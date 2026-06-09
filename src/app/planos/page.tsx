"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PlanosPage() {
  const router = useRouter();

  const [modalAberto, setModalAberto] =
    useState(false);

  const [planoSelecionado, setPlanoSelecionado] =
    useState("");

  const [metodoPagamento, setMetodoPagamento] =
    useState("");

  async function contratarPlano() {
    if (!metodoPagamento) {
      alert(
        "Selecione uma forma de pagamento."
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
        "/api/planos",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            authId: user.id,
            tipo: planoSelecionado,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      alert(
        `Pagamento via ${metodoPagamento} aprovado!\nPlano contratado com sucesso.`
      );

      router.push(
        "/dashboard"
      );
    } else {
      alert(data.message);
    }
  }

  function abrirModal(
    tipo: string
  ) {
    setPlanoSelecionado(tipo);
    setMetodoPagamento("");
    setModalAberto(true);
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
            🚲 Escolha seu Plano
          </h1>

          <p className="mt-2 text-green-100">
            Selecione um plano para utilizar o sistema
          </p>
        </div>

      </header>

      <section className="mx-auto max-w-6xl p-6">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              Avulso
            </h2>

            <p className="mt-2 text-gray-600">
              1 viagem única de até 15 minutos
            </p>

            <p className="mt-4 text-3xl font-bold text-green-700">
              R$ 5,00
            </p>

            <button
              onClick={() =>
                abrirModal(
                  "avulso"
                )
              }
              className="mt-6 w-full rounded-lg bg-green-700 py-3 text-white hover:bg-green-800"
            >
              Contratar
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              Diário
            </h2>

            <p className="mt-2 text-gray-600">
              20 viagens por um dia de 45 minutos
            </p>

            <p className="mt-4 text-3xl font-bold text-green-700">
              R$ 10,00
            </p>

            <button
              onClick={() =>
                abrirModal(
                  "diario"
                )
              }
              className="mt-6 w-full rounded-lg bg-green-700 py-3 text-white hover:bg-green-800"
            >
              Contratar
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              Mensal
            </h2>

            <p className="mt-2 text-gray-600">
              20 viagens por dia de 45 minutos
            </p>

            <p className="mt-4 text-3xl font-bold text-green-700">
              R$ 20,00
            </p>

            <button
              onClick={() =>
                abrirModal(
                  "mensal"
                )
              }
              className="mt-6 w-full rounded-lg bg-green-700 py-3 text-white hover:bg-green-800"
            >
              Contratar
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">
              Anual
            </h2>

            <p className="mt-2 text-gray-600">
              20 viagens por dia de 45 minutos
            </p>

            <p className="mt-4 text-3xl font-bold text-green-700">
              R$ 120,00
            </p>

            <button
              onClick={() =>
                abrirModal(
                  "anual"
                )
              }
              className="mt-6 w-full rounded-lg bg-green-700 py-3 text-white hover:bg-green-800"
            >
              Contratar
            </button>
          </div>

        </div>

      </section>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <h2 className="mb-4 text-xl font-bold">
              Finalizar Contratação
            </h2>

            <p className="mb-4 text-gray-600">
              Plano selecionado:{" "}
              <strong>
                {planoSelecionado}
              </strong>
            </p>

            <h3 className="mb-3 font-semibold">
              Forma de pagamento
            </h3>

            <div className="space-y-3">

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                <input
                  type="radio"
                  name="pagamento"
                  value="PIX"
                  checked={
                    metodoPagamento ===
                    "PIX"
                  }
                  onChange={(e) =>
                    setMetodoPagamento(
                      e.target.value
                    )
                  }
                />
                PIX
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                <input
                  type="radio"
                  name="pagamento"
                  value="Cartão de Crédito"
                  checked={
                    metodoPagamento ===
                    "Cartão de Crédito"
                  }
                  onChange={(e) =>
                    setMetodoPagamento(
                      e.target.value
                    )
                  }
                />
                Cartão de Crédito
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                <input
                  type="radio"
                  name="pagamento"
                  value="Cartão de Débito"
                  checked={
                    metodoPagamento ===
                    "Cartão de Débito"
                  }
                  onChange={(e) =>
                    setMetodoPagamento(
                      e.target.value
                    )
                  }
                />
                Cartão de Débito
              </label>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setModalAberto(
                    false
                  )
                }
                className="flex-1 rounded-lg border py-3"
              >
                Cancelar
              </button>

              <button
                onClick={
                  contratarPlano
                }
                className="flex-1 rounded-lg bg-green-700 py-3 text-white hover:bg-green-800"
              >
                Confirmar
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}