"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Estacao {
  id: string;
  nome: string;
  endereco: string;
  capacidade: number;

  bicicletas_atuais: number;

  vagas_livres: number;

  lotada: boolean;
}

export default function DevolverPage() {
  const router = useRouter();

  const [estacoes, setEstacoes] =
    useState<Estacao[]>([]);

  const [estacaoSelecionada, setEstacaoSelecionada] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function carregar() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const response =
        await fetch(
          "/api/estacoes"
        );

      const data =
        await response.json();

      if (data.success) {
        setEstacoes(
          data.estacoes
        );
      }

      setLoading(false);
    }

    carregar();
  }, [router]);

  async function devolverBike() {
    if (!estacaoSelecionada) {
      alert(
        "Selecione uma estação."
      );
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const response =
      await fetch(
        "/api/devolver",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            authId: user.id,
            estacaoId:
              estacaoSelecionada,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      alert(
        "Bicicleta devolvida com sucesso."
      );

      router.push(
        "/dashboard"
      );
    } else {
      alert(data.message);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Carregando...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="relative bg-green-700 p-6 text-white shadow">

        <button
            onClick={() =>
              router.back()
            }
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-lg bg-green-600 px-4 py-2 transition hover:bg-green-500"
          >
            ← Voltar
          </button>

        <div className="text-center">        
          <h1 className="text-2xl font-bold">
            🚲 Devolver Bicicleta
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-2xl p-6">

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-lg font-semibold">
            Escolha a estação de destino
          </h2>

          <select
            value={
              estacaoSelecionada
            }
            onChange={(e) =>
              setEstacaoSelecionada(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Selecione uma estação
            </option>

            {estacoes.map(
              (estacao) => (
                <option
                  key={estacao.id}
                  value={estacao.id}
                  disabled={
                    estacao.lotada
                  }
                >
                  {estacao.nome}
                  {" • "}
                  {
                    estacao.bicicletas_atuais
                  }
                  /
                  {
                    estacao.capacidade
                  }
                  {" bicicletas • "}
                  {
                    estacao.vagas_livres
                  }
                  {" vagas"}
                </option>
              )
            )}
          </select>

          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            Escolha uma estação com vagas disponíveis para concluir a devolução.
          </div>

          <button
            onClick={
              devolverBike
            }
            className="mt-6 w-full rounded-lg bg-green-700 py-3 text-white hover:bg-green-800"
          >
            Confirmar Devolução
          </button>

        </div>

      </section>

    </main>
  );
}