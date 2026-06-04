import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { usuarioId } = await request.json();

    const { data: plano } = await supabase
      .from("planos")
      .select("*")
      .eq("usuario_id", usuarioId)
      .eq("status", "ativo")
      .maybeSingle();

    const { data: aluguel } = await supabase
      .from("alugueis")
      .select(`
        *,
        bicicletas (
          codigo,
          modelo
        )
      `)
      .eq("usuario_id", usuarioId)
      .eq("status", "ativo")
      .maybeSingle();

    const { data: estacoes } = await supabase
      .from("estacoes")
      .select("*");

    return NextResponse.json({
      success: true,
      plano,
      aluguel,
      estacoes,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao carregar dashboard",
      },
      { status: 500 }
    );
  }
}