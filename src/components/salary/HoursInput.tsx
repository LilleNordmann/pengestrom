// src/components/salary/HoursInput.tsx
'use client';
import React from 'react';
import { SmallNum, TimeRow } from './ui';

type Props = {
  shiftYes: boolean; // styrer om kveld/natt vises
  hVanlig: number;  setHVanligAction: (v: number) => void;
  hHellig: number;  setHHelligAction: (v: number) => void;
  hKveld: number;   setHKveldAction: (v: number) => void;
  hNatt: number;    setHNattAction: (v: number) => void;
  hOT50: number;    setHOT50Action: (v: number) => void;
  hOT100: number;   setHOT100Action: (v: number) => void;
};

export default function HoursInput({
  shiftYes,
  hVanlig,  setHVanligAction,
  hHellig,  setHHelligAction,
  hKveld,   setHKveldAction,
  hNatt,    setHNattAction,
  hOT50,    setHOT50Action,
  hOT100,   setHOT100Action,
}: Props) {
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
          <SmallNum value={hVanlig} onChange={setHVanligAction} step={0.25} decimals={2} />
        </TimeRow>

        <TimeRow label="Helligdag">
          <SmallNum value={hHellig} onChange={setHHelligAction} step={0.25} decimals={2} />
        </TimeRow>

        {shiftYes && (
          <>
            <TimeRow label="Kveld">
              <SmallNum value={hKveld} onChange={setHKveldAction} step={0.25} decimals={2} />
            </TimeRow>

            <TimeRow label="Natt">
              <SmallNum value={hNatt} onChange={setHNattAction} step={0.25} decimals={2} />
            </TimeRow>
          </>
        )}

        <TimeRow label="50% overtid">
          <SmallNum value={hOT50} onChange={setHOT50Action} step={0.25} decimals={2} />
        </TimeRow>

        <TimeRow label="100% overtid">
          <SmallNum value={hOT100} onChange={setHOT100Action} step={0.25} decimals={2} />
        </TimeRow>
      </div>
    </>
  );
}
