import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const RT = F.rateTable;
const ex = F.basicExclusion;
const top = F.topRate;
const fedOn = (x: number) => K.federalEstateTax({ taxableEstate: x, gifts: 0, dsue: 0 }).tax;
const TB = K.P.tableB;
/** Highest marginal rate a state's own computation reaches. */
const maxRate = (c: string) => { const r = K.E[c]; if (r.table) return r.table[r.table.length - 1].rate; if (r.method === 'md') return r.rate!; return TB[TB.length - 1].rate; };
const t16 = K.pct(TB[TB.length - 1].rate, 0);
const hiRate = Math.max(...K.ESTATE_CODES.map(maxRate)), loRate = Math.min(...K.ESTATE_CODES.map(maxRate));
const names = (r: number) => K.ESTATE_CODES.filter((c) => maxRate(c) === r).map(K.nameOf).join(' and ');
const methodName: Record<string, string> = { excess: 'table on the amount above the exemption', whole: 'table on the whole estate once over the exemption', sdtc: 'old federal credit table, minus a credit', ma: 'old federal credit table, minus a credit', ny: `own table, credit phased out to ${K.pct(K.E.NY.cliff!, 0)}`, il: 'old federal credit table, interrelated', md: `lesser of ${K.pct(K.E.MD.rate!, 0)} of the excess and the old credit` };
const e1 = 16000000, e2 = 20000000, e3 = 40000000;

export default defineGuide({
  id: 'estate-tax-rates',
  group: 'federal',
  order: 110,
  slug: 'estate-tax-rates',
  nav: 'Estate tax rates',
  card: `The federal schedule from ${K.pct(RT[0].rate, 0)} to ${K.pct(top, 0)}, and the top rate of each state`,
  title: `Estate Tax Rates 2026: Federal ${K.pct(top, 0)} Schedule and State Rates`,
  description: `Estate tax rates 2026: the federal schedule of section 2001(c) from ${K.pct(RT[0].rate, 0)} to ${K.pct(top, 0)}, why only ${K.pct(top, 0)} applies above ${K.usd(ex)}, and the 13 top state rates.`,
  h1: 'Estate tax rates in 2026: federal and state',
  intro: `The federal rate schedule has twelve brackets, but an estate that owes federal tax in 2026 pays ${K.pct(top, 0)} on every dollar above the exemption. State rates are lower at the top and start much sooner. Try an amount below.`,
  facts: [['Federal rate above the exclusion', K.pct(top, 0)], ['Brackets in the schedule', String(RT.length)], ['Highest state rate', K.pct(hiRate, 0)], ['Federal exclusion', K.usd(ex)]],
  resume: `The federal estate tax schedule of section 2001(c) starts at ${K.pct(RT[0].rate, 0)} on the first ${K.usd(RT[1].from)} and climbs through ${RT.length} brackets to ${K.pct(top, 0)} above ${K.usd(RT[RT.length - 1].from)}. Those lower brackets never produce a bill on their own. The tax is computed on the whole taxable estate and then reduced by a credit equal to the tax on the ${K.usd(ex)} exclusion, ${K.usd(F.basicCredit)} in 2026, and since the exclusion lies far above ${K.usd(RT[RT.length - 1].from)}, the credit absorbs every lower bracket. The result is a flat ${K.pct(top, 0)} on the part of the estate above the exclusion: ${K.usd(fedOn(e1))} on ${K.usd(e1)}, ${K.usd(fedOn(e2))} on ${K.usd(e2)}. The same schedule applies to lifetime gifts. State rates work differently. Most states tax from their own, much lower exemption, with brackets that rise to a top rate between ${K.pct(loRate, 0)} in ${names(loRate)} and ${K.pct(hiRate, 0)} in ${names(hiRate)}, and the state tax is deductible from the federal base.`,
  body: (h) => `
<h2>The federal schedule, bracket by bracket</h2>
<p>Section 2001(c) of the Internal Revenue Code prints the schedule as a table of base amounts and marginal rates, reproduced from the ${h.src('usc_2001', 'statute')}. It is also Table A of the ${h.src('irs_i706', 'Form 706 instructions')}. Each line reads: over this amount, the tax is the base plus the rate on the excess.</p>
${h.table(['Taxable amount over', 'Tax on that amount', 'Rate on the excess'], RT.map((r) => [K.usd(r.from), K.usd(r.base), K.pct(r.rate, 0)]), 'Unified rate schedule, 26 U.S.C. 2001(c), unchanged by Public Law 119-21.', ['l', 'r', 'r'])}
<p>Public Law 119-21 left the schedule as it was. What changed in 2026 is the exclusion, and with it the credit. Public Law 119-21 raised the basic exclusion to ${K.usd(ex)}; the tentative tax on that amount is ${K.usd(K.tentativeTax(ex))}, which is the basic credit. Every bracket below ${K.pct(top, 0)} is inside the exclusion, so it is cancelled by the credit for every estate.</p>
<h2>Why the effective rate is ${K.pct(top, 0)} or nothing</h2>
<p>Take an estate of ${K.usd(e1)} with no lifetime taxable gifts. The tentative tax on ${K.usd(e1)} is ${K.usd(K.tentativeTax(e1))}. Subtracting the credit of ${K.usd(F.basicCredit)} leaves ${K.usd(fedOn(e1))}, exactly ${K.pct(top, 0)} of the ${K.usd(e1 - ex)} above the exclusion. An estate of ${K.usd(e3)} owes ${K.usd(fedOn(e3))}, which is ${K.pct(fedOn(e3) / e3)} of the whole estate but still ${K.pct(top, 0)} of the excess. There is no progressivity above the exclusion: the tax is a flat rate on a single slice.</p>
${h.mini('fed', { t: 'Federal tax at a given estate size', p: ['estate'], d: { estate: e2 } })}
<p>Two things lower the base before the rate applies. Debts, funeral and administration expenses, the marital deduction for what passes to a citizen spouse, and the charitable deduction come off the gross estate. State estate and inheritance taxes actually paid are deductible too, under ${h.src('usc_2058', 'section 2058')}. A New York estate that pays state tax therefore pays federal tax on a smaller amount, so a dollar of state tax costs the family about ${K.pct(1 - top, 0)} of a dollar once the estate is above the federal line.</p>
<h2>Lifetime gifts use the same schedule</h2>
<p>The gift tax shares the schedule and the exclusion. Taxable gifts above the annual exclusion are added up over the years; tax is owed only when the total exceeds the basic exclusion, and then at ${K.pct(top, 0)}. At death the adjusted taxable gifts are added to the taxable estate before the schedule is applied, and gift tax that would have been payable on them is subtracted, so the same dollar is never taxed twice. The ${h.a('gift-tax', 'gift tax page')} follows a gift through Form 709.</p>
<h2>Top state rates next to ${K.pct(top, 0)}</h2>
<p>State estate taxes are graduated in earnest because they start low: an Oregon estate is taxed from ${K.usd(K.E.OR.exemption)}, a Massachusetts estate from ${K.usd(K.E.MA.exemption)}. The top rates are lower than the federal rate, but they apply to amounts the federal tax never reaches.</p>
${h.table(['Jurisdiction', 'Method', 'Top rate', 'Tax on ' + K.usd(e2)], K.ESTATE_CODES.map((c) => [K.nameOf(c), methodName[K.E[c].method], K.pct(maxRate(c), 1), K.usd(K.stateTax(c, e2))]), `Highest marginal rate reached by each state's own computation for a death in 2026, and the state tax of a resident on a ${K.usd(e2)} taxable estate, against a federal tax of ${K.usd(fedOn(e2))} before the state tax deduction. Washington: deaths from July 1, 2026.`, ['l', 'l', 'r', 'r'])}
<p>Several states still use the old federal credit for state death taxes, printed on their forms as Table B, whose top rate is ${t16}. Massachusetts and Rhode Island apply it and subtract a fixed credit; Illinois applies it with a formula in which the tax is deductible from its own base; Maryland takes the lower of that table and ${K.pct(K.E.MD.rate!, 0)} of the amount above its exemption. Washington has its own table, which changed for deaths on or after July 1, 2026; ${h.a('washington-estate-tax', 'the Washington page')} shows both. Connecticut taxes at a single rate of ${K.pct(K.E.CT.table![0].rate, 0)} above its exemption, with a cap on the total tax.</p>
<h2>Rates do not change with the heir</h2>
<p>The federal estate tax and the state estate taxes are charged on the estate as a whole, before anything is distributed. The rate does not depend on who inherits: a child, a nephew and a friend bear the same ${K.pct(top, 0)} once the estate is above the exclusion. Only the spouse and charities change the result, because what passes to them is deducted from the base. Rates that do vary with the relationship belong to the inheritance taxes of Pennsylvania, New Jersey, Kentucky, Nebraska and Maryland, which are charged on each heir's share; they are compared on ${h.a('inheritance-tax-by-state', 'the inheritance tax page')}.</p>
<h2>Combined rate on the last dollar</h2>
<p>For an estate above the federal exclusion in a state with an estate tax, the last dollar bears both taxes, but the state tax reduces the federal base. With a state marginal rate s, the combined marginal rate is s plus ${K.pct(top, 0)} of what remains: at a ${t16} state rate, about ${K.pct(TB[TB.length - 1].rate + top * (1 - TB[TB.length - 1].rate), 1)}. Below the federal exclusion the state rate is the whole story. The ${h.a('state-estate-tax', 'state estate tax page')} gives the method of each state in detail.</p>
`,
  faqs: [
    { q: `Why does an estate never pay the ${K.pct(RT[0].rate, 0)} federal bracket?`, a: `Because the credit equals the tentative tax on the ${K.usd(ex)} exclusion, which already includes every bracket from ${K.pct(RT[0].rate, 0)} up. The schedule reaches ${K.pct(top, 0)} at ${K.usd(RT[RT.length - 1].from)}, so only the part of the estate above the exclusion is left after the credit, and it is taxed at ${K.pct(top, 0)} throughout.` },
    { q: `How much federal estate tax does a ${K.usd(e2)} estate owe in 2026?`, a: `${K.usd(fedOn(e2))} for a single person with no lifetime taxable gifts: ${K.pct(top, 0)} of the ${K.usd(e2 - ex)} above the exclusion. State estate taxes paid are deducted first, so a resident of a taxing state owes somewhat less federal tax. A widowed person with a DSUE amount from the late spouse can owe nothing at all.` },
    { q: 'Which state has the highest estate tax rate in 2026?', a: `${names(hiRate)}, both at ${K.pct(hiRate, 0)} at the top. Hawaii reaches it above ${K.usd(K.E.HI.table![K.E.HI.table!.length - 1].from)} of estate beyond the exclusion; Washington above ${K.usd(K.E.WA.table![K.E.WA.table!.length - 1].from)}, for deaths from July 1, 2026. Before that date the Washington table topped out at ${K.pct(K.E.WA.firstHalf!.table[K.E.WA.firstHalf!.table.length - 1].rate, 0)}. Most other states stop at ${t16}.` },
    { q: 'Is state estate tax deductible on the federal estate tax return?', a: `Yes. Section 2058 allows a deduction for estate, inheritance, legacy or succession taxes actually paid to a state on property in the gross estate. The deduction lowers the base taxed at ${K.pct(top, 0)}. It only matters for estates above the federal exclusion; below it there is no federal tax to reduce.` },
  ],
  tool: 'fed',
  toolArg: { estate: e2 },
  related: ['estate-tax-exemption', 'state-estate-tax', 'gift-tax', 'washington-estate-tax', 'massachusetts-estate-tax', 'portability'],
  sources: ['usc_2001', 'irs_i706', 'usc_2058', 'pl_119_21', 'wa_tables'],
});
