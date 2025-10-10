// src/lib/format.ts
export const NOK = (n:number) =>
  n.toLocaleString('nb-NO', { minimumFractionDigits:2, maximumFractionDigits:2 });
