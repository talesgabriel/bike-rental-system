"use client";

import { useEffect, useState } from "react";

interface Usuario {
  id: string;
  nome: string;
}

interface Plano {
  tipo: string;
  tempo_limite: number;
  data_fim: string;
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
  capacidade: number;
}

export default function Dashboard() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [plano, setPlano] = useState<Plano | null>(null);
  const [aluguel, setAluguel] = useState<Aluguel | null>(null);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDashboard() {
      const usuarioStorage =
        localStorage.getItem("usuario");

      if (!usuarioStorage) {
        return;
      }

      const usuarioLogado =
        JSON.parse(usuarioStorage);

      setUsuario(usuarioLogado);

      const response = await fetch(
        "/api/dashboard/",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            usuarioId:
              usuarioLogado.id,
          }),
        }
      );

      const data =
        await response.json();

      if (data.success) {
        setPlano(data.plano);
        setAluguel(data.aluguel);
        setEstacoes(data.estacoes);
      }

      setLoading(false);
    }

    carregarDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Carregando...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-green-700 p-6 text-white shadow">
        <h1 className="text-2xl font-bold">
          🚲 Bike Mossoró
        </h1>

        <p className="mt-2">
          Olá, {usuario?.nome}
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
                  Tempo limite:
                </strong>{" "}
                {plano.tempo_limite} min
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
            </>
          ) : (
            <p>
              Nenhum plano ativo.
            </p>
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

              <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                Devolver Bicicleta
              </button>
            </>
          ) : (
            <>
              <p>
                Nenhuma bicicleta
                em uso.
              </p>

              <button className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                Alugar Bicicleta
              </button>
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
                    Capacidade:{" "}
                    {
                      estacao.capacidade
                    }
                  </p>

                  <button className="mt-4 w-full rounded-lg bg-green-700 py-2 text-white hover:bg-green-800">
                    Ver Bicicletas
                  </button>
                </div>
              )
            )}
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("usuario");
            window.location.href = "/login";
          }}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Sair
        </button>
      </section>
    </main>
  );
}