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
      error,
    } = await supabase
      .from("alugueis")
      .select("*")
      .eq("usuario_id", usuarioId)
      .eq("status", "ativo")
      .single();

    if (error || !aluguel) {
      return NextResponse.json({
        success: false,
        message:
          "Nenhum aluguel ativo encontrado.",
      });
    }

    await supabase
      .from("alugueis")
      .update({
        status: "finalizado",
        data_fim: new Date(),
      })
      .eq("id", aluguel.id);

    await supabase
      .from("bicicletas")
      .update({
        status: "disponivel",
      })
      .eq(
        "id",
        aluguel.bicicleta_id
      );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao devolver bicicleta",
      },
      { status: 500 }
    );
  }
}