/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P, K.F, K.E, K.I    params-2026.json, its federal block, the estate-tax states, the inheritance-tax states
 *   K.tool(kind, args)    runs a calculator of tool-specs.ts and returns its result card
 *   K.stateTax, K.inhTax  engine shortcuts on a plain amount (resident, no gifts, no other property)
 *   formats               K.usd, K.pct, K.num, K.dec, K.day
 */
import P from '../data/params-2026.json';
import { usd, getTool, pct } from './tool-specs';
import { formatNumber, formatDecimal, displayDate } from './format';
import { RULES, ruleAt, stateEstateTax, nyTax, ilTax, tableB, type Half } from './engine/state';
import { INH, inheritanceTax, relationLabel, type Relation } from './engine/inheritance';
import { federalEstateTax, tentativeTax } from './engine/federal';
import { computeCase } from './engine/estate';
import { taxFromTable } from './engine/brackets';
import { nameOf, ESTATE_CODES, INHERITANCE_CODES, NONE_CODES } from './states';
import type { V } from './tool-types';

function tool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args };
  return spec.run(v);
}
const stateTax = (st: string, amount: number, half: Half = 'h2') => stateEstateTax({ st, taxable: amount, gross: amount, inState: amount, resident: true, gifts: 0, giftWhen: 'old', dsue: 0, half }).tax;
const inhTax = (st: string, rel: Relation, amount: number) => inheritanceTax(st, rel, amount).tax;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const KIT = {
  P, F: P.federal, E: RULES, I: INH, R: P.repealed, tool,
  stateTax, inhTax, ruleAt, nyTax, ilTax, tableB, taxFromTable, federalEstateTax, tentativeTax, computeCase, inheritanceTax, relationLabel,
  nameOf, ESTATE_CODES, INHERITANCE_CODES, NONE_CODES,
  usd, pct, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: (iso: string) => displayDate(iso, 'en-US'),
  /** "$7.35 million" for prose. */
  mil: (x: number) => `$${formatDecimal(x / 1e6, 3)} million`,
  month: (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`,
};
export type Kit = typeof KIT;
