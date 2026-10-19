import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ME = K.E.ME;
const ex = ME.exemption, T = ME.table!;
const tax = (x: number) => K.stateTax('ME', x);
const sizes = [7000000, 8000000, 10000000, 12000000, 15000000, 20000000];
const gift = (x: number, g: number, when: '1y' | 'old') => K.computeCase({ estate: x, st: 'ME', married: false, toSpouse: 'none', heir: 'child', heirs: 2, gifts: g, giftWhen: when }).home!.tax;
const fl = K.computeCase({ estate: 9000000, st: 'ME', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'FL', reValue: 1800000 });

export default defineGuide({
  id: 'maine-estate-tax',
  group: 'estate',
  order: 225,
  slug: 'maine-estate-tax',
  nav: 'Maine',
  card: `${K.usd(ex)} exclusion indexed each year, ${K.pct(T[0].rate, 0)} to ${K.pct(T[2].rate, 0)} above it`,
  title: `Maine Estate Tax 2026: ${K.usd(ex)} Exclusion and Rates`,
  description: `Maine estate tax 2026: ${K.usd(ex)} exclusion, ${K.pct(T[0].rate, 0)}, ${K.pct(T[1].rate, 0)} and ${K.pct(T[2].rate, 0)} on the excess, gifts of the last year added, out-of-state property, Form 706ME due in 9 months.`,
  h1: 'Maine estate tax in 2026',
  intro: `Maine taxes estates above ${K.usd(ex)} for deaths in 2026, with three rates applied to the excess. Enter the Maine taxable estate to see the tax.`,
  facts: [['Exclusion 2026', K.usd(ex)], ['Exclusion 2025', K.usd(ME.prev)], ['Rates on the excess', `${K.pct(T[0].rate, 0)} to ${K.pct(T[2].rate, 0)}`], ['Form 706ME due', `${ME.dueMonths} months`]],
  resume: `For estates of decedents dying in 2026, Maine Revenue Services sets the exclusion at ${K.usd(ex)}, up from ${K.usd(ME.prev)} in 2025. Nothing is owed at or below that amount. Above it the tax is ${K.pct(T[0].rate, 0)} of the first ${K.usd(T[1].from)} of excess, ${K.pct(T[1].rate, 0)} of the next ${K.usd(T[2].from - T[1].from)} and ${K.pct(T[2].rate, 0)} of the rest, so an estate of ${K.usd(10000000)} owes ${K.usd(tax(10000000))} and one of ${K.usd(15000000)} owes ${K.usd(tax(15000000))}. The Maine taxable estate is the federal taxable estate plus taxable gifts made in the year before death and the value of Maine elective property. For a resident, the tax is then multiplied by the share of the estate made of Maine real and tangible property and all intangible property, which removes real estate located in another state. The exclusion is indexed each year to the chained consumer price index. Form 706ME is due nine months after death, and Maine publishes no rule letting a surviving spouse use the unused Maine exclusion of the first spouse.`,
  body: (h) => `
<h2>Brackets that move with the exclusion</h2>
<p>Section 4103 of Title 36 does not print its brackets in dollars. It defines them from the Maine exclusion amount: ${K.pct(T[0].rate, 0)} of the excess up to the exclusion plus ${K.usd(T[1].from)}, then ${K.usd(T[1].base)} plus ${K.pct(T[1].rate, 0)} up to the exclusion plus ${K.usd(T[2].from)}, then ${K.usd(T[2].base)} plus ${K.pct(T[2].rate, 0)} above (${h.src('me_4103', '36 M.R.S. section 4103')}). Each time the exclusion rises with inflation, the brackets slide with it, and the tax on a given excess stays the same. Maine Revenue Services publishes the resulting dollar table every year (${h.src('me_mrs', 'Maine estate tax page')}).</p>
${h.table(['Maine taxable estate over', 'Not over', 'Tax'], T.map((r, i) => [K.usd(ex + r.from), i + 1 < T.length ? K.usd(ex + T[i + 1].from) : 'no limit', `${r.base ? `${K.usd(r.base)} plus ` : ''}${K.pct(r.rate, 0)} of the amount over ${K.usd(ex + r.from)}`]), 'Maine estate tax for decedents dying in 2026.', ['l', 'l', 'l'])}
${h.table(['Maine taxable estate', 'Tax', 'Average rate'], sizes.map((x) => [K.usd(x), K.usd(tax(x)), K.pct(tax(x) / x)]), 'Resident, all property in Maine, no gifts in the last year.', ['l', 'r', 'r'])}
<p>The ${K.usd(7000000)} estate in the first line owed nothing in 2025 either, because it sits below both years' exclusion; the ${K.usd(8000000)} estate pays ${K.usd(tax(8000000))} in 2026, ${K.usd(T[0].rate * (ex - ME.prev))} less than it would have paid with the 2025 exclusion.</p>
${h.mini('state', { t: 'Maine tax on another estate', p: ['estate'], d: { st: 'ME', estate: 9000000 } })}
<h2>The one-year rule for gifts</h2>
<p>The Maine taxable estate equals the federal taxable estate plus taxable gifts made during the one-year period ending on the date of death, plus the value of Maine elective property, and, for deaths after 2017, less any Maine QTIP property. Only gifts above the federal annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient are taxable gifts. A gift made thirteen months before death is out of the computation; one made eleven months before is in. With an estate of ${K.usd(9000000)} and a ${K.usd(1000000)} taxable gift, the tax is ${K.usd(gift(9000000, 1000000, '1y'))} if the gift falls within the year and ${K.usd(gift(9000000, 1000000, 'old'))} if it does not. Among the estate-tax states, New York and Minnesota look back three years and Vermont two (${h.a('gifts-and-state-estate-tax', 'gifts and state estate tax')}).</p>
<h2>Real estate outside Maine</h2>
<p>For a resident, the tax from the table is multiplied by a fraction: Maine real and tangible property plus all intangible property, such as bank and brokerage accounts, over the adjusted federal gross estate. A winter home in Florida is therefore left out in proportion. A resident with a ${K.usd(9000000)} estate including a ${K.usd(1800000)} Florida house owes ${K.usd(fl.home!.tax)} rather than ${K.usd(tax(9000000))}. Nonresidents who owned real or tangible property in Maine file as well, and Maine Revenue Services specifies that they test the filing requirement on their whole federal gross estate, not only on the Maine property. Real estate owned through a pass-through entity is generally treated as owned directly (section 4104). The comparison of states is on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>When a return is required</h2>
<p>Maine's estate tax FAQ asks two questions. Is a federal estate tax return required? Does the federal gross estate plus taxable gifts within one year of death plus Maine elective property exceed the Maine exclusion? A yes to either, for a resident or for a nonresident with Maine real or tangible property, means Form 706ME must be filed (${h.src('me_mrs', 'Maine Revenue Services')}). A nonresident uses the whole federal gross estate for the second question, not only the Maine property. When both answers are no but the decedent owned Maine real estate, the estate submits Form 700-SOV, a statement of value, with a certificate to release the automatic estate tax lien placed on that property at death. The probate court may also ask for a certification that the return was filed or the tax paid.</p>
<h2>Maine tax and the federal tax together</h2>
<p>The federal basic exclusion is ${K.usd(K.F.basicExclusion)} for 2026, more than twice the Maine figure. Between ${K.usd(ex)} and ${K.usd(K.F.basicExclusion)} Maine is the only death tax; above that amount both apply, and the Maine tax is deducted from the federal taxable estate under section 2058 of the Internal Revenue Code, which softens the combined cost of the two taxes. For a ${K.usd(20000000)} estate left to two children, the calculator at the top of ${h.a('state-estate-tax', 'the state estate tax page')} shows both figures side by side.</p>
<h2>Indexing and deadlines</h2>
<p>Section 4119 adjusts the exclusion each year by the chained consumer price index, which explains the move from ${K.usd(ME.prev)} to ${K.usd(ex)}. The return is due nine months after death. Maine grants an automatic extension equal to the federal extension or six months, whichever is longer, with a written request needed to go further, generally to a total of eight months. The extension covers filing, not payment: interest runs on unpaid tax from the original due date. Estates made largely of a closely held business can ask for more time to pay under section 4109.</p>
`,
  faqs: [
    { q: 'What is the Maine estate tax exclusion for 2026?', a: `${K.usd(ex)} for decedents dying in 2026, against ${K.usd(ME.prev)} in 2025. It is indexed each year to the chained consumer price index and works as the filing threshold too. Above it the tax is ${K.pct(T[0].rate, 0)}, ${K.pct(T[1].rate, 0)} and ${K.pct(T[2].rate, 0)} of successive slices of the excess.` },
    { q: 'Does a gift made shortly before death count for the Maine estate tax?', a: `Yes, if it is a taxable gift made within the one-year period ending on the date of death: it is added to the Maine taxable estate. Older gifts and gifts under the federal annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient are not added, so the timing of a large gift can change the Maine bill.` },
    { q: 'Does Maine tax a resident\'s house in another state?', a: `Not directly. The tax is multiplied by the share of the adjusted federal gross estate made of Maine real and tangible property and all intangible property, so real estate located elsewhere lowers the Maine tax in proportion. The state where that house is may tax it under its own rules.` },
    { q: 'What is Maine Form 700-SOV used for?', a: `It is the statement of value filed when no Form 706ME is required but the decedent owned real or tangible property in Maine. Submitted with a certificate of discharge, it asks Maine Revenue Services to release the estate tax lien placed automatically on that property at death, so the property can be sold or transferred.` },
  ],
  tool: 'state',
  toolArg: { st: 'ME', estate: 9000000 },
  related: ['state-estate-tax', 'vermont-estate-tax', 'massachusetts-estate-tax', 'gifts-and-state-estate-tax', 'property-in-another-state'],
  sources: ['me_mrs', 'me_4103'],
});
