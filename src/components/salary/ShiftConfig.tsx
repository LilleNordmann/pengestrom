// src/components/salary/ShiftConfig.tsx
'use client';
import React from 'react';
import { Chip, SmallNum } from './ui';

export type ShiftMode = 'kr' | '%';

export default function ShiftConfig({
  shiftYes,
  setShiftYes,
  shiftMode,
  setShiftMode,
  kveldTillegg,
  setKveldTillegg,
  nattTillegg,
  setNattTillegg,
  // nye props for prosent-modus preview i kroner
  kveldPreviewText,
  nattPreviewText,
}: {
  shiftYes: boolean;
  setShiftYes: (v: boolean) => void;
  shiftMode: ShiftMode;
  setShiftMode: (v: ShiftMode) => void;
  kveldTillegg: number;
  setKveldTillegg: (v: number) => void;
  nattTillegg: number;
  setNattTillegg: (v: number) => void;
  // f.eks. "kr 375,00" – ferdig formatert
  kveldPreviewText?: string;
  nattPreviewText?: string;
}) {
  return (
    <div className="mb-2">
      <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
        Jobber du skift
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        <Chip label="JA" active={shiftYes} onClick={() => setShiftYes(true)} />
        <Chip label="NEI" active={!shiftYes} onClick={() => setShiftYes(false)} />
      </div>

      <div className="mt-2 text-xs font-semibold" style={{ color: 'var(--muted)' }}>
        Skifttillegg i
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        <Chip label="Prosent" active={shiftMode === '%'} onClick={() => setShiftMode('%')} />
        <Chip label="Kroner" active={shiftMode === 'kr'} onClick={() => setShiftMode('kr')} />
      </div>

      {shiftYes && (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Row
            label="Kveldstillegg"
            unit={shiftMode === 'kr' ? 'kr' : '%'}
            value={kveldTillegg}
            onChange={setKveldTillegg}
            step={shiftMode === 'kr' ? 1 : 0.5}
            // vis kun preview i prosent-modus
            rightText={shiftMode === '%' ? (kveldPreviewText ?? '') : ''}
          />
          <Row
            label="Natt­tillegg"
            unit={shiftMode === 'kr' ? 'kr' : '%'}
            value={nattTillegg}
            onChange={setNattTillegg}
            step={shiftMode === 'kr' ? 1 : 0.5}
            rightText={shiftMode === '%' ? (nattPreviewText ?? '') : ''}
          />
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  unit,
  value,
  onChange,
  step,
  rightText,
}: {
  label: string;
  unit: string; // 'kr' | '%'
  value: number;
  onChange: (v: number) => void;
  step?: number;
  rightText?: string; // vises høyrejustert (kun prosent-modus)
}) {
  return (
    <div
      className="
        grid items-center gap-x-3 gap-y-2
        /* På mobil bryter preview under feltet. På md+ ligger alt på én linje */
        grid-cols-[1fr_auto_minmax(72px,96px)] 
        md:grid-cols-[auto_auto_minmax(84px,112px)_1fr]
      "
    >
      {/* Label */}
      <div className="text-sm md:text-[15px]">{label}</div>

      {/* Enhet (kr / %) */}
      <div className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
        {unit}
      </div>

      {/* Input */}
      <div className="justify-self-start md:justify-self-auto w-[84px]">
        <SmallNum value={value} onChange={onChange} step={step ?? 1} />
      </div>

      {/* Høyreside (kr-preview) – skjules i kroner-modus */}
      {rightText ? (
        <div
          className="
            col-span-3 md:col-span-1
            md:justify-self-end md:text-right
            text-sm font-semibold tracking-tight
          "
        >
          {rightText}
        </div>
      ) : (
        // tomt element for å holde linjehøyde konsistent på md+
        <div className="hidden md:block" />
      )}
    </div>
  );
}
