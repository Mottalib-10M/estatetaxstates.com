/**
 * The calculators of the site, one entry per question. Every figure comes from the engine (src/lib/engine/*),
 * which reads params-2026.json. A spec lists its inputs (visible first, `adv` ones folded under "More options")
 * and a pure `run` that turns them into a result card. Nothing here is a figure typed by hand.
 */
import P from '../data/params-2026.json';
import type { ToolSpec, V, Input } from './tool-types';
import { formatMoney, formatPercent } from './format';
import { computeCase } from './engine/estate';
import { RULES, ruleAt, stateEstateTax, nyTax, type GiftWhen, type Half } from './engine/state';
import { INH, inheritanceTax, RELATIONS, relationLabel, type Relation } from './engine/inheritance';
import { federalEstateTax, giftToOne } from './engine/federal';
import { marginalRate, taxFromTable } from './engine/brackets';
import { STATE_OPTIONS, ESTATE_CODES, INHERITANCE_CODES, nameOf } from './states';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
export const pct = (x: number, d = 1) => formatPercent(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const FED = P.federal;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MONEY = (id: string, label: string, def: number, help?: string, adv = false, max = 50000000): Input => ({ id, label, def, unit: '$', max, help, adv });
const STATE = (def: string, label = 'State where the person lived', id = 'st', adv = false): Input => ({ kind: 'select', id, label, def, options: STATE_OPTIONS, adv });
const ESTATE_STATE = (def: string, label = 'State', id = 'st'): Input => ({ kind: 'select', id, label, def, options: ESTATE_CODES.map((c) => ({ value: c, label: nameOf(c) })) });
const INH_STATE = (def: string): Input => ({ kind: 'select', id: 'st', label: 'State', def, options: INHERITANCE_CODES.map((c) => ({ value: c, label: nameOf(c) })) });
const REL = (def: string, label = 'Heirs other than the spouse are', id = 'heir'): Input => ({ kind: 'select', id, label, def, options: RELATIONS.filter((r) => r.value !== 'spouse' || id === 'rel') });
const MARRIED = (def: string): Input => ({ kind: 'choice', id: 'ms', label: 'Married at death', def, options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] });
const GW: Input = { kind: 'select', id: 'gw', label: 'Those gifts were made', def: 'old', adv: true, options: [{ value: '1y', label: 'Less than 1 year before death' }, { value: '2y', label: '1 to 2 years before' }, { value: '3y', label: '2 to 3 years before' }, { value: 'old', label: 'More than 3 years before' }] };
const DOD: Input = { kind: 'select', id: 'dod', label: 'Date of death in 2026', def: 'h2', adv: true, help: 'Washington changed its table on July 1', options: [{ value: 'h1', label: 'January 1 to June 30' }, { value: 'h2', label: 'July 1 to December 31' }] };
const rateOf = (tax: number, base: number) => (base > 0 ? pct(tax / base) : pct(0));

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  /* Home and state pages: everything a death in 2026 costs, state by state */
  estate: () => ({
    inputs: [
      MONEY('estate', 'Net estate (assets minus debts)', 8000000, 'House, accounts, life insurance owned, business'),
      STATE('NY'),
      MARRIED('no'),
      { kind: 'select', id: 'spx', label: 'Left to the spouse', def: 'all', options: [{ value: 'all', label: 'Everything' }, { value: 'half', label: 'Half' }, { value: 'none', label: 'Nothing' }], help: 'Ignored if not married' },
      REL('child'),
      { id: 'n', label: 'Number of those heirs', def: 2, max: 20 },
      { kind: 'select', id: 're', label: 'Real estate in another state', def: 'none', adv: true, options: [{ value: 'none', label: 'None' }, ...STATE_OPTIONS] },
      MONEY('rv', 'Value of that real estate', 0, 'Already counted in the net estate', true),
      MONEY('gifts', 'Taxable gifts made during life', 0, 'Above the annual exclusion of each year', true),
      GW,
      MONEY('dsue', 'Unused exclusion of a late spouse (DSUE)', 0, 'Widowed only, if portability was elected', true, 15000000),
      MONEY('charity', 'Left to charity', 0, undefined, true),
      DOD,
    ],
    run: (v) => {
      const st = s(v, 'st'), re = s(v, 're');
      const r = computeCase({
        estate: n(v, 'estate'), st, married: s(v, 'ms') === 'yes', toSpouse: s(v, 'spx') as 'all' | 'half' | 'none',
        heir: s(v, 'heir') as Relation, heirs: n(v, 'n'), reState: re === 'none' ? undefined : re, reValue: n(v, 'rv'),
        gifts: n(v, 'gifts'), giftWhen: s(v, 'gw') as GiftWhen, dsue: n(v, 'dsue'), charity: n(v, 'charity'), half: s(v, 'dod') as Half,
      });
      const k = Math.max(1, Math.round(n(v, 'n')));
      const rows: Array<[string, string, number?]> = [
        [r.home ? `${r.home.name} estate tax` : `${nameOf(st)}: no estate tax`, usd(r.home?.tax ?? 0), r.home?.tax ?? 0],
      ];
      if (r.other) rows.push([`${r.other.name} estate tax on the property there`, usd(r.other.tax), r.other.tax]);
      if (r.inhHome) rows.push([`${nameOf(st)} inheritance tax, each ${relationLabel(s(v, 'heir')).toLowerCase()}`, usd(r.inhHome.tax), r.inhHome.tax * k]);
      if (r.inhOther) rows.push([`${nameOf(re)} inheritance tax, each heir`, usd(r.inhOther.tax), r.inhOther.tax * k]);
      rows.push(['Federal estate tax', usd(r.fed.tax), r.fed.tax]);
      rows.push(['Left to heirs and spouse after taxes', usd(r.netToHeirs)]);
      const shareTxt = r.heirShare > 0 ? `${k} heir${k > 1 ? 's' : ''} at ${usd(r.heirShare)} each` : 'nothing goes to other heirs';
      return {
        label: 'Death taxes on this estate in 2026', value: usd(r.total),
        sub: `${rateOf(r.total, n(v, 'estate'))} of the estate; ${r.spouseShare > 0 ? `${usd(r.spouseShare)} to the spouse tax free, ` : ''}${shareTxt}.`,
        rows,
        note: `Federal: ${usd(r.fed.base)} taxed against an exclusion of ${usd(r.fed.exclusion)}. ${r.home && !r.home.files ? `No ${r.home.name} return: the estate is under ${usd(r.home.exemption)}. ` : ''}Estimate on 2026 rules, not legal or tax advice.`,
      };
    },
  }),

  /* One state's estate tax on an amount, with the ladder of amounts */
  state: (arg) => ({
    inputs: [
      ESTATE_STATE(String(arg?.st ?? 'NY')),
      MONEY('estate', 'Taxable estate after the spouse and charity', Number(arg?.estate ?? 8000000)),
      MONEY('out', 'Of which real estate in another state', 0, 'Taxed there, not here', true),
      MONEY('gifts', 'Taxable gifts made during life', 0, undefined, true),
      GW,
      MONEY('dsue', 'State unused exclusion of a late spouse', 0, 'Maryland and Hawaii only', true, 15000000),
      DOD,
    ],
    run: (v) => {
      const st = s(v, 'st'), T = n(v, 'estate'), out = Math.min(n(v, 'out'), T), half = s(v, 'dod') as Half;
      const one = (x: number, o = out) => stateEstateTax({ st, taxable: x, gross: x, inState: x - Math.min(o, x), resident: true, gifts: n(v, 'gifts'), giftWhen: s(v, 'gw') as GiftWhen, dsue: n(v, 'dsue'), half });
      const res = one(T);
      const r = ruleAt(st, half);
      const step = r.exemption < 2500000 ? 500000 : 1000000;
      const start = Math.ceil(r.exemption / step) * step;
      const ladder = Array.from({ length: 7 }, (_, i) => start + i * step * (r.exemption < 2500000 ? 2 : 1));
      return {
        label: `${r.name} estate tax for a death in 2026`, value: usd(res.tax),
        sub: res.tax > 0 ? `${rateOf(res.tax, T)} of the taxable estate; exemption ${usd(r.exemption)}.` : `Under the ${usd(r.exemption)} exemption, or exempt by its method.`,
        rows: [['Exemption or threshold', usd(r.exemption)], ['Amount above it', usd(Math.max(0, res.base - r.exemption))], ['State estate tax', usd(res.tax), res.tax], ['Return due', `${r.dueMonths} months after death`]],
        table: { caption: `${r.name}, estate tax by size of estate (resident, no gifts)`, headers: ['Taxable estate', 'State tax', 'Share'], align: ['l', 'r', 'r'],
          rows: ladder.map((x) => { const t = one(x, 0).tax; return [usd(x), usd(t), rateOf(t, x)]; }) },
        note: 'Estimate on the state table for 2026. Federal tax comes on top above the federal exclusion.',
      };
    },
  }),

  /* Inheritance tax: one heir, one amount */
  inh: (arg) => ({
    inputs: [
      INH_STATE(String(arg?.st ?? 'PA')),
      MONEY('amt', 'Amount this person receives', Number(arg?.amt ?? 200000)),
      { kind: 'select', id: 'rel', label: 'Relationship to the deceased', def: String(arg?.rel ?? 'nephew'), options: RELATIONS },
    ],
    run: (v) => {
      const st = s(v, 'st'), amt = n(v, 'amt'), rel = s(v, 'rel') as Relation;
      const o = inheritanceTax(st, rel, amt);
      return {
        label: `${nameOf(st)} inheritance tax for this heir`, value: usd(o.tax),
        sub: `${o.label}. ${o.tax > 0 ? `${pct(o.rate)} of what is received.` : 'Nothing to pay.'}`,
        rows: [['Received', usd(amt)], ['Tax', usd(o.tax), o.tax], ['Kept by the heir', usd(amt - o.tax), amt - o.tax]],
        table: { caption: `Same heir, same amount, in the five states with an inheritance tax`, headers: ['State', 'Class', 'Tax'], align: ['l', 'l', 'r'],
          rows: INHERITANCE_CODES.map((c) => { const x = inheritanceTax(c, rel, amt); return [nameOf(c), x.label.split(':')[0], usd(x.tax)]; }) },
        note: 'Tax on the share received from a resident. A spouse pays none in any of the five states.',
      };
    },
  }),

  /* New York cliff */
  cliff: (arg) => ({
    inputs: [MONEY('estate', 'New York taxable estate', Number(arg?.estate ?? 7500000))],
    run: (v) => {
      const T = n(v, 'estate'), bea = RULES.NY.exemption, top = bea * 1.05;
      const tax = nyTax(T), full = T > 0 ? taxFromTable(RULES.NY.table!, T) : 0;
      const zone = T > bea && T <= top;
      const lad = [bea, bea + 0.01 * bea, bea + 0.02 * bea, bea + 0.03 * bea, bea + 0.04 * bea, top, top + 100000, top + 500000].map(Math.round);
      return {
        label: 'New York estate tax for a death in 2026', value: usd(tax),
        sub: T <= bea ? `Under the ${usd(bea)} basic exclusion amount.` : zone ? `Inside the cliff: the credit shrinks to zero at ${usd(top)}.` : `Above ${usd(top)}: no credit, tax on the whole estate.`,
        rows: [['Basic exclusion amount', usd(bea)], ['105 % of it', usd(top)], ['Tax without any credit', usd(full)], ['Tax owed', usd(tax), tax],
          ['Tax on each dollar above the exclusion', T > bea ? pct(tax / (T - bea)) : pct(0)]],
        table: { caption: 'The cliff, step by step', headers: ['Taxable estate', 'Tax', 'Tax per dollar over the exclusion'], align: ['l', 'r', 'r'],
          rows: lad.map((x) => { const t = nyTax(x); return [usd(x), usd(t), x > bea ? pct(t / (x - bea)) : 'n/a']; }) },
        note: 'Gifts made in the 3 years before death count in the New York taxable estate (deaths before January 1, 2032).',
      };
    },
  }),

  /* Federal estate tax only */
  fed: (arg) => ({
    inputs: [
      MONEY('estate', 'Taxable estate after the spouse and charity', Number(arg?.estate ?? 18000000)),
      MONEY('gifts', 'Lifetime taxable gifts', Number(arg?.gifts ?? 0)),
      MONEY('dsue', 'Unused exclusion from a late spouse', Number(arg?.dsue ?? 0), 'Only if portability was elected', false, 15000000),
      MONEY('stt', 'State death taxes paid', 0, 'Deductible from the federal base', true),
    ],
    run: (v) => {
      const f = federalEstateTax({ taxableEstate: n(v, 'estate') - n(v, 'stt'), gifts: n(v, 'gifts'), dsue: n(v, 'dsue') });
      return {
        label: 'Federal estate tax for a death in 2026', value: usd(f.tax),
        sub: f.tax > 0 ? `40 % of the ${usd(f.overBy)} above the exclusion.` : `${usd(f.exclusion - f.base)} of exclusion left unused.`,
        rows: [['Estate plus lifetime gifts', usd(f.base)], ['Exclusion (basic plus DSUE)', usd(f.exclusion)], ['Tentative tax', usd(f.tentative)], ['Credit', usd(f.credit)], ['Federal estate tax', usd(f.tax), f.tax]],
        table: { caption: 'Basic exclusion amount by year of death', headers: ['Year', 'Per person', 'Married couple with portability'], align: ['l', 'r', 'r'],
          rows: Object.entries(FED.history).reverse().map(([y, x]) => [y, usd(x), usd(2 * x)]) },
      };
    },
  }),

  /* Gifts during life */
  gift: (arg) => ({
    inputs: [
      MONEY('amt', 'Given to one person in 2026', Number(arg?.amt ?? 50000)),
      { kind: 'choice', id: 'split', label: 'Spouse joins the gift', def: String(arg?.split ?? 'no'), options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] },
      { kind: 'select', id: 'to', label: 'The recipient is', def: String(arg?.to ?? 'child'), options: [{ value: 'child', label: 'A child, relative or friend' }, { value: 'ncspouse', label: 'My spouse, not a US citizen' }, { value: 'spouse', label: 'My spouse, a US citizen' }] },
      { kind: 'choice', id: 'ct', label: 'Living in Connecticut', def: String(arg?.ct ?? 'no'), options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], adv: true },
    ],
    run: (v) => {
      const amt = n(v, 'amt'), to = s(v, 'to'), split = s(v, 'split') === 'yes' && to === 'child';
      if (to === 'spouse') return { label: 'Taxable gift', value: usd(0), sub: 'Unlimited marital deduction: no Form 709 for a gift to a US citizen spouse.', rows: [['Gift', usd(amt)], ['Taxable', usd(0)]] };
      const g = giftToOne(amt, split, to === 'ncspouse');
      return {
        label: 'Taxable gift for 2026', value: usd(g.taxable),
        sub: g.taxable > 0 ? `Form 709 due April 15, 2027. No tax: it uses ${usd(g.taxable)} of the ${usd(FED.basicExclusion * (split ? 2 : 1))} lifetime exclusion.` : split ? 'Form 709 still due to elect gift splitting.' : 'Under the annual exclusion: no form, no tax.',
        rows: [['Annual exclusion that applies', usd(g.annual)], ['Taxable gift', usd(g.taxable), g.taxable], ['Lifetime exclusion left', usd(g.exclusionLeft)],
          ['Connecticut gift tax return', s(v, 'ct') === 'yes' && g.taxable > 0 ? 'CT-706/709 due' : 'not needed']],
        note: 'Tuition paid to a school and medical bills paid to the provider are not gifts at all (26 U.S.C. 2503(e)).',
      };
    },
  }),

  /* Married couples: everything to the spouse, or a credit shelter trust at the state exemption */
  couple: (arg) => ({
    inputs: [
      MONEY('estate', 'Couple’s combined estate', Number(arg?.estate ?? 10000000)),
      ESTATE_STATE(String(arg?.st ?? 'MA')),
      { id: 'grow', label: 'Growth until the second death', def: 0, unit: '%', max: 300, help: 'Total, not per year' },
    ],
    run: (v) => {
      const W = n(v, 'estate'), st = s(v, 'st'), g = 1 + n(v, 'grow') / 100;
      const r = RULES[st];
      const portable = r.portability === 'yes';
      const tax = (x: number, dsue = 0) => stateEstateTax({ st, taxable: x, gross: x, inState: x, resident: true, gifts: 0, giftWhen: 'old', dsue, half: 'h2' }).tax;
      const fedT = (x: number, dsue: number) => federalEstateTax({ taxableEstate: x, gifts: 0, dsue }).tax;
      // A: all to the spouse; the survivor dies with everything.
      const aState = tax(W * g, portable ? r.exemption : 0), aFed = fedT(W * g - aState, FED.basicExclusion);
      // B: the first to die leaves the state exemption (or half the estate) in a credit shelter trust.
      const trust = Math.min(W / 2, r.exemption);
      const bFirst = tax(trust), bState = bFirst + tax((W - trust) * g), bFed = fedT((W - trust) * g, FED.basicExclusion - trust);
      return {
        label: 'State tax saved by a credit shelter trust', value: usd(Math.max(0, aState - bState)),
        sub: portable ? `${r.name} allows portability: the survivor already uses both exemptions.` : `${r.name} has no portability: the first exemption is lost if everything goes to the spouse.`,
        rows: [['Everything to the spouse: state tax at the second death', usd(aState), aState], [`Trust of ${usd(trust)}: state tax`, usd(bState), bState],
          ['Federal tax, everything to the spouse', usd(aFed)], ['Federal tax, with the trust', usd(bFed)]],
        note: 'Trust growth stays outside the survivor’s estate. Illustration only: a trust is drafted by an estate attorney.',
      };
    },
  }),

  /* Moving: same estate, two states */
  compare: (arg) => ({
    inputs: [
      MONEY('estate', 'Net estate', Number(arg?.estate ?? 8000000)),
      STATE(String(arg?.a ?? 'NY'), 'State you live in now', 'a'),
      STATE(String(arg?.b ?? 'FL'), 'State you would move to', 'b'),
      REL(String(arg?.heir ?? 'child')),
      { id: 'n', label: 'Number of those heirs', def: 2, max: 20, adv: true },
    ],
    run: (v) => {
      const go = (st: string) => computeCase({ estate: n(v, 'estate'), st, married: false, toSpouse: 'none', heir: s(v, 'heir') as Relation, heirs: n(v, 'n') });
      const A = go(s(v, 'a')), B = go(s(v, 'b'));
      const sa = A.stateTotal + A.inhTotal, sb = B.stateTotal + B.inhTotal;
      return {
        label: `State death taxes, ${nameOf(s(v, 'a'))} against ${nameOf(s(v, 'b'))}`, value: usd(sa - sb),
        sub: sa > sb ? `Less tax in ${nameOf(s(v, 'b'))}, if the move is real (domicile).` : sa < sb ? `More tax in ${nameOf(s(v, 'b'))}.` : 'Same state tax in both.',
        rows: [[`${nameOf(s(v, 'a'))}: estate and inheritance tax`, usd(sa), sa], [`${nameOf(s(v, 'b'))}: estate and inheritance tax`, usd(sb), sb], ['Federal tax, either way', usd(B.fed.tax)]],
        table: { caption: 'The same estate, unmarried, in each state that taxes it', headers: ['State', 'Estate tax', 'Inheritance tax, all heirs'], align: ['l', 'r', 'r'],
          rows: [...new Set([...ESTATE_CODES, ...INHERITANCE_CODES])].sort((x, y) => nameOf(x).localeCompare(nameOf(y))).map((c) => { const x = go(c); return [nameOf(c), usd(x.stateTotal), usd(x.inhTotal)]; }) },
        note: 'Real estate keeps the tax of the state where it sits even after the move.',
      };
    },
  }),

  /* Real estate in another state */
  realty: (arg) => ({
    inputs: [
      STATE(String(arg?.st ?? 'FL'), 'State where the owner lives'),
      STATE(String(arg?.re ?? 'OR'), 'State where the property is', 're'),
      MONEY('rv', 'Value of the property', Number(arg?.rv ?? 1000000)),
      MONEY('estate', 'Whole net estate, property included', Number(arg?.estate ?? 3000000)),
      REL(String(arg?.heir ?? 'child')),
      { id: 'n', label: 'Number of those heirs', def: 2, max: 20, adv: true },
    ],
    run: (v) => {
      const re = s(v, 're');
      const r = computeCase({ estate: Math.max(n(v, 'estate'), n(v, 'rv')), st: s(v, 'st'), married: false, toSpouse: 'none', heir: s(v, 'heir') as Relation, heirs: n(v, 'n'), reState: re, reValue: n(v, 'rv') });
      const there = (r.other?.tax ?? 0) + (r.inhOther?.tax ?? 0) * Math.max(1, Math.round(n(v, 'n')));
      return {
        label: `Tax owed to ${nameOf(re)} on the property`, value: usd(there),
        sub: re === s(v, 'st') ? 'Same state: the property is simply part of the resident estate.' : there > 0 ? 'A nonresident estate return is due in that state.' : `${nameOf(re)} taxes nothing here.`,
        rows: [[`${nameOf(re)} estate tax`, usd(r.other?.tax ?? 0), r.other?.tax ?? 0], [`${nameOf(re)} inheritance tax, each heir`, usd(r.inhOther?.tax ?? 0)],
          [`${nameOf(s(v, 'st'))} estate tax`, usd(r.home?.tax ?? 0), r.home?.tax ?? 0], ['Federal estate tax', usd(r.fed.tax)]],
        note: 'Holding the property in a revocable trust avoids a second probate; it does not by itself avoid the state tax.',
      };
    },
  }),

  /* Deadlines */
  deadline: (arg) => ({
    inputs: [
      STATE(String(arg?.st ?? 'PA')),
      { kind: 'select', id: 'm', label: 'Month of death', def: String(arg?.m ?? '3'), options: MONTHS.map((x, i) => ({ value: String(i + 1), label: `${x} 2026` })) },
    ],
    run: (v) => {
      const st = s(v, 'st'), m = n(v, 'm');
      const at = (k: number) => { const t = m - 1 + k; return `${MONTHS[t % 12]} ${2026 + Math.floor(t / 12)}`; };
      const rows: Array<[string, string, number?]> = [['Federal Form 706, if required', at(FED.returnMonths)], ['With the automatic 6-month extension', at(FED.returnMonths + FED.extensionMonths)]];
      if (RULES[st]) rows.push([`${RULES[st].name} ${RULES[st].form}`, at(RULES[st].dueMonths)]);
      const I = INH[st] as unknown as { dueMonths?: number; dueMonthsBeforeJuly?: number; discount?: { months: number; monthsBeforeJuly?: number } } | undefined;
      if (I) {
        const before = st === 'KY' && m < 7;
        const due = before ? I.dueMonthsBeforeJuly : I.dueMonths;
        if (I.discount) rows.push([`${nameOf(st)} early payment discount until`, at(before ? I.discount.monthsBeforeJuly ?? I.discount.months : I.discount.months)]);
        if (due) rows.push([`${nameOf(st)} inheritance tax due`, at(due)]);
        if (st === 'NE') rows.push(['Nebraska inheritance tax', 'set by the county court']);
        if (st === 'MD') rows.push(['Maryland inheritance tax', 'when the property is distributed from the estate']);
      }
      return {
        label: 'First deadline for this death', value: at(Math.min(...[FED.returnMonths, RULES[st]?.dueMonths ?? 99, I?.discount?.months ?? 99, (I as { dueMonths?: number } | undefined)?.dueMonths ?? 99])),
        sub: 'Same day of the month as the death, in the month shown.', rows,
        note: 'An extension to file is not an extension to pay: interest runs from the original date.',
      };
    },
  }),

  /* Spouse who is not a US citizen */
  nca: (arg) => ({
    inputs: [
      MONEY('estate', 'Estate of the citizen spouse', Number(arg?.estate ?? 20000000)),
      MONEY('gift', 'Gifts to the noncitizen spouse in 2026', Number(arg?.gift ?? 250000)),
      { kind: 'choice', id: 'qdot', label: 'Left in a QDOT', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] },
    ],
    run: (v) => {
      const E = n(v, 'estate'), q = s(v, 'qdot') === 'yes';
      const g = giftToOne(n(v, 'gift'), false, true);
      const f = federalEstateTax({ taxableEstate: q ? 0 : E, gifts: g.taxable, dsue: 0 });
      return {
        label: 'Federal estate tax at the first death', value: usd(f.tax),
        sub: q ? 'A QDOT defers the tax until principal leaves the trust or the survivor dies.' : 'No marital deduction for a noncitizen spouse without a QDOT.',
        rows: [['Annual exclusion for a noncitizen spouse', usd(FED.nonCitizenSpouse)], ['Taxable part of this year’s gifts', usd(g.taxable)], ['Estate tax now', usd(f.tax), f.tax]],
        note: 'Federal rule only; state estate taxes have their own marital deduction rules. Not legal advice.',
      };
    },
  }),
};

/** A spec with its defaults overridden by `arg` (same keys as the input ids). */
export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (arg[i.id] === undefined ? i : ({ ...i, def: i.kind === 'select' || i.kind === 'choice' ? String(arg[i.id]) : arg[i.id] } as typeof i))) };
}
export const TOOL_KINDS = Object.keys(SPECS);
export { marginalRate };
