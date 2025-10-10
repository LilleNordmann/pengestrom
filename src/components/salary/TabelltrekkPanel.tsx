// src/components/salary/TabelltrekkPanel.tsx
'use client';
import React from 'react';
import { KVHeader, KVFoot, PanelWarn, SmallNum } from './ui';

export default function TabelltrekkPanel({
  NOK,
  bruttoTilTabell,
  tabelltrekkKr,
  setTabelltrekkKr,
}: {
  NOK: (n: number) => string;
  bruttoTilTabell: number;
  tabelltrekkKr: number;
  setTabelltrekkKr: (v: number) => void;
}) {
  return (
    <PanelWarn>
      <KVHeader k="Brutto til tabelltrekk" v={`kr ${NOK(bruttoTilTabell)}`} />
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="text-sm" style={{ color: 'var(--muted)' }}>Skatt Tabelltrekk</span>
        <SmallNum value={tabelltrekkKr} onChange={setTabelltrekkKr} step={100} w={90} />
      </div>
      <KVFoot label="Sum tabelltrekk" value={`kr ${NOK(tabelltrekkKr)}`} />
    </PanelWarn>
  );
}
