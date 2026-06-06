import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  request: Request
) {
  try {
    const {
      nome,
      cpf,
      data_nasc,
      email,
      senha,
    } = await request.json();

    const {
      data: authUser,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email,
          password: senha,
          email_confirm: true,
        }
      );

    if (authError) {
      throw authError;
    }

    const authId =
      authUser.user.id;

    const { error: usuarioError } =
      await supabase
        .from("usuarios")
        .insert({
          nome,
          cpf,
          email,
          data_nasc,
          role: "cliente",
          auth_id: authId,
        });

    if (usuarioError) {
      throw usuarioError;
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
          "Erro ao realizar cadastro",
      },
      { status: 500 }
    );
  }
}