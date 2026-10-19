import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const MA = K.E.MA;
const th = MA.exemption, credit = MA.credit!;
const tax = (x: number) => K.stateTax('MA', x);
const sizes = [2000000, 2100000, 2500000, 3000000, 5000000, 10000000];
const resFl = K.computeCase({ estate: 6000000, st: 'MA', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'FL', reValue: 1500000 });
const nrCape = K.computeCase({ estate: 9000000, st: 'NY', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'MA', reValue: 1500000 });
const nrBig = K.computeCase({ estate: 9000000, st: 'FL', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'MA', reValue: 3000000 });
const TB = K.P.tableB;

export default defineGuide({
  id: 'massachusetts-estate-tax',
  group: 'estate',
  order: 235,
  slug: 'massachusetts-estate-tax',
  nav: 'Massachusetts',
  card: `${K.usd(th)} threshold, Table B less ${K.usd(credit)}, out-of-state property left out`,
  title: `Massachusetts Estate Tax 2026: $${K.dec(th / 1e6, 1)} Million Threshold`,
  description: `Massachusetts estate tax 2026: ${K.usd(th)} threshold, Table B credit less ${K.usd(credit)}, no cliff since 2023, property outside the state left out, M-706 in 9 months.`,
  h1: 'Massachusetts estate tax in 2026',
  intro: `Massachusetts taxes estates above ${K.usd(th)} with the federal credit table of 2000 and a fixed credit of ${K.usd(credit)}. Enter the amount subject to Massachusetts estate tax to see the tax for a death in 2026.`,
  facts: [['Filing threshold', K.usd(th)], ['Fixed credit', K.usd(credit)], ['Top rate of Table B', K.pct(TB[TB.length - 1].rate, 0)], ['Form M-706 due', `${MA.dueMonths} months`]],
  resume: `A Massachusetts estate tax return is required for a death in 2026 when the gross estate plus adjusted taxable gifts exceeds ${K.usd(th)}, a threshold in force since January 1, 2023. The tax is the maximum credit for state death taxes of the federal law as it stood on December 31, 2000, read on Table B for the amount subject to Massachusetts estate tax less ${K.usd(60000)}, minus a fixed Massachusetts credit of ${K.usd(credit)}. That credit equals the Table B amount at ${K.usd(th)}, so the tax starts from zero at the threshold and climbs steadily: ${K.usd(tax(2500000))} on ${K.usd(2500000)}, ${K.usd(tax(5000000))} on ${K.usd(5000000)}, ${K.usd(tax(10000000))} on ${K.usd(10000000)}. For deaths on or after August 1, 2025, a resident's real estate and tangible property outside Massachusetts are left out of the computation, and a nonresident is taxed only on Massachusetts real estate and tangible property. Form M-706 is due nine months after death, with an automatic six-month extension when 80 % of the tax is paid on time.`,
  body: (h) => `
<h2>The computation since August 1, 2025</h2>
<p>The Department of Revenue's estate tax guide, updated in April 2026, gives the steps for a resident who died on or after August 1, 2025 (${h.src('ma_dor', 'Massachusetts estate tax guide')}). Start from the federal gross estate as defined by the Internal Revenue Code in effect on December 31, 2000. Subtract real and tangible property located outside Massachusetts. Add any Massachusetts QTIP assets from a predeceased spouse's return. Subtract the deductions allowed for Massachusetts purposes, such as debts, costs, the marital deduction and charitable gifts: the result is the amount subject to Massachusetts estate tax. Then compute the federal credit for state death taxes with Table B on that amount less ${K.usd(60000)}, and subtract ${K.usd(credit)}. The result, never below zero, is the tax.</p>
${h.table(['Amount subject to Massachusetts tax', 'Table B credit', 'Massachusetts tax', 'Average rate'], sizes.map((x) => [K.usd(x), K.usd(K.tableB(x - 60000)), K.usd(tax(x)), K.pct(tax(x) / x)]), 'Resident, all property in Massachusetts, deaths in 2026.', ['l', 'r', 'r', 'r'])}
<p>The ${K.usd(credit)} is not an arbitrary number: it is exactly the Table B credit on an estate of ${K.usd(th)}. Below the threshold the subtraction leaves nothing, and just above it the tax grows at the Table B marginal rate of ${K.pct(TB[9].rate, 1)}, then faster as the estate climbs through the brackets to ${K.pct(TB[TB.length - 1].rate, 0)} above ${K.usd(TB[TB.length - 1].from + 60000)}.</p>
${h.mini('state', { t: 'Massachusetts tax on another amount', p: ['estate'], d: { st: 'MA', estate: 4000000 } })}
<h2>No more cliff at the threshold</h2>
<p>For deaths from 2016 through 2022 the threshold was ${K.usd(1000000)} and there was no fixed credit, so an estate barely over the line owed the Table B credit on its whole value. The 2023 law raised the threshold to ${K.usd(th)} and added the ${K.usd(credit)} credit under chapter 65C, section 2A(f). An estate of ${K.usd(2100000)} now owes ${K.usd(tax(2100000))}. Older articles that describe a Massachusetts cliff are describing the rules before 2023.</p>
<h2>Residents with property in another state</h2>
<p>Since August 1, 2025, real estate and tangible property located outside Massachusetts are removed from the computation altogether, rather than reducing the tax by a ratio. A resident with a ${K.usd(6000000)} estate that includes a ${K.usd(1500000)} condominium in Florida is taxed as if the estate were ${K.usd(4500000)}: ${K.usd(resFl.home!.tax)} instead of ${K.usd(tax(6000000))}. For deaths from January 1, 2023 to July 31, 2025 a different method applied; the Department's FAQ on the 2023 changes describes it.</p>
<h2>Nonresidents with a house in Massachusetts</h2>
<p>A nonresident who owned real estate or tangible property in Massachusetts must file when the total worldwide estate plus adjusted taxable gifts exceeds ${K.usd(th)}, using Form M-706 with the nonresident decedent affidavit, Form M-NRA. The tax, however, is computed only on the Massachusetts real and tangible property, less the federal deductions directly related to it, with the same Table B and the same ${K.usd(credit)} credit. The result can be surprising. A New York resident with a ${K.usd(9000000)} estate and a ${K.usd(1500000)} house on Cape Cod must file, yet owes ${K.usd(nrCape.other?.tax ?? 0)}, because the Massachusetts property alone is below ${K.usd(th)}. A Florida resident whose Massachusetts property is worth ${K.usd(3000000)} owes ${K.usd(nrBig.other?.tax ?? 0)}. Other states' rules for out-of-state owners are on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Federal changes have no effect</h2>
<p>The guide is explicit that changes to the federal estate tax after December 31, 2000 have no impact on the Massachusetts estate tax. The federal basic exclusion of ${K.usd(K.F.basicExclusion)} for 2026, portability between spouses and the federal rate schedule play no part in the computation. The Table B worksheet itself comes from the July 1999 revision of the federal Form 706 instructions and is reprinted on page 6 of Form M-706, so the bracket amounts never change from one year to the next. The guide describes no carryover of an unused threshold between spouses either: a couple who leave everything to each other give the survivor a single ${K.usd(th)} threshold, a situation discussed on ${h.a('married-couples-state-estate-tax', 'married couples and state estate tax')}.</p>
<h2>Filing and paying</h2>
<p>The return and the payment are due nine months after the date of death. Since December 5, 2016 every filer receives an automatic six-month extension of time to file, provided at least 80 % of the tax finally due has been paid by the payment due date. Returns and the M-NRA can be filed through MassTaxConnect. Massachusetts QTIP elections made at the first death bring the trust back into the second estate, as the computation above shows.</p>
`,
  faqs: [
    { q: 'Does Massachusetts still have an estate tax cliff in 2026?', a: `No. Since January 1, 2023 the threshold is ${K.usd(th)} and a fixed credit of ${K.usd(credit)}, equal to the Table B credit at that amount, is subtracted from the tax. An estate just over ${K.usd(th)} therefore owes a small tax, ${K.usd(tax(2100000))} at ${K.usd(2100000)}, not a tax on its whole value as before 2023.` },
    { q: 'Is a Massachusetts resident\'s Florida home subject to the Massachusetts estate tax?', a: `Not for deaths on or after August 1, 2025. Real estate and tangible property located outside Massachusetts are subtracted from the federal gross estate before the tax is computed. The rest of the estate, including bank and brokerage accounts wherever held, remains in the Massachusetts computation.` },
    { q: 'Why must a nonresident file a Massachusetts return and still owe nothing?', a: `The filing test uses the worldwide estate plus adjusted taxable gifts, above ${K.usd(th)}, while the tax uses only Massachusetts real and tangible property. When that property is worth ${K.usd(th)} or less, Table B minus the ${K.usd(credit)} credit gives zero, even though an M-706 and an M-NRA are required.` },
    { q: 'What extension does Massachusetts give for the estate tax return?', a: `An automatic six months to file, beyond the nine-month due date, for every estate that has paid at least 80 % of the tax finally due by the original payment date. Interest runs on any tax paid late. The extension has applied automatically since December 5, 2016, with no separate request required by the guide.` },
  ],
  tool: 'state',
  toolArg: { st: 'MA', estate: 3000000 },
  related: ['state-estate-tax', 'rhode-island-estate-tax', 'property-in-another-state', 'married-couples-state-estate-tax', 'new-york-estate-tax', 'maine-estate-tax'],
  sources: ['ma_dor'],
});
