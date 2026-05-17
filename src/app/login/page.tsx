"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/home';

  const handleLogin = async () => {
    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/fundo.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-4xl border border-white/60 rounded-3xl p-6 md:p-10 bg-black/95 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-11 h-13" alt="Logo" />
            <h1 className="text-4xl md:text-5xl mt-2 font-extrabold text-white">
              Meet<span className="font-light">flow</span>
            </h1>
          </div>
          <div className="w-69 h-[2px] bg-white/70 mt-2" />
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-white text-2xl md:text-3xl mb-6">Login</h2>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-white text-sm">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 rounded bg-gray-200 text-black outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <label className="text-white text-sm">Senha</label>
              <input
                type="password"
                placeholder="Password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full mt-1 p-3 rounded bg-gray-200 text-black outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-lg mt-2 text-white font-medium bg-gradient-to-r from-[#5f38d9] to-[#7b5cff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <span className="text-center text-white text-sm mt-2">
              ou continue com
            </span>

            <div className="flex gap-4 mt-2">
              <div className="flex-1 h-12 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition">
                <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-13/2Eb7DkCRha.png" className="w-5" alt="Google" />
              </div>
              <div className="flex-1 h-12 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition">
                <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-13/NuDBZP4bQ1.png" className="w-5" alt="Apple" />
              </div>
              <div className="flex-1 h-12 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 transition">
                <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-13/pV7ts3V3R6.png" className="w-5" alt="Facebook" />
              </div>
            </div>

            <p className="text-center text-white text-sm mt-4">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-[#7b5cff]">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
