"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        window.location.href = "/";
        return;
      }
      setOk(true);
    })();
  }, []);

  if (!ok) return null;
  return <>{children}</>;
}
