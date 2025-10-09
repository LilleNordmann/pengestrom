'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type DeferredPrompt = {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function useStandalone() {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const mm = window.matchMedia?.('(display-mode: standalone)');
    const isStandalone = mm?.matches || (window.navigator as any).standalone === true;
    setStandalone(!!isStandalone);

    const handler = () => setStandalone(window.matchMedia('(display-mode: standalone)').matches);
    mm?.addEventListener?.('change', handler);
    return () => mm?.removeEventListener?.('change', handler);
  }, []);

  return standalone;
}

function useIsIOS() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    // En enkel sjekk for Safari (utelukke Chrome/Firefox på iOS)
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    return isIOS && isSafari;
  }, []);
}

export default function InstallPWAButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const deferredPromptRef = useRef<DeferredPrompt | null>(null);

  const isStandalone = useStandalone();
  const isIOS = useIsIOS();

  // Vis ikke banner hvis bruker har avvist nylig (24t)
  const recentlyDismissed = useRef(false);
  useEffect(() => {
    const ts = localStorage.getItem('pwa_install_dismiss_ts');
    if (ts && Date.now() - Number(ts) < 24 * 60 * 60 * 1000) {
      recentlyDismissed.current = true;
    }
  }, []);

  // Lytt til beforeinstallprompt (Chromium)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onBIP = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as unknown as DeferredPrompt;
      if (!isStandalone && !recentlyDismissed.current) {
        setCanInstall(true);
      }
    };
    window.addEventListener('beforeinstallprompt', onBIP as any);

    const onInstalled = () => {
      setCanInstall(false);
      deferredPromptRef.current = null;
    };
    window.addEventListener('appinstalled', onInstalled);

    // Fallback: hvis kriteriene er oppfylt, men BIP ikke fyres (kan skje),
    // la iOS-hjelpen være tilgjengelig
    if (isIOS && !isStandalone && !recentlyDismissed.current) {
      // Vi viser ikke automatisk modal, men lar knappen synes
      setCanInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP as any);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [isStandalone, isIOS]);

  if (isStandalone || !canInstall) return null;

  const onClickInstall = async () => {
    if (isIOS) {
      setShowIOSHelp(true);
      return;
    }
    const dp = deferredPromptRef.current;
    if (!dp) {
      // Ingen prompt tilgjengelig — vis iOS-hjelp som fallback
      setShowIOSHelp(true);
      return;
    }
    await dp.prompt();
    const choice = await dp.userChoice;
    if (choice.outcome === 'accepted') {
      setCanInstall(false);
    } else {
      // Bruker avslo — ikke mas på 24t
      localStorage.setItem('pwa_install_dismiss_ts', String(Date.now()));
      setCanInstall(false);
    }
    deferredPromptRef.current = null;
  };

  const dismiss = () => {
    localStorage.setItem('pwa_install_dismiss_ts', String(Date.now()));
    setCanInstall(false);
  };

  return (
    <>
      {/* Lite banner/knapp – legg gjerne i headeren */}
      <div className="fixed z-40 bottom-[env(safe-area-inset-bottom,0)] left-0 right-0 px-4 pb-4">
        <div className="mx-auto max-w-md rounded-2xl shadow-lg border bg-[var(--card,#111111)] text-white p-3 flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-white/10 p-2 leading-none">📲</div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Installer Pengestrøm</div>
            <div className="text-xs opacity-80">
              Få appen på hjemskjermen for raskere tilgang.
            </div>
          </div>
          <button
            onClick={onClickInstall}
            className="rounded-xl px-3 py-2 text-sm font-semibold bg-white text-black hover:opacity-90"
          >
            Installer
          </button>
          <button
            onClick={dismiss}
            className="ml-1 rounded-xl px-2 py-2 text-xs border border-white/30 hover:bg-white/10"
            aria-label="Lukk"
            title="Lukk"
          >
            ✕
          </button>
        </div>
      </div>

      {/* iOS veiledning (modal) */}
      {showIOSHelp && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full sm:max-w-md rounded-2xl bg-white text-black p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Legg til på Hjem-skjermen (iOS)</h2>
              <button
                onClick={() => setShowIOSHelp(false)}
                className="rounded-md px-2 py-1 text-sm border hover:bg-black/5"
              >
                Lukk
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Åpne i <strong>Safari</strong> på iPhone/iPad.</li>
              <li>Trykk <strong>Del-ikonet</strong> nederst (firkant med pil opp) <span className="inline-block">🔼</span></li>
              <li>Velg <strong>«Legg til på Hjem-skjerm»</strong>.</li>
              <li>Trykk <strong>Legg til</strong>.</li>
            </ol>
            <div className="mt-3 text-xs text-neutral-600">
              Tips: Når den er lagt til, starter Pengestrøm i fullskjerm og oppfører seg som en app.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
