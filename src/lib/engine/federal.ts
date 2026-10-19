/**
 * Federal estate and gift tax, 2026 (26 U.S.C. 2001 and 2010 as amended by Public Law 119-21; Rev. Proc. 2025-32).
 * The tax is the tentative tax on (taxable estate + adjusted taxable gifts) minus the tentative tax on the
 * applicable exclusion amount (basic exclusion + DSUE from a predeceased spouse). Gift tax already paid on
 * lifetime gifts is not modelled: gifts are assumed to have stayed under the exclusion, as they almost always do.
 */
import P from '../../data/params-2026.json';
import { taxFromTable, type Bracket } from './brackets';

export const F = P.federal;
const RT = F.rateTable as Bracket[];
export const tentativeTax = (x: number) => taxFromTable(RT, x);

export interface FedIn { taxableEstate: number; gifts: number; dsue: number }
export interface FedOut { base: number; exclusion: number; tentative: number; credit: number; tax: number; overBy: number }
export function federalEstateTax({ taxableEstate, gifts, dsue }: FedIn): FedOut {
  const base = Math.max(0, taxableEstate) + Math.max(0, gifts);
  const exclusion = F.basicExclusion + Math.min(Math.max(0, dsue), F.basicExclusion);
  const tentative = tentativeTax(base), credit = tentativeTax(exclusion);
  return { base, exclusion, tentative, credit, tax: Math.max(0, tentative - credit), overBy: Math.max(0, base - exclusion) };
}

/** Lifetime gifts: how much of the year's gifts to one person is a taxable gift, and how much exclusion it uses. */
export function giftToOne(amount: number, split: boolean, spouseNonCitizen = false) {
  const annual = spouseNonCitizen ? F.nonCitizenSpouse : F.annualExclusion * (split ? 2 : 1);
  const taxable = Math.max(0, amount - annual);
  return { annual, taxable, file709: amount > (split ? 0 : annual) || split, exclusionLeft: Math.max(0, F.basicExclusion * (split ? 2 : 1) - taxable) };
}
