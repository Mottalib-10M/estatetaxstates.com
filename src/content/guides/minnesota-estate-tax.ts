import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const MN = K.E.MN;
const ex = MN.exemption;
const T = MN.table!;
const r0 = K.pct(T[0].rate, 0), rTop = K.pct(T[T.length - 1].rate, 0);
const at = (x: number) => K.stateTax('MN', x);
const amounts = [3500000, 4000000, 5000000, 6000000, 8000000, 10000000, 14000000];
// A gift case: $1,000,000 of taxable gifts made 20 months before death, estate of $3,500,000 at death.
const giftEstate = 3500000, gift = 1000000;
const withGift = at(giftEstate + gift);
// A cabin up north owned by a Minnesota resident is Minnesota property; a Florida condo is not.
const gross = 6000000, condo = 1500000;
const apportioned = at(gross) * (gross - condo) / gross;

export default defineGuide({
  id: 'minnesota-estate-tax',
  group: 'estate',
  order: 240,
  slug: 'minnesota-estate-tax',
  nav: 'Minnesota',
  card: `${K.usd(ex)} exclusion, ${r0} to ${rTop}, gifts of the last three years added`,
  title: 'Minnesota Estate Tax 2026: Exclusion, Rates and Gift Rule',
  description: `Minnesota estate tax 2026: ${K.usd(ex)} exclusion, rates from ${r0} to ${rTop} on the excess, taxable gifts of the last 3 years added back, Form M706 due in ${MN.dueMonths} months.`,
  h1: 'Minnesota estate tax in 2026',
  intro: `Minnesota taxes the part of an estate above ${K.usd(ex)}, and it looks back three years at taxable gifts. Enter the estate to see the Minnesota tax, then the ladder of amounts below the result.`,
  facts: [['Exclusion 2026', K.usd(ex)], ['First rate', r0], ['Top rate', rTop], ['Form M706 due', `${MN.dueMonths} months`]],
  resume: `Minnesota's estate tax applies to deaths in 2026 when the federal gross estate plus taxable gifts made in the three years before death exceeds ${K.usd(ex)}. That exclusion has been fixed in the statute since 2020 and is not indexed, so it stays at ${K.usd(ex)} year after year while the federal exclusion has climbed to ${K.usd(K.F.basicExclusion)}. The tax is computed on the Minnesota taxable estate, which is the federal taxable estate plus those recent gifts, minus the exclusion. The first ${K.usd(T[1].from)} of that amount is taxed at ${r0}, and the rate then rises in steps to ${rTop} above ${K.usd(T[T.length - 1].from)}. An estate of ${K.usd(4000000)} owes ${K.usd(at(4000000))}; one of ${K.usd(6000000)} owes ${K.usd(at(6000000))}; one of ${K.usd(10000000)} owes ${K.usd(at(10000000))}. Minnesota publishes no portability rule for a surviving spouse. Property located in another state reduces the tax through a fraction, and Form M706 and the payment are both due ${MN.dueMonths} months after death.`,
  body: (h) => `
<h2>From the federal return to the Minnesota tax</h2>
<p>Minnesota borrows the federal arithmetic and then changes three lines. Under ${h.src('mn_291_016', 'Minnesota Statutes section 291.016')}, the Minnesota taxable estate starts from the federal taxable estate, whether or not any federal tax is due. Three things are added back if they were deducted federally: the deduction for state death taxes, the deduction for foreign death taxes, and the taxable gifts the person made within three years of death. Then the exclusion is subtracted, together with a deduction for qualified small business and farm property when the estate qualifies for it. What is left goes through the rate schedule of ${h.src('mn_291_03', 'section 291.03')}.</p>
<p>The first add-back matters more than it seems. The federal return lets an estate deduct the state tax it pays; Minnesota refuses to let its own tax shrink its own base. The estate is therefore taxed on the full amount, and the Minnesota tax is not circular, unlike the Illinois computation described on ${h.a('illinois-estate-tax', 'the Illinois page')}.</p>
${h.table(['Estate (taxable, no gifts)', 'Minnesota taxable estate', 'Minnesota tax', 'Share of the estate'], amounts.map((x) => [K.usd(x), K.usd(x - ex), K.usd(at(x)), K.pct(at(x) / x)]), 'Minnesota estate tax for a resident dying in 2026 with all property in Minnesota.', ['l', 'r', 'r', 'r'])}
<h2>A flat first bracket that is very wide</h2>
<p>Most state schedules climb quickly. Minnesota's does the opposite: its first bracket runs from the first dollar above the exclusion to ${K.usd(T[1].from)} of taxable estate, all at ${r0}. In practice every Minnesota estate between ${K.usd(ex)} and ${K.usd(ex + T[1].from)} pays a single rate on its excess, which makes the estimate easy: subtract ${K.usd(ex)} and take ${r0}. Only estates above that range meet the steps at ${K.pct(T[1].rate, 1)}, ${K.pct(T[2].rate, 1)}, ${K.pct(T[3].rate, 1)} and ${rTop}. The first dollar over the line is taxed at ${r0} and no more; there is no cliff of the New York kind.</p>
${h.mini('state', { t: 'Minnesota tax on your estate', p: ['estate'], d: { st: 'MN', estate: 5000000 } })}
<h2>The three-year look-back on gifts</h2>
<p>Gifts are the obvious way to bring an estate under ${K.usd(ex)}, and Minnesota closes part of that road. A taxable gift, meaning the part of a gift above the federal annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient, counts in the Minnesota taxable estate if it was made within three years of death. Gifts that were already included in the federal estate are not counted twice. The filing test uses the same window: the M706 instructions require a return when the federal gross estate plus adjusted taxable gifts made within three years exceeds ${K.usd(ex)}.</p>
<p>Take a resident who dies with ${K.usd(giftEstate)} after giving a child ${K.usd(gift)} twenty months earlier. Without the look-back the tax would be ${K.usd(at(giftEstate))}; with the gift added back it is ${K.usd(withGift)}. Had the same gift been made four years before death, it would have stayed out. Minnesota has no separate gift tax, so a gift made in time removes both the amount given and its later growth from the base. The rules of the other states are compared on ${h.a('gifts-and-state-estate-tax', 'gifts and state estate tax')}.</p>
<h2>Property in Minnesota, property elsewhere</h2>
<p>The tax computed on the schedule is multiplied by a fraction: the Minnesota gross estate, plus Minnesota-situs gifts, over the federal gross estate plus those gifts. For a resident, the Minnesota gross estate is everything except real estate and tangible property located in another state. A resident worth ${K.usd(gross)} who owns a ${K.usd(condo)} condominium in Florida pays ${K.usd(apportioned)} instead of ${K.usd(at(gross))}, because a quarter of the estate sits outside the state. The fraction applies to the tax, not to the value, so the exclusion is in effect shared in the same proportion: without the condominium the same resident would owe ${K.usd(at(gross - condo))}.</p>
<p>The fraction works the other way for nonresidents. Someone who lived in Arizona and kept a lake cabin in Minnesota owes Minnesota a share of the tax computed on the whole estate, the cabin's share. A return is required once the federal gross estate plus recent gifts exceeds ${K.usd(ex)} and the estate includes Minnesota property. The instructions add a rule for interests in pass-through entities: a nonresident's share of Minnesota real estate held through a partnership, an LLC or an S corporation counts as Minnesota property, unless the securities trade on a regulated exchange. More examples are on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Married couples</h2>
<p>What passes to a spouse who is a US citizen is deducted, so the first death of a couple rarely owes Minnesota tax. The state publishes no rule letting the survivor add the first spouse's unused Minnesota exclusion, and the federal portability election does not create one. A couple whose combined estate is above ${K.usd(ex)} can therefore lose the first exclusion if everything goes to the survivor; ${h.a('married-couples-state-estate-tax', 'married couples and state estate tax')} puts numbers on that difference. Minnesota also lets an estate make its own election for qualified terminable interest property on the M706, separate from the federal one.</p>
<h2>Filing and paying</h2>
<p>Form M706 is due ${MN.dueMonths} months after death under section 289A.18 of the Minnesota Statutes, and the tax must be paid by the same date. The automatic extension to file is six months, or the time the IRS grants for the federal return if that is longer; it does not extend the time to pay, and penalties and interest run on any tax paid late. For 2025 deaths the Department of Revenue printed an exclusion and filing threshold of ${K.usd(ex)}; the statute fixes the same amount for 2026.</p>
`,
  faqs: [
    { q: 'Is the Minnesota estate tax exclusion indexed to inflation?', a: `No. Section 291.016 sets the exclusion at ${K.usd(ex)} for deaths in 2020 and every year after, so it is the same in 2026 as in 2020. It rose in steps before that. An estate that grows with the markets is therefore more likely to cross the Minnesota line each year, while the federal exclusion of ${K.usd(K.F.basicExclusion)} keeps moving away.` },
    { q: 'How much Minnesota estate tax does a $5 million estate owe in 2026?', a: `${K.usd(at(5000000))}, if all of it is in Minnesota and no gifts were made in the last three years. The Minnesota taxable estate is ${K.usd(5000000 - ex)}, taxed at ${r0}. No federal estate tax is due at that size, and the Minnesota tax is computed without deducting itself, as the statute adds the state death tax deduction back.` },
    { q: 'Does Minnesota count a gift made two years before death?', a: `Yes. Taxable gifts made within three years of death are added to the Minnesota taxable estate and also count for the filing test. Only the part of a gift above the federal annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient is a taxable gift, so ordinary yearly gifts never come back. A gift made more than three years before death stays out.` },
    { q: 'Does a Minnesota resident pay Minnesota tax on a winter home in Arizona?', a: `Not directly. Out-of-state real estate is left out of the Minnesota gross estate, and the tax on the whole estate is multiplied by the Minnesota share. The house still counts in that whole estate, so the exclusion is shared: at ${K.usd(gross)} with a ${K.usd(condo)} house elsewhere the tax is ${K.usd(apportioned)}, against ${K.usd(at(gross - condo))} without the house.` },
  ],
  tool: 'state',
  toolArg: { st: 'MN', estate: 5000000 },
  related: ['state-estate-tax', 'gifts-and-state-estate-tax', 'married-couples-state-estate-tax', 'property-in-another-state', 'illinois-estate-tax', 'moving-to-avoid-estate-tax'],
  sources: ['mn_291_016', 'mn_291_03'],
});
