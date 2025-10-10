// src/components/salary/MoneyBox.tsx
'use client';

import React from 'react';

type Props = {
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  width?: number;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export default function MoneyBox({ value, onChange, editable = false, width = 90 }: Props) {
  if (editable) {
    return (
      <input
        inputMode="decimal"
        className="ui-chip"
        style={{ width }}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    );
  }
  return (
    <div
      aria-readonly="true"
      className="ui-chip select-none cursor-default"
      style={{ width }}
    >
      {value}
    </div>
  );
}
