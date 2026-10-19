import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const CT = K.E.CT;
const ex = CT.exemption, rate = CT.table![0].rate, cap = CT.cap!;
const old2024 = K.F.history['2024'];
const cases = [14000000, 16000000, 20000000, 30000000].map((x) => {
  const r = K.computeCase({ estate: x, st: 'CT', married: false, toSpouse: 'none', heir: 'child', heirs: 2 });
  return { x, st: r.home!.tax, fed: r.fed.tax, net: r.netToHeirs };
});
const capAt = ex + cap / rate;
const half = K.computeCase({ estate: 20000000, st: 'FL', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'CT', reValue: 5000000 });

export default defineGuide({
  id: 'connecticut-estate-tax',
  group: 'estate',
  order: 205,
  slug: 'connecticut-estate-tax',
  nav: 'Connecticut',
  card: `${K.usd(ex)} like the federal exclusion, ${K.pct(rate, 0)} above, a gift tax too`,
  title: `Connecticut Estate Tax 2026: $${K.dec(ex / 1e6, 1)} Million Exemption, Gift Tax`,
  description: `Connecticut estate tax 2026: ${K.usd(ex)} exemption tied to the federal amount, ${K.pct(rate, 0)} above it, gifts since 2005 added back, a ${K.usd(cap)} cap, 6-month deadline.`,
  h1: 'Connecticut estate and gift tax in 2026',
  intro: `Connecticut is the only state with both an estate tax and a gift tax, and its exemption is written as the federal basic exclusion amount. Enter the Connecticut taxable estate to see the state tax for a death in 2026.`,
  facts: [['Exemption 2026', K.usd(ex)], ['Rate above it', K.pct(rate, 0)], ['Maximum tax', K.usd(cap)], ['Return CT-706/709', `${CT.dueMonths} months`]],
  resume: `For a death in 2026, Connecticut charges estate tax only when the Connecticut taxable estate exceeds ${K.usd(ex)}, the same amount as the federal basic exclusion, against ${K.usd(CT.prev)} in 2025. Above that line the tax is a flat ${K.pct(rate, 0)} of the excess, and the estate and gift taxes paid by one person over a lifetime can never exceed ${K.usd(cap)} in total. The Connecticut taxable estate is the federal gross estate less federal deductions, plus every Connecticut taxable gift made since January 1, 2005 that is not already in the estate, and the deduction for state death taxes is disregarded. An estate of ${K.usd(20000000)} left to two children owes ${K.usd(cases[2].st)} to Connecticut and ${K.usd(cases[2].fed)} in federal tax. Gifts follow the same exemption: a Connecticut gift tax of ${K.pct(rate, 0)} applies once lifetime taxable gifts since 2005 pass ${K.usd(ex)}. The CT-706/709 return is due ${CT.dueMonths} months after death, earlier than in any other state.`,
  body: (h) => `
<h2>The 2026 figure, and why older charts show less</h2>
<p>The Department of Revenue Services states that for estates of decedents dying during 2026 the exemption is ${K.usd(ex)}, and its rate table reads "${K.pct(rate, 0)} of the excess over the federal basic exclusion amount" (${h.src('ct_drs', 'DRS estate and gift tax information')}). The statute, section 12-391 of the General Statutes, uses the same reference to the federal amount (${h.src('ct_statute', 'chapter 217')}). The Connecticut figure therefore changed whenever the federal figure did: ${K.usd(old2024)} in 2024, ${K.usd(CT.prev)} in 2025, ${K.usd(ex)} in 2026.</p>
<p>Several published tables still give Connecticut an exemption of ${K.usd(old2024)}, the 2024 amount, or ${K.usd(CT.prev)}, the 2025 one. For an estate between those figures and ${K.usd(ex)} the difference is the whole tax: an estate of ${K.usd(14000000)} owes nothing in 2026, while a table stuck at the 2024 figure would suggest a bill of ${K.usd(rate * (14000000 - old2024))}.</p>
<h2>Computing the tax</h2>
${h.table(['Connecticut taxable estate', 'Connecticut tax', 'Federal tax', 'Left to the two children'], cases.map((c) => [K.usd(c.x), K.usd(c.st), K.usd(c.fed), K.usd(c.net)]), 'Unmarried resident, no lifetime gifts, everything to two children; federal tax after deducting the Connecticut tax (section 2058).', ['l', 'r', 'r', 'r'])}
<p>Because the two thresholds are equal, an estate below ${K.usd(ex)} owes neither tax, and an estate above it owes both. The federal rate of ${K.pct(K.F.topRate, 0)} applies to the federal base after the Connecticut tax is deducted, so each dollar above the line costs a little less than the two rates added together. The ${K.usd(cap)} ceiling is reached only for a Connecticut taxable estate of about ${K.usd(capAt)} or more; it is reduced by Connecticut gift tax already paid.</p>
${h.mini('state', { t: 'Connecticut tax on another estate', p: ['estate'], d: { st: 'CT', estate: 18000000 } })}
<h2>What goes into the Connecticut taxable estate</h2>
<p>The DRS lists three parts. First, the gross estate as valued for federal estate tax, less the deductions allowed federally: debts, costs, the marital deduction for a surviving spouse and the charitable deduction. Second, all Connecticut taxable gifts made during life in calendar years since January 1, 2005, other than gifts already included in the federal gross estate. Third, any Connecticut gift tax paid by the decedent or the estate on gifts made in the three years before death. The deduction for state death taxes under section 2058 of the Internal Revenue Code is ignored, so the Connecticut tax is not deducted from its own base.</p>
<p>That second item is what makes Connecticut different from the other estate-tax states. A gift of a house to a child in 2010 is part of the base at death in 2026, whatever the years in between. The tax already paid on those gifts is credited, and the credit cannot exceed the estate tax itself.</p>
<h2>The Connecticut gift tax</h2>
<p>Connecticut taxable gifts are the federal taxable gifts, that is gifts above the federal annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient, made by a resident, wherever the property is, or by a nonresident when the gift is Connecticut real estate or tangible property. For gifts made in 2026, no Connecticut gift tax is due until the total of Connecticut taxable gifts since 2005 exceeds ${K.usd(ex)}; above it the rate is ${K.pct(rate, 0)}. A return is still required for every year in which a Connecticut taxable gift was made, even with no tax. For 2026 gifts, Form CT-706/709 is due on or before April 15, 2027. The rules on combining gifts and estate are compared with other states on ${h.a('gifts-and-state-estate-tax', 'gifts and state estate tax')}.</p>
<h2>Nonresidents with Connecticut property</h2>
<p>A person domiciled elsewhere who owned real estate or tangible property in Connecticut has a nonresident estate. The test is the same ${K.usd(ex)} on the Connecticut taxable estate, but the tax computed on the table is multiplied by a fraction: the part of the gross estate over which Connecticut has jurisdiction, divided by the whole gross estate (Schedule G of the return). Real estate held through a pass-through entity is treated as owned directly in some cases, for instance when the entity carries on no business. A Florida resident with a ${K.usd(20000000)} estate including a ${K.usd(5000000)} Connecticut house would owe about ${K.usd(half.other?.tax ?? 0)} to Connecticut on that basis. The other states' rules are on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Deadlines and the probate court</h2>
<p>The estate tax is due, with the return, six months after death, against nine in most states; the penalty and interest of section 12-392 run from that date unless an extension is obtained. When the Connecticut taxable estate is above ${K.usd(ex)}, Form CT-706/709 is filed with DRS and a copy with the Probate Court. When it is ${K.usd(ex)} or less, no tax is due and the estate generally files Form CT-706 NT with the Probate Court for the district where the decedent lived. An executor who wants a Connecticut-only QTIP election for property passing to a spouse in trust has to file the full CT-706/709 even below the exemption. The Department publishes no rule letting a survivor use the unused Connecticut exemption of a late spouse.</p>
`,
  faqs: [
    { q: `Is the Connecticut estate tax exemption ${K.mil(old2024)} or ${K.mil(ex)} in 2026?`, a: `${K.usd(ex)}. The Connecticut statute refers to the federal basic exclusion amount, which was ${K.usd(old2024)} in 2024, ${K.usd(CT.prev)} in 2025 and ${K.usd(ex)} for deaths in 2026. A chart that shows ${K.usd(old2024)} for 2026 is using the 2024 figure, and overstates the tax on estates between that amount and ${K.usd(ex)}.` },
    { q: 'Does Connecticut add lifetime gifts back into the estate?', a: `Yes, all Connecticut taxable gifts made since January 1, 2005 that are not already in the federal gross estate, with no look-back limit, plus Connecticut gift tax paid on gifts in the three years before death. Gifts under the federal annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient are not taxable gifts and stay out.` },
    { q: 'What is the maximum Connecticut estate tax?', a: `${K.usd(cap)} for one person, counting estate tax and gift tax together, for deaths since 2019. At ${K.pct(rate, 0)} of the excess, the ceiling is reached when the Connecticut taxable estate is about ${K.usd(capAt)}. Connecticut gift tax already paid reduces the remaining room under the ceiling.` },
    { q: 'When is the Connecticut estate tax return due?', a: `Six months after the date of death, for the CT-706/709 and for the payment, unless an extension of time is requested. Estates at or below ${K.usd(ex)} file the shorter CT-706 NT with the Probate Court instead. The separate annual gift tax return for gifts made during 2026 is due by April 15, 2027.` },
  ],
  tool: 'state',
  toolArg: { st: 'CT', estate: 20000000 },
  related: ['gifts-and-state-estate-tax', 'gift-tax', 'state-estate-tax', 'new-york-estate-tax', 'estate-tax-exemption', 'property-in-another-state'],
  sources: ['ct_drs', 'ct_statute', 'irs_whats_new'],
});
