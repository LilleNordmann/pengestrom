// src/app/salary/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Gate = 'ok';
type ShiftMode = 'kr' | '%';

export default function SalaryPage() {
  const gate: Gate = 'ok';

  // --- Inndata: satser ---
  const [hourly, setHourly] = useState<number>(250);

  // Skift
  const [shiftYes, setShiftYes] = useState<boolean>(true);
  const [shiftMode, setShiftMode] = useState<ShiftMode>('kr');
  const [kveldTillegg, setKveldTillegg] = useState<number>(20); // kr eller %
  const [nattTillegg, setNattTillegg] = useState<number>(50);   // kr eller %

  // --- Inndata: timer ---
  const [hVanlig, setHVanlig] = useState<number>(150);
  const [hHellig, setHHellig] = useState<number>(16);
  const [hKveld, setHKveld] = useState<number>(40);
  const [hNatt, setHNatt] = useState<number>(10);
  const [hOT50, setHOT50] = useState<number>(4);
  const [hOT100, setHOT100] = useState<number>(5);

  // --- Skatt-input ---
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

  const Num = ({
    value,
    onChange,
    step = 1,
    min = 0,
    suffix,
    w = 'w-28',
    centered = false,
  }: {
    value: number;
    onChange: (v: number) => void;
    step?: number;
    min?: number;
    suffix?: string;
    w?: string;
    centered?: boolean;
  }) => (
    <div className={`flex items-center gap-2 ${centered ? 'justify-center' : ''}`}>
      {/* ren "kr"/"%" håndteres uten bakgrunn i kallet */}
      <input
        type="number"
        className={`${w} rounded-lg px-3 py-2 text-right font-semibold outline-none ring-1 focus:ring-2`}
        style={{
          background: 'var(--input-soft)',
          borderColor: 'var(--input-ring)',
          color: 'var(--input-fg)',
        }}
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        onChange={(e) => onChange(parseFloat(e.target.value || '0'))}
      />
      {suffix ? <span className="text-sm" style={{ color: 'var(--muted)' }}>{suffix}</span> : null}
    </div>
  );

  if (gate !== 'ok') return null;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div
        className="rounded-2xl border p-6 shadow-sm"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h1 className="mb-6 text-center text-3xl font-extrabold">Lønnsutregning</h1>

        {/* Øvre satser-panel: timelønn + autoutregnet 50/100% */}
        <section
          className="mb-6 rounded-xl p-4"
          style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <TopCard
              label="Du har"
              editable
              value={hourly}
              onChange={setHourly}
              trailing="i timelønn"
              prefix="kr"
            />
            <TopCard
              label="Ved 50% overtid har du"
              value={ot50Rate}
              trailing="i timelønn"
              prefix="kr"
            />
            <TopCard
              label="Ved 100% overtid har du"
              value={ot100Rate}
              trailing="i timelønn"
              prefix="kr"
            />
          </div>
        </section>

        {/* Skift-tillegg: JA/NEI + kr/% + felt for kveld/natt */}
        <section className="mb-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                Jobber du skift
              </div>
              <div className="flex gap-2">
                <Toggle
                  label="JA"
                  active={shiftYes}
                  onClick={() => setShiftYes(true)}
                />
                <Toggle
                  label="NEI"
                  active={!shiftYes}
                  onClick={() => setShiftYes(false)}
                />
              </div>

              {shiftYes && (
                <>
                  <div className="mt-3 text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                    Skifttillegg i
                  </div>
                  <div className="flex gap-2">
                    <Toggle
                      label="Prosent"
                      active={shiftMode === '%'}
                      onClick={() => setShiftMode('%')}
                    />
                    <Toggle
                      label="Kroner"
                      active={shiftMode === 'kr'}
                      onClick={() => setShiftMode('kr')}
                    />
                  </div>
                </>
              )}
            </div>

            {shiftYes && (
              <div className="grid max-w-md grid-cols-2 gap-4">
                <LabeledInput
                  label="Kveldstillegg"
                  prefix={shiftMode === 'kr' ? 'kr' : '%'}
                  input={
                    <Num
                      value={kveldTillegg}
                      onChange={setKveldTillegg}
                      step={shiftMode === 'kr' ? 1 : 0.5}
                      min={0}
                    />
                  }
                  suffix={shiftMode === 'kr' ? 'i tillegg' : 'av timelønn'}
                />
                <LabeledInput
                  label="Nattstillegg"
                  prefix={shiftMode === 'kr' ? 'kr' : '%'}
                  input={
                    <Num
                      value={nattTillegg}
                      onChange={setNattTillegg}
                      step={shiftMode === 'kr' ? 1 : 0.5}
                      min={0}
                    />
                  }
                  suffix={shiftMode === 'kr' ? 'i tillegg' : 'av timelønn'}
                />
              </div>
            )}
          </div>
        </section>

        {/* Skriv inn timene */}
        <section
          className="mb-6 rounded-xl p-4 text-center"
          style={{ border: '1px solid var(--border)' }}
        >
          <h2 className="text-xl font-semibold">Skriv inn timene du har jobbet</h2>
        </section>

        {/* Kun venstre kolonne med timer (høyre kolonne fjernet) */}
        <section className="mb-8 grid grid-cols-1 gap-3">
          <InputRow label="Vanlige timer jobbet">
            <Num value={hVanlig} onChange={setHVanlig} step={0.25} min={0} suffix="Timer" />
          </InputRow>
          <InputRow label="Helligdag">
            <Num value={hHellig} onChange={setHHellig} step={0.25} min={0} suffix="Timer" />
          </InputRow>
          <InputRow label="Kveld">
            <Num value={hKveld} onChange={setHKveld} step={0.25} min={0} suffix="Timer" />
          </InputRow>
          <InputRow label="Natt">
            <Num value={hNatt} onChange={setHNatt} step={0.25} min={0} suffix="Timer" />
          </InputRow>
          <InputRow label="50% overtid">
            <Num value={hOT50} onChange={setHOT50} step={0.25} min={0} suffix="Timer" />
          </InputRow>
          <InputRow label="100% overtid">
            <Num value={hOT100} onChange={setHOT100} step={0.25} min={0} suffix="Timer" />
          </InputRow>
        </section>

        {/* Brutto lønn tabell */}
        <section className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">Brutto Lønn</h3>
          <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)' }}>
            <TableRow title="Timelønn" value={NOK(timelonn)} />
            <TableRow title="Kveld" value={NOK(kveld)} />
            <TableRow title="Natt" value={NOK(natt)} />
            <TableRow title="50% overtid" value={NOK(ot50)} />
            <TableRow title="100% overtid" value={NOK(ot100)} />
          </div>
        </section>

        <section
          className="mb-6 rounded-xl p-4 text-xl font-semibold"
          style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
        >
          <div className="flex items-center justify-between">
            <span className="tracking-wide">Total Bruttolønn</span>
            <span className="tabular-nums">kr {NOK(brutto)}</span>
          </div>
        </section>

        {/* Skattetrekk */}
        <section className="mb-6 grid grid-cols-1 gap-4">
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--panel-warn)', border: '1px solid var(--warn-border)' }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">Brutto til tabelltrekk</span>
              <span className="tabular-nums">kr {NOK(bruttoTilTabell)}</span>
            </div>
            {/* Sentrert input */}
            <div className="mt-2 flex w-full items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>Skatt Tabelltrekk</span>
                <Num value={tabelltrekkKr} onChange={setTabelltrekkKr} step={100} min={0} centered w="w-32" />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Sum tabelltrekk</span>
              <div className="tabular-nums">kr {NOK(tabelltrekkKr)}</div>
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--panel-warn)', border: '1px solid var(--warn-border)' }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">Brutto Overtid</span>
              <span className="tabular-nums">kr {NOK(bruttoOvertid)}</span>
            </div>
            {/* Sentrert input */}
            <div className="mt-2 flex w-full items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>Skatt prosenttrekk</span>
                <Num value={overtidSkattProsent} onChange={setOvertidSkattProsent} step={1} min={0} centered w="w-20" />
                <span className="text-sm" style={{ color: 'var(--muted)' }}>%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Sum prosenttrekk</span>
              <div className="tabular-nums">kr {NOK(skattOvertid)}</div>
            </div>
          </div>
        </section>

        <section
          className="mb-6 rounded-xl p-4 text-xl font-semibold"
          style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
        >
          <div className="flex items-center justify-between">
            <span className="tracking-wide">Totalt Skattetrekk</span>
            <span className="tabular-nums">kr {NOK(totalSkatt)}</span>
          </div>
        </section>

        {/* Utbetalt */}
        <section
          className="mb-8 rounded-xl p-4 text-xl font-semibold"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <span className="tracking-wide">Utbetalt</span>
            <span className="tabular-nums">kr {NOK(utbetalt)}</span>
          </div>
        </section>

        <div className="flex justify-center">
          <Link
            href="/"
            className="w-full rounded-2xl bg-white py-4 text-center font-semibold text-black transition hover:opacity-90 md:w-72"
          >
            Neste
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ---- Hjelpekomponenter ---- */

function TopCard({
  label,
  value,
  onChange,
  editable = false,
  trailing,
  prefix = 'kr',
}: {
  label: string;
  value: number;
  onChange?: (v: number) => void;
  editable?: boolean;
  trailing?: string;
  prefix?: 'kr' | '%';
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
      style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
    >
      <span className="text-sm">{label}</span>
      <div className="flex min-w-[240px] items-center justify-between gap-2">
        <span className="text-sm font-extrabold">{prefix}</span>
        {editable ? (
          <input
            type="number"
            className="w-28 rounded-lg px-3 py-2 text-right font-semibold outline-none ring-1 focus:ring-2"
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
            className="w-28 rounded-lg px-3 py-2 text-right font-semibold"
            style={{ background: 'var(--input-soft)', border: '1px solid var(--input-ring)', color: 'var(--input-fg)' }}
            value={value.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />
        )}
        {trailing ? <span className="ml-2 text-sm" style={{ color: 'var(--muted)' }}>{trailing}</span> : null}
      </div>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
        active ? 'opacity-100' : 'opacity-60'
      }`}
      style={{
        background: 'var(--input-soft)',
        border: `1px solid var(--input-ring)`,
        color: 'var(--input-fg)',
      }}
    >
      {label}
    </button>
  );
}

function LabeledInput({
  label,
  prefix,
  input,
  suffix,
}: {
  label: string;
  prefix?: string;
  input: React.ReactNode;
  suffix?: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 ring-1"
      style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
    >
      <div className="flex items-center gap-2">
        {prefix ? <span className="text-sm font-extrabold">{prefix}</span> : null}
        {input}
      </div>
      {suffix ? <span className="text-sm" style={{ color: 'var(--muted)' }}>{suffix}</span> : null}
    </div>
  );
}

function InputRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-2"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="text-sm">{label}</div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

function TableRow({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="grid grid-cols-[1fr_auto_auto] items-center px-3 py-2 last:border-0"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="text-sm" style={{ color: 'var(--muted)' }}>{title}</div>
      <div className="mx-3 w-6 text-right text-sm font-semibold">kr</div>
      <div className="tabular-nums">{value}</div>
    </div>
  );
}
