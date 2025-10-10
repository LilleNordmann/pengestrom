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
    <div className="mb-4 rounded-lg px-4 py-3 ui-panel">
      {/* Fleksibel, bryter pent på små skjermer */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {/* Timelønn (redigerbar) */}
        <InlineBlock label="Timelønn">
          <span className="mx-2 text-sm font-bold">kr</span>
          <MoneyBox
            editable
            value={hourlyStr}
            onChange={setHourlyStr}
            // commit ved Enter/blur så verdien formatteres
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') onCommitHourly();
            }}
            onBlur={onCommitHourly}
          />
        </InlineBlock>

        {/* 50% overtid (visning) */}
        <InlineBlock label="50% overtid">
          <span className="mx-2 text-sm font-bold">kr</span>
          <span className="tabular-nums text-lg font-extrabold">{ot50Text}</span>
        </InlineBlock>

        {/* 100% overtid (visning) */}
        <InlineBlock label="100% overtid">
          <span className="mx-2 text-sm font-bold">kr</span>
          <span className="tabular-nums text-lg font-extrabold">{ot100Text}</span>
        </InlineBlock>
      </div>
    </div>
  );
}

/** Liten hjelpekomponent for "Label  kr  Value" på én linje */
function InlineBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-xs" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
      {children}
    </div>
  );
}
