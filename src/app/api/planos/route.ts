import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request
) {
  try {
    const {
      authId,
      tipo,
    } = await request.json();

    const {
      data: usuario,
      error: erroUsuario,
    } = await supabase
      .from("usuarios")
      .select("id")
      .eq("auth_id", authId)
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

    const {
      data: planoAtivo,
    } = await supabase
      .from("planos")
      .select("*")
      .eq(
        "usuario_id",
        usuario.id
      )
      .eq(
        "status",
        "ativo"
      )
      .maybeSingle();

    if (planoAtivo) {
      return NextResponse.json({
        success: false,
        message:
          "Você já possui um plano ativo.",
      });
    }

    let dias = 0;
    let viagensRestantes = 0;
    let tempoLimite = 0;

    switch (tipo) {
      case "avulso":
        dias = 1;
        viagensRestantes = 1;
        tempoLimite = 15;
        break;

      case "diario":
        viagensRestantes = 20;
        dias = 1;
        tempoLimite = 45;
        break;

      case "mensal":
        viagensRestantes = 20;
        dias = 30;
        tempoLimite = 45;
        break;

      case "anual":
        viagensRestantes = 10;
        dias = 365;
        tempoLimite = 45;
        break;

      default:
        return NextResponse.json({
          success: false,
          message:
            "Plano inválido.",
        });
    }

    const dataInicio =
      new Date();

    const dataFim =
      new Date();

    dataFim.setDate(
      dataFim.getDate() +
        dias
    );

    const {
      error: erroPlano,
    } = await supabase
      .from("planos")
      .insert({
        usuario_id:
          usuario.id,
        tipo,
        status: "ativo",
        data_inicio:
          dataInicio,
        data_fim:
          dataFim,
        viagens_restantes:
          viagensRestantes,
        tempo_limite:
          tempoLimite,
      });

    if (erroPlano) {
      throw erroPlano;
    }

    return NextResponse.json({
      success: true,
      message:
        "Plano contratado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao contratar plano.",
      },
      {
        status: 500,
      }
    );
  }
}