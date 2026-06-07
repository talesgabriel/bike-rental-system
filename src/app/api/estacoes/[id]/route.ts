import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: estacao } =
      await supabase
        .from("estacoes")
        .select("*")
        .eq("id", id)
        .single();

    const { data: bicicletas } =
      await supabase
        .from("bicicletas")
        .select("*")
        .eq("estacao_id", id)

    return NextResponse.json({
      success: true,
      estacao,
      bicicletas,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Erro",
      },
      { status: 500 }
    );
  }
}