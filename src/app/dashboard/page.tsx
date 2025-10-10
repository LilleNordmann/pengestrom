"use client";

import ProtectedLayout from "../(auth)/protected-layout";
import { getSupabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Dashboard() {
  async function signOut() {
    await getSupabase().auth.signOut();
    window.location.href = "/";
  }

  return (
    <ProtectedLayout>
      <main className="mx-auto max-w-3xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button onClick={signOut} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300">
            Logg ut
          </button>
        </div>
        <p>Velkommen! Auth fungerer 🎉</p>
        <Link
  href="/salary"
  className="block rounded-2xl border border-neutral-200 p-5 shadow-sm transition hover:shadow-md dark:border-neutral-800"
>
  <div className="text-lg font-semibold">Lønnsutregning</div>
  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
    Regn ut timelønn, tillegg, overtid og skattetrekk.
  </p>
</Link>
      </main>
    </ProtectedLayout>
  );
}
