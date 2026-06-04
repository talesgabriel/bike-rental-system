import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, senha } =
      await request.json();

    const { data: usuario } =
      await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .eq("senha", senha)
        .maybeSingle();

    if (!usuario) {
      return NextResponse.json({
        success: false,
        message:
          "Email ou senha inválidos",
      });
    }

    return NextResponse.json({
      success: true,
      usuario,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao realizar login",
      },
      { status: 500 }
    );
  }
}