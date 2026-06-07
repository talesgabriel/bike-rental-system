"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function EstacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [estacao, setEstacao] =
    useState<any>(null);

  const [bicicletas, setBicicletas] =
    useState<any[]>([]);

  const [qrAberto, setQrAberto] =
    useState<string | null>(null);

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

  const bicicletasDisponiveis =
    bicicletas.filter(
      (bike) =>
        bike.status ===
        "disponivel"
    );

  const bicicletasEmUso =
    bicicletas.filter(
      (bike) =>
        bike.status ===
        "em uso"
    );

  const bicicletasManutencao =
    bicicletas.filter(
      (bike) =>
        bike.status ===
        "manutencao"
    );

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
            🚲 Estação {estacao.nome}
          </h1>

          <p className="mt-2 text-green-100">
            {estacao.endereco}
          </p>
        </div>

      </header>

      <section className="mx-auto max-w-6xl p-6">

        <div className="mb-8 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-sm text-gray-500">
              Total
            </h3>

            <p className="mt-2 text-3xl font-bold">
              {bicicletas.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-sm text-gray-500">
              Disponíveis
            </h3>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {
                bicicletasDisponiveis.length
              }
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-sm text-gray-500">
              Em uso
            </h3>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {
                bicicletasEmUso.length
              }
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-sm text-gray-500">
              Manutenção
            </h3>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {
                bicicletasManutencao.length
              }
            </p>
          </div>

        </div>

        <h2 className="mb-4 text-xl font-semibold">
          Bicicletas disponíveis para retirada
        </h2>

        {bicicletasDisponiveis.length ===
        0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              Nenhuma bicicleta disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">

            {bicicletasDisponiveis.map(
              (bike) => (
                <div
                  key={bike.id}
                  className="rounded-xl bg-white p-5 shadow transition hover:shadow-lg"
                >
                  <h3 className="text-lg font-bold">
                    {bike.codigo}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {bike.modelo}
                  </p>

                  <div className="mt-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      🟢 Disponível
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setQrAberto(
                        qrAberto ===
                          bike.codigo
                          ? null
                          : bike.codigo
                      )
                    }
                    className="mt-4 w-full rounded-lg bg-green-700 py-2 text-white hover:bg-green-800"
                  >
                    {qrAberto ===
                    bike.codigo
                      ? "Ocultar QR Code"
                      : "Exibir QR Code"}
                  </button>

                  {qrAberto ===
                    bike.codigo && (
                    <div className="mt-4 flex flex-col items-center rounded-lg border bg-white p-4">

                      <QRCode
                        value={
                          bike.codigo
                        }
                        size={180}
                      />

                      <p className="mt-3 text-sm font-medium text-gray-600">
                        {bike.codigo}
                      </p>

                    </div>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </section>

    </main>
  );
}