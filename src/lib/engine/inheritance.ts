/**
 * Inheritance taxes for deaths in 2026: Pennsylvania, New Jersey, Kentucky, Nebraska, Maryland (params-2026.json > inheritance).
 * The tax falls on what each person receives, at a rate set by the person's relationship to the deceased.
 * `ratio` is the part of the estate the state taxes when the deceased lived elsewhere (only real and tangible
 * property located in the state); it is 1 for a resident. New Jersey taxes a nonresident's share by the ratio
 * method, Kentucky prorates the exemption, the others tax the in-state part directly.
 */
import P from '../../data/params-2026.json';
import { taxFromSlices } from './brackets';

export type Relation = 'spouse' | 'child' | 'minorchild' | 'grandchild' | 'stepchild' | 'parent' | 'sibling' | 'nephew' | 'inlaw' | 'auntuncle' | 'cousin' | 'other' | 'charity';
export const RELATIONS: Array<{ value: Relation; label: string }> = [
  { value: 'spouse', label: 'Spouse' }, { value: 'child', label: 'Child' }, { value: 'minorchild', label: 'Child aged 21 or younger' },
  { value: 'grandchild', label: 'Grandchild' }, { value: 'stepchild', label: 'Stepchild' }, { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Brother or sister' }, { value: 'nephew', label: 'Niece or nephew' }, { value: 'inlaw', label: 'Son- or daughter-in-law' },
  { value: 'auntuncle', label: 'Aunt or uncle' }, { value: 'cousin', label: 'Cousin' }, { value: 'other', label: 'Friend or partner' }, { value: 'charity', label: 'Charity' },
];
export const relationLabel = (r: string) => RELATIONS.find((x) => x.value === r)?.label ?? r;

interface Cls { label: string; rate?: number; exemption?: number | null; slices?: Array<[number | null, number]> }
interface InhRule { name: string; classes: Record<string, Cls>; map: Record<string, string>; [k: string]: unknown }
export const INH = P.inheritance as unknown as Record<string, InhRule>;

export interface InhOut { st: string; cls: string; label: string; tax: number; rate: number; taxed: number }

/** Tax one person pays to state `st` on `amount` received (the in-state part when `ratio` < 1). */
export function inheritanceTax(st: string, rel: Relation, amount: number, ratio = 1): InhOut {
  const r = INH[st];
  const key = r.map[rel];
  const c = r.classes[key];
  const out = (tax: number): InhOut => ({ st, cls: key, label: c.label, tax: Math.max(0, tax), rate: amount > 0 ? Math.max(0, tax) / amount : 0, taxed: amount });
  if (amount <= 0) return out(0);
  if (st === 'PA') return out((c.rate ?? 0) * amount);
  if (st === 'MD') return out(amount <= (r.smallExempt as number) ? 0 : (c.rate ?? 0) * amount);
  if (st === 'NJ') {
    if (amount * (ratio > 0 ? 1 / ratio : 1) < (r.minTaxable as number)) return out(0);
    // Ratio method: tax on the whole share, then the New Jersey part of it.
    const whole = ratio > 0 ? amount / ratio : amount;
    return out(taxFromSlices(c.slices!, whole) * ratio);
  }
  if (st === 'KY') {
    if (!c.exemption) return out(0);
    const ex = c.exemption * ratio;
    return out(taxFromSlices(c.slices!, Math.max(0, amount - ex)));
  }
  if (st === 'NE') {
    if (c.rate === undefined || !c.exemption) return out(0);
    if (rel === 'minorchild') return out(0); // under 22: exempt (77-2004 to 77-2006)
    return out(amount > c.exemption ? c.rate * (amount - c.exemption) : 0);
  }
  return out(0);
}
