/**
 * A bracket table as the statutes print it: each row is "over `from`, the tax is `base` plus `rate` of the
 * excess over `from`". Rows sorted by `from`, the first one starting at 0. The `base` column is checked
 * against the rates by the tests (tests/engine.test.ts), so a typo in a published table cannot slip in.
 */
export interface Bracket { from: number; rate: number; base: number }

export function taxFromTable(table: Bracket[], amount: number): number {
  if (amount <= 0) return 0;
  let row = table[0];
  for (const r of table) if (amount > r.from) row = r;
  return row.base + row.rate * (amount - row.from);
}

/** Marginal rate at an amount (the rate of the row the last dollar falls in). */
export function marginalRate(table: Bracket[], amount: number): number {
  let row = table[0];
  for (const r of table) if (amount > r.from) row = r;
  return row.rate;
}

/** Recomputes each row's base from the rates: equal to the printed base when the table is consistent. */
export function impliedBases(table: Bracket[]): number[] {
  const out = [table[0].base];
  for (let i = 1; i < table.length; i++) out.push(out[i - 1] + table[i - 1].rate * (table[i].from - table[i - 1].from));
  return out;
}

/** Tax on brackets given as [upper bound of slice, rate] slices (inheritance tax schedules). */
export function taxFromSlices(slices: Array<[number | null, number]>, amount: number): number {
  let tax = 0, lo = 0;
  for (const [hi, rate] of slices) {
    if (amount <= lo) break;
    const top = hi === null ? amount : Math.min(amount, hi);
    tax += (top - lo) * rate;
    if (hi === null) break;
    lo = hi;
  }
  return tax;
}
