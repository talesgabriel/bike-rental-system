"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response = await fetch(
      "/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {
      localStorage.setItem(
        "usuario",
        JSON.stringify(
          data.usuario
        )
      );

      router.push(
        "/dashboard"
      );
    } else {
      alert(data.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="mb-4 w-full rounded border p-3"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }
          className="mb-6 w-full rounded border p-3"
        />

        <button
          type="submit"
          className="w-full rounded bg-green-700 py-3 text-white"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}