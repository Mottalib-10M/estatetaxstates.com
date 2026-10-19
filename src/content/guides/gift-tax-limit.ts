import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const ae = F.annualExclusion, ex = F.basicExclusion;
const AH = F.annualExclusionHistory as Record<string, number>;
const NC = F.nonCitizenSpouseHistory as Record<string, number>;
const split = 2 * ae;
const kids = 3, people = 6;
const over = 25000;

export default defineGuide({
  id: 'gift-tax-limit',
  group: 'federal',
  order: 130,
  slug: 'gift-tax-limit',
  nav: 'Gift tax limit 2026',
  card: `${K.usd(ae)} per recipient, ${K.usd(split)} for a couple, ${K.usd(F.nonCitizenSpouse)} to a noncitizen spouse`,
  title: `Gift Tax Limit 2026: ${K.usd(ae)} Annual Exclusion per Person`,
  description: `Gift tax limit 2026: ${K.usd(ae)} per recipient, ${K.usd(split)} when spouses split, ${K.usd(F.nonCitizenSpouse)} to a noncitizen spouse, and what happens to any gift above that limit.`,
  h1: 'Gift tax limit for 2026: the annual exclusion',
  intro: `In 2026 anyone can give ${K.usd(ae)} to as many people as they like without filing anything. Enter a gift to see how much of it is above the limit and what that excess does.`,
  facts: [['Per recipient, 2026', K.usd(ae)], ['Couple splitting', K.usd(split)], ['Noncitizen spouse', K.usd(F.nonCitizenSpouse)], ['2024 limit', K.usd(AH['2024'])]],
  resume: `The annual gift tax exclusion is ${K.usd(ae)} per recipient for gifts made in 2026, the same as in 2025 and up from ${K.usd(AH['2024'])} in 2024, as set by Rev. Proc. 2025-32. It applies separately to each person who receives a gift, so a donor with ${kids} married children can give ${K.usd(people * ae)} to the six of them in one year with no return. Spouses who elect to split their gifts double the limit to ${K.usd(split)} per recipient, but must file Form 709 to make the election. Gifts to a spouse who is a US citizen are unlimited; gifts to a spouse who is not a citizen are excluded up to ${K.usd(F.nonCitizenSpouse)} in 2026. Going above the limit is not a tax event in itself: the excess is a taxable gift, reported by April 15 of the next year, which reduces the ${K.usd(ex)} lifetime exclusion. Only gifts of present interests qualify, so most gifts in trust need a closer look.`,
  body: (h) => `
<h2>The limit, year by year</h2>
<p>The exclusion was set at $10,000 in section 2503(b) and is indexed for inflation, rounded down to a multiple of $1,000. That rounding is why it often stays flat: the 2026 calculation did not reach the next step, so the limit stayed at ${K.usd(ae)}. The IRS publishes the amount for each year in the revenue procedure on inflation adjustments, ${h.src('rp_2025_32', 'Rev. Proc. 2025-32')} for 2026 and ${h.src('rp_2024_40', 'Rev. Proc. 2024-40')} for 2025.</p>
${h.table(['Year of gift', 'Per recipient', 'Couple splitting', 'Spouse not a US citizen'], Object.keys(AH).sort().reverse().map((y) => [y, K.usd(AH[y]), K.usd(2 * AH[y]), K.usd(NC[y])]), 'Annual exclusion amounts as published by the IRS.', ['l', 'r', 'r', 'r'])}
<h2>Per recipient, not per donor</h2>
<p>The limit counts what one donor gives to one recipient during the calendar year. A grandmother can give ${K.usd(ae)} to each of her eight grandchildren and to each of their parents, and none of it is a taxable gift. Gifts to the same person add up over the year: a check of ${K.usd(10000)} in March and another of ${K.usd(10000)} in December total ${K.usd(20000)}, which is ${K.usd(20000 - ae)} over the limit. The year resets on January 1, so a donor can give ${K.usd(ae)} on December 31 and ${K.usd(ae)} again on January 2.</p>
${h.mini('gift', { t: 'How much of a gift is above the limit?', p: ['amt'], d: { amt: over } })}
<h2>Above the limit: a form, not a bill</h2>
<p>A gift of ${K.usd(over)} to one person in 2026 is a taxable gift of ${K.usd(over - ae)}. The donor reports it on Form 709 by April 15, 2027. No tax is paid: the return applies the unified credit, and the donor's remaining lifetime exclusion becomes ${K.usd(ex - (over - ae))}. Tax at ${K.pct(F.topRate, 0)} begins only when lifetime taxable gifts pass ${K.usd(ex)}. At death the gifts above the limit are added back to the estate, so going over simply moves part of the exclusion from the estate to the gift. Gifts below the limit, by contrast, are gone from both: they never count anywhere, which is why repeated annual gifts are the simplest way to reduce an estate. The ${h.a('gift-tax', 'gift tax page')} follows the larger gifts.</p>
<h2>Splitting with a spouse</h2>
<p>A married donor can ask the spouse to consent to treat all gifts to third parties during the year as made half by each, under section 2513. One spouse can then write a check of ${K.usd(split)} to a child with nothing taxable. Conditions, from the ${h.src('irs_i709', 'Form 709 instructions')}: both spouses must be married to each other when the gift is made, the consent covers every gift of the year to third parties, and it is given on Form 709, signed by the consenting spouse. In most cases both spouses file their own return, even though no tax is due, because the election itself requires the form.</p>
<h2>Gifts to a spouse</h2>
<p>Gifts to a husband or wife who is a US citizen are deducted without limit: no exclusion is needed and no return is filed. If the spouse is not a citizen, the marital deduction does not apply in the same way, and the exclusion is raised to ${K.usd(F.nonCitizenSpouse)} for 2026 (${K.usd(NC['2025'])} in 2025). The ${h.a('non-citizen-spouse', 'page on noncitizen spouses')} covers the estate side, where the rules are stricter.</p>
<h2>Present interests and gifts in trust</h2>
<p>The exclusion applies only to gifts the recipient can use now. Cash, shares transferred outright and a deeded property are present interests. A transfer to a trust that holds the money until the beneficiary turns 35 is a future interest: it gets no exclusion, and the donor files Form 709 even for a small amount. In a trust where several beneficiaries have a present interest, each counts as a separate recipient for the exclusion. Whether a given trust qualifies depends on its terms, which the Form 709 instructions examine at length.</p>
<h2>What the limit does not cover</h2>
<p>Tuition paid directly to a school and medical bills paid directly to a provider are outside the gift tax altogether, in addition to the ${K.usd(ae)}. Gifts to charity are deductible. And the federal limit says nothing about state rules: Connecticut has its own gift tax, and several states add recent gifts back to the estate at death (${h.a('gifts-and-state-estate-tax', 'gifts and state estate taxes')}). The amounts on this page are read on the ${h.src('irs_gift_faq', 'IRS gift tax questions')}.</p>
`,
  faqs: [
    { q: 'How much can I give each person in 2026 without filing a gift tax return?', a: `${K.usd(ae)} per recipient, counting every gift made to that person during the calendar year. There is no limit on the number of recipients. The gift must be a present interest, such as cash or shares transferred outright. Above that amount the donor files Form 709, even though no tax is usually due.` },
    { q: `Can my wife and I give ${K.usd(split)} to our daughter in 2026?`, a: `Yes, with gift splitting. Each spouse uses an annual exclusion of ${K.usd(ae)}, so the couple can give ${K.usd(split)} to each recipient. If the money comes from only one of you, the other must consent on Form 709, and the election applies to all gifts either spouse makes to third parties that year.` },
    { q: 'Did the annual gift exclusion go up for 2026?', a: `No. It is ${K.usd(ae)} for 2026, the same as for 2025, after ${K.usd(AH['2024'])} in 2024. The amount is indexed for inflation but rounded down to a multiple of $1,000, so it rises only when inflation adds up to a full step. The exclusion for a noncitizen spouse did rise, to ${K.usd(F.nonCitizenSpouse)}.` },
    { q: `What happens if I give a friend ${K.usd(over)} this year?`, a: `The first ${K.usd(ae)} is excluded and the other ${K.usd(over - ae)} is a taxable gift. You report it on Form 709 by April 15, 2027, and it reduces your lifetime exclusion of ${K.usd(ex)} by that amount. No gift tax is paid unless your lifetime taxable gifts exceed the exclusion. Your friend owes nothing.` },
  ],
  tool: 'gift',
  toolArg: { amt: over },
  related: ['gift-tax', 'estate-tax-exemption', 'non-citizen-spouse', 'gifts-and-state-estate-tax'],
  sources: ['rp_2025_32', 'rp_2024_40', 'irs_gift_faq', 'irs_i709', 'usc_2503', 'usc_2513'],
});
