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
import { BarRow } from '@/components/salary/ui';

export default function SalaryPage() {
  const [hourly, setHourly] = useState<number>(250);
  const formatNOK = (n: number) =>
    n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [hourlyStr, setHourlyStr] = useState<string>(formatNOK(hourly));

  const [shiftYes, setShiftYes] = useState<boolean>(true);
  const [shiftMode, setShiftMode] = useState<ShiftMode>('kr');
  const [kveldTillegg, setKveldTillegg] = useState<number>(20);
  const [nattTillegg, setNattTillegg] = useState<number>(50);

  const [hVanlig, setHVanlig] = useState<number>(150);
  const [hHellig, setHHellig] = useState<number>(16);
  const [hKveld, setHKveld] = useState<number>(40);
  const [hNatt, setHNatt] = useState<number>(10);
  const [hOT50, setHOT50] = useState<number>(4);
  const [hOT100, setHOT100] = useState<number>(5);

  const [tabelltrekkKr, setTabelltrekkKr] = useState<number>(8060);
  const [overtidSkattProsent, setOvertidSkattProsent] = useState<number>(35);

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

  const utbetalt = brutto - totalSkatt;

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

  return (
    <main className="mx-auto max-w-[680px] p-4">
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        onBlur={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          commitHourly();
        }}
      >
        <h1 className="mb-4 text-center text-2xl font-extrabold">Lønnsutregning</h1>

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
        />

        {/* Timer */}
        <HoursInput
          hVanlig={hVanlig} setHVanlig={setHVanlig}
          hHellig={hHellig} setHHellig={setHHellig}
          hKveld={hKveld} setHKveld={setHKveld}
          hNatt={hNatt} setHNatt={setHNatt}
          hOT50={hOT50} setHOT50={setHOT50}
          hOT100={hOT100} setHOT100={setHOT100}
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
        />

        {/* Skattepaneler */}
        <TabelltrekkPanel
          NOK={NOK}
          bruttoTilTabell={bruttoTilTabell}
          tabelltrekkKr={tabelltrekkKr}
          setTabelltrekkKr={setTabelltrekkKr}
        />

        <OvertidSkattPanel
          NOK={NOK}
          bruttoOvertid={bruttoOvertid}
          overtidSkattProsent={overtidSkattProsent}
          setOvertidSkattProsent={setOvertidSkattProsent}
          skattOvertid={skattOvertid}
        />

        {/* Totalt skattetrekk + utbetalt */}
        <BarRow label="Totalt Skattetrekk" value={`kr ${NOK(totalSkatt)}`} />
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
