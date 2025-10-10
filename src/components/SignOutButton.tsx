'use client';

import { getSupabase } from '@/lib/supabaseClient'; // eller: import { getSupabase } from '../lib/supabaseClient';

export default function SignOutButton({
  className = 'px-4 py-1 rounded bg-white text-black text-sm font-medium shadow-sm',
}: { className?: string }) {
  async function handleClick() {
    const supabase = getSupabase();
    try {
      await supabase.auth.signOut();
    } finally {
      window.location.href = '/';
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      Loggut
    </button>
  );
}
