// src/app/salary/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Gate = 'ok';

export default function SalaryPage() {
  const gate: Gate = 'ok';

  // --- Inndata: satser ---
  const [hourly, setHourly] = useState<number>(250);
  const [kveldTillegg, setKveldTillegg] = useState<number>(20);
  const [nattTillegg, setNattTillegg] = useState<number>(50);

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

  const kveld = hKveld * kveldTillegg;
  const natt = hNatt * nattTillegg;

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
  }: {
    value: number;
    onChange: (v: number) => void;
    step?: number;
    min?: number;
    suffix?: string;
  }) => (
    <div className="flex items-center gap-2">
      <input
        type="number"
        className="w-28 rounded-lg px-2 py-1 text-right font-medium outline-none ring-1 focus:ring-2"
        style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        onChange={(e) => onChange(parseFloat(e.target.value || '0'))}
      />
      {suffix ? <span className="text-sm text-muted-foreground">{suffix}</span> : null}
    </div>
  );

  if (gate !== 'ok') return null;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="mb-6 text-center text-3xl font-bold">Lønnsutregning</h1>

        {/* Øvre satser-panel */}
        <section
          className="mb-6 rounded-xl p-4"
          style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Row
              label="Du har"
              valueRight={<ValueRow left="kr" right={NOK(hourly)} trailing="i timelønn" />}
            />
            <Row
              label="Ved 50% overtid har du"
              valueRight={<ValueRow left="kr" right={NOK(ot50Rate)} trailing="i timelønn" />}
            />
            <Row
              label="Ved 100% overtid har du"
              valueRight={<ValueRow left="kr" right={NOK(ot100Rate)} trailing="i timelønn" />}
            />
          </div>
        </section>

        {/* Skifttillegg / kvelds- og natt-tillegg */}
        <section className="mb-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-neutral-500">Jobber du skift</div>
              <div className="text-sm text-neutral-800 dark:text-neutral-200">JA/NEI</div>
              <div className="mt-2 text-sm font-semibold text-neutral-500">Skifttillegg i</div>
              <div className="text-sm text-neutral-800 dark:text-neutral-200">Prosent/kroner</div>
            </div>

            <div className="grid max-w-sm grid-cols-2 gap-4">
              <div
                className="flex items-center justify-between rounded-lg px-3 py-2 ring-1"
                style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
              >
                <span
                  className="shrink-0 w-6 rounded-md px-2 py-1 text-center text-sm font-semibold ring-1"
                  style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
                >
                  kr
                </span>
                <Num value={kveldTillegg} onChange={setKveldTillegg} step={1} min={0} />
                <span className="ml-2 text-sm">i tillegg</span>
              </div>
              <div
                className="flex items-center justify-between rounded-lg px-3 py-2 ring-1"
                style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
              >
                <span
                  className="shrink-0 w-6 rounded-md px-2 py-1 text-center text-sm font-semibold ring-1"
                  style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
                >
                  kr
                </span>
                <Num value={nattTillegg} onChange={setNattTillegg} step={1} min={0} />
                <span className="ml-2 text-sm">i tillegg</span>
              </div>
            </div>
          </div>
        </section>

        {/* Skriv inn timene */}
        <section className="mb-6 rounded-xl border border-neutral-300 p-4 text-center dark:border-neutral-700">
          <h2 className="text-xl font-semibold">Skriv inn timene du har jobbet</h2>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="grid gap-3">
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
          </div>

          {/* Redigerbar timelønn + visning av 50%/100% */}
          <div className="grid gap-3">
            <InputRow label="Timelønn">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-md px-2 py-1 text-sm font-semibold ring-1"
                  style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
                >
                  kr
                </span>
                <Num value={hourly} onChange={setHourly} step={1} min={0} />
              </div>
            </InputRow>
            <InputRow label="50% overtidssats">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-md px-2 py-1 text-sm font-semibold ring-1"
                  style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
                >
                  kr
                </span>
                <input
                  disabled
                  className="w-28 rounded-lg px-2 py-1 text-right"
                  style={{ background: 'var(--input-soft)', border: '1px solid var(--input-ring)' }}
                  value={NOK(ot50Rate)}
                />
              </div>
            </InputRow>
            <InputRow label="100% overtidssats">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-md px-2 py-1 text-sm font-semibold ring-1"
                  style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
                >
                  kr
                </span>
                <input
                  disabled
                  className="w-28 rounded-lg px-2 py-1 text-right"
                  style={{ background: 'var(--input-soft)', border: '1px solid var(--input-ring)' }}
                  value={NOK(ot100Rate)}
                />
              </div>
            </InputRow>
          </div>
        </section>

        {/* Brutto lønn tabell */}
        <section className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">Brutto Lønn</h3>
          <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
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
            <div className="mt-2 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-300">Skatt Tabelltrekk</span>
                <Num value={tabelltrekkKr} onChange={setTabelltrekkKr} step={100} min={0} />
              </label>
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
            <div className="mt-2 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-300">Skatt prosenttrekk</span>
                <div className="flex items-center gap-2">
                  <Num value={overtidSkattProsent} onChange={setOvertidSkattProsent} step={1} min={0} />
                  <span className="text-sm">%</span>
                </div>
              </label>
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
        <section className="mb-8 rounded-xl p-4 text-xl font-semibold" style={{ background: 'var(--card)' }}>
          <div className="flex items-center justify-between">
            <span className="tracking-wide">Utbetalt</span>
            <span className="tabular-nums">kr {NOK(utbetalt)}</span>
          </div>
        </section>

        <div className="flex justify-center">
          <Link
            href="/"
            className="w-full rounded-2xl bg-black py-4 text-center text-white transition hover:opacity-90 dark:bg-white dark:text-black md:w-72"
          >
            Neste
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ---- Små hjelpekomponenter ---- */

function Row({
  label,
  valueRight,
}: {
  label: string;
  valueRight: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
      style={{ background: 'var(--panel-accent)', border: '1px solid var(--accent-border)' }}
    >
      <span className="text-sm">{label}</span>
      <div className="min-w-[230px]">{valueRight}</div>
    </div>
  );
}

function ValueRow({
  left,
  right,
  trailing,
}: {
  left: string;
  right: string;
  trailing?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span
        className="w-6 rounded-md px-2 py-1 text-center text-sm font-semibold ring-1"
        style={{ background: 'var(--input-soft)', borderColor: 'var(--input-ring)' }}
      >
        {left}
      </span>
      <input
        disabled
        className="w-28 rounded-lg px-2 py-1 text-right font-medium"
        style={{ background: 'var(--input-soft)', border: '1px solid var(--input-ring)' }}
        value={right}
      />
      {trailing ? <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-300">{trailing}</span> : null}
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
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-800">
      <div className="text-sm">{label}</div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

function TableRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center border-b border-neutral-200 px-3 py-2 last:border-0 dark:border-neutral-800">
      <div className="text-sm">{title}</div>
      <div className="mx-3 w-6 text-right text-sm font-semibold">kr</div>
      <div className="tabular-nums">{value}</div>
    </div>
  );
}
