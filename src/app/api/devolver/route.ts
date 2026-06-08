import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request
) {
  try {
    const {
      authId,
      estacaoId,
    } = await request.json();

    const {
      data: usuario,
      error: erroUsuario,
    } = await supabase
      .from("usuarios")
      .select("id")
      .eq(
        "auth_id",
        authId
      )
      .single();

    if (
      erroUsuario ||
      !usuario
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Usuário não encontrado.",
      });
    }

    const usuarioId =
      usuario.id;

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

    const {
      data: estacao,
      error: erroEstacao,
    } = await supabase
      .from("estacoes")
      .select("*")
      .eq(
        "id",
        estacaoId
      )
      .single();

    if (
      erroEstacao ||
      !estacao
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Estação não encontrada.",
      });
    }

    const {
      count: bicicletasNaEstacao,
      error: erroContagem,
    } = await supabase
      .from("bicicletas")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "estacao_id",
        estacaoId
      );

    if (
      erroContagem
    ) {
      throw erroContagem;
    }

    if (
      (bicicletasNaEstacao ??
        0) >=
      estacao.capacidade
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Esta estação está lotada.",
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
        estacao_id:
          estacaoId,
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
      Math.max(
        (plano.viagens_restantes ??
          0) - 1,
        0
      );

    const atualizarPlano = {
      viagens_restantes:
        viagensRestantes,
    };

    if (
      plano.tipo === "avulso" &&
      viagensRestantes === 0
    ) {
      Object.assign(
        atualizarPlano,
        {
          status:
            "encerrado",
        }
      );
    }

    const {
      error:
        erroAtualizarPlano,
    } = await supabase
      .from("planos")
      .update(
        atualizarPlano
      )
      .eq(
        "id",
        plano.id
      );

    if (
      erroAtualizarPlano
    ) {
      throw erroAtualizarPlano;
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