// src/components/salary/TopBar.tsx
'use client';

import React from 'react';
import MoneyBox from './MoneyBox';

type Props = {
  hourlyStr: string;
  setHourlyStrAction: (s: string) => void; // ← nytt navn
  onCommitHourlyAction: () => void;        // ← nytt navn
  ot50Text: string;
  ot100Text: string;
};

export default function TopBar({
  hourlyStr,
  setHourlyStrAction,
  onCommitHourlyAction,
  ot50Text,
  ot100Text,
}: Props) {
  return (
    <div className="mb-4 rounded-lg px-4 py-3 ui-panel">
      {/* Mobil: grid med rader. Desktop: ligg på linje med gap */}
      <div className="grid gap-3 md:flex md:flex-wrap md:items-center md:gap-x-8 md:gap-y-3">
        <InlineKV
          label="Timelønn"
          valueNode={
            <MoneyBox
              editable
              value={hourlyStr}
              onChangeAction={setHourlyStrAction}
              onKeyDownAction={(e) => {
                if (e.key === 'Enter') onCommitHourlyAction();
              }}
              onBlurAction={onCommitHourlyAction}
            />
          }
        />

        <InlineKV
          label="50% overtid"
          valueNode={
            <span className="tabular-nums text-base md:text-lg font-extrabold">
              {ot50Text}
            </span>
          }
        />

        <InlineKV
          label="100% overtid"
          valueNode={
            <span className="tabular-nums text-base md:text-lg font-extrabold">
              {ot100Text}
            </span>
          }
        />
      </div>
    </div>
  );
}

/** Viser "Label | kr | Verdi".
 *  - Mobil: grid med tre kolonner (label venstre, "kr" midt, verdi høyre)
 *  - Desktop (md+): flex på én linje med små mellomrom
 */
function InlineKV({
  label,
  valueNode,
}: {
  label: string;
  valueNode: React.ReactNode;
}) {
  return (
    <div
      className="
        grid w-full grid-cols-[1fr_auto_auto] items-center
        md:w-auto md:grid-cols-none md:flex md:items-center md:gap-2
      "
    >
      <span className="text-xs md:text-xs" style={{ color: 'var(--muted)' }}>
        {label}
      </span>

      <span className="mx-2 text-sm font-bold md:mx-0">kr</span>

      {/* På mobil: høyrejuster verdien; desktop: normal */}
      <div className="justify-self-end md:justify-self-auto">{valueNode}</div>
    </div>
  );
}
