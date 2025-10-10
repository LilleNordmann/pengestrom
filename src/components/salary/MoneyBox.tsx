'use client';

import React from 'react';

type Props = {
  value: string;
  editable?: boolean;
  width?: number;

  // Callbacks må slutte på "Action" for å unngå serialiseringsvarsel
  onChangeAction?: (v: string) => void;
  onKeyDownAction?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlurAction?: React.FocusEventHandler<HTMLInputElement>;
};

export default function MoneyBox({
  value,
  editable = false,
  width = 90,
  onChangeAction,
  onKeyDownAction,
  onBlurAction,
}: Props) {
  if (editable) {
    return (
      <input
        inputMode="decimal"
        className="ui-chip"
        style={{ width }}
        value={value}
        onChange={(e) => onChangeAction?.(e.target.value)}
        onKeyDown={onKeyDownAction}
        onBlur={onBlurAction}
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
