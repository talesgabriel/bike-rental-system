import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {

    const {
      data: estacoes,
      error: erroEstacoes,
    } = await supabase
      .from("estacoes")
      .select("*");

    if (
      erroEstacoes ||
      !estacoes
    ) {
      throw erroEstacoes;
    }

    const resultado =
      await Promise.all(

        estacoes.map(
          async (
            estacao
          ) => {

            const {
              count,
              error:
                erroContagem,
            } = await supabase
              .from(
                "bicicletas"
              )
              .select(
                "*",
                {
                  count:
                    "exact",
                  head: true,
                }
              )
              .eq(
                "estacao_id",
                estacao.id
              );

            if (
              erroContagem
            ) {
              throw erroContagem;
            }

            const bicicletasAtuais =
              count ?? 0;

            const vagasLivres =
              Math.max(
                estacao.capacidade -
                  bicicletasAtuais,
                0
              );

            return {

              id:
                estacao.id,

              nome:
                estacao.nome,

              endereco:
                estacao.endereco,

              capacidade:
                estacao.capacidade,

              bicicletas_atuais:
                bicicletasAtuais,

              vagas_livres:
                vagasLivres,

              lotada:
                vagasLivres ===
                0,

            };
          }
        )
      );

    return NextResponse.json({
      success: true,
      estacoes:
        resultado,
    });

  } catch (error) {

    console.error(
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao carregar estações.",
      },
      {
        status: 500,
      }
    );
  }
}