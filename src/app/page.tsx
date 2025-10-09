"use client";

import { useState } from "react";
import Image from "next/image";
import { getSupabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setErr(null);
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) setErr(error.message);
      else window.location.href = "/dashboard";
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Ukjent feil";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-black text-white flex flex-col items-center justify-center px-6 pt-[env(safe-area-inset-top)]">
      {/* Logo */}
      <Image
        src="/icons/pengestrom_logo.svg"
        alt="Pengestrøm logo"
        width={180}
        height={180}
        className="mb-6 rounded-2xl"
      />

      {/* Tittel og undertittel */}
      <h1 className="text-2xl font-semibold text-center mb-1">
        Velkommen til Pengestrøm
      </h1>
      <p className="text-sm text-gray-300 mb-6">Følg Din Økonomi</p>

      {/* Input-felt */}
      <div className="w-full max-w-xs space-y-3">
        <input
          className="w-full rounded bg-white text-black p-2 text-center"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded bg-white text-black p-2 text-center"
          type="password"
          placeholder="Passord"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {err && <p className="text-sm text-red-500 text-center">{err}</p>}

        {/* Logg inn knapp */}
        <button
          onClick={signIn}
          disabled={loading}
          className="w-full rounded bg-white text-black py-2 font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Logger inn..." : "Logg Inn"}
        </button>

        {/* Lenker */}
        <div className="text-center text-sm mt-3 space-y-2">
          <a href="#" className="block text-gray-300 hover:underline">
            Glemt Passord?
          </a>
          <a href="/register" className="block text-gray-300 hover:underline">
            Registrer deg
          </a>
        </div>
      </div>
    </main>
  );
}
