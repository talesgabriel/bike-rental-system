import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request
) {
  try {
    const { usuarioId } =
      await request.json();

    const {
      data: aluguel,
      error: erroAluguel,
    } = await supabase
      .from("alugueis")
      .select("*")
      .eq(
        "usuario_id",
        usuarioId
      )
      .eq(
        "status",
        "ativo"
      )
      .single();

    if (
      erroAluguel ||
      !aluguel
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Nenhum aluguel ativo encontrado.",
      });
    }

    const {
      data: plano,
      error: erroPlano,
    } = await supabase
      .from("planos")
      .select("*")
      .eq(
        "usuario_id",
        usuarioId
      )
      .eq(
        "status",
        "ativo"
      )
      .single();

    if (
      erroPlano ||
      !plano
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Plano não encontrado.",
      });
    }

    const dataFim =
      new Date();

    const dataInicio =
      new Date(
        aluguel.data_inicio
      );

    const duracaoMinutos =
      Math.floor(
        (dataFim.getTime() -
          dataInicio.getTime()) /
          60000
      );

    const excedeuLimite =
      duracaoMinutos >
      plano.tempo_limite;

    const {
      error:
        erroFinalizarAluguel,
    } = await supabase
      .from("alugueis")
      .update({
        status:
          "finalizado",
        data_fim:
          dataFim,
        duracao_minutos:
          duracaoMinutos,
        excedeu_limite:
          excedeuLimite,
      })
      .eq(
        "id",
        aluguel.id
      );

    if (
      erroFinalizarAluguel
    ) {
      throw erroFinalizarAluguel;
    }

    const {
      error:
        erroAtualizarBike,
    } = await supabase
      .from("bicicletas")
      .update({
        status:
          "disponivel",
      })
      .eq(
        "id",
        aluguel.bicicleta_id
      );

    if (
      erroAtualizarBike
    ) {
      throw erroAtualizarBike;
    }

    const viagensRestantes =
      (plano.viagens_restantes ??
        0) - 1;

    if (
      viagensRestantes <= 0
    ) {
      const {
        error:
          erroEncerrarPlano,
      } = await supabase
        .from("planos")
        .update({
          viagens_restantes: 0,
          status:
            "encerrado",
        })
        .eq(
          "id",
          plano.id
        );

      if (
        erroEncerrarPlano
      ) {
        throw erroEncerrarPlano;
      }
    } else {
      const {
        error:
          erroAtualizarPlano,
      } = await supabase
        .from("planos")
        .update({
          viagens_restantes:
            viagensRestantes,
        })
        .eq(
          "id",
          plano.id
        );

      if (
        erroAtualizarPlano
      ) {
        throw erroAtualizarPlano;
      }
    }

    return NextResponse.json({
      success: true,
      viagensRestantes,
      duracaoMinutos,
      excedeuLimite,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao devolver bicicleta.",
      },
      {
        status: 500,
      }
    );
  }
}