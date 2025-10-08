"use client";

import { useState } from "react";
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
    } catch (e: any) {
      setErr(e?.message ?? "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Pengestrøm</h1>
      <input className="w-full rounded border p-2" placeholder="E-post"
        value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="Passord"
        value={pw} onChange={(e)=>setPw(e.target.value)} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button onClick={signIn} disabled={loading}
        className="w-full rounded bg-black py-2 text-white disabled:opacity-50">
        {loading ? "Logger inn..." : "Logg inn"}
      </button>
    </main>
  );
}
