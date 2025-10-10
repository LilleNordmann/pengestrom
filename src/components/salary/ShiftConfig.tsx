// src/components/salary/ShiftConfig.tsx
'use client';
import React from 'react';
import { Chip, SmallNum } from './ui';

export type ShiftMode = 'kr' | '%';

type Props = {
  shiftYes: boolean;
  setShiftYesAction: (v: boolean) => void;   // ← nytt navn

  shiftMode: ShiftMode;
  setShiftModeAction: (v: ShiftMode) => void; // ← nytt navn

  kveldTillegg: number;
  setKveldTilleggAction: (v: number) => void; // ← nytt navn

  nattTillegg: number;
  setNattTilleggAction: (v: number) => void;  // ← nytt navn

  kveldPreviewText?: string;
  nattPreviewText?: string;
};

export default function ShiftConfig({
  shiftYes,
  setShiftYesAction,
  shiftMode,
  setShiftModeAction,
  kveldTillegg,
  setKveldTilleggAction,
  nattTillegg,
  setNattTilleggAction,
  kveldPreviewText,
  nattPreviewText,
}: Props) {
  const handleNo = () => {
    setShiftYesAction(false);
    setKveldTilleggAction(0);
    setNattTilleggAction(0);
    setShiftModeAction('kr'); // valgfritt fallback
  };

  return (
    <div className="mb-2">
      <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
        Jobber du skift
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        <Chip label="JA"  active={shiftYes}     onClick={() => setShiftYesAction(true)} />
        <Chip label="NEI" active={!shiftYes}    onClick={handleNo} />
      </div>

      {shiftYes && (
        <>
          <div className="mt-2 text-xs font-semibold" style={{ color: 'var(--muted)' }}>
            Skifttillegg i
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            <Chip label="Prosent" active={shiftMode === '%'} onClick={() => setShiftModeAction('%')} />
            <Chip label="Kroner"  active={shiftMode === 'kr'} onClick={() => setShiftModeAction('kr')} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <Row
              label="Kveldstillegg"
              unit={shiftMode === 'kr' ? 'kr' : '%'}
              value={kveldTillegg}
              onChange={setKveldTilleggAction}
              step={shiftMode === 'kr' ? 1 : 0.5}
              rightText={shiftMode === '%' ? (kveldPreviewText ?? '') : ''}
            />
            <Row
              label="Natt­tillegg"
              unit={shiftMode === 'kr' ? 'kr' : '%'}
              value={nattTillegg}
              onChange={setNattTilleggAction}
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
  unit: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  rightText?: string;
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
