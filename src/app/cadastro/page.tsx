"use client";

import { useState } from "react";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNasc, setDataNasc] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [senha, setSenha] =
    useState("");

  async function handleCadastro(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response = await fetch(
      "/api/cadastro",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          nome,
          cpf,
          data_nasc: dataNasc,
          email,
          senha,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {
      alert(
        "Cadastro realizado com sucesso!"
      );

      window.location.href =
        "/login";
    } else {
      alert(data.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleCadastro}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">
          Criar Conta
        </h1>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          className="mb-4 w-full rounded border p-3"
        />

        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) =>
            setCpf(e.target.value)
          }
          className="mb-4 w-full rounded border p-3"
        />

        <input
          type="date"
          value={dataNasc}
          onChange={(e) =>
            setDataNasc(
              e.target.value
            )
          }
          className="mb-4 w-full rounded border p-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mb-4 w-full rounded border p-3"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
          className="mb-6 w-full rounded border p-3"
        />

        <button
          type="submit"
          className="w-full rounded bg-green-700 py-3 text-white"
        >
          Cadastrar
        </button>
      </form>
    </main>
  );
}