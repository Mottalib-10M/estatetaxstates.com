import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const PA = K.I.PA;
const C = PA.classes;
const lin = C.lineal.rate!, sib = C.sibling.rate!, col = C.other.rate!;
const disc = (PA.discount as { rate: number; months: number });
const share = 300000;
const tax = (rel: Parameters<typeof K.inhTax>[1], x = share) => K.inhTax('PA', rel, x);
// A worked estate: $900,000 split between a son, a sister and a friend.
const third = 300000;
const split = [['Son', tax('child', third)], ['Sister', tax('sibling', third)], ['Friend', tax('other', third)]] as const;
const splitTotal = split.reduce((a, [, t]) => a + t, 0);

export default defineGuide({
  id: 'pennsylvania-inheritance-tax',
  group: 'inheritance',
  order: 310,
  slug: 'pennsylvania-inheritance-tax',
  nav: 'Pennsylvania',
  card: `${K.pct(lin, 1)} for children, ${K.pct(sib, 0)} for siblings, ${K.pct(col, 0)} for others, no exemption`,
  title: 'Pennsylvania Inheritance Tax 2026: Rates, Discount, Who Pays',
  description: `Pennsylvania inheritance tax 2026: 0 for a spouse, ${K.pct(lin, 1)} for children, ${K.pct(sib, 0)} for siblings, ${K.pct(col, 0)} for others, ${K.pct(disc.rate, 0)} off within ${disc.months} months, life insurance exempt.`,
  h1: 'Pennsylvania inheritance tax in 2026',
  intro: `Pennsylvania taxes what each person inherits, from the first dollar, at a rate fixed by the heir's relationship to the deceased. Enter the share and the relationship to see the tax.`,
  facts: [['Children and grandchildren', K.pct(lin, 1)], ['Brothers and sisters', K.pct(sib, 0)], ['Everyone else', K.pct(col, 0)], ['Early payment discount', `${K.pct(disc.rate, 0)} within ${disc.months} months`]],
  resume: `Pennsylvania charges its inheritance tax on the property a resident leaves, and on Pennsylvania real estate and tangible property left by a nonresident. There is no threshold: the rate applies to the whole share. A surviving spouse pays 0, and so does a parent inheriting from a child aged 21 or younger, or a child aged 21 or younger inheriting from a parent. Children, stepchildren, grandchildren, parents and grandparents pay ${K.pct(lin, 1)}; brothers and sisters, half-blood included, pay ${K.pct(sib, 0)}; everyone else, nieces, nephews, cousins, friends and unmarried partners, pays ${K.pct(col, 0)}. Charities and government bodies are exempt. On a ${K.usd(share)} share that is ${K.usd(tax('child'))} for a son, ${K.usd(tax('sibling'))} for a sister and ${K.usd(tax('nephew'))} for a nephew. The tax is due at death and becomes delinquent after ${PA.dueMonths} months; paid within ${disc.months} months, it is reduced by ${K.pct(disc.rate, 0)}. Life insurance on the deceased is exempt, and most IRAs of a person who died before retirement age are too.`,
  body: (h) => `
<h2>The four rates and who they apply to</h2>
<p>The Department of Revenue lists four rates on its ${h.src('pa_dor', 'inheritance tax page')}. The categories are defined in the instructions of the resident return, ${h.src('pa_rev1500', 'REV-1500')}, and they are narrower than everyday family words suggest. "Children" includes adopted children and stepchildren. "Lineal descendants" includes grandchildren and great-grandchildren, adopted or not. The spouse or surviving spouse of a child is taxed at the lineal rate too. Siblings are persons with at least one parent in common with the deceased; stepbrothers and stepsisters fall in the collateral class, at ${K.pct(col, 0)}.</p>
${h.table(['Heir', 'Rate', `Tax on ${K.usd(share)}`], [
  ['Surviving spouse', K.pct(C.spouse.rate!, 0), K.usd(tax('spouse'))],
  ['Child aged 21 or younger, from a parent', K.pct(C.minor.rate!, 0), K.usd(tax('minorchild'))],
  ['Child, stepchild, grandchild, parent, grandparent', K.pct(lin, 1), K.usd(tax('child'))],
  ['Son- or daughter-in-law', K.pct(lin, 1), K.usd(tax('inlaw'))],
  ['Brother or sister', K.pct(sib, 0), K.usd(tax('sibling'))],
  ['Niece, nephew, aunt, uncle, cousin', K.pct(col, 0), K.usd(tax('nephew'))],
  ['Friend, unmarried partner, stepsibling', K.pct(col, 0), K.usd(tax('other'))],
  ['Charity, exempt institution', K.pct(C.charity.rate!, 0), K.usd(tax('charity'))],
], 'Pennsylvania inheritance tax for deaths in 2026, before the early payment discount.', ['l', 'r', 'r'])}
<p>An unmarried partner is a stranger in the eyes of this tax. The REV-1500 instructions add that a common-law marriage is recognized only if it was contracted on or before January 1, 2005 and can be proved; otherwise the survivor pays the collateral rate.</p>
<h2>One estate, three heirs, three bills</h2>
<p>Because each heir is taxed separately, the same estate can cost very different amounts depending on how it is divided. Take ${K.usd(3 * third)} left in equal thirds to a son, a sister and a friend:</p>
${h.table(['Heir', 'Share', 'Tax'], [...split.map(([w, t]) => [w, K.usd(third), K.usd(t)]), ['Total', K.usd(3 * third), K.usd(splitTotal)]], 'Pennsylvania inheritance tax on three equal shares.', ['l', 'r', 'r'])}
<p>The friend pays more than twice what the son pays. Left entirely to the son, the same estate would owe ${K.usd(tax('child', 3 * third))}. Each share is computed after the estate's debts, funeral costs and administration expenses, which the Department allows as deductions, including attorney and executor fees and the cost of a grave marker (${h.src('pa_rev584', 'REV-584')}).</p>
${h.mini('inh', { t: 'Pennsylvania tax on one heir’s share', p: ['amt', 'rel'], d: { st: 'PA', amt: 250000, rel: 'sibling' } })}
<h2>What is not taxed</h2>
<p>Several assets that families expect to be taxed are not. All life insurance on the life of the deceased, whether payable to the estate or to a named beneficiary, has been exempt since December 13, 1982 (${h.src('pa_rev1508', 'REV-1508 instructions')}). Property owned jointly by spouses is exempt. Retirement accounts are usually outside the tax when the deceased could not have withdrawn from them without penalty: the Department's brochure says IRAs typically are not subject to inheritance tax unless the deceased was disabled, and that the same applies to a 401(k) unless the owner could have accessed it without penalty. Qualifying farmland passed to family members, certain family business interests and property of a service member who died from an injury or illness received on active duty are exempt under conditions set out by the Department.</p>
<p>A spouse, or failing that a child or parent who lived in the household, can also claim the family exemption of ${K.usd(3500)} against the estate.</p>
<h2>The joint account trap</h2>
<p>Joint ownership does not avoid the tax, except between spouses. A bank account, securities or real estate held jointly with right of survivorship is taxed on the deceased's fraction, the value divided by the number of owners. The brochure answers a question that comes up often: a daughter who added her mother's name to her own savings account for convenience is taxed on half of it when her mother dies, even though the money was hers. And if the joint ownership was created within a year of death, the whole value is taxable, less ${K.usd(3000)}.</p>
<h2>Paying early, paying late</h2>
<p>The tax is due at death. Paid within ${disc.months} months, it is reduced by ${K.pct(disc.rate, 0)}, a discount capped at ${K.pct(disc.rate, 0)} of the tax due; on a ${K.usd(tax('sibling'))} bill for a sister that is ${K.usd(tax('sibling') * disc.rate)}. The return is filed within ${PA.dueMonths} months with the Register of Wills of the county where the deceased lived, and interest runs from the day after the ${PA.dueMonths}-month date. An extension of time to file does not extend the time to pay. The ${h.a('estate-tax-return-deadline', 'deadlines page')} puts these dates next to the federal ones.</p>
<h2>Nonresidents with Pennsylvania property</h2>
<p>For someone who lived in another state, Pennsylvania taxes only real estate and tangible property located in Pennsylvania, such as a house, a cabin or a car kept there; bank accounts and securities are not taxed. The return is ${h.src('pa_rev1737a', 'REV-1737-A')}. A New Jersey resident leaving a Pocono house to a nephew pays Pennsylvania ${K.pct(col, 0)} on the house and New Jersey's tax on the rest, as shown on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Pennsylvania has no estate tax</h2>
<p>Pennsylvania does not tax the estate as a whole, so no amount of wealth triggers a second state tax. Above ${K.usd(K.F.basicExclusion)} the federal estate tax applies, and the Pennsylvania inheritance tax paid is deductible from the federal taxable estate. The state comparison is on ${h.a('inheritance-tax-by-state', 'inheritance tax by state')}.</p>
`,
  faqs: [
    { q: 'Do children pay Pennsylvania inheritance tax on what a parent leaves them?', a: `Yes, at ${K.pct(lin, 1)} of the share, with no threshold, unless the child is aged 21 or younger, in which case the rate is 0. Stepchildren are treated as children. A child inheriting ${K.usd(share)} owes ${K.usd(tax('child'))}, or ${K.usd(tax('child') * (1 - disc.rate))} if the tax is paid within ${disc.months} months of the death.` },
    { q: 'Is life insurance subject to Pennsylvania inheritance tax?', a: `No. All life insurance on the life of the deceased is exempt for deaths since December 13, 1982, whether the policy is paid to a named beneficiary or to the estate. The proceeds still count in the federal gross estate when the deceased owned the policy, which matters only above ${K.usd(K.F.basicExclusion)}.` },
    { q: 'Does a Pennsylvania joint bank account avoid inheritance tax?', a: `Only between spouses. With anyone else, the deceased's fraction of a joint account is taxed: half for two owners, a third for three, at the survivor's rate. If the account was made joint within a year of death, the full balance is taxable less ${K.usd(3000)}.` },
    { q: 'What rate does an unmarried partner pay in Pennsylvania?', a: `The collateral rate, ${K.pct(col, 0)}, like a friend. Pennsylvania recognizes a common-law marriage only if it was contracted on or before January 1, 2005 and can be proved; a partner in such a marriage is a spouse and pays 0. Without that proof the partner is taxed like any person outside the family.` },
    { q: 'How much is the Pennsylvania early payment discount worth?', a: `${K.pct(disc.rate, 0)} of the tax paid within ${disc.months} months of death, capped at ${K.pct(disc.rate, 0)} of the total tax due. On ${K.usd(tax('nephew'))} of tax for a nephew's ${K.usd(share)} share, the discount is ${K.usd(tax('nephew') * disc.rate)}. A partial payment made inside the window earns the discount on the amount paid, as the REV-1500 instructions show.` },
  ],
  tool: 'inh',
  toolArg: { st: 'PA', amt: share, rel: 'child' },
  related: ['inheritance-tax-by-state', 'new-jersey-inheritance-tax', 'maryland-inheritance-tax', 'property-in-another-state', 'estate-tax-vs-inheritance-tax', 'taxes-on-inheritance'],
  sources: ['pa_dor', 'pa_rev584', 'pa_rev1500', 'pa_rev1508', 'pa_rev1737a'],
});
