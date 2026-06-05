"use client";

import { useEffect, useState } from "react";

export default function EstacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [estacao, setEstacao] =
    useState<any>(null);

  const [bicicletas, setBicicletas] =
    useState<any[]>([]);

  useEffect(() => {
    async function carregar() {
      const { id } = await params;

      const response = await fetch(
        `/api/estacoes/${id}`
      );

      const data =
        await response.json();

      if (data.success) {
        setEstacao(data.estacao);
        setBicicletas(
          data.bicicletas
        );
      }
    }

    carregar();
  }, [params]);

  if (!estacao) {
    return (
      <div className="p-6">
        Carregando...
      </div>
    );
  }

  async function alugarBike(
    bicicletaId: number
  ) {
    const usuarioStorage =
      localStorage.getItem(
        "usuario"
      );

    if (!usuarioStorage) {
      return;
    }

    const usuario =
      JSON.parse(
        usuarioStorage
      );

    const response =
      await fetch(
        "/api/aluguel",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            usuarioId:
              usuario.id,
            bicicletaId,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      window.location.href =
        "/dashboard";
    } else {
      alert(data.message);
    }
  }
  
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-2 text-3xl font-bold">
          {estacao.nome}
        </h1>

        <p className="mb-8 text-gray-600">
          Bicicletas disponíveis
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {bicicletas.map(
            (bike) => (
              <div
                key={bike.id}
                className="rounded-xl bg-white p-4 shadow"
              >
                <h2 className="font-semibold">
                  {bike.codigo}
                </h2>

                <p className="mt-2">
                  Modelo:
                  {" "}
                  {bike.modelo}
                </p>

                <p className="mt-2">
                  Status:
                  {" "}
                  {bike.status}
                </p>

                <button
                  onClick={() =>
                    alugarBike(bike.id)
                  }
                  className="mt-4 w-full rounded-lg bg-green-700 py-2 text-white hover:bg-green-800"
                >
                  Alugar
                </button>
              </div>
            )
          )}
        </div>

      </div>
    </main>
  );
}