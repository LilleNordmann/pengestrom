// src/components/salary/HoursInput.tsx
'use client';
import React from 'react';
import { SmallNum, TimeRow } from './ui';

export default function HoursInput({
  shiftYes,             // NY: styrer om kveld/natt vises
  hVanlig, setHVanlig,
  hHellig, setHHellig,
  hKveld, setHKveld,
  hNatt, setHNatt,
  hOT50, setHOT50,
  hOT100, setHOT100,
}: {
  shiftYes: boolean;     // NY
  hVanlig: number; setHVanlig: (v: number) => void;
  hHellig: number; setHHellig: (v: number) => void;
  hKveld: number; setHKveld: (v: number) => void;
  hNatt: number; setHNatt: (v: number) => void;
  hOT50: number; setHOT50: (v: number) => void;
  hOT100: number; setHOT100: (v: number) => void;
}) {
  return (
    <>
      <div
        className="my-4 rounded-lg px-3 py-2 text-center text-sm font-semibold"
        style={{ border: '1px solid var(--border)' }}
      >
        Skriv inn timene du har jobbet
      </div>

      <div className="mb-4 grid gap-2">
        <TimeRow label="Vanlige timer jobbet">
          <SmallNum value={hVanlig} onChange={setHVanlig} step={0.25} decimals={2} />
        </TimeRow>

        <TimeRow label="Helligdag">
          <SmallNum value={hHellig} onChange={setHHellig} step={0.25} decimals={2} />
        </TimeRow>

        {shiftYes && (
          <>
            <TimeRow label="Kveld">
              <SmallNum value={hKveld} onChange={setHKveld} step={0.25} decimals={2} />
            </TimeRow>

            <TimeRow label="Natt">
              <SmallNum value={hNatt} onChange={setHNatt} step={0.25} decimals={2} />
            </TimeRow>
          </>
        )}

        <TimeRow label="50% overtid">
          <SmallNum value={hOT50} onChange={setHOT50} step={0.25} decimals={2} />
        </TimeRow>

        <TimeRow label="100% overtid">
          <SmallNum value={hOT100} onChange={setHOT100} step={0.25} decimals={2} />
        </TimeRow>
      </div>
    </>
  );
}
