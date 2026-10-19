import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

type Rel = Parameters<typeof K.inhTax>[1];
const run = (st: string, estate: number, heir: Rel) => K.computeCase({ estate, st, married: false, toSpouse: 'none', heir, heirs: 2 });
const CASES: Array<[string, string, number, Rel, string]> = [
  ['Pennsylvania', 'PA', 3000000, 'child', 'two children'],
  ['New Jersey', 'NJ', 3000000, 'nephew', 'two nephews'],
  ['New York', 'NY', 8000000, 'child', 'two children'],
  ['Massachusetts', 'MA', 3000000, 'child', 'two children'],
  ['Maryland', 'MD', 7000000, 'nephew', 'two nephews'],
  ['Maryland', 'MD', 7000000, 'child', 'two children'],
  ['Florida', 'FL', 8000000, 'nephew', 'two nephews'],
];
const rows = CASES.map(([n, st, e, rel, who]) => { const r = run(st, e, rel); return [`${n}, ${K.usd(e)} to ${who}`, K.usd(r.stateTotal), K.usd(r.inhTotal), K.usd(r.fed.tax)]; });
const pa = run('PA', 3000000, 'child'), ma = run('MA', 3000000, 'child');
const mdN = run('MD', 7000000, 'nephew'), mdC = run('MD', 7000000, 'child');
const both = K.ESTATE_CODES.filter((c) => K.INHERITANCE_CODES.includes(c));

export default defineGuide({
  id: 'estate-tax-vs-inheritance-tax',
  group: 'inheritance',
  order: 370,
  slug: 'estate-tax-vs-inheritance-tax',
  nav: 'Estate tax vs inheritance tax',
  card: 'Who pays, on what, at which rate: the two death taxes compared with figures',
  title: 'Estate Tax vs Inheritance Tax 2026: Who Pays and How Much',
  description: 'Estate tax vs inheritance tax in 2026: one taxes the whole estate above a threshold, the other each heir by relationship. Seven worked cases; Maryland has both.',
  h1: 'Estate tax vs inheritance tax',
  intro: `An estate tax is charged on everything the deceased left; an inheritance tax is charged on each person who receives a share. Enter an estate, a state and the heirs to see which of the two applies, or both.`,
  facts: [['Estate tax jurisdictions', String(K.ESTATE_CODES.length)], ['Inheritance tax states', String(K.INHERITANCE_CODES.length)], ['Both', both.map(K.nameOf).join(', ')], ['Federal', 'estate tax only']],
  resume: `The two taxes look alike on a family's bank statement, since both are paid after a death, but they are built differently. An estate tax is charged on the estate as a whole, after debts and deductions, once it crosses a threshold: ${K.usd(K.F.basicExclusion)} for the federal tax in 2026, from ${K.usd(K.E.OR.exemption)} in Oregon to ${K.usd(K.E.CT.exemption)} in Connecticut for the ${K.ESTATE_CODES.length} state-level jurisdictions. The executor files one return and pays from the estate. An inheritance tax is charged on each beneficiary's share, at a rate set by the relationship to the deceased, often from the first dollar and whatever the size of the estate; it exists in ${K.INHERITANCE_CODES.length} states. A spouse is exempt from both everywhere. Pennsylvania takes ${K.usd(pa.inhTotal)} from ${K.usd(3000000)} left to two children, while Massachusetts takes ${K.usd(ma.stateTotal)} in estate tax from the same estate. Maryland applies both and lets the inheritance tax reduce the estate tax.`,
  body: (h) => `
<h2>Side by side</h2>
${h.table(['', 'Estate tax', 'Inheritance tax'], [
  ['Charged on', 'The whole taxable estate', 'Each beneficiary’s share'],
  ['Threshold', 'Yes, a single exemption for the estate', 'Per heir, often none'],
  ['Rate depends on', 'Size of the estate', 'Relationship of the heir'],
  ['Spouse', 'Deducted (marital deduction)', 'Exempt in all five states'],
  ['Children', 'Taxed only if the estate is over the threshold', 'Exempt except in Pennsylvania and Nebraska'],
  ['Return filed by', 'The executor', 'The executor or personal representative, sometimes the heir'],
  ['Levied by', `Federal government and ${K.ESTATE_CODES.length} jurisdictions`, `${K.INHERITANCE_CODES.length} states`],
], 'How the two kinds of death tax differ, deaths in 2026.', ['l', 'l', 'l'])}
<p>The federal government has only an estate tax. The ${K.ESTATE_CODES.length} jurisdictions with an estate tax are ${K.ESTATE_CODES.map(K.nameOf).join(', ')}; the ${K.INHERITANCE_CODES.length} with an inheritance tax are ${K.INHERITANCE_CODES.map(K.nameOf).join(', ')}. ${both.map(K.nameOf).join(' and ')} appears on both lists.</p>
<h2>The same families, seven situations</h2>
<p>Each line is an unmarried resident of the state who leaves the estate in two equal shares. The engine applies the state's estate tax, its inheritance tax per heir, and the federal estate tax with state death taxes deducted.</p>
${h.table(['Situation', 'State estate tax', 'Inheritance tax, both heirs', 'Federal estate tax'], rows, 'Deaths in 2026, net estates after debts and expenses. Computed by the engine of this site.', ['l', 'r', 'r', 'r'])}
<p>The lines show the main practical difference. In an inheritance tax state the size of the estate hardly matters and the family tree decides: the Pennsylvania children pay on every dollar of a ${K.usd(3000000)} estate that Florida, New Jersey or the federal government would not tax at all, and the New Jersey nephews pay far more than children would. In an estate tax state the family tree hardly matters and the size decides: the Massachusetts children pay because ${K.usd(3000000)} is above the state's ${K.usd(K.E.MA.exemption)} threshold, and they would pay the same as nephews. The New York line adds a third effect: an estate tax state can tax a large estate heavily even when the heirs are the closest relatives, because the exemption, not the relationship, is the only gate.</p>
${h.mini('estate', { t: 'Estate tax, inheritance tax, or both?', p: ['estate', 'st', 'heir'], d: { st: 'MD', estate: 7000000, heir: 'nephew', ms: 'no' } })}
<h2>Maryland, the state with both</h2>
<p>Maryland charges ${K.pct(K.I.MD.rate as number, 0)} inheritance tax on shares going to heirs outside its exempt list, and an estate tax above ${K.usd(K.E.MD.exemption)}. Form MET 1 then subtracts the Maryland inheritance tax paid from the estate tax, on line 14a (${h.src('md_met1', 'Form MET 1')}). The result is that the family pays roughly the larger of the two. Left to two nephews, a ${K.usd(7000000)} estate owes ${K.usd(mdN.inhTotal)} of inheritance tax and ${K.usd(mdN.stateTotal)} of estate tax after the credit; left to two children, it owes no inheritance tax and ${K.usd(mdC.stateTotal)} of estate tax. The detail is on ${h.a('maryland-inheritance-tax', 'Maryland inheritance tax')} and ${h.a('maryland-estate-tax', 'Maryland estate tax')}.</p>
<h2>How the federal tax treats state death taxes</h2>
<p>Both kinds of state tax reduce the federal one. Section 2058 of the Internal Revenue Code lets the estate deduct "any estate, inheritance, legacy, or succession taxes actually paid to any State or the District of Columbia" from the federal gross estate, and the Form 706 instructions apply the deduction on line 3b (${h.src('usc_2058', '26 U.S.C. 2058')}). The deduction only matters for estates above the federal exclusion of ${K.usd(K.F.basicExclusion)}, which is why the federal column above is zero in most lines.</p>
<h2>Where the deceased lived, and where the property is</h2>
<p>Both taxes follow the deceased, not the heirs: the state of residence taxes the estate or the shares, and a state where the deceased owned real estate taxes that property too, with its estate tax, its inheritance tax or both. An heir's own state of residence never matters. That is why a move by the parent can change the bill and a move by the child cannot; the options and their limits are on ${h.a('moving-to-avoid-estate-tax', 'moving to avoid estate tax')}, and property in two states on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Planning reflexes that work for one tax and not the other</h2>
<p>Because the two taxes are triggered by different facts, a technique that removes one can leave the other untouched. Leaving more to a spouse defers an estate tax until the second death but changes nothing for an inheritance tax, where the spouse was already exempt. Splitting an estate among more heirs does not lower an estate tax computed on the whole, but in Nebraska, Kentucky and New Jersey's Class C it multiplies the per-heir exemptions. Life insurance paid to a named beneficiary is outside the inheritance tax in Pennsylvania, New Jersey, Kentucky and Maryland, yet it stays in the federal gross estate, and in the states that start from it, when the deceased owned the policy. These are descriptions of how the rules interact, not recommendations; an estate attorney licensed in the state concerned applies them to a family.</p>
`,
  faqs: [
    { q: 'What is the difference between an estate tax and an inheritance tax?', a: `An estate tax is charged on the whole estate above a threshold, before distribution, and its rate grows with the size of the estate. An inheritance tax is charged on each heir's share at a rate set by the heir's relationship to the deceased, often from the first dollar. The federal government and ${K.ESTATE_CODES.length} jurisdictions use the first, ${K.INHERITANCE_CODES.length} states the second.` },
    { q: 'Can one estate owe both an estate tax and an inheritance tax?', a: `Yes, in two ways. In Maryland, which has both taxes, the inheritance tax paid is credited against the estate tax on Form MET 1. And an estate taxed by its home state can owe another state's inheritance tax on real estate located there, for example a New York resident with a house in New Jersey left to a nephew.` },
    { q: 'Is a spouse exempt from both death taxes?', a: `Yes, with one federal condition: what passes to the spouse is deducted under the marital deduction, which requires a spouse who is a US citizen or a qualified domestic trust. All five inheritance tax states exempt the surviving spouse. The tax that was avoided can come back at the second death if the survivor's own estate is over a threshold.` },
  ],
  tool: 'estate',
  toolArg: { st: 'MD', estate: 7000000, heir: 'nephew' },
  related: ['inheritance-tax-by-state', 'state-estate-tax', 'maryland-inheritance-tax', 'maryland-estate-tax', 'taxes-on-inheritance', 'estate-tax-exemption'],
  sources: ['md_met1', 'usc_2058', 'irs_i706', 'pa_dor', 'nj_inh'],
});
