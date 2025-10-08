import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Ikke kast ved import/build; kast først når vi faktisk trenger klienten
  if (!url || !anon) {
    throw new Error("Supabase env mangler i dette miljøet. Sjekk Vercel env for Preview/Production.");
  }

  client = createClient(url, anon);
  return client;
}
