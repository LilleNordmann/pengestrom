"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function signIn() {
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr(error.message);
    else window.location.href = "/dashboard";
  }

  return (
    <main className="mx-auto max-w-sm p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Pengestrøm</h1>
      <input className="w-full rounded border p-2" type="email" placeholder="E-post"
             value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="Passord"
             value={pw} onChange={e=>setPw(e.target.value)} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button onClick={signIn} className="w-full rounded bg-black py-2 text-white">Logg inn</button>
      <p className="text-sm text-neutral-500">
        Har du ikke bruker? Opprett i Supabase Auth (Email+Password), eller legg til sign-up senere.
      </p>
      <p className="text-xs"><Link href="/dashboard" className="underline">Hopp til dashboard</Link> (for test)</p>
    </main>
  );
}
