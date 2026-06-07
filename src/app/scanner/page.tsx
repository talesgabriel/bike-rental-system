"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

export default function ScannerPage() {
  const router = useRouter();

  const scannerRef =
    useRef<Html5QrcodeScanner | null>(
      null
    );

  useEffect(() => {
    const scanner =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        false
      );

    scanner.render(
      async (codigoLido) => {
        try {
          scanner.clear();

          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) {
            alert(
              "Faça login novamente."
            );

            router.push("/login");
            return;
          }

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
                  authId: user.id,
                  codigo:
                    codigoLido,
                }),
              }
            );

          const data =
            await response.json();

          if (data.success) {
            alert(
              `Bicicleta ${data.bicicleta.codigo} liberada!`
            );

            router.push(
              "/dashboard"
            );
          } else {
            alert(data.message);

            router.refresh();
          }
        } catch (error) {
          console.error(error);

          alert(
            "Erro ao processar QR Code."
          );
        }
      },
      () => {}
    );

    scannerRef.current =
      scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="bg-green-700 p-6 text-center text-white shadow">
        <h1 className="text-2xl font-bold">
          🚲 Desbloquear Bicicleta
        </h1>

        <p className="mt-2">
          Aponte a câmera para o QR Code
        </p>
      </header>

      <section className="mx-auto max-w-xl p-6">

        <div className="rounded-xl bg-white p-6 shadow">

          <div id="reader" />

        </div>

      </section>

    </main>
  );
}