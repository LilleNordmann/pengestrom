"use client";

import { supabase } from "@/lib/supabaseClient";
import ProtectedLayout from "../(auth)/protected-layout";

export default function Dashboard() {
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <ProtectedLayout>
      <main className="mx-auto max-w-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={signOut}
            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
          >
            Logg ut
          </button>
        </div>

        <section className="space-y-4">
          <p>Velkommen til Pengestrøm!</p>
          <p>Her skal du snart se lønn, utgifter og lån samlet på ett sted 💰</p>
        </section>
      </main>
    </ProtectedLayout>
  );
}
