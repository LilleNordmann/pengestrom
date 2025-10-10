// src/app/salary/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/salary/TopBar';
import ShiftConfig, { ShiftMode } from '@/components/salary/ShiftConfig';
import HoursInput from '@/components/salary/HoursInput';
import BruttoTable from '@/components/salary/BruttoTable';
import TabelltrekkPanel from '@/components/salary/TabelltrekkPanel';
import OvertidSkattPanel from '@/components/salary/OvertidSkattPanel';
import { BarRow, EditRow } from '@/components/salary/ui';

export default function SalaryPage() {
  // === Ny: velger for lønnstype ===
  const [salaryType, setSalaryType] = useState<'timelønn' | 'fastlønn'>('timelønn');

  // === Timelønn state ===
  const [hourly, setHourly] = useState<number>(250);
  const formatNOK = (n: number) =>
    n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [hourlyStr, setHourlyStr] = useState<string>(formatNOK(hourly));

  const [shiftYes, setShiftYes] = useState<boolean>(false);
  const [shiftMode, setShiftMode] = useState<ShiftMode>('kr');
  const [kveldTillegg, setKveldTillegg] = useState<number>(0);
  const [nattTillegg, setNattTillegg] = useState<number>(0);

  const [hVanlig, setHVanlig] = useState<number>(150);
  const [hHellig, setHHellig] = useState<number>(8);
  const [hKveld, setHKveld] = useState<number>(4);
  const [hNatt, setHNatt] = useState<number>(1);
  const [hOT50, setHOT50] = useState<number>(4);
  const [hOT100, setHOT100] = useState<number>(5);

  const [tabelltrekkKr, setTabelltrekkKr] = useState<number>(8060);
  const [overtidSkattProsent, setOvertidSkattProsent] = useState<number>(35);

  // Manuelle justeringer (timelønn)
  const [matTrekkKr, setMatTrekkKr] = useState<number>(0);
  const [utleggKr, setUtleggKr] = useState<number>(0);

  const ot50Rate = useMemo(() => hourly * 1.5, [hourly]);
  const ot100Rate = useMemo(() => hourly * 2, [hourly]);

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

  // Utbetalt (timelønn)
  const utbetalt = brutto - totalSkatt - matTrekkKr + utleggKr;

  const NOK = (n: number) => formatNOK(n);

  const parseNOK = (s: string): number | null => {
    const cleaned = s.replace(/\s/g, '').replace(',', '.');
    const val = parseFloat(cleaned);
    return Number.isFinite(val) ? val : null;
  };

  const commitHourly = () => {
    const parsed = parseNOK(hourlyStr);
    if (parsed === null) {
      setHourlyStr(formatNOK(hourly));
      return;
    }
    setHourly(parsed);
    setHourlyStr(formatNOK(parsed));
  };

  // Kr-preview for prosent-modus (per time)
  const kveldPreviewText = `kr ${NOK(hourly * (kveldTillegg / 100))}`;
  const nattPreviewText  = `kr ${NOK(hourly * (nattTillegg / 100))}`;

  // === Fastlønn: enkel førsteversjon ===
  const [monthlyGross, setMonthlyGross] = useState<number>(45000);
  const [fastTabelltrekk, setFastTabelltrekk] = useState<number>(12000);
  const [fastMatTrekk, setFastMatTrekk] = useState<number>(0);
  const [fastUtlegg, setFastUtlegg] = useState<number>(0);

  const fastUtbetalt = monthlyGross - fastTabelltrekk - fastMatTrekk + fastUtlegg;

  return (
    <main className="mx-auto max-w-[680px] p-4">
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h1 className="mb-4 text-center text-2xl font-extrabold">Lønnsutregning</h1>

        {/* === Velger: Timelønn / Fastlønn (side-om-side) === */}
        <div className="mb-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSalaryType('timelønn')}
            aria-pressed={salaryType === 'timelønn'}
            className={`px-4 py-2 rounded-xl border transition
              ${salaryType === 'timelønn'
                ? 'bg-[var(--accent-bg)] text-[var(--accent-fg)] border-[var(--accent-border)]'
                : 'bg-[var(--card)] text-[var(--fg)] border-[var(--border)] hover:opacity-90'}`}
          >
            Timelønn
          </button>
          <button
            type="button"
            onClick={() => setSalaryType('fastlønn')}
            aria-pressed={salaryType === 'fastlønn'}
            className={`px-4 py-2 rounded-xl border transition
              ${salaryType === 'fastlønn'
                ? 'bg-[var(--accent-bg)] text-[var(--accent-fg)] border-[var(--accent-border)]'
                : 'bg-[var(--card)] text-[var(--fg)] border-[var(--border)] hover:opacity-90'}`}
          >
            Fastlønn
          </button>
        </div>

        {/* === TIMELØNN-SEKSJON === */}
        {salaryType === 'timelønn' && (
          <div
            onBlur={(e) => {
              // Commit timelønn-input når fokus forlater timelønn-seksjonen
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              commitHourly();
            }}
          >
            {/* Topp: timelønn + 50/100% satser */}
            <TopBar
              hourlyStr={hourlyStr}
              setHourlyStr={setHourlyStr}
              onCommitHourly={commitHourly}
              ot50Text={NOK(ot50Rate)}
              ot100Text={NOK(ot100Rate)}
            />

            {/* Skift-konfig */}
            <ShiftConfig
              shiftYes={shiftYes}
              setShiftYes={setShiftYes}
              shiftMode={shiftMode}
              setShiftMode={setShiftMode}
              kveldTillegg={kveldTillegg}
              setKveldTillegg={setKveldTillegg}
              nattTillegg={nattTillegg}
              setNattTillegg={setNattTillegg}
              kveldPreviewText={kveldPreviewText}
              nattPreviewText={nattPreviewText}
            />

            {/* Timer */}
            <HoursInput
              shiftYes={shiftYes}
              hVanlig={hVanlig} setHVanlig={setHVanlig}
              hHellig={hHellig} setHHellig={setHHellig}
              hKveld={hKveld}   setHKveld={setHKveld}
              hNatt={hNatt}     setHNatt={setHNatt}
              hOT50={hOT50}     setHOT50={setHOT50}
              hOT100={hOT100}   setHOT100={setHOT100}
            />

            {/* Brutto-lønn + total bruttolønn */}
            <BruttoTable
              NOK={NOK}
              timelonn={timelonn}
              kveld={kveld}
              natt={natt}
              ot50={ot50}
              ot100={ot100}
              brutto={brutto}
              shiftYes={shiftYes}
            />

            {/* Skattepaneler */}
            <TabelltrekkPanel
              NOK={NOK}
              bruttoTilTabell={bruttoTilTabell}
              tabelltrekkKr={tabelltrekkKr}
              setTabelltrekkKr={setTabelltrekkKr}
              initialMode="percent"
              initialPercent={30}
            />

            <OvertidSkattPanel
              NOK={NOK}
              bruttoOvertid={bruttoOvertid}
              overtidSkattProsent={overtidSkattProsent}
              setOvertidSkattProsent={setOvertidSkattProsent}
              skattOvertid={skattOvertid}
            />

            {/* Totalt skattetrekk */}
            <BarRow
              label="Totalt Skattetrekk"
              value={`kr ${NOK(totalSkatt)}`}
              className="text-base"
            />

            {/* Mat trekk og Utlegg (timelønn) */}
            <div className="mt-2 space-y-2">
              <EditRow
                label="Mat trekk"
                unit="kr"
                value={matTrekkKr}
                onChange={setMatTrekkKr}
                step={50}
                w={100}
                decimals={2}
              />
              <EditRow
                label="Utlegg"
                unit="kr"
                value={utleggKr}
                onChange={setUtleggKr}
                step={50}
                w={100}
                decimals={2}
              />
            </div>

            {/* Utbetalt */}
            <BarRow
              label="Utbetalt"
              value={`kr ${NOK(utbetalt)}`}
              tone="neutral"
              className="text-lg"
              valueClassName="text-2xl font-extrabold"
            />
          </div>
        )}

        {/* === FASTLØNN-SEKSJON (enkel førsteversjon) === */}
        {salaryType === 'fastlønn' && (
          <div className="mt-2">
            <div className="rounded-xl border p-4"
                 style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h2 className="mb-3 text-lg font-semibold">Fastlønn</h2>

              <EditRow
                label="Månedslønn (brutto)"
                unit="kr"
                value={monthlyGross}
                onChange={setMonthlyGross}
                step={500}
                w={140}
                decimals={2}
              />

              <div className="mt-2">
                <EditRow
                  label="Tabelltrekk"
                  unit="kr"
                  value={fastTabelltrekk}
                  onChange={setFastTabelltrekk}
                  step={500}
                  w={140}
                  decimals={2}
                />
              </div>

              <div className="mt-2 space-y-2">
                <EditRow
                  label="Mat trekk"
                  unit="kr"
                  value={fastMatTrekk}
                  onChange={setFastMatTrekk}
                  step={50}
                  w={120}
                  decimals={2}
                />
                <EditRow
                  label="Utlegg"
                  unit="kr"
                  value={fastUtlegg}
                  onChange={setFastUtlegg}
                  step={50}
                  w={120}
                  decimals={2}
                />
              </div>

              <div className="mt-3">
                <BarRow
                  label="Utbetalt"
                  value={`kr ${formatNOK(fastUtbetalt)}`}
                  tone="neutral"
                  className="text-lg"
                  valueClassName="text-2xl font-extrabold"
                />
              </div>
            </div>
          </div>
        )}

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
