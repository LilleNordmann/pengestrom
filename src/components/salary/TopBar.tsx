// src/components/salary/TopBar.tsx
'use client';

import React from 'react';
import MoneyBox from './MoneyBox';

type Props = {
  hourlyStr: string;
  setHourlyStr: (s: string) => void;
  onCommitHourly: () => void;
  ot50Text: string;   // ferdig formatert "375,00"
  ot100Text: string;  // ferdig formatert "500,00"
};

export default function TopBar({
  hourlyStr,
  setHourlyStr,
  onCommitHourly,
  ot50Text,
  ot100Text,
}: Props) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
      {/* Du har ... i timelønn (redigerbar) */}
      <div className="rounded-lg px-3 py-2 ui-panel">
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Du har</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-bold">kr</span>
          <MoneyBox
            editable
            value={hourlyStr}
            onChange={setHourlyStr}
          />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>i timelønn</span>
        </div>
      </div>

      {/* 50% overtid (visning) */}
      <div className="rounded-lg px-3 py-2 ui-panel">
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Ved 50% overtid har du</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-bold">kr</span>
          <MoneyBox value={ot50Text} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>i timelønn</span>
        </div>
      </div>

      {/* 100% overtid (visning) */}
      <div className="rounded-lg px-3 py-2 ui-panel">
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Ved 100% overtid har du</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-bold">kr</span>
          <MoneyBox value={ot100Text} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>i timelønn</span>
        </div>
      </div>
    </div>
  );
}
