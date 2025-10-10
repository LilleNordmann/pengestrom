// src/components/salary/TabelltrekkPanel.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { KVHeader, KVFoot, PanelWarn, SmallNum, Chip } from './ui';

type Mode = 'percent' | 'table';

export default function TabelltrekkPanel({
  NOK,
  bruttoTilTabell,
  tabelltrekkKr,
  setTabelltrekkKr,
  initialMode = 'table',      // start på Tabell som før
  initialPercent = 30,        // valgfri startprosent
}: {
  NOK: (n: number) => string;
  bruttoTilTabell: number;
  tabelltrekkKr: number;
  setTabelltrekkKr: (v: number) => void;
  initialMode?: Mode;
  initialPercent?: number;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [percent, setPercent] = useState<number>(initialPercent);

  // Når vi står i prosent-modus, beregn trekk i kroner og push til parent
  useEffect(() => {
    if (mode === 'percent') {
      const v = Math.max(0, (bruttoTilTabell * percent) / 100);
      // runder til nærmeste hele krone
      setTabelltrekkKr(Math.round(v));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, percent, bruttoTilTabell]);

  // Summen som vises i bunnlinjen
  const sumTrekk = mode === 'percent'
    ? Math.round((bruttoTilTabell * percent) / 100)
    : tabelltrekkKr;

  return (
    <PanelWarn>
      {/* Topp: valg av beregningsmåte */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--muted)' }}>
          Hvordan trekkes skatten
        </span>
        <div className="flex gap-2">
          <Chip label="Prosent" active={mode === 'percent'} onClick={() => setMode('percent')} />
          <Chip label="Tabell"  active={mode === 'table'}   onClick={() => setMode('table')} />
        </div>
      </div>

      {/* Header-linje bytter tekst etter modus */}
      <KVHeader
        k={mode === 'percent' ? 'Brutto til prosenttrekk' : 'Brutto til tabelltrekk'}
        v={`kr ${NOK(bruttoTilTabell)}`}
      />

      {/* Innholdslinje varierer: prosentfelt ELLER trekktabell-felt */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {mode === 'percent' ? (
          <>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Prosent</span>
            <SmallNum value={percent} onChange={setPercent} step={0.5} w={90} />
            <span className="text-sm" style={{ color: 'var(--muted)' }}>%</span>
          </>
        ) : (
          <>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Trekktabell</span>
            <SmallNum value={tabelltrekkKr} onChange={setTabelltrekkKr} step={100} w={90} />
          </>
        )}
      </div>

      <KVFoot label="Sum trekk" value={`kr ${NOK(sumTrekk)}`} />
    </PanelWarn>
  );
}
