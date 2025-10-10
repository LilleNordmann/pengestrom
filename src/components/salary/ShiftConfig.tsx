// src/components/salary/ShiftConfig.tsx
'use client';
import React from 'react';
import { Chip, MiniLine, SmallNum } from './ui';

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
}: {
  shiftYes: boolean;
  setShiftYes: (v: boolean) => void;
  shiftMode: ShiftMode;
  setShiftMode: (v: ShiftMode) => void;
  kveldTillegg: number;
  setKveldTillegg: (v: number) => void;
  nattTillegg: number;
  setNattTillegg: (v: number) => void;
}) {
  return (
    <div className="mb-2">
      <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Jobber du skift</div>
      <div className="mt-1 flex gap-2">
        <Chip label="JA" active={shiftYes} onClick={() => setShiftYes(true)} />
        <Chip label="NEI" active={!shiftYes} onClick={() => setShiftYes(false)} />
      </div>

      <div className="mt-2 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Skifttillegg i</div>
      <div className="mt-1 flex gap-2">
        <Chip label="Prosent" active={shiftMode === '%'} onClick={() => setShiftMode('%')} />
        <Chip label="Kroner" active={shiftMode === 'kr'} onClick={() => setShiftMode('kr')} />
      </div>

      {shiftYes && (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <MiniLine
            label="Kveldstillegg"
            left={shiftMode === 'kr' ? 'kr' : '%'}
            right={shiftMode === 'kr' ? 'i tillegg' : 'av timelønn'}
            input={<SmallNum value={kveldTillegg} onChange={setKveldTillegg} step={shiftMode === 'kr' ? 1 : 0.5} />}
          />
          <MiniLine
            label="Natttillegg"
            left={shiftMode === 'kr' ? 'kr' : '%'}
            right={shiftMode === 'kr' ? 'i tillegg' : 'av timelønn'}
            input={<SmallNum value={nattTillegg} onChange={setNattTillegg} step={shiftMode === 'kr' ? 1 : 0.5} />}
          />
        </div>
      )}
    </div>
  );
}
