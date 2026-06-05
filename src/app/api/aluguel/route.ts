import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const {
      usuarioId,
      bicicletaId,
    } = await request.json();

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

    const { error: erroAluguel } =
      await supabase
        .from("alugueis")
        .insert({
          usuario_id: usuarioId,
          bicicleta_id: bicicletaId,
          data_inicio:
            new Date(),
          status: "ativo",
        });

    if (erroAluguel) {
      throw erroAluguel;
    }

    const { error: erroBike } =
      await supabase
        .from("bicicletas")
        .update({
          status: "em uso",
        })
        .eq("id", bicicletaId);

    if (erroBike) {
      throw erroBike;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao realizar aluguel",
      },
      { status: 500 }
    );
  }
}