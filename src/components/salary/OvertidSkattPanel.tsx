// src/components/salary/OvertidSkattPanel.tsx
'use client';
import React from 'react';
import { KVHeader, KVFoot, PanelWarn, SmallNum } from './ui';

export default function OvertidSkattPanel({
  NOK,
  bruttoOvertid,
  overtidSkattProsent,
  setOvertidSkattProsent,
  skattOvertid,
}: {
  NOK: (n: number) => string;
  bruttoOvertid: number;
  overtidSkattProsent: number;
  setOvertidSkattProsent: (v: number) => void;
  skattOvertid: number;
}) {
  return (
    <PanelWarn>
      <KVHeader k="Brutto Overtid" v={`kr ${NOK(bruttoOvertid)}`} />
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="text-sm" style={{ color: 'var(--muted)' }}>Skatt prosenttrekk</span>
        <SmallNum value={overtidSkattProsent} onChange={setOvertidSkattProsent} step={1} w={70} />
        <span className="text-sm" style={{ color: 'var(--muted)' }}>%</span>
      </div>
      <KVFoot label="Sum prosenttrekk" value={`kr ${NOK(skattOvertid)}`} />
    </PanelWarn>
  );
}
