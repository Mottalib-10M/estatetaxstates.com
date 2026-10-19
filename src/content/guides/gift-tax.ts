import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const ex = F.basicExclusion, ae = F.annualExclusion, top = F.topRate;
const CT = K.E.CT;
const g1 = 100000, g2 = 2000000;
const house = 600000;
const after = (gifts: number, estate: number) => K.federalEstateTax({ taxableEstate: estate, gifts, dsue: 0 });

export default defineGuide({
  id: 'gift-tax',
  group: 'federal',
  order: 120,
  slug: 'gift-tax',
  nav: 'Gift tax',
  card: `Form 709, the ${K.usd(ex)} lifetime exclusion, and Connecticut's own gift tax`,
  title: 'Gift Tax 2026: Form 709, Lifetime Exclusion and State Rules',
  description: `Gift tax 2026: when a gift is taxable, Form 709 due April 15, 2027, the ${K.usd(ex)} lifetime exclusion, and Connecticut, the only state gift tax left.`,
  h1: 'Gift tax in 2026: who files and who pays',
  intro: `Almost nobody pays federal gift tax: a taxable gift is reported, then absorbed by a lifetime exclusion of ${K.usd(ex)}. Enter a gift to one person to see what is taxable, whether Form 709 is due and how much exclusion is left.`,
  facts: [['Annual exclusion per recipient', K.usd(ae)], ['Lifetime exclusion', K.usd(ex)], ['Form 709 for 2026 gifts', 'April 15, 2027'], ['States with a gift tax', 'Connecticut']],
  resume: `The federal gift tax applies to gifts made during life, under the same rate schedule and the same exclusion as the estate tax. In 2026 the first ${K.usd(ae)} given to each person in the year is excluded; anything above is a taxable gift, reported on Form 709 by April 15 of the following year. A taxable gift does not mean a tax payment: it uses part of the ${K.usd(ex)} basic exclusion, and tax at ${K.pct(top, 0)} is owed only once lifetime taxable gifts exceed that amount. A gift of ${K.usd(g1)} to a child in 2026 is a taxable gift of ${K.usd(g1 - ae)}, with nothing to pay and ${K.usd(ex - (g1 - ae))} of exclusion left. Tuition paid directly to a school and medical bills paid to the provider are not gifts at all, and gifts to a spouse who is a US citizen are fully deducted. Among the states only Connecticut taxes gifts, with an exemption of ${K.usd(CT.exemption)} shared with its estate tax; elsewhere, gifts are free of state tax, although several states add recent gifts back to the estate at death.`,
  body: (h) => `
<h2>What counts as a taxable gift</h2>
<p>Under ${h.src('usc_2503', 'section 2503')} of the Internal Revenue Code, taxable gifts are all gifts made during the calendar year, minus the annual exclusion and the deductions for gifts to a spouse and to charity. The IRS lists the gifts that are not taxable in its ${h.src('irs_gift_faq', 'gift tax questions')}: gifts up to the annual exclusion, tuition and medical expenses paid for someone, gifts to a spouse, and gifts to a political organization for its use. The general rule, in the IRS words, is that any gift is a taxable gift: cash, securities, or a house deeded to a child, valued at what they are worth on the day of the gift.</p>
<p>The annual exclusion applies per recipient and only to present interests, meaning property the recipient can use now. A gift into a trust that the beneficiary cannot touch for years is a future interest: it gets no annual exclusion and must be reported even if it is small, as the ${h.src('irs_i709', 'Form 709 instructions')} state.</p>
${h.mini('gift', { t: 'Is this gift taxable?', p: ['amt'], d: { amt: g1 } })}
<h2>Form 709, and why it rarely means a payment</h2>
<p>A donor who makes a taxable gift files Form 709 between January 1 and April 15 of the year after the gift, so April 15, 2027 for gifts made in 2026. Married couples do not file a joint return; each spouse files their own. The return computes the tax on the taxable gifts of the year added to those of earlier years, with the rate schedule, then subtracts the applicable credit, which corresponds to the basic exclusion of ${K.usd(ex)}. As long as the running total stays under the exclusion, the line for tax due shows zero.</p>
<p>A parent who helps a child buy a home with ${K.usd(house)} in 2026 makes a taxable gift of ${K.usd(house - ae)}. No tax is paid. At the parent's death, that amount comes back as an adjusted taxable gift and is added to the taxable estate before the estate tax is computed. If the estate is ${K.usd(14800000)}, the total becomes ${K.usd(14800000 + house - ae)}, and the estate owes ${K.usd(after(house - ae, 14800000).tax)}. Without the gift, the estate would have been ${K.usd(14800000 + house)} and owed ${K.usd(after(0, 14800000 + house).tax)}. Gifts therefore do not escape the federal system; the reporting keeps the exclusion honest.</p>
<h2>Gifts that are not gifts: tuition and medical bills</h2>
<p>Section 2503(e) excludes, without any dollar limit, amounts paid on someone's behalf as tuition to an educational organization, or to a provider of medical care for that person. The payment has to go directly to the school or the provider. Books, room and board do not qualify, and contributions to a 529 plan are ordinary gifts, not tuition. A grandparent who pays ${K.usd(60000)} of university tuition straight to the university and also gives the student ${K.usd(ae)} in cash has made no taxable gift. The exclusion applies regardless of the relationship between the payer and the person helped.</p>
<h2>Splitting a gift with a spouse</h2>
<p>A married donor can elect, with the spouse's consent, to treat every gift made to third parties during the year as made half by each. The pair then has two annual exclusions per recipient, ${K.usd(2 * ae)} in 2026, but the election requires a Form 709 even if nothing is taxable, and it covers all gifts of the year, not only one. The ${h.a('gift-tax-limit', 'annual exclusion page')} shows the arithmetic, and the special exclusion of ${K.usd(F.nonCitizenSpouse)} for a spouse who is not a US citizen.</p>
<h2>Connecticut: the only state gift tax</h2>
<p>Connecticut taxes gifts made by its residents, and gifts of Connecticut real estate or tangible property by nonresidents. The ${h.src('ct_drs', 'Department of Revenue Services')} sets the 2026 exemption at ${K.usd(CT.exemption)} for the total of Connecticut taxable gifts made since January 1, 2005, the same amount as the federal exclusion. Above it the tax is ${K.pct(CT.table![0].rate, 0)} of the excess. The return, Form CT-706/709, is an annual return due April 15, 2027 for 2026 gifts, and it is required for every year with a Connecticut taxable gift even when no tax is due. Gift tax and estate tax together cannot exceed ${K.usd(CT.cap!)} per person. The ${h.a('connecticut-estate-tax', 'Connecticut page')} covers the estate side.</p>
<h2>States without a gift tax that still count gifts</h2>
<p>No other state taxes gifts when they are made, which makes lifetime gifts a common way to reduce a state estate tax. Several states close part of that door by adding recent gifts back at death: New York and Minnesota for gifts within three years, Vermont within two years, Maine within one year. Hawaii reduces its exclusion by lifetime taxable gifts, and Illinois and Maryland count adjusted taxable gifts in their computation. The rules state by state are on ${h.a('gifts-and-state-estate-tax', 'gifts and state estate taxes')}.</p>
`,
  faqs: [
    { q: 'Do I pay tax when I give my son more than the annual exclusion?', a: `Usually not. The amount above ${K.usd(ae)} is a taxable gift reported on Form 709, and it uses part of the ${K.usd(ex)} lifetime exclusion. Gift tax at ${K.pct(top, 0)} is paid only once all lifetime taxable gifts exceed that exclusion. The gift is added back to the estate at death, which keeps the total in check.` },
    { q: 'When is Form 709 due for a gift made in 2026?', a: `April 15, 2027, or the next business day if that date falls on a weekend or legal holiday, as the Form 709 instructions say. The return can be filed electronically. A return is needed for any taxable gift, for a gift of a future interest even if small, and whenever spouses elect to split their gifts.` },
    { q: 'Is paying a grandchild’s tuition a taxable gift?', a: `No, if the payment goes directly to the school and covers tuition only. Section 2503(e) excludes such payments without limit and without a Form 709. Paying room and board, books, or giving the money to the student is an ordinary gift, covered by the annual exclusion of ${K.usd(ae)} and then by the lifetime exclusion.` },
    { q: 'Does Connecticut tax gifts made by a resident in 2026?', a: `Only above a lifetime total of ${K.usd(CT.exemption)} of Connecticut taxable gifts made since 2005, at ${K.pct(CT.table![0].rate, 0)} of the excess. A Connecticut gift tax return is still filed for every year with a taxable gift. Connecticut is the only state with a gift tax; the others leave gifts untaxed when made.` },
  ],
  tool: 'gift',
  toolArg: { amt: g1 },
  related: ['gift-tax-limit', 'estate-tax-exemption', 'gifts-and-state-estate-tax', 'connecticut-estate-tax', 'non-citizen-spouse'],
  sources: ['usc_2503', 'irs_gift_faq', 'irs_i709', 'ct_drs', 'pl_119_21'],
});
