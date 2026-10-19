/**
 * State estate taxes for deaths in 2026, one method per jurisdiction, as printed by the state (params-2026.json > estate):
 *  - excess  tax on the amount above the exemption, read on the state's table (CT, HI, ME, MN, VT, WA);
 *  - whole   the table starts at the exemption and taxes the whole estate once it is crossed (DC, OR);
 *  - sdtc    old federal credit for state death taxes (Table B, adjusted taxable estate = estate - $60,000)
 *            minus a fixed credit (RI);
 *  - ma      Massachusetts: Table B minus $99,600, out-of-state real and tangible property left out;
 *  - ny      New York: section 952 table, credit phased out between 100 % and 105 % of the basic exclusion;
 *  - il      Illinois: the Attorney General's interrelated computation (the tax is deductible from its own base);
 *  - md      Maryland: the lesser of 16 % above $5,000,000 and the apportioned Table B credit (Form MET 1).
 * Apportionment: `ratio` states multiply the tax by (property taxed by the state / gross estate);
 * `situs` states (NY, MA) leave property they do not tax out of the base.
 */
import P from '../../data/params-2026.json';
import { taxFromTable, type Bracket } from './brackets';
import { tentativeTax } from './federal';

export type GiftWhen = '1y' | '2y' | '3y' | 'old';
export type Half = 'h1' | 'h2';
interface EstateRule {
  name: string; method: string; exemption: number; prev: number; table?: Bracket[]; cap?: number; credit?: number; rate?: number; cliff?: number;
  apportion: 'ratio' | 'situs'; portability: string; gifts: string; dueMonths: number; form: string; sources: string[];
  firstHalf?: { until: string; exemption: number; table: Bracket[] };
}
export const RULES = P.estate as unknown as Record<string, EstateRule>;
export const TABLE_B = P.tableB as Bracket[];
export const tableB = (adjusted: number) => taxFromTable(TABLE_B, adjusted);

/** Exemption and table in force on the date of death (Washington changed on July 1, 2026). */
export function ruleAt(st: string, half: Half = 'h2') {
  const r = RULES[st];
  if (st === 'WA' && half === 'h1' && r.firstHalf) return { ...r, exemption: r.firstHalf.exemption, table: r.firstHalf.table };
  return r;
}

/** Gifts the state adds back to the estate, by how long before death they were made. */
export function giftsAdded(st: string, gifts: number, when: GiftWhen): number {
  const g = RULES[st]?.gifts;
  if (!gifts || !g) return 0;
  if (g === 'lifetime') return gifts;
  if (g === '1y') return when === '1y' ? gifts : 0;
  if (g === '2y') return when === '1y' || when === '2y' ? gifts : 0;
  if (g === '3y') return when === 'old' ? 0 : gifts;
  return 0; // 'none', 'il', 'md', 'reduce-exclusion' are handled inside the method
}

/** New York: tax on the NY taxable estate after the applicable credit (Tax Law 952(c)). */
export function nyTax(taxable: number, bea = RULES.NY.exemption) {
  const t = (x: number) => taxFromTable(RULES.NY.table!, x);
  if (taxable <= 0) return 0;
  if (taxable <= bea) return 0;
  const top = bea * (RULES.NY.cliff ?? 1.05);
  if (taxable > top) return t(taxable);
  const creditBase = bea * (1 - (taxable - bea) / (0.05 * bea));
  return Math.max(0, t(taxable) - t(creditBase));
}

/** Illinois Attorney General computation (taxable estate T, adjusted taxable gifts G), before apportionment. */
export function ilTax(T: number, G: number, threshold = RULES.IL.exemption) {
  const F = T + G;
  if (F <= threshold) return 0;
  let x = 0;
  for (let i = 0; i < 200; i++) { const nx = tableB(Math.max(0, T - x - 60000)); if (Math.abs(nx - x) < 0.001) { x = nx; break; } x = nx; }
  if (0.4 * (F - x - threshold) < x) x = (0.4 * (F - threshold)) / 1.4;
  return Math.max(0, x);
}

/** Maryland Form MET 1, lines 8 to 13 (before the credit for inheritance tax paid). */
export function mdTax(base: number, gifts: number, dsue: number, share: number) {
  const r = RULES.MD, d = Math.min(Math.max(0, dsue), r.exemption);
  const line8 = Math.max(0, base - r.exemption - d);
  if (line8 <= 0) return { line9: 0, sdtc: 0, tax: 0 };
  const line9 = (r.rate ?? 0.16) * line8;
  const fedGross = tentativeTax(base + gifts);
  const line11 = Math.max(0, fedGross - tentativeTax(r.exemption) - 0.4 * d);
  const sdtc = Math.min(line11, tableB(Math.max(0, base - 60000)));
  return { line9, sdtc, tax: Math.min(line9, sdtc * share) };
}

export interface StateIn {
  st: string;
  /** Taxable estate before any state death tax: gross estate minus debts, expenses, marital and charitable deductions. */
  taxable: number;
  /** Gross estate, used for the apportionment ratio. */
  gross: number;
  /** Part of the gross estate this state taxes (all of it for a resident without property elsewhere). */
  inState: number;
  resident: boolean;
  gifts: number; giftWhen: GiftWhen; dsue: number; half: Half;
}
export interface StateOut { st: string; name: string; tax: number; exemption: number; base: number; share: number; files: boolean; note?: string }

export function stateEstateTax(i: StateIn): StateOut {
  const r = ruleAt(i.st, i.half);
  if (!r) return { st: i.st, name: i.st, tax: 0, exemption: 0, base: 0, share: 0, files: false };
  const share = i.gross > 0 ? Math.min(1, Math.max(0, i.inState / i.gross)) : 0;
  const added = giftsAdded(i.st, i.gifts, i.giftWhen);
  let base = Math.max(0, i.taxable + added), tax = 0, exemption = r.exemption, note: string | undefined;
  const files = i.gross + (r.gifts === 'none' ? 0 : i.gifts) > exemption;
  switch (r.method) {
    case 'excess': {
      if (i.st === 'HI') { exemption = r.exemption + (r.portability === 'yes' ? Math.min(i.dsue, r.exemption) : 0) - i.gifts; }
      const full = taxFromTable(r.table!, Math.max(0, base - exemption));
      tax = Math.min(full, r.cap ?? Infinity) * share;
      break;
    }
    case 'whole':
      tax = base > exemption ? taxFromTable(r.table!, base) * share : 0;
      break;
    case 'sdtc':
      tax = Math.max(0, tableB(Math.max(0, base - 60000)) - (r.credit ?? 0)) * share;
      break;
    case 'ma': {
      base = i.resident ? Math.max(0, i.taxable - (i.gross - i.inState)) : Math.max(0, i.taxable * share);
      tax = Math.max(0, tableB(Math.max(0, base - 60000)) - (r.credit ?? 0));
      break;
    }
    case 'ny': {
      base = i.resident ? Math.max(0, i.taxable - (i.gross - i.inState) + added) : Math.max(0, i.taxable * share);
      tax = (i.gross + added) > exemption ? nyTax(base, exemption) : 0;
      break;
    }
    case 'il':
      tax = ilTax(i.taxable, i.gifts, exemption) * share;
      break;
    case 'md': {
      const m = mdTax(i.taxable, i.gifts, r.portability === 'yes' ? i.dsue : 0, share);
      tax = m.tax;
      break;
    }
  }
  return { st: i.st, name: r.name, tax: Math.max(0, tax), exemption, base, share, files, note };
}
