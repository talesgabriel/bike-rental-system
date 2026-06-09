"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Usuario {
  id: string;
  nome: string;
}

interface Plano {
  tipo: string;
  data_inicio: string;
  data_fim: string;
  viagens_restantes: number;
  tempo_limite: number;
}

interface Bicicleta {
  codigo: string;
  modelo: string;
}

interface Aluguel {
  data_inicio: string;
  bicicletas?: Bicicleta;
}

interface Estacao {
  id: string;
  nome: string;
  endereco: string;
  capacidade: number;
}

export default function Dashboard() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [plano, setPlano] = useState<Plano | null>(null);
  const [aluguel, setAluguel] = useState<Aluguel | null>(null);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);

  useEffect(() => {
  async function carregarDashboard() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      window.location.href =
        "/login";
      return;
    }

    const response =
      await fetch(
        "/api/dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            authId: user.id,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      setUsuario(data.usuario);
      setPlano(data.plano);
      setAluguel(data.aluguel);
      setEstacoes(data.estacoes);
    }

    setLoading(false);
  }

  carregarDashboard();
}, []);

  useEffect(() => {
    if (!aluguel || !plano) return;

    const inicio = new Date(aluguel.data_inicio).getTime();
    const limiteMs = plano.tempo_limite * 60 * 1000;

console.log(aluguel.data_inicio);

console.log(
  new Date(
    aluguel.data_inicio
  )
);
    const atualizar = () => {
      const agora = Date.now();

      const restante = limiteMs - (agora - inicio);

      setTempoRestante(restante > 0 ? restante : 0);
    };

    atualizar();

    const interval = setInterval(atualizar, 1000);

    return () => clearInterval(interval);
  }, [aluguel, plano]);

  if (loading) {
    return (
      <div className="p-6">
        Carregando...
      </div>
    );
  }

  function formatarTempo(ms: number) {
    const totalSegundos = Math.floor(ms / 1000);

    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    return `${minutos}m ${segundos}s`;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-green-700 p-6 text-white text-center shadow">
        <h1 className="text-2xl font-bold">
          🚲 Bike Mossoró
        </h1>

        <p className="mt-2">
          👋 Olá, {usuario?.nome}
        </p>
      </header>

      <section className="mx-auto max-w-6xl p-6">

        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-lg font-semibold">
            Meu Plano
          </h2>

          {plano ? (
            <>
              <p>
                <strong>Tipo:</strong>{" "}
                {plano.tipo}
              </p>

              <p>
                <strong>
                  Início:
                </strong>{" "}
                {new Date(
                  plano.data_inicio
                ).toLocaleDateString(
                  "pt-BR"
                )}
              </p>

              <p>
                <strong>
                  Válido até:
                </strong>{" "}
                {new Date(
                  plano.data_fim
                ).toLocaleDateString(
                  "pt-BR"
                )}
              </p>

              <p>
                <strong>
                  Viagens restantes:
                </strong>{" "}
                {plano.viagens_restantes}
              </p>

              <p>
                <strong>
                  Tempo máximo por viagem:
                </strong>{" "}
                {plano.tempo_limite} min
              </p>
            </>
          ) : (
            <>
              <p>
                Nenhum plano ativo.
              </p>

              <Link
                href="/planos"
                className="mt-4 inline-block rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
              >
                Contratar Plano
              </Link>
            </>
          )}
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-lg font-semibold">
            Minha Bicicleta
          </h2>

          {aluguel ? (
            <>
              <p>
                <strong>
                  Bicicleta:
                </strong>{" "}
                {
                  aluguel.bicicletas
                    ?.codigo
                }
              </p>

              <p>
                <strong>
                  Modelo:
                </strong>{" "}
                {
                  aluguel.bicicletas
                    ?.modelo
                }
              </p>

              <p>
                <strong>
                  Início:
                </strong>{" "}
                {new Date(
                  aluguel.data_inicio
                ).toLocaleString(
                  "pt-BR"
                )}
              </p>

              {tempoRestante !== null && (
                <p>
                  <strong>Tempo restante:</strong>{" "}
                  {tempoRestante > 0
                    ? formatarTempo(tempoRestante)
                    : "Tempo excedido"}
                </p>
              )}

              <Link 
                href="/devolver"
                className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Devolver Bicicleta
              </Link>
            </>
          ) : (
            <>
              <p className="mb-4">
                Nenhuma bicicleta em uso.
              </p>

              {plano &&
                plano.viagens_restantes > 0 ? (
                  <Link
                    href="/scanner"
                    className="inline-block rounded-lg bg-green-700 px-4 py-2 text-white"
                  >
                    🚲 Desbloquear Bicicleta
                  </Link>
                ) : plano ? (
                  <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
                    Seu plano está sem viagens disponíveis.
                  </div>
                ) : (
                  <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
                    Você precisa adquirir um plano para retirar bicicletas.
                  </div>
                )}
            </>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Estações Disponíveis
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {estacoes.map(
              (estacao) => (
                <div
                  key={estacao.id}
                  className="rounded-lg border p-4"
                >
                  <h3 className="font-semibold">
                    {estacao.nome}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {estacao.endereco}
                  </p>

                  <p className="mt-2 text-gray-600">
                    Capacidade:{" "}
                    {
                      estacao.capacidade
                    }
                  </p>

                  <Link
                    href={`/estacoes/${estacao.id}`}
                    className="mt-4 block w-full rounded-lg bg-green-700 py-2 text-center text-white hover:bg-green-800"
                  >
                    Ver Bicicletas
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();

            window.location.href =
              "/login";
          }}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Sair
        </button>
      </section>
    </main>
  );
}