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
      .eq(
        "auth_id",
        authId
      )
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

      const agora =
        new Date();

      const expirado =
        new Date(
          plano.data_fim
        ) < agora;

      if (expirado) {

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

      } else {

        const hoje =
          agora
            .toISOString()
            .split("T")[0];

        const ultimaRenovacao =
          plano.ultima_renovacao
            ? new Date(
                plano.ultima_renovacao
              )
                .toISOString()
                .split("T")[0]
            : null;

        const precisaRenovar =
          plano.tipo !==
            "avulso" &&
          hoje !==
            ultimaRenovacao;

        if (
          precisaRenovar
        ) {

          const {
            error:
              erroRenovacao,
          } = await supabase
            .from("planos")
            .update({
              viagens_restantes:
                20,

              ultima_renovacao:
                agora,
            })
            .eq(
              "id",
              plano.id
            );

          if (
            erroRenovacao
          ) {
            throw erroRenovacao;
          }

          plano.viagens_restantes =
            20;

          plano.ultima_renovacao =
            agora.toISOString();

        }

      }

    }

    const {
      data: aluguel,
    } =
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

    const {
      data: estacoes,
    } =
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
      {
        status: 500,
      }
    );

  }
}