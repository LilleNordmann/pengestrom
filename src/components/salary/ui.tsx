// src/components/salary/ui.tsx
'use client';
import React from 'react';

/* -------------------- Chip -------------------- */
type ChipProps = {
  label: string;
  active: boolean;
  onClickAction?: () => void;   // NYTT navn (trygt)
  onClick?: () => void;         // GAMMELT navn (fallback)
};
export function Chip({ label, active, onClickAction, onClick }: ChipProps) {
  const handle = onClickAction ?? onClick;
  return (
    <button
      type="button"
      onClick={handle}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${active ? 'opacity-100' : 'opacity-60'}`}
      style={{ background: 'var(--input-soft)', border: '1px solid var(--input-ring)', color: 'var(--input-fg)' }}
    >
      {label}
    </button>
  );
}

/* -------------------- SmallNum -------------------- */
type SmallNumProps = {
  value: number;
  onChangeAction?: (v: number) => void;  // NYTT navn (trygt)
  onChange?: (v: number) => void;        // GAMMELT navn (fallback)
  step?: number;
  min?: number;
  w?: number;
  /** Antall desimaler å normalisere til (f.eks. 2 for timer) */
  decimals?: number;
};

export function SmallNum({
  value,
  onChangeAction,
  onChange,
  step = 1,
  min = 0,
  w = 80,
  decimals,
}: SmallNumProps) {
  const setVal = onChangeAction ?? onChange;

  const display =
    Number.isFinite(value)
      ? (decimals != null ? value.toFixed(decimals) : String(value))
      : (decimals != null ? (0).toFixed(decimals) : '0');

  return (
    <input
      type="number"
      inputMode="decimal"
      className="ui-chip"
      style={{ width: w }}
      value={display}
      step={step}
      min={min}
      onChange={(e) => {
        const raw = (e.target.value ?? '').replace(',', '.');
        if (raw === '') {
          setVal?.(0);
          return;
        }
        const n = parseFloat(raw);
        if (!isNaN(n)) setVal?.(n);
      }}
      onBlur={(e) => {
        if (decimals != null) {
          const raw = (e.currentTarget.value ?? '').replace(',', '.');
          const n = parseFloat(raw);
          if (!isNaN(n)) setVal?.(Number(n.toFixed(decimals)));
        }
      }}
    />
  );
}

/* -------------------- TimeRow -------------------- */
export function TimeRow({ label, children }: { label: string; children: React.ReactNode }) {
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

/* -------------------- KVRow / BarRow -------------------- */
export function KVRow({ k, v }: { k: string; v: string }) {
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

export function BarRow({
  label,
  value,
  tone = 'accent',
  className,
  labelClassName,
  valueClassName,
}: {
  label: string;
  value: string;
  tone?: 'accent' | 'neutral';
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}) {
  const bg = tone === 'accent' ? 'var(--panel-accent)' : 'var(--card)';
  const bd = tone === 'accent' ? 'var(--accent-border)' : 'var(--border)';
  return (
    <div
      className={`my-3 rounded-lg px-3 py-2 text-sm font-semibold ${className ?? ''}`}
      style={{ background: bg, border: `1px solid ${bd}` }}
    >
      <div className="flex items-center justify-between">
        <span className={`${labelClassName ?? ''}`}>{label}</span>
        <span className={`tabular-nums ${valueClassName ?? ''}`}>{value}</span>
      </div>
    </div>
  );
}

/* -------------------- Panel/KV helpers -------------------- */
export function PanelWarn({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 rounded-lg p-3" style={{ background: 'var(--panel-warn)', border: '1px solid var(--warn-border)' }}>
      {children}
    </div>
  );
}

export function KVHeader({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{k}</span>
      <span className="tabular-nums">{v}</span>
    </div>
  );
}

export function KVFoot({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

/* -------------------- MiniLine -------------------- */
export function MiniLine({
  label,
  left,
  input,
  right,
}: {
  label: string;
  left?: string;
  input: React.ReactNode;
  right?: string;
}) {
  return (
    <div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="mt-1 flex items-center justify-between gap-2 ui-panel rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          {left ? <span className="text-sm font-bold">{left}</span> : null}
          {input}
        </div>
        {right ? <span className="text-xs" style={{ color: 'var(--muted)' }}>{right}</span> : null}
      </div>
    </div>
  );
}

/* -------------------- EditRow -------------------- */
export function EditRow({
  label,
  unit = 'kr',
  value,
  onChangeAction,     // NYTT navn (trygt)
  onChange,           // GAMMELT navn (fallback)
  step = 1,
  w = 100,
  decimals,
}: {
  label: string;
  unit?: string;
  value: number;
  onChangeAction?: (v: number) => void;
  onChange?: (v: number) => void;
  step?: number;
  w?: number;
  decimals?: number;
}) {
  const handle = onChangeAction ?? onChange;

  return (
    <div
      className="grid grid-cols-[1fr_auto_minmax(84px,128px)] items-center rounded-lg px-3 py-2"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="text-sm">{label}</div>
      <div className="mx-3 w-6 text-right text-xs font-semibold">{unit}</div>
      <div className="justify-self-end">
        <SmallNum value={value} onChangeAction={handle} step={step} w={w} decimals={decimals} />
      </div>
    </div>
  );
}
