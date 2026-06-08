"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PlanosPage() {
  const router = useRouter();

  async function contratarPlano(
    tipo: string
  ) {
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
            tipo,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      alert(
        "Plano contratado com sucesso!"
      );

      router.push(
        "/dashboard"
      );
    } else {
      alert(data.message);
    }
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
                contratarPlano(
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
              20 viagens por dia de 45 minutos
            </p>

            <p className="mt-4 text-3xl font-bold text-green-700">
              R$ 10,00
            </p>

            <button
              onClick={() =>
                contratarPlano(
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
                contratarPlano(
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
              10 viagens por dia de 45 minutos
            </p>

            <p className="mt-4 text-3xl font-bold text-green-700">
              R$ 120,00
            </p>

            <button
              onClick={() =>
                contratarPlano(
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
    </main>
  );
}