import Link from "next/link";

export default function CadastroSucesso() {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/fundo.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-xl border border-white/60 rounded-3xl p-6 md:p-10 bg-black/95 shadow-2xl text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-11 h-13" alt="Logo" />
            <h1 className="text-4xl md:text-5xl mt-2 font-extrabold text-white">
              Meet<span className="font-light">flow</span>
            </h1>
          </div>
        </div>

        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-white text-2xl md:text-3xl mb-4">
          Cadastro realizado!
        </h2>

        <p className="text-gray-300 mb-8">
          Enviamos um email de confirmação para o seu endereço. Por favor,
          verifique sua caixa de entrada e clique no link para ativar sua conta.
        </p>

        <Link
          href="/login"
          className="inline-block px-8 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#5f38d9] to-[#7b5cff] hover:opacity-90 transition"
        >
          Ir para Login
        </Link>
      </div>
    </div>
  );
}
