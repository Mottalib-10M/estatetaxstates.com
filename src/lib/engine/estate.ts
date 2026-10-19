/**
 * The whole picture for one death in 2026: state estate tax where the deceased lived, the tax of a second
 * state on real estate located there, inheritance taxes per heir, and the federal estate tax.
 * Simplifications, all written on the result card and in the Method page:
 *  - `estate` is the net estate (assets minus debts and funeral and administration costs);
 *  - the spouse's share is a deduction everywhere (marital deduction), charity's too;
 *  - the heirs other than the spouse share the rest equally; inheritance tax is computed on those shares
 *    before estate taxes are paid (states compute it on the property received);
 *  - the state death taxes are deducted from the federal base (26 U.S.C. 2058).
 */
import { RULES, stateEstateTax, type GiftWhen, type Half, type StateOut } from './state';
import { INH, inheritanceTax, type Relation, type InhOut } from './inheritance';
import { federalEstateTax, type FedOut } from './federal';

export interface Case {
  estate: number; st: string;
  married: boolean; toSpouse: 'all' | 'half' | 'none';
  heir: Relation; heirs: number; charity?: number;
  /** Real estate in another state, part of `estate`. */
  reState?: string; reValue?: number;
  dsue?: number; gifts?: number; giftWhen?: GiftWhen; half?: Half;
}
export interface Result {
  spouseShare: number; heirShare: number; charity: number; taxable: number;
  home: StateOut | null; other: StateOut | null;
  inhHome: InhOut | null; inhOther: InhOut | null; inhSpouse: number; inhTotal: number;
  stateTotal: number; fed: FedOut; total: number; netToHeirs: number;
}

export function computeCase(c: Case): Result {
  const estate = Math.max(0, c.estate);
  const reValue = c.reState && c.reState !== c.st ? Math.min(Math.max(0, c.reValue ?? 0), estate) : 0;
  const reState = reValue > 0 ? c.reState! : '';
  const charity = Math.min(Math.max(0, c.charity ?? 0), estate);
  const afterCharity = estate - charity;
  const spouseShare = c.married ? (c.toSpouse === 'all' ? afterCharity : c.toSpouse === 'half' ? afterCharity / 2 : 0) : 0;
  const rest = afterCharity - spouseShare;
  const n = Math.max(1, Math.round(c.heirs));
  const heirShare = rest > 0 ? rest / n : 0;
  const taxable = Math.max(0, estate - spouseShare - charity);
  const gifts = Math.max(0, c.gifts ?? 0), giftWhen = c.giftWhen ?? 'old', half = c.half ?? 'h2', dsue = c.married ? 0 : Math.max(0, c.dsue ?? 0);

  // 1. Estate tax of the state of residence (on everything but the other state's real estate).
  const home = RULES[c.st] ? stateEstateTax({ st: c.st, taxable, gross: estate, inState: estate - reValue, resident: true, gifts, giftWhen, dsue, half }) : null;
  // 2. Estate tax of the state where the real estate lies (nonresident estate).
  const other = reState && RULES[reState] ? stateEstateTax({ st: reState, taxable, gross: estate, inState: reValue, resident: false, gifts, giftWhen, dsue, half }) : null;

  // 3. Inheritance taxes, per heir (the spouse is exempt in all five states).
  const outRatio = estate > 0 ? reValue / estate : 0;
  const inhHome = INH[c.st] && heirShare > 0 ? inheritanceTax(c.st, c.heir, heirShare * (1 - outRatio), 1) : null;
  const inhOther = reState && INH[reState] && heirShare > 0 ? inheritanceTax(reState, c.heir, heirShare * outRatio, outRatio) : null;
  const inhTotal = ((inhHome?.tax ?? 0) + (inhOther?.tax ?? 0)) * (heirShare > 0 ? n : 0);

  // Maryland credits the inheritance tax paid against its estate tax (MET 1, line 14a).
  if (home && c.st === 'MD' && inhHome) home.tax = Math.max(0, home.tax - inhHome.tax * n);
  if (other && reState === 'MD' && inhOther) other.tax = Math.max(0, other.tax - inhOther.tax * n);

  const stateTotal = (home?.tax ?? 0) + (other?.tax ?? 0);
  const fed = federalEstateTax({ taxableEstate: taxable - stateTotal - inhTotal, gifts, dsue });
  const total = stateTotal + inhTotal + fed.tax;
  return { spouseShare, heirShare, charity, taxable, home, other, inhHome, inhOther, inhSpouse: 0, inhTotal, stateTotal, fed, total, netToHeirs: estate - charity - total };
}
