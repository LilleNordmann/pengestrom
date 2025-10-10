// src/components/salary/FastRatesPanel.tsx
'use client';

type Props = {
  NOK: (n: number) => string;
  monthlyGross: number;        // kr per måned
  annualHours: number;         // f.eks. 1950
  setAnnualHours: (n: number) => void;
  baseHourly: number;          // (monthlyGross * 12) / annualHours
  ot50Rate: number;            // baseHourly * 1.5
  ot100Rate: number;           // baseHourly * 2
};

export default function FastRatesPanel({
  NOK,
  monthlyGross,
  annualHours,
  setAnnualHours,
  baseHourly,
  ot50Rate,
  ot100Rate,
}: Props) {
  return (
    <div
      className="mt-3 rounded-xl border p-4"
      style={{ background: 'var(--panel-accent, var(--card))', borderColor: 'var(--accent-border, var(--border))' }}
    >
      <div className="flex flex-col gap-2">
        {/* Utregnet timelønn-linje med inline "timer i året" */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm opacity-80">
            Utregnet timelønn ved{' '}
            <label className="inline-flex items-center gap-2">
              <input
                type="number"
                className="w-20 rounded-md border bg-transparent px-2 py-1 text-right"
                style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
                value={annualHours}
                step={10}
                min={1000}
                max={2500}
                onChange={(e) => setAnnualHours(Number(e.target.value))}
              />
              <span className="opacity-80">timer i året</span>
            </label>
          </div>
          <div className="font-medium">kr {NOK(baseHourly)}</div>
        </div>

        {/* 50% */}
        <div className="flex items-center justify-between">
          <div className="text-sm opacity-80">Timelønn ved 50% overtid</div>
          <div className="font-medium">kr {NOK(ot50Rate)}</div>
        </div>

        {/* 100% */}
        <div className="flex items-center justify-between">
          <div className="text-sm opacity-80">Timelønn ved 100% overtid</div>
          <div className="font-medium">kr {NOK(ot100Rate)}</div>
        </div>
      </div>
    </div>
  );
}
