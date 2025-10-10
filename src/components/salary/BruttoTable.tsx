'use client';
import React from 'react';
import { BarRow, KVRow } from './ui';
import { NOK } from '@/lib/format';

type Props = {
  timelonn: number;
  kveld: number;
  natt: number;
  ot50: number;
  ot100: number;
  brutto: number;
  shiftYes: boolean;
};

export default function BruttoTable({
  timelonn,
  kveld,
  natt,
  ot50,
  ot100,
  brutto,
  shiftYes,
}: Props) {
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
