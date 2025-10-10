// src/components/salary/FastOvertimeHours.tsx
'use client';

import { EditRow } from '@/components/salary/ui';

type Props = {
  hOT50: number;
  setHOT50Action: (n: number) => void;   // ← nytt navn
  hOT100: number;
  setHOT100Action: (n: number) => void;  // ← nytt navn
};

export default function FastOvertimeHours({
  hOT50,
  setHOT50Action,
  hOT100,
  setHOT100Action,
}: Props) {
  return (
    <div
      className="mt-4 rounded-xl border p-4"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="mb-3 text-sm font-semibold opacity-90">
        Skriv inn timene du har jobbet
      </div>

      <div className="space-y-2">
        <EditRow
          label="50% overtid"
          unit="Timer"
          value={hOT50}
          onChange={setHOT50Action}
          step={0.25}
          w={100}
          decimals={2}
        />
        <EditRow
          label="100% overtid"
          unit="Timer"
          value={hOT100}
          onChange={setHOT100Action}
          step={0.25}
          w={100}
          decimals={2}
        />
      </div>
    </div>
  );
}
