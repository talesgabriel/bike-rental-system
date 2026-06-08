import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request
) {
  try {
    const { authId } =
      await request.json();

    const {
      data: usuario,
      error: usuarioError,
    } = await supabase
      .from("usuarios")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (
      usuarioError ||
      !usuario
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Usuário não encontrado",
      });
    }

    let { data: plano } =
      await supabase
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

    if (plano) {
      const expirado =
        new Date(
          plano.data_fim
        ) < new Date();

      const semViagens =
        plano.viagens_restantes <=
        0;

      if (
        expirado ||
        semViagens
      ) {
        await supabase
          .from("planos")
          .update({
            status:
              "encerrado",
          })
          .eq(
            "id",
            plano.id
          );

        plano = null;
      }
    }

    const { data: aluguel } =
      await supabase
        .from("alugueis")
        .select(`
          *,
          bicicletas (
            codigo,
            modelo
          )
        `)
        .eq(
          "usuario_id",
          usuario.id
        )
        .eq(
          "status",
          "ativo"
        )
        .maybeSingle();

    const { data: estacoes } =
      await supabase
        .from("estacoes")
        .select("*");

    return NextResponse.json({
      success: true,
      usuario,
      plano,
      aluguel,
      estacoes,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao carregar dashboard",
      },
      { status: 500 }
    );
  }
}