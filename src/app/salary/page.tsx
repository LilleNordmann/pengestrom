// src/app/salary/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type ShiftMode = 'kr' | '%';

export default function SalaryPage() {
  // --- Satser ---
  const [hourly, setHourly] = useState<number>(250);

  // Skift
  const [shiftYes, setShiftYes] = useState<boolean>(true);
  const [shiftMode, setShiftMode] = useState<ShiftMode>('kr');
  const [kveldTillegg, setKveldTillegg] = useState<number>(20); // kr eller %
  const [nattTillegg, setNattTillegg] = useState<number>(50);   // kr eller %

  // --- Timer ---
  const [hVanlig, setHVanlig] = useState<number>(150);
  const [hHellig, setHHellig] = useState<number>(16);
  const [hKveld, setHKveld] = useState<number>(40);
  const [hNatt, setHNatt] = useState<number>(10);
  const [hOT50, setHOT50] = useState<number>(4);
  const [hOT100, setHOT100] = useState<number>(5);

  // --- Skatt ---
  const [tabelltrekkKr, setTabelltrekkKr] = useState<number>(8060);
  const [overtidSkattProsent, setOvertidSkattProsent] = useState<number>(35);

  // --- Avledede satser ---
  const ot50Rate = useMemo(() => hourly * 1.5, [hourly]);
  const ot100Rate = useMemo(() => hourly * 2, [hourly]);

  // --- Beregninger ---
  const baseHours = hVanlig + hHellig;
  const timelonn = baseHours * hourly;

  const kveld =
    shiftYes
      ? (shiftMode === 'kr'
          ? hKveld * kveldTillegg
          : hKveld * hourly * (kveldTillegg / 100))
      : 0;

  const natt =
    shiftYes
      ? (shiftMode === 'kr'
          ? hNatt * nattTillegg
          : hNatt * hourly * (nattTillegg / 100))
      : 0;

  const ot50 = hOT50 * ot50Rate;
  const ot100 = hOT100 * ot100Rate;

  const brutto = timelonn + kveld + natt + ot50 + ot100;

  const bruttoTilTabell = timelonn + kveld + natt; // overtid holdes utenfor tabelltrekk
  const bruttoOvertid = ot50 + ot100;

  const skattOvertid = bruttoOvertid * (overtidSkattProsent / 100);
  const totalSkatt = tabelltrekkKr + skattOvertid;

  const utbetalt = brutto - totalSkatt;

  // --- utils ---
  const NOK = (n: number) =>
    n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
      style={{
        width: w,
        background: 'var(--input-soft)',
        borderColor: 'var(--input-ring)',
        color: 'var(--input-fg)',
      }}
      className="rounded-md px-2 py-1 text-right font-semibold outline-none ring-1 focus:ring-2"
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

        {/* Toppsatser */}
        <div
          className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          <TopLine
            label="Du har"
            editable
            value={hourly}
            onChange={setHourly}
            tail="i timelønn"
          />
          <TopLine label="Ved 50% overtid har du" value={ot50Rate} tail="i timelønn" />
          <TopLine label="Ved 100% overtid har du" value={ot100Rate} tail="i timelønn" />
        </div>

        {/* Skift */}
        <div className="mb-2">
          <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Jobber du skift</div>
          <div className="mt-1 flex gap-2">
            <Chip label="JA" active={shiftYes} onClick={() => setShiftYes(true)} />
            <Chip label="NEI" active={!shiftYes} onClick={() => setShiftYes(false)} />
          </div>

          <div className="mt-2 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Skifttillegg i</div>
          <div className="mt-1 flex gap-2">
            <Chip label="Prosent" active={shiftMode === '%'} onClick={() => setShiftMode('%')} />
            <Chip label="Kroner" active={shiftMode === 'kr'} onClick={() => setShiftMode('kr')} />
          </div>

          {shiftYes && (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <MiniLine
                label="Kveldstillegg"
                left="kr"
                input={
                  <SmallNum
                    value={kveldTillegg}
                    onChange={setKveldTillegg}
                    step={shiftMode === 'kr' ? 1 : 0.5}
                  />
                }
                right="i tillegg"
                mode={shiftMode}
              />
              <MiniLine
                label="Natttillegg"
                left="kr"
                input={
                  <SmallNum
                    value={nattTillegg}
                    onChange={setNattTillegg}
                    step={shiftMode === 'kr' ? 1 : 0.5}
                  />
                }
                right="i tillegg"
                mode={shiftMode}
              />
            </div>
          )}
        </div>

        {/* Separator: Skriv inn timene */}
        <div
          className="my-4 rounded-lg px-3 py-2 text-center text-sm font-semibold"
          style={{ border: '1px solid var(--border)' }}
        >
          Skriv inn timene du har jobbet
        </div>

        {/* Timer-tabell venstre + Timer-tekst høyre */}
        <div className="mb-4 grid gap-2">
          <TimeRow label="Vanlige timer jobbet">
            <SmallNum value={hVanlig} onChange={setHVanlig} step={0.25} />
          </TimeRow>
          <TimeRow label="Helligdag">
            <SmallNum value={hHellig} onChange={setHHellig} step={0.25} />
          </TimeRow>
          <TimeRow label="Kveld">
            <SmallNum value={hKveld} onChange={setHKveld} step={0.25} />
          </TimeRow>
          <TimeRow label="Natt">
            <SmallNum value={hNatt} onChange={setHNatt} step={0.25} />
          </TimeRow>
          <TimeRow label="50% overtid">
            <SmallNum value={hOT50} onChange={setHOT50} step={0.25} />
          </TimeRow>
          <TimeRow label="100% overtid">
            <SmallNum value={hOT100} onChange={setHOT100} step={0.25} />
          </TimeRow>
        </div>

        {/* Brutto Lønn */}
        <div className="mt-4">
          <div className="mb-2 text-center text-sm font-semibold">Brutto Lønn</div>
          <KVRow k="Timelønn" v={NOK(timelonn)} />
          <KVRow k="Kveld" v={NOK(kveld)} />
          <KVRow k="Natt" v={NOK(natt)} />
          <KVRow k="50% overtid" v={NOK(ot50)} />
          <KVRow k="100% overtid" v={NOK(ot100)} />
        </div>

        {/* Total Brutto */}
        <BarRow label="Total Bruttolønn" value={`kr ${NOK(brutto)}`} />

        {/* Skatt – Tabelltrekk */}
        <PanelWarn>
          <KVHeader k="Brutto til tabelltrekk" v={`kr ${NOK(bruttoTilTabell)}`} />
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Skatt Tabelltrekk</span>
            <SmallNum value={tabelltrekkKr} onChange={setTabelltrekkKr} step={100} w={90} />
          </div>
          <KVFoot label="Sum tabelltrekk" value={`kr ${NOK(tabelltrekkKr)}`} />
        </PanelWarn>

        {/* Skatt – Overtid prosenttrekk */}
        <PanelWarn>
          <KVHeader k="Brutto Overtid" v={`kr ${NOK(bruttoOvertid)}`} />
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Skatt prosenttrekk</span>
            <SmallNum value={overtidSkattProsent} onChange={setOvertidSkattProsent} step={1} w={70} />
            <span className="text-sm" style={{ color: 'var(--muted)' }}>%</span>
          </div>
          <KVFoot label="Sum prosenttrekk" value={`kr ${NOK(skattOvertid)}`} />
        </PanelWarn>

        {/* Totalt skattetrekk */}
        <BarRow label="Totalt Skattetrekk" value={`kr ${NOK(totalSkatt)}`} />

        {/* Utbetalt */}
        <BarRow label="Utbetalt" value={`kr ${NOK(utbetalt)}`} tone="neutral" />

        {/* Neste */}
        <div className="mt-5 flex justify-center">
          <Link
            href="/"
            className="w-full max-w-[260px] rounded-2xl bg-white py-3 text-center font-semibold text-black transition hover:opacity-90"
          >
            Neste
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ========== Små komponenter som matcher excel-look ========== */

function TopLine({
  label,
  value,
  onChange,
  editable = false,
  tail,
}: {
  label: string;
  value: number;
  onChange?: (v: number) => void;
  editable?: boolean;
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
        {editable ? (
          <input
            type="number"
            className="w-[90px] rounded-md px-2 py-1 text-right font-semibold outline-none ring-1 focus:ring-2"
            style={{
              background: 'var(--input-soft)',
              borderColor: 'var(--input-ring)',
              color: 'var(--input-fg)',
            }}
            value={value}
            step={1}
            min={0}
            onChange={(e) => onChange?.(parseFloat(e.target.value || '0'))}
          />
        ) : (
          <input
            disabled
            className="w-[90px] rounded-md px-2 py-1 text-right font-semibold"
            style={{ background: 'var(--input-soft)', border: '1px solid var(--input-ring)', color: 'var(--input-fg)' }}
            value={value.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />
        )}
        {tail ? <span className="text-xs" style={{ color: 'var(--muted)' }}>{tail}</span> : null}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${active ? 'opacity-100' : 'opacity-60'}`}
      style={{ background: 'var(--input-soft)', border: '1px solid var(--input-ring)', color: 'var(--input-fg)' }}
    >
      {label}
    </button>
  );
}

function MiniLine({
  label,
  left,
  input,
  right,
  mode,
}: {
  label: string;
  left?: string;
  input: React.ReactNode;
  right?: string;
  mode: ShiftMode;
}) {
  return (
    <div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
      <div
        className="mt-1 flex items-center justify-between gap-2 rounded-lg px-3 py-2"
        style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{mode === 'kr' ? left : '%'}</span>
          {input}
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {mode === 'kr' ? right : 'av timelønn'}
        </span>
      </div>
    </div>
  );
}

function TimeRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="grid grid-cols-[1fr_auto_auto] items-center rounded-lg px-3 py-2"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="text-xs">{label}</div>
      <div className="flex items-center">{children}</div>
      <div className="pl-3 text-xs" style={{ color: 'var(--muted)' }}>Timer</div>
    </div>
  );
}

function KVRow({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="grid grid-cols-[1fr_auto_auto] items-center px-3 py-1"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{k}</div>
      <div className="mx-3 w-6 text-right text-xs font-semibold">kr</div>
      <div className="tabular-nums text-sm">{v}</div>
    </div>
  );
}

function BarRow({ label, value, tone = 'accent' }: { label: string; value: string; tone?: 'accent' | 'neutral' }) {
  const bg = tone === 'accent' ? 'var(--panel-accent)' : 'var(--card)';
  const bd = tone === 'accent' ? 'var(--accent-border)' : 'var(--border)';
  return (
    <div className="my-3 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: bg, border: `1px solid ${bd}` }}>
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
    </div>
  );
}

function PanelWarn({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 rounded-lg p-3" style={{ background: 'var(--panel-warn)', border: '1px solid var(--warn-border)' }}>
      {children}
    </div>
  );
}

function KVHeader({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{k}</span>
      <span className="tabular-nums">{v}</span>
    </div>
  );
}

function KVFoot({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
