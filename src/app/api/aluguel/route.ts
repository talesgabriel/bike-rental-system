import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const {
      authId,
      codigo,
    } = await request.json();

    const {
      data: usuario,
      error: erroUsuario,
    } = await supabase
      .from("usuarios")
      .select("id")
      .eq("auth_id", authId)
      .single();

    if (erroUsuario || !usuario) {
      return NextResponse.json({
        success: false,
        message: "Usuário não encontrado.",
      });
    }

    const usuarioId = usuario.id;

    const {
      data: planoAtivo,
    } = await supabase
      .from("planos")
      .select("*")
      .eq("usuario_id", usuarioId)
      .eq("status", "ativo")
      .maybeSingle();

    if (!planoAtivo) {
      return NextResponse.json({
        success: false,
        message:
          "Você precisa possuir um plano ativo.",
      });
    }

    if (
      new Date(planoAtivo.data_fim) <
      new Date()
    ) {
      await supabase
        .from("planos")
        .update({
          status: "encerrado",
        })
        .eq("id", planoAtivo.id);

      return NextResponse.json({
        success: false,
        message:
          "Seu plano expirou.",
      });
    }

    if (
      planoAtivo.viagens_restantes <= 0
    ) {
      await supabase
        .from("planos")
        .update({
          status: "encerrado",
        })
        .eq("id", planoAtivo.id);

      return NextResponse.json({
        success: false,
        message:
          "Seu plano não possui mais viagens disponíveis.",
      });
    }

    const {
      data: aluguelAtivo,
    } = await supabase
      .from("alugueis")
      .select("*")
      .eq("usuario_id", usuarioId)
      .eq("status", "ativo")
      .maybeSingle();

    if (aluguelAtivo) {
      return NextResponse.json({
        success: false,
        message:
          "Você já possui uma bicicleta em uso.",
      });
    }

    const {
      data: bicicleta,
      error: erroBike,
    } = await supabase
      .from("bicicletas")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (erroBike || !bicicleta) {
      return NextResponse.json({
        success: false,
        message:
          "Bicicleta não encontrada.",
      });
    }

    if (
      bicicleta.status !==
      "disponivel"
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Esta bicicleta não está disponível.",
      });
    }

    const {
      error: erroAluguel,
    } = await supabase
      .from("alugueis")
      .insert({
        usuario_id: usuarioId,
        bicicleta_id: bicicleta.id,
        data_inicio: new Date(),
        status: "ativo",
      });

    if (erroAluguel) {
      throw erroAluguel;
    }

    const {
      error: erroAtualizacao,
    } = await supabase
      .from("bicicletas")
      .update({
        status: "em uso",
      })
      .eq("id", bicicleta.id);

    if (erroAtualizacao) {
      throw erroAtualizacao;
    }

    return NextResponse.json({
      success: true,
      bicicleta: {
        codigo:
          bicicleta.codigo,
        modelo:
          bicicleta.modelo,
      },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao realizar aluguel.",
      },
      { status: 500 }
    );
  }
}