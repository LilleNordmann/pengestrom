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
  kveldPreviewText?: string;
  nattPreviewText?: string;
}) {
  const handleNo = () => {
    setShiftYes(false);
    setKveldTillegg(0);
    setNattTillegg(0);
    // valgfritt: gå tilbake til 'kr' for å unngå misvisende %-preview neste gang
    setShiftMode('kr');
  };

  return (
    <div className="mb-2">
      <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
        Jobber du skift
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        <Chip label="JA" active={shiftYes} onClick={() => setShiftYes(true)} />
        <Chip label="NEI" active={!shiftYes} onClick={handleNo} />
      </div>

      {/* Skjul hele seksjonen når NEI er valgt */}
      {shiftYes && (
        <>
          <div className="mt-2 text-xs font-semibold" style={{ color: 'var(--muted)' }}>
            Skifttillegg i
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            <Chip label="Prosent" active={shiftMode === '%'} onClick={() => setShiftMode('%')} />
            <Chip label="Kroner" active={shiftMode === 'kr'} onClick={() => setShiftMode('kr')} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <Row
              label="Kveldstillegg"
              unit={shiftMode === 'kr' ? 'kr' : '%'}
              value={kveldTillegg}
              onChange={setKveldTillegg}
              step={shiftMode === 'kr' ? 1 : 0.5}
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
        </>
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
        grid-cols-[1fr_auto_minmax(72px,96px)]
        md:grid-cols-[auto_auto_minmax(84px,112px)_1fr]
      "
    >
      <div className="text-sm md:text-[15px]">{label}</div>

      <div className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
        {unit}
      </div>

      <div className="justify-self-start md:justify-self-auto w-[84px]">
        <SmallNum value={value} onChange={onChange} step={step ?? 1} />
      </div>

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
        <div className="hidden md:block" />
      )}
    </div>
  );
}
