import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

type When = '1y' | '2y' | '3y' | 'old';
const AX = K.F.annualExclusion;
/** State estate tax of a resident whose estate at death is `estate`, after a gift of `gift` to one child made `when`. */
const after = (st: string, estate: number, gift: number, when: When) =>
  K.computeCase({ estate, st, married: false, toSpouse: 'none', heir: 'child', heirs: 2, gifts: Math.max(0, gift - AX), giftWhen: when }).home?.tax ?? 0;
const RULE: Record<string, string> = {
  lifetime: 'Every Connecticut taxable gift since 2005 is added; Connecticut also has its own gift tax',
  '3y': 'Taxable gifts of the 3 years before death are added back',
  '2y': 'Taxable gifts of the 2 years before death are added back',
  '1y': 'Taxable gifts of the year before death are added back',
  'reduce-exclusion': 'No gift tax, but adjusted taxable gifts reduce the exclusion',
  il: `Adjusted taxable gifts count in the ${K.usd(K.E.IL.exemption)} threshold and in the computation`,
  md: 'Adjusted taxable gifts enter the filing test and the Table B credit computation (Schedule B)',
  none: 'No add-back of lifetime gifts in the instructions read for this site',
};
// Worked cases: a gift of $1,000,000 (New York), $600,000 (Minnesota), $500,000 (Vermont and Maine), each to one child.
const ny = { estate: 7000000, gift: 1000000 }, mn = { estate: 3200000, gift: 600000 }, vt = { estate: 4800000, gift: 500000 }, me = { estate: 7000000, gift: 500000 };
const CASES: Array<[string, { estate: number; gift: number }, When]> = [['NY', ny, '3y'], ['MN', mn, '3y'], ['VT', vt, '2y'], ['ME', me, '1y']];
const ct = { estate: 14000000, gifts: 2000000 };
const ctTax = K.computeCase({ estate: ct.estate, st: 'CT', married: false, toSpouse: 'none', heir: 'child', heirs: 2, gifts: ct.gifts, giftWhen: 'old' }).home?.tax ?? 0;
const hi = { estate: 5000000, gifts: 1000000 };
const hiTax = K.computeCase({ estate: hi.estate, st: 'HI', married: false, toSpouse: 'none', heir: 'child', heirs: 2, gifts: hi.gifts, giftWhen: 'old' }).home?.tax ?? 0;
const nyWithin = after('NY', ny.estate, ny.gift, '2y'), nyOld = after('NY', ny.estate, ny.gift, 'old');

export default defineGuide({
  id: 'gifts-and-state-estate-tax',
  group: 'guides',
  order: 420,
  slug: 'gifts-and-state-estate-tax',
  nav: 'Gifts and state estate tax',
  card: 'Which states add lifetime gifts back, and over how many years',
  title: 'Gifts and State Estate Tax 2026: Look-Back Rules by State',
  description: `Gifts and state estate tax in 2026: Connecticut counts every gift since 2005, New York and Minnesota 3 years, Vermont 2, Maine 1, Hawaii cuts the exclusion.`,
  h1: 'Lifetime gifts and state estate taxes in 2026',
  intro: 'A gift made during life leaves the estate, but several states pull it back in if death follows within a few years. Enter a gift to see the federal annual exclusion, the Form 709 question and, for Connecticut, the state gift tax return.',
  facts: [['Federal annual exclusion', K.usd(AX)], ['Look-back in New York and Minnesota', '3 years'], ['States with a gift tax', 'Connecticut only'], ['Form 709 due', 'April 15, 2027']],
  resume: `Only Connecticut taxes gifts as such among the states: it counts every Connecticut taxable gift made since January 1, 2005, exempts the first ${K.usd(K.E.CT.exemption)} in total and adds those gifts to the estate at death. Elsewhere a gift is a way to shrink the estate that a state will tax, with a look-back period in four of them. New York and Minnesota add back taxable gifts made within three years of death, Vermont within two years, Maine within one year, and Hawaii reduces its ${K.usd(K.E.HI.exemption)} exclusion by every adjusted taxable gift. Illinois and Maryland bring gifts into their computations through the federal figures. A gift of up to ${K.usd(AX)} per person in 2026, the federal annual exclusion, is not a taxable gift at all and is never added back. A New York resident who gives a child ${K.usd(ny.gift)} and dies two years later with ${K.usd(ny.estate)} owes ${K.usd(nyWithin)} in New York estate tax; the same gift made four years earlier leaves ${K.usd(nyOld)}.`,
  body: (h) => `
<h2>The rule in each estate-tax state</h2>
${h.table(['Jurisdiction', 'What happens to lifetime gifts'], K.ESTATE_CODES.map((st) => [K.nameOf(st), RULE[K.E[st].gifts] ?? RULE.none]), `Deaths in 2026. Taxable gift means a federal taxable gift: the part above the annual exclusion of ${K.usd(AX)} per recipient, after the marital and charitable deductions.`, ['l', 'l'])}
<p>The wording matters. Every look-back rule counts taxable gifts in the federal sense, defined by ${h.src('usc_2503', '26 U.S.C. 2503')}: the value given to a person in a year minus the annual exclusion. Gifts within ${K.usd(AX)} per person, tuition paid directly to a school and medical bills paid directly to the provider are not taxable gifts and stay out of every state computation. Vermont's statute adds a detail that the others share in substance: the amount added back is the gift's value when made, and any part already included in the federal gross estate is not counted twice.</p>
<h2>What a look-back costs, four examples</h2>
<p>Each line follows a resident who gives one child a single sum and dies in 2026 with the estate shown, the rest going to two children. The middle column applies the state's look-back to a gift inside the period; the last column assumes the gift was made long enough before death to escape it.</p>
${h.table(['State', 'Estate at death', 'Gift to a child', 'Tax, gift inside the look-back', 'Tax, older gift'], CASES.map(([st, c, w]) => [K.nameOf(st), K.usd(c.estate), K.usd(c.gift), K.usd(after(st, c.estate, c.gift, w)), K.usd(after(st, c.estate, c.gift, 'old'))]), `Gift made in a single year to one child; the part above ${K.usd(AX)} is the taxable gift. Rules of each state for deaths in 2026.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The New York line shows why the three-year rule matters more there than anywhere else. The gift brings the estate back over the exclusion of ${K.usd(K.E.NY.exemption)}, past the point where the credit disappears, so the tax is computed on the whole sum from the first dollar. The rule is written in the ${h.src('ny_et706i', 'ET-706 instructions')} for deaths before ${K.month(K.E.NY.giftsUntil!)}, and only gifts made while a New York resident count. In Minnesota the clause is in ${h.src('mn_291_016', 'section 291.016')}, in Vermont in the statute behind the ${h.src('vt_tax', 'Department of Taxes')} page, and in Maine the filing test itself includes taxable gifts made within one year of death (${h.src('me_mrs', 'Maine Revenue Services')}).</p>
${h.mini('gift', { t: 'Is this gift a taxable gift?', p: ['amt', 'split'], d: { amt: 100000 } })}
<h2>Connecticut, the only state gift tax</h2>
<p>Connecticut has had a gift tax since 2005, and its ${h.src('ct_drs', 'Department of Revenue Services')} sets the 2026 exemption at ${K.usd(K.E.CT.exemption)} of aggregate Connecticut taxable gifts made since January 1, 2005, the same amount as the federal basic exclusion. Above it the tax is ${K.pct(K.E.CT.table![0].rate, 0)} of the excess. The annual return, Form CT-706/709, covers all Connecticut taxable gifts of the calendar year and is filed by April 15 of the next year even when no tax is due. A resident's taxable gifts include intangible property wherever located; a nonresident's include only real and tangible property in Connecticut.</p>
<p>At death, the Connecticut taxable estate adds every Connecticut taxable gift made since 2005 that is not already in the federal gross estate, plus any Connecticut gift tax paid in the three years before death. Someone who leaves ${K.usd(ct.estate)} after ${K.usd(ct.gifts)} of lifetime taxable gifts has a Connecticut taxable estate of ${K.usd(ct.estate + ct.gifts)}, and owes ${K.usd(ctTax)}. The combined Connecticut estate and gift tax of one person is capped at ${K.usd(K.E.CT.cap!)}. The details are on the ${h.a('connecticut-estate-tax', 'Connecticut page')}.</p>
<h2>Hawaii, Illinois and Maryland: gifts inside the formula</h2>
<p>Hawaii has no gift tax, but the ${h.src('hi_m6', 'M-6 instructions')} reduce the applicable exclusion by the federal adjusted taxable gifts of the decedent, whatever the year they were made. With ${K.usd(hi.gifts)} of past taxable gifts, an estate of ${K.usd(hi.estate)} that would sit under the ${K.usd(K.E.HI.exemption)} exclusion owes ${K.usd(hiTax)}. Illinois requires Form 700 when the estate plus adjusted taxable gifts exceeds ${K.usd(K.E.IL.exemption)} (${h.src('il_fact', 'Attorney General fact sheet')}), and its computation caps the tax with those gifts included. Maryland puts the adjusted taxable gifts in the filing test and in the federal tentative tax of Schedule B on ${h.src('md_met1', 'Form MET 1')}.</p>
<h2>The federal side, for every state</h2>
<p>Federal law taxes gifts and estates with one exclusion: ${K.usd(K.F.basicExclusion)} per person in 2026. Gifts above the annual exclusion are reported on Form 709 and use part of that amount, and at death the adjusted taxable gifts are added to the estate to compute the federal tax (${h.src('irs_gift_faq', 'IRS gift tax questions')}). A married couple can split a gift and give ${K.usd(2 * AX)} to each person without a taxable gift, with a Form 709 to elect the split. The ${h.a('gift-tax', 'federal gift tax')} and ${h.a('gift-tax-limit', 'annual limit')} pages cover those rules; what this page adds is the state layer, which can make the timing of a large gift worth a six- or seven-figure difference.</p>
`,
  faqs: [
    { q: 'Does New York add back a gift made 30 months before death?', a: `Yes, if it was a taxable gift made while the donor lived in New York. New York counts taxable gifts made within three years of death for deaths before ${K.month(K.E.NY.giftsUntil!)}. A gift made 30 months earlier is inside that window. Gifts within the ${K.usd(AX)} annual exclusion per recipient are not taxable gifts and never come back.` },
    { q: 'Is there a Connecticut gift tax return even when no tax is owed?', a: `Yes. Form CT-706/709 reports every Connecticut taxable gift of the calendar year and is due by April 15 of the next year, whether or not tax is due. Tax applies only once the aggregate of Connecticut taxable gifts since January 1, 2005 exceeds ${K.usd(K.E.CT.exemption)}, at ${K.pct(K.E.CT.table![0].rate, 0)} of the excess.` },
    { q: 'Can Hawaii tax an estate under its exclusion because of old gifts?', a: `Yes. Hawaii has no gift tax, but it subtracts the decedent's federal adjusted taxable gifts from the ${K.usd(K.E.HI.exemption)} exclusion, without a look-back limit. An estate of ${K.usd(hi.estate)} after ${K.usd(hi.gifts)} of taxable gifts owes ${K.usd(hiTax)}, although the estate alone is under the exclusion.` },
    { q: 'Do Washington, Oregon, Massachusetts or Rhode Island add gifts back to the estate?', a: `The instructions and pages read for this site describe no add-back of lifetime gifts to the taxable estate in those four states, nor in the District of Columbia. Massachusetts does count adjusted taxable gifts in its ${K.usd(K.E.MA.exemption)} filing test. A gift still has to be reported federally on Form 709 when it exceeds the annual exclusion.` },
  ],
  tool: 'gift',
  toolArg: { amt: 50000, split: 'no', to: 'child' },
  related: ['gift-tax', 'gift-tax-limit', 'connecticut-estate-tax', 'new-york-estate-tax', 'minnesota-estate-tax', 'hawaii-estate-tax'],
  sources: ['ct_drs', 'ny_et706i', 'mn_291_016', 'vt_tax', 'me_mrs', 'hi_m6', 'il_fact', 'md_met1', 'usc_2503', 'irs_gift_faq'],
});
