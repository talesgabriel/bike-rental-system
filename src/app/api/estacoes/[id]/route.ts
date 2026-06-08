import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {

    const { id } =
      await params;

    const {
      data: estacao,
      error: erroEstacao,
    } = await supabase
      .from("estacoes")
      .select("*")
      .eq(
        "id",
        id
      )
      .single();

    if (
      erroEstacao ||
      !estacao
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Estação não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data: bicicletas,
      error: erroBikes,
    } = await supabase
      .from("bicicletas")
      .select("*")
      .eq(
        "estacao_id",
        id
      );

    if (erroBikes) {
      throw erroBikes;
    }

    return NextResponse.json({
      success: true,
      estacao,
      bicicletas,
    });

  } catch (
    error
  ) {

    console.error(
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao carregar estação.",
      },
      {
        status: 500,
      }
    );
  }
}