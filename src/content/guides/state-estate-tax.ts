import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const C = K.ESTATE_CODES;
const TB = K.P.tableB;
/** Top marginal rate printed in each state's own schedule (Table B for the states that still use it). */
const topRate = (st: string) => { const t = E[st].table; if (t) return t[t.length - 1].rate; if (st === 'MD') return E.MD.rate!; return TB[TB.length - 1].rate; };
const methodLabel = (st: string) => ({ excess: 'rate on the excess', whole: 'brackets from the exemption up', sdtc: 'Table B less a credit', ma: 'Table B less a credit', ny: `credit phased out by ${K.pct(E.NY.cliff!, 0)}`, il: 'interrelated Table B', md: `lesser of ${K.pct(E.MD.rate!, 0)} or Table B` } as Record<string, string>)[E[st].method];
const carry = (st: string) => (E[st].portability === 'yes' ? 'yes' : E[st].portability === 'no' ? 'no' : 'none published');
const sizes = [5000000, 8000000, 12000000];
const bill = (st: string, x: number) => K.stateTax(st, x);
const rank = (x: number) => [...C].sort((a, b) => bill(b, x) - bill(a, x));
const at5 = rank(5000000), at12 = rank(12000000);
const zeroAt5 = C.filter((c) => bill(c, 5000000) === 0);
const changed = C.filter((c) => E[c].prev !== E[c].exemption);
const flat = C.filter((c) => E[c].prev === E[c].exemption);
const lowest = [...C].sort((a, b) => E[a].exemption - E[b].exemption);
const names = (l: string[]) => l.map((c) => E[c].name).join(', ').replace(/, ([^,]*)$/, ' and $1');
const fedAt12 = K.federalEstateTax({ taxableEstate: 12000000, gifts: 0, dsue: 0 }).tax;

export default defineGuide({
  id: 'state-estate-tax',
  group: 'estate',
  order: 200,
  slug: 'state-estate-tax',
  nav: 'All state estate taxes',
  card: 'The 13 exemptions, rates and methods, with the tax on 5, 8 and 12 million',
  title: 'State Estate Tax 2026: Exemptions, Rates and Tax by State',
  description: `State estate tax 2026: exemptions from ${K.usd(E[lowest[0]].exemption)} to ${K.usd(E.CT.exemption)}, rates, methods and the tax all 13 jurisdictions take from a 5, 8 or 12 million estate.`,
  h1: 'State estate tax in 2026: the 13 jurisdictions compared',
  intro: `Twelve states and the District of Columbia charge their own estate tax for deaths in 2026, each with its exemption, its table and its way of reading that table. Enter an estate and a state to see the bill, then compare the same estate across all thirteen below.`,
  facts: [['Jurisdictions', String(C.length)], ['Lowest exemption', `${K.usd(E[lowest[0]].exemption)} (${E[lowest[0]].name})`], ['Highest exemption', `${K.usd(E.CT.exemption)} (Connecticut)`], ['Spouse carryover', 'Hawaii and Maryland']],
  resume: `In 2026 an estate tax is charged at death in ${names(C)}. The exemption decides whether anything is owed and runs from ${K.usd(E[lowest[0]].exemption)} in ${E[lowest[0]].name} to ${K.usd(E.CT.exemption)} in Connecticut, which ties its figure to the federal basic exclusion. Top marginal rates sit between ${K.pct(topRate('ME'), 0)} in Connecticut and Maine and ${K.pct(topRate('WA'), 0)} in Hawaii and Washington for deaths from July 1, 2026, with most states at ${K.pct(topRate('MA'), 0)}. The same ${K.usd(5000000)} estate owes ${K.usd(bill(at5[0], 5000000))} in ${E[at5[0]].name} and nothing in ${zeroAt5.length} jurisdictions, among them ${names(zeroAt5.slice(0, 3))}. At ${K.usd(12000000)} the largest bill is ${E[at12[0]].name}'s ${K.usd(bill(at12[0], 12000000))}, against a federal tax of ${K.usd(fedAt12)} on that amount. Only Hawaii and Maryland let a surviving spouse use the unused state exemption of the first spouse. ${changed.length} jurisdictions raised their exemption for 2026; ${names(flat)} kept the 2025 figure.`,
  body: (h) => `
<h2>The thirteen schedules for 2026</h2>
<p>Each row below was read on the revenue department's page, the return instructions or the statute of the jurisdiction, and each state has its own page on this site with the source cited. The exemption is the amount at which the tax starts for a death in 2026. The method column matters as much as the exemption, because two states with the same threshold can produce very different bills on the same estate.</p>
${h.table(['Jurisdiction', '2026 exemption', '2025 exemption', 'Top rate', 'Method', 'Spouse carryover', 'Return due'], C.map((c) => [E[c].name, K.usd(E[c].exemption), K.usd(E[c].prev), K.pct(topRate(c), topRate(c) * 1000 % 10 ? 1 : 0), methodLabel(c), carry(c), `${E[c].dueMonths} months`]), `Deaths in 2026. Washington: ${K.usd(E.WA.firstHalf!.exemption)} for deaths from January 1 to June 30. Read on ${K.day(K.P.retrieved_at)}.`, ['l', 'r', 'r', 'r', 'l', 'l', 'r'])}
<h2>One estate, thirteen bills</h2>
<p>The next table runs the engine of this site on three estate sizes, for an unmarried resident with no lifetime gifts and no property in another state. These are the taxable estates after debts, costs and charitable gifts. They show what a single rate per state hides.</p>
${h.table(['Jurisdiction', ...sizes.map((x) => K.usd(x))], C.map((c) => [E[c].name, ...sizes.map((x) => K.usd(bill(c, x)))]), 'State estate tax only, computed with each 2026 schedule; deaths from July 1 for Washington.', ['l', 'r', 'r', 'r'])}
<p>At ${K.usd(5000000)} the ranking is led by ${names(at5.slice(0, 3))}: low exemptions bite hardest on mid-sized estates. At ${K.usd(12000000)} the order shifts toward the states whose rates climb highest, ${names(at12.slice(0, 3))}. Connecticut stays at zero across the three sizes, since its threshold equals the federal exclusion. Above that line both governments tax, and the state tax is deducted from the federal base under section 2058 of the Internal Revenue Code.</p>
${h.mini('estate', { t: 'Run your own estate through a state', p: ['estate', 'st'], d: { estate: 6000000, st: 'MA' } })}
<h2>Why published tables rarely agree</h2>
<p>Most charts of state estate taxes are compiled once and updated late. It is still common to find tables quoting 2018 or 2025 figures under a current headline, a federal exemption that is several million dollars too low, or a Connecticut exemption taken from an earlier year. For 2026, ${changed.length} jurisdictions moved their exemption: ${names(changed)}. Washington moved twice within twelve months, and Kentucky changed its inheritance tax classes. A chart that leaves out one of these updates misstates the tax on the very estates near the threshold, where the error matters most.</p>
<p>A second source of disagreement is method. Several summaries print one percentage per state, for instance a top rate of ${K.pct(topRate('MA'), 0)}, and let readers multiply. That reading is wrong for at least five jurisdictions. Massachusetts and Rhode Island compute a credit from the federal Table B of 2001 and then subtract a fixed amount. Illinois iterates because its tax is deductible from its own base. Maryland compares two computations and keeps the smaller. New York removes its credit as the estate grows past the exemption. The table above is computed, not copied, so each bill follows the state's own worksheet.</p>
<h2>Four families of computation</h2>
<p><strong>Tax on the excess.</strong> ${names(C.filter((c) => E[c].method === 'excess'))} apply a schedule to the part of the estate above the exemption. Connecticut and Vermont use a single rate; the others have brackets. Connecticut also caps the combined estate and gift tax at ${K.usd(E.CT.cap!)}.</p>
<p><strong>Brackets fixed in dollars, starting at the exemption.</strong> The District of Columbia and Oregon print a table whose first line opens at the exemption with a tax of zero, while the later lines start at round amounts such as ${K.usd(E.OR.table![1].from)} in Oregon or ${K.usd(E.DC.table![1].from)} in the District. The first band is therefore narrow in the District and wide in Oregon.</p>
<p><strong>The old federal credit.</strong> The federal estate tax once gave a credit for state death taxes, read on Table B; section 2058 now gives a deduction instead. Massachusetts, Rhode Island, Illinois and Maryland still compute their tax from that table, each with its own adjustment: a fixed credit of ${K.usd(E.MA.credit!)} in Massachusetts and ${K.usd(E.RI.credit!)} in Rhode Island, an interrelated computation in Illinois, a ceiling of ${K.pct(E.MD.rate!, 0)} of the excess in Maryland.</p>
<p><strong>The New York cliff.</strong> New York uses its own table and a credit that shrinks to zero at ${K.pct(E.NY.cliff!, 0)} of the exclusion, so an estate slightly above ${K.usd(E.NY.exemption)} pays tax from the first dollar. The ${h.a('new-york-estate-tax-cliff', 'cliff page')} shows the band step by step.</p>
<h2>Who is taxed: domicile and property</h2>
<p>A state taxes the estate of a person domiciled there, meaning the place the person treated as a permanent home, and the real estate and tangible property located there of anyone else. Most states then apportion: they compute the tax as if everything were taxable and multiply it by the share of the gross estate they have jurisdiction over. New York and Massachusetts instead leave property outside their reach out of the base. A resident of a state without an estate tax who owns a vacation home in Oregon or Massachusetts can therefore owe that state's tax; the rules are on ${h.a('property-in-another-state', 'property in another state')}, and the states with no tax at all are listed on ${h.a('states-without-estate-tax', 'states without estate tax')}.</p>
<h2>Couples, gifts and the second death</h2>
<p>A transfer to a spouse who is a US citizen is deducted in every jurisdiction, so the first death of a married couple rarely owes state tax. The exposure moves to the second death. Federal portability lets the survivor add the unused federal exclusion, but among the states only Hawaii and Maryland have a comparable rule; New York, Illinois and Washington refuse it in their instructions, and the others publish none. The comparison with and without a trust at the first death is on ${h.a('married-couples-state-estate-tax', 'married couples')}. Lifetime gifts are the other lever: Connecticut taxes them, New York and Minnesota add back the last three years, Vermont two and Maine one (${h.a('gifts-and-state-estate-tax', 'gifts and state estate tax')}).</p>
<h2>A return can be due when no tax is</h2>
<p>Filing thresholds usually look at the gross estate, before the marital and charitable deductions, sometimes with lifetime gifts added. An estate that leaves everything to a surviving spouse can therefore have to file in Massachusetts, Maryland or Maine while owing nothing. Deadlines run from nine months after death in most states to ${E.CT.dueMonths} months in Connecticut, ${E.DC.dueMonths} months in the District and ${E.OR.dueMonths} months in Oregon; the full calendar, federal return included, is on ${h.a('estate-tax-return-deadline', 'estate tax return deadlines')}. Everything here is an estimate built to compare situations, not a substitute for the return or for an estate attorney's reading of a particular estate.</p>
`,
  faqs: [
    { q: 'Which state estate tax exemption changed the most for 2026?', a: `Connecticut, which rose from ${K.usd(E.CT.prev)} to ${K.usd(E.CT.exemption)} because its statute follows the federal basic exclusion. ${names(changed.filter((c) => c !== 'CT'))} also moved, by inflation indexing. ${names(flat)} kept the same exemption as in 2025; for Washington that is true for deaths from July 1, after an indexed ${K.usd(E.WA.firstHalf!.exemption)} in the first half of 2026.` },
    { q: 'Why do state estate tax charts give different numbers for the same state?', a: `Mostly because of age: many charts still print 2018 or 2025 exemptions, and Washington changed its law twice in a year. The other cause is method. A single rate cannot reproduce the Massachusetts and Rhode Island credits, the Illinois interrelated computation, the Maryland comparison or the New York cliff, so a chart that multiplies a rate by the estate gives the wrong tax.` },
    { q: 'Does paying a state estate tax lower the federal estate tax?', a: `Only above the federal exclusion. Section 2058 of the Internal Revenue Code deducts estate, inheritance and similar death taxes paid to any state from the federal taxable estate, which helps estates larger than ${K.usd(K.F.basicExclusion)}. Below that amount there is no federal tax to reduce, and the state tax is a full cost to the heirs.` },
    { q: 'Do state estate taxes count life insurance and annuities?', a: `Yes, when they are in the federal gross estate, which is where every state starts. The IRS lists cash and securities, real estate, insurance, trusts, annuities and business interests among the property counted, at fair market value on the date of death. Insurance and annuities paid to a named beneficiary can therefore push a modest estate over a ${K.usd(E.MA.exemption)} or ${K.usd(E.OR.exemption)} state threshold.` },
    { q: 'Can a widow or widower carry over a state exemption?', a: `Only in Hawaii and Maryland. Each caps the carryover at its own exemption, ${K.usd(E.HI.exemption)} and ${K.usd(E.MD.exemption)}, and requires the election on a timely state return of the first spouse to die. New York, Illinois and Washington say in their instructions that the federal portability election does not apply, and the remaining states publish no such rule.` },
  ],
  tool: 'estate',
  toolArg: { estate: 8000000, st: 'MA' },
  related: ['new-york-estate-tax', 'massachusetts-estate-tax', 'washington-estate-tax', 'states-without-estate-tax', 'inheritance-tax-by-state', 'married-couples-state-estate-tax'],
  sources: ['ny_dtf', 'ma_dor', 'wa_tables', 'ct_drs', 'dc_d76', 'or_706i', 'md_met1', 'il_fact', 'me_mrs', 'mn_291_03', 'ri_706', 'vt_tax', 'hi_m6'],
});
