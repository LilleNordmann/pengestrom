"use client";

import ProtectedLayout from "../(auth)/protected-layout";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  async function signOut() {
    await supabase.auth.signOut();
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
        <p>Velkommen! Her kommer lønn, utgifter og lån.</p>
      </main>
    </ProtectedLayout>
  );
}
