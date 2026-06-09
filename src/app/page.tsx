import Link from "next/link";

export default function Home() {
return ( <main className="min-h-screen bg-gray-50">

  <header className="bg-green-700 text-white">
    <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        🚲 Bike Mossoró
      </h1>

      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-lg border border-white px-4 py-2 hover:bg-white hover:text-green-700 transition"
        >
          Entrar
        </Link>

        <Link
          href="/cadastro"
          className="rounded-lg bg-white px-4 py-2 text-green-700 font-semibold hover:bg-gray-100"
        >
          Criar Conta
        </Link>
      </div>
    </div>
  </header>

  <section className="bg-green-700 text-white">
    <div className="mx-auto max-w-6xl px-6 py-24 text-center">

      <div className="text-8xl mb-6">
        🚲
      </div>

      <h2 className="text-5xl font-bold mb-6">
        Mobilidade sustentável
        para Mossoró
      </h2>

      <p className="mx-auto max-w-3xl text-lg text-green-100">
        Alugue bicicletas de forma rápida,
        segura e acessível através de estações
        distribuídas pela cidade.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/cadastro"
          className="rounded-lg bg-white px-6 py-3 text-green-700 font-semibold shadow hover:bg-gray-100"
        >
          Começar Agora
        </Link>

        <a
          href="#planos"
          className="rounded-lg border border-white px-6 py-3 hover:bg-white hover:text-green-700 transition"
        >
          Conhecer Planos
        </a>
      </div>

    </div>
  </section>

  <section className="mx-auto max-w-6xl px-6 py-20">
    <h2 className="text-center text-3xl font-bold mb-12">
      Como Funciona
    </h2>

    <div className="grid gap-8 md:grid-cols-4">

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="text-4xl mb-4">
          👤
        </div>

        <h3 className="font-semibold mb-2">
          Cadastre-se
        </h3>

        <p className="text-gray-600">
          Crie sua conta rapidamente.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="text-4xl mb-4">
          💳
        </div>

        <h3 className="font-semibold mb-2">
          Escolha um Plano
        </h3>

        <p className="text-gray-600">
          Avulso, diário, mensal ou anual.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="text-4xl mb-4">
          📱
        </div>

        <h3 className="font-semibold mb-2">
          Escaneie
        </h3>

        <p className="text-gray-600">
          Utilize o QR Code para desbloquear a bicicleta.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="text-4xl mb-4">
          🚴
        </div>

        <h3 className="font-semibold mb-2">
          Pedale
        </h3>

        <p className="text-gray-600">
          Aproveite o trajeto e devolva em qualquer estação disponível.
        </p>
      </div>

    </div>
  </section>

  <section className="bg-white py-20">
    <div className="mx-auto max-w-6xl px-6">

      <h2 className="text-center text-3xl font-bold mb-12">
        Benefícios
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border p-6">
          <div className="text-3xl mb-3">
            🌱
          </div>

          <h3 className="font-semibold">
            Sustentabilidade
          </h3>
        </div>

        <div className="rounded-xl border p-6">
          <div className="text-3xl mb-3">
            🔒
          </div>

          <h3 className="font-semibold">
            Segurança
          </h3>
        </div>

        <div className="rounded-xl border p-6">
          <div className="text-3xl mb-3">
            📍
          </div>

          <h3 className="font-semibold">
            Estações Distribuídas
          </h3>
        </div>

        <div className="rounded-xl border p-6">
          <div className="text-3xl mb-3">
            ⚡
          </div>

          <h3 className="font-semibold">
            Agilidade
          </h3>
        </div>

      </div>

    </div>
  </section>

  <section
    id="planos"
    className="mx-auto max-w-6xl px-6 py-20"
  >

    <h2 className="text-center text-3xl font-bold mb-12">
      Nossos Planos
    </h2>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="font-bold text-xl mb-2">
          Avulso
        </h3>

        <p className="text-3xl font-bold text-green-700 mb-4">
          R$ 5,00
        </p>

        <ul className="space-y-2 text-gray-600 mb-6">
          <li>✓ 1 viagem</li>
          <li>✓ Até 15 minutos</li>
          <li>✓ Uso ocasional</li>
        </ul>

      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="font-bold text-xl mb-2">
          Diário
        </h3>

        <p className="text-3xl font-bold text-green-700 mb-4">
          R$ 10,00
        </p>

        <ul className="space-y-2 text-gray-600 mb-6">
          <li>✓ 20 viagens</li>
          <li>✓ Até 45 minutos</li>
          <li>✓ Validade de 1 dia</li>
        </ul>

      </div>

      <div className="rounded-xl border-2 border-green-700 bg-white p-6 shadow-lg">
        <div className="mb-3 inline-block rounded-full bg-green-700 px-3 py-1 text-sm text-white">
          Mais Popular
        </div>

        <h3 className="font-bold text-xl mb-2">
          Mensal
        </h3>

        <p className="text-3xl font-bold text-green-700 mb-4">
          R$ 20,00
        </p>

        <ul className="space-y-2 text-gray-600 mb-6">
          <li>✓ 20 viagens por dia</li>
          <li>✓ Até 45 minutos</li>
          <li>✓ Validade de 30 dias</li>
        </ul>

      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="font-bold text-xl mb-2">
          Anual
        </h3>

        <p className="text-3xl font-bold text-green-700 mb-4">
          R$ 120,00
        </p>

        <ul className="space-y-2 text-gray-600 mb-6">
          <li>✓ 20 viagens por dia</li>
          <li>✓ Até 45 minutos</li>
          <li>✓ Validade de 365 dias</li>
        </ul>

      </div>

    </div>

  </section>

  <section className="bg-green-700 text-white py-20 text-center">

    <h2 className="text-4xl font-bold mb-4">
      Pronto para começar?
    </h2>

    <p className="mb-8 text-green-100">
      Transforme a forma como você se desloca pela cidade.
    </p>

    <Link
      href="/cadastro"
      className="rounded-lg bg-white px-8 py-4 text-green-700 font-semibold hover:bg-gray-100"
    >
      Criar Conta
    </Link>

  </section>

  <footer className="bg-gray-900 py-8 text-center text-gray-400">
    <p>
      ©️ Bike Mossoró
    </p>
  </footer>

</main>
);
}
