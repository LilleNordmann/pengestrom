// src/components/salary/OvertidSkattPanel.tsx
'use client';
import React from 'react';
import { KVHeader, KVFoot, PanelWarn, SmallNum } from './ui';
import { NOK } from '@/lib/format';

type Props = {
  bruttoOvertid: number;
  overtidSkattProsent: number;
  setOvertidSkattProsentAction: (v: number) => void; // ← nytt navn
  skattOvertid: number;
};

export default function OvertidSkattPanel({
  bruttoOvertid,
  overtidSkattProsent,
  setOvertidSkattProsentAction,
  skattOvertid,
}: Props) {
  return (
    <PanelWarn>
      <KVHeader k="Brutto Overtid" v={`kr ${NOK(bruttoOvertid)}`} />
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="text-sm" style={{ color: 'var(--muted)' }}>Skatt prosenttrekk</span>
        <SmallNum value={overtidSkattProsent} onChange={setOvertidSkattProsentAction} step={1} w={70} />
        <span className="text-sm" style={{ color: 'var(--muted)' }}>%</span>
      </div>
      <KVFoot label="Sum prosenttrekk" value={`kr ${NOK(skattOvertid)}`} />
    </PanelWarn>
  );
}
