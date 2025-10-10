// src/app/salary/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type ShiftMode = 'kr' | '%';

export default function SalaryPage() {
  // --- Satser ---
  const [hourly, setHourly] = useState<number>(250);

  // Formatter/visningsstreng for timelønn med 2 desimaler
  const formatNOK = (n: number) =>
    n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [hourlyStr, setHourlyStr] = useState<string>(formatNOK(hourly));

  // Skift
  const [shiftYes, setShiftYes] = useState<boolean>(true);
  const [shiftMode, setShiftMode] = useState<ShiftMode>('kr');
  const [kveldTillegg, setKveldTillegg] = useState<number>(20);
  const [nattTillegg, setNattTillegg] = useState<number>(50);

  // Timer
  const [hVanlig, setHVanlig] = useState<number>(150);
  const [hHellig, setHHellig] = useState<number>(16);
  const [hKveld, setHKveld] = useState<number>(40);
  const [hNatt, setHNatt] = useState<number>(10);
  const [hOT50, setHOT50] = useState<number>(4);
  const [hOT100, setHOT100] = useState<number>(5);

  // Skatt
  const [tabelltrekkKr, setTabelltrekkKr] = useState<number>(8060);
  const [overtidSkattProsent, setOvertidSkattProsent] = useState<number>(35);

  // Avledede satser
  const ot50Rate = useMemo(() => hourly * 1.5, [hourly]);
  const ot100Rate = useMemo(() => hourly * 2, [hourly]);

  // Beregninger
  const baseHours = hVanlig + hHellig;
  const timelonn = baseHours * hourly;

  const kveld = shiftYes
    ? (shiftMode === 'kr' ? hKveld * kveldTillegg : hKveld * hourly * (kveldTillegg / 100))
    : 0;

  const natt = shiftYes
    ? (shiftMode === 'kr' ? hNatt * nattTillegg : hNatt * hourly * (nattTillegg / 100))
    : 0;

  const ot50 = hOT50 * ot50Rate;
  const ot100 = hOT100 * ot100Rate;

  const brutto = timelonn + kveld + natt + ot50 + ot100;

  const bruttoTilTabell = timelonn + kveld + natt;
  const bruttoOvertid = ot50 + ot100;

  const skattOvertid = bruttoOvertid * (overtidSkattProsent / 100);
  const totalSkatt = tabelltrekkKr + skattOvertid;

  const utbetalt = brutto - totalSkatt;

  // helpers
  const NOK = (n: number) => formatNOK(n);

  const parseNOK = (s: string): number | null => {
    const cleaned = s.replace(/\s/g, '').replace(',', '.');
    const val = parseFloat(cleaned);
    return Number.isFinite(val) ? val : null;
  };

  const commitHourly = () => {
    const parsed = parseNOK(hourlyStr);
    if (parsed == null) {
      setHourlyStr(formatNOK(hourly));
      return;
    }
    setHourly(parsed);
    setHourlyStr(formatNOK(parsed));
  };

  // Små input
  const SmallNum = ({
    value,
    onChange,
    step = 1,
    min = 0,
    w = 80,
  }: {
    value: number;
    onChange: (v: number) => void;
    step?: number;
    min?: number;
    w?: number;
  }) => (
    <input
      type="number"
      className="rounded-md px-2 py-1 text-right font-semibold outline-none ring-1 focus:ring-2"
      style={{
        width: w,
        background: 'var(--input-soft)',
        borderColor: 'var(--input-ring)',
        color: 'var(--input-fg)',
      }}
      value={Number.isFinite(value) ? value : 0}
      step={step}
      min={min}
      onChange={(e) => onChange(parseFloat(e.target.value || '0'))}
    />
  );

  return (
    <main className="mx-auto max-w-[680px] p-4">
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h1 className="mb-4 text-center text-2xl font-extrabold">Lønnsutregning</h1>

        {/* TOPP – bare første er redigerbar, alle viser 2 desimaler */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <TopLineEditable
            label="Du har"
            valueStr={hourlyStr}
            setValueStr={setHourlyStr}
            onBlur={commitHourly}
            tail="i timelønn"
          />
          <TopLineDisplay
            label="Ved 50% overtid har du"
            value={NOK(ot50Rate)}
            tail="i timelønn"
          />
          <TopLineDisplay
            label="Ved 100% overtid har du"
            value={NOK(ot100Rate)}
            tail="i timelønn"
          />
        </div>

        {/* Resten av siden er uendret fra forrige versjon din */}
        {/* ... (skiftvalg, timer, brutto, skatt osv.) ... */}
        {/* For korthet: behold kodeblokkene dine for skift, timer, paneler og BarRow her */}
      </div>
    </main>
  );
}

/* ======== Topp-komponenter (bytter ut gamle TopCard/TopLine-varianter) ======== */

// Redigerbar timelønn – viser alltid 2 desimaler (via valueStr + onBlur)
function TopLineEditable({
  label,
  valueStr,
  setValueStr,
  onBlur,
  tail,
}: {
  label: string;
  valueStr: string;
  setValueStr: (s: string) => void;
  onBlur: () => void;
  tail?: string;
}) {
  return (
    <div
      className="rounded-lg px-3 py-2"
      style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
    >
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-bold">kr</span>
        <input
          inputMode="decimal"
          className="w-[90px] rounded-md px-2 py-1 text-right font-semibold outline-none ring-1 focus:ring-2"
          style={{
            background: 'var(--input-soft)',
            borderColor: 'var(--input-ring)',
            color: 'var(--input-fg)',
          }}
          value={valueStr}
          onChange={(e) => setValueStr(e.target.value)}
          onBlur={onBlur}
        />
        {tail ? <span className="text-xs" style={{ color: 'var(--muted)' }}>{tail}</span> : null}
      </div>
    </div>
  );
}

// Visningsfelt – ser IKKE redigerbart ut (span, cursor-default, ingen focus-ring)
function TopLineDisplay({
  label,
  value,
  tail,
}: {
  label: string;
  value: string; // ferdig formatert med 2 desimaler
  tail?: string;
}) {
  return (
    <div
      className="rounded-lg px-3 py-2"
      style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
    >
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-bold">kr</span>
        <span
          className="inline-block w-[90px] rounded-md px-2 py-1 text-right font-semibold select-none cursor-default"
          style={{ background: 'var(--input-soft)', border: '1px solid var(--input-ring)', color: 'var(--input-fg)' }}
          aria-hidden="true"
        >
          {value}
        </span>
        {tail ? <span className="text-xs" style={{ color: 'var(--muted)' }}>{tail}</span> : null}
      </div>
    </div>
  );
}
