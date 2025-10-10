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

// NYE komponenter
import FastRatesPanel from '@/components/salary/FastRatesPanel';
import FastOvertimeHours from '@/components/salary/FastOvertimeHours';

export default function SalaryPage() {
  // === Velger for lønnstype ===
  const [salaryType, setSalaryType] = useState<'timelønn' | 'fastlønn'>('timelønn');

  // === Felles formatering ===
  const formatNOK = (n: number) =>
    n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const NOK = (n: number) => formatNOK(n);

  // === TIMELØNN STATE ===
  const [hourly, setHourly] = useState<number>(250);
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

  const utbetalt = brutto - totalSkatt - matTrekkKr + utleggKr;

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

  const kveldPreviewText = `kr ${NOK(hourly * (kveldTillegg / 100))}`;
  const nattPreviewText  = `kr ${NOK(hourly * (nattTillegg / 100))}`;

  // === FASTLØNN STATE ===
  const [monthlyGross, setMonthlyGross] = useState<number>(45000);
  const [annualHours, setAnnualHours]   = useState<number>(1950); // redigerbar i panelet

  // Overtidstimer (fastlønn)
  const [fastHOT50, setFastHOT50] = useState<number>(4);
  const [fastHOT100, setFastHOT100] = useState<number>(5);

  // Trekk/skatt (fastlønn)
  const [fastTabelltrekk, setFastTabelltrekk] = useState<number>(12000);
  const [fastMatTrekk, setFastMatTrekk] = useState<number>(0);
  const [fastUtlegg, setFastUtlegg] = useState<number>(0);

  // Avledede satser for fastlønn
  const fastBaseHourly = useMemo(
    () => (annualHours > 0 ? (monthlyGross * 12) / annualHours : 0),
    [monthlyGross, annualHours]
  );
  const fastOT50Rate = useMemo(() => fastBaseHourly * 1.5, [fastBaseHourly]);
  const fastOT100Rate = useMemo(() => fastBaseHourly * 2, [fastBaseHourly]);

  // Overtid (fastlønn)
  const fastOT50 = fastHOT50 * fastOT50Rate;
  const fastOT100 = fastHOT100 * fastOT100Rate;

  // Brutto / skattegrunnlag (fastlønn)
  const fastBrutto = monthlyGross + fastOT50 + fastOT100;
  const fastBruttoTilTabell = monthlyGross; // fastlønn til tabell
  const fastBruttoOvertid = fastOT50 + fastOT100;

  const fastSkattOvertid = fastBruttoOvertid * (overtidSkattProsent / 100); // gjenbruk sats
  const fastTotalSkatt = fastTabelltrekk + fastSkattOvertid;

  const fastUtbetalt = fastBrutto - fastTotalSkatt - fastMatTrekk + fastUtlegg;

  return (
    <main className="mx-auto max-w-[680px] p-4">
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h1 className="mb-4 text-center text-2xl font-extrabold">Lønnsutregning</h1>

        {/* Velger: Timelønn / Fastlønn */}
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

        {/* === TIMELØNN === */}
        {salaryType === 'timelønn' && (
          <div
            onBlur={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              commitHourly();
            }}
          >
            <TopBar
              hourlyStr={hourlyStr}
              setHourlyStr={setHourlyStr}
              onCommitHourly={commitHourly}
              ot50Text={NOK(ot50Rate)}
              ot100Text={NOK(ot100Rate)}
            />

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

            <HoursInput
              shiftYes={shiftYes}
              hVanlig={hVanlig} setHVanlig={setHVanlig}
              hHellig={hHellig} setHHellig={setHHellig}
              hKveld={hKveld}   setHKveld={setHKveld}
              hNatt={hNatt}     setHNatt={setHNatt}
              hOT50={hOT50}     setHOT50={setHOT50}
              hOT100={hOT100}   setHOT100={setHOT100}
            />

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

            <BarRow
              label="Totalt Skattetrekk"
              value={`kr ${NOK(totalSkatt)}`}
              className="text-base"
            />

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

            <BarRow
              label="Utbetalt"
              value={`kr ${NOK(utbetalt)}`}
              tone="neutral"
              className="text-lg"
              valueClassName="text-2xl font-extrabold"
            />
          </div>
        )}

        {/* === FASTLØNN === */}
        {salaryType === 'fastlønn' && (
          <div className="mt-2">
            <div className="rounded-xl border p-4"
                 style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h2 className="mb-3 text-lg font-semibold">Fastlønn</h2>

              {/* Månedslønn (brutto) */}
              <EditRow
                label="Månedslønn (brutto)"
                unit="kr"
                value={monthlyGross}
                onChange={setMonthlyGross}
                step={500}
                w={140}
                decimals={2}
              />

              {/* Panel: utregnede satser */}
              <FastRatesPanel
                NOK={NOK}
                monthlyGross={monthlyGross}
                annualHours={annualHours}
                setAnnualHours={setAnnualHours}
                baseHourly={fastBaseHourly}
                ot50Rate={fastOT50Rate}
                ot100Rate={fastOT100Rate}
              />

              {/* Panel: skriv inn OT-timer */}
              <FastOvertimeHours
                hOT50={fastHOT50}
                setHOT50={setFastHOT50}
                hOT100={fastHOT100}
                setHOT100={setFastHOT100}
              />

              {/* Skattepaneler (gjenbruk) */}
              <div className="mt-4">
                <TabelltrekkPanel
                  NOK={NOK}
                  bruttoTilTabell={fastBruttoTilTabell}
                  tabelltrekkKr={fastTabelltrekk}
                  setTabelltrekkKr={setFastTabelltrekk}
                  initialMode="amount"   // fastlønn: vis kr som standard
                  initialPercent={30}
                />
              </div>

              <div className="mt-3">
                <OvertidSkattPanel
                  NOK={NOK}
                  bruttoOvertid={fastBruttoOvertid}
                  overtidSkattProsent={overtidSkattProsent}
                  setOvertidSkattProsent={setOvertidSkattProsent}
                  skattOvertid={fastSkattOvertid}
                />
              </div>

              {/* Totalt skattetrekk for fastlønn */}
              <BarRow
                label="Totalt Skattetrekk"
                value={`kr ${NOK(fastTotalSkatt)}`}
                className="mt-1 text-base"
              />

              {/* Mat trekk / Utlegg */}
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

              {/* Utbetalt */}
              <div className="mt-3">
                <BarRow
                  label="Utbetalt"
                  value={`kr ${NOK(fastUtbetalt)}`}
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
            href="/dashboard"
            className="w-full max-w-[260px] rounded-2xl bg-white py-3 text-center font-semibold text-black transition hover:opacity-90"
          >
            Neste
          </Link>
        </div>
      </div>
    </main>
  );
}
