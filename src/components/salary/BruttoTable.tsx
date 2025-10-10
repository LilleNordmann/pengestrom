// src/components/salary/BruttoTable.tsx
'use client';
import React from 'react';
import { BarRow, KVRow } from './ui';

export default function BruttoTable({
  NOK,
  timelonn,
  kveld,
  natt,
  ot50,
  ot100,
  brutto,
  shiftYes, // NY
}: {
  NOK: (n: number) => string;
  timelonn: number;
  kveld: number;
  natt: number;
  ot50: number;
  ot100: number;
  brutto: number;
  shiftYes: boolean; // NY
}) {
  return (
    <>
      <div className="mt-4">
        <div className="mb-2 text-center text-sm font-semibold">Brutto Lønn</div>
        <KVRow k="Timelønn" v={NOK(timelonn)} />
        {shiftYes && <KVRow k="Kveld" v={NOK(kveld)} />}
        {shiftYes && <KVRow k="Natt" v={NOK(natt)} />}
        <KVRow k="50% overtid" v={NOK(ot50)} />
        <KVRow k="100% overtid" v={NOK(ot100)} />
      </div>

      <BarRow label="Total Bruttolønn" value={`kr ${NOK(brutto)}`} />
    </>
  );
}
