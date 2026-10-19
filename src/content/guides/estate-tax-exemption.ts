import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const ex = F.basicExclusion;
const H = F.history as Record<string, number>;
const fedOn = (x: number, dsue = 0) => K.federalEstateTax({ taxableEstate: x, gifts: 0, dsue }).tax;
const big = 18000000, couple = 2 * ex;
const states = [...K.ESTATE_CODES].sort((a, b) => K.E[a].exemption - K.E[b].exemption);
const low = states[0], high = states[states.length - 1];
const under = states.filter((c) => K.E[c].exemption < ex).length;

export default defineGuide({
  id: 'estate-tax-exemption',
  group: 'federal',
  order: 100,
  slug: 'estate-tax-exemption',
  nav: 'Estate tax exemption',
  card: `${K.usd(ex)} per person in 2026, and the 13 state exemptions next to it`,
  title: `Estate Tax Exemption 2026: ${K.mil(ex).replace('million', 'Million')} Federal and by State`,
  description: `Estate tax exemption 2026: ${K.usd(ex)} federal per person under Public Law 119-21, ${K.usd(couple)} for a couple with portability, and every state exemption.`,
  h1: 'Estate tax exemption in 2026: federal and state',
  intro: `The federal exemption is ${K.usd(ex)} for deaths and gifts in 2026. Twelve of the thirteen state exemptions are lower, some far lower. Enter an estate to see the federal tax, then compare with the states below.`,
  facts: [['Federal exclusion 2026', K.usd(ex)], ['Couple with portability', K.usd(couple)], ['Lowest state exemption', `${K.nameOf(low)}, ${K.usd(K.E[low].exemption)}`], ['Rate above it', K.pct(F.topRate, 0)]],
  resume: `For a death in 2026 the federal basic exclusion amount is ${K.usd(ex)} per person, set by section 70106 of Public Law 119-21, signed on July 4, 2025, which rewrote section 2010(c)(3) of the Internal Revenue Code. It was ${K.usd(H['2025'])} in 2025 and ${K.usd(H['2024'])} in 2024, and the law makes it indexed for inflation again from 2027, as Rev. Proc. 2025-32 states. The same amount covers lifetime taxable gifts and the estate together, so a gift above the annual exclusion uses part of it. A married couple can shelter ${K.usd(couple)} when the survivor receives the unused exclusion of the first spouse through portability. Above the exclusion the tax is ${K.pct(F.topRate, 0)}: an estate of ${K.usd(big)} owes ${K.usd(fedOn(big))}. The state picture is different. ${under} of the 13 jurisdictions with an estate tax exempt less than ${K.usd(ex)}, from ${K.usd(K.E[low].exemption)} in ${K.nameOf(low)} to ${K.usd(K.E[high].exemption)} in ${K.nameOf(high)}, and those state exemptions decide the tax for most estates that pay any.`,
  body: (h) => `
<h2>Where the ${K.usd(ex)} comes from</h2>
<p>The federal estate tax and the gift tax share one exemption, called the basic exclusion amount. Section 70106 of ${h.src('pl_119_21', 'Public Law 119-21')} replaced the $5,000,000 base written in section 2010(c)(3) with $15,000,000, moved the base year for inflation to 2025, and struck subparagraph (C) of the same paragraph. The amendment applies to estates of people dying, and gifts made, after December 31, 2025. The IRS confirms the figure on its ${h.src('irs_whats_new', 'estate and gift tax news page')}, and ${h.src('rp_2025_32', 'Rev. Proc. 2025-32')} adds that the amount will be adjusted for inflation for 2027 and later years.</p>
<p>The exemption works through a credit. The tax is first computed on the whole taxable estate plus lifetime taxable gifts with the rate schedule of section 2001(c), then reduced by the tax that schedule would produce on the exclusion itself. On ${K.usd(ex)} that credit is ${K.usd(F.basicCredit)}, the basic credit amount printed in the ${h.src('irs_i706', 'Form 706 instructions')}. Since the schedule reaches its top rate of ${K.pct(F.topRate, 0)} at ${K.usd(1000000)}, every dollar above the exclusion is taxed at ${K.pct(F.topRate, 0)}.</p>
${h.table(['Year of death', 'Basic exclusion', 'Couple with portability'], Object.keys(H).sort().reverse().map((y) => [y, K.usd(H[y]), K.usd(2 * H[y])]), 'Basic exclusion amount by year of death, as listed by the IRS.', ['l', 'r', 'r'])}
<h2>One exemption for gifts and the estate</h2>
<p>Gifts are counted first. A parent who gives a child ${K.usd(1019000)} in 2026 has made a taxable gift of ${K.usd(1019000 - F.annualExclusion)}, after the annual exclusion of ${K.usd(F.annualExclusion)}. No gift tax is due: the gift is reported on Form 709 and uses that much of the exclusion. At death the adjusted taxable gifts are added to the estate, and the credit is computed on the total. The ${h.a('gift-tax', 'gift tax page')} shows the computation for one gift, and ${h.a('gift-tax-limit', 'the annual exclusion page')} covers the gifts that never touch the exemption at all.</p>
${h.mini('fed', { t: 'Federal tax on an estate above the exemption', p: ['estate'], d: { estate: big } })}
<h2>A couple: ${K.usd(couple)} with portability</h2>
<p>Each spouse has an exclusion. Anything left to a surviving spouse who is a US citizen is deducted without limit, so the first death usually uses little or none of it. Since 2011 the executor of the first spouse can pass the unused part, the deceased spousal unused exclusion or DSUE amount, to the survivor by filing a timely Form 706. A survivor holding a full DSUE amount dies with ${K.usd(couple)} of exclusion. A couple worth ${K.usd(25000000)} that elects portability owes ${K.usd(fedOn(25000000, ex))} at the second death; without the election the same estate would owe ${K.usd(fedOn(25000000))}. The rules, and why most states do not follow them, are on ${h.a('portability', 'the portability page')}.</p>
<h2>The 13 state exemptions next to the federal one</h2>
<p>Twelve states and the District of Columbia tax estates themselves, each with its own exemption. Only Connecticut follows the federal figure, by statute. The others are fixed amounts or are indexed on their own formula, and several are a small fraction of ${K.usd(ex)}. For these estates the federal exemption is beside the point: an Oregon estate of ${K.usd(3000000)} owes ${K.usd(K.stateTax('OR', 3000000))} to Oregon and nothing to the IRS.</p>
${h.table(['Jurisdiction', '2026 exemption', '2025', 'State tax on ' + K.usd(10000000)], states.map((c) => [h.a(c === 'DC' ? 'district-of-columbia-estate-tax' : `${K.nameOf(c).toLowerCase().replace(/ /g, '-')}-estate-tax`, K.nameOf(c)), K.usd(K.E[c].exemption), K.usd(K.E[c].prev), K.usd(K.stateTax(c, 10000000))]), `State exemptions for deaths in 2026, lowest first, and the tax each state levies on a ${K.usd(10000000)} taxable estate of a resident (no gifts, no property elsewhere). Washington: deaths from July 1, 2026.`, ['l', 'r', 'r', 'r'])}
<p>The last column explains why the state matters more than the federal number for an estate of that size. A ${K.usd(10000000)} estate owes no federal tax in 2026, yet it owes something in every one of these jurisdictions except Connecticut. The detail of each method, including the New York cliff and the Massachusetts credit, is on ${h.a('state-estate-tax', 'the state estate tax page')}.</p>
<h2>What indexing from 2027 means</h2>
<p>The new law brought back inflation adjustment with 2025 as the base year. The IRS publishes the amounts for future years in annual revenue procedures; until the 2027 one is out, no 2027 figure is official, and this site does not print a forecast. Section 2010(c)(3) rounds the adjusted amount to the nearest multiple of $10,000, which is why every exclusion in the IRS table ends in four zeros. Section 70106 contains no ending date: the amount it sets applies to every estate and gift after December 31, 2025, adjusted each year from 2027.</p>
<h2>Gifts made before 2026</h2>
<p>People who made large gifts in 2024 or 2025, when the exclusion was ${K.usd(H['2024'])} and then ${K.usd(H['2025'])}, have used part of an exclusion that is now larger. The remaining room is simply the 2026 amount minus the adjusted taxable gifts already made. The IRS gift tax FAQ addresses this case and confirms that the ${K.usd(ex)} applies to gifts made in 2026 (${h.src('irs_gift_faq', 'IRS gift tax questions')}).</p>
`,
  faqs: [
    { q: 'What is the federal estate tax exemption for a death in 2026?', a: `It is ${K.usd(ex)} per person, the basic exclusion amount set by Public Law 119-21 of July 4, 2025. It applies to the taxable estate plus lifetime taxable gifts. Up from ${K.usd(H['2025'])} for deaths in 2025, it will be indexed for inflation from 2027. Above it, each dollar is taxed at ${K.pct(F.topRate, 0)}.` },
    { q: `Is the ${K.mil(ex)} exemption scheduled to drop back to a lower amount?`, a: `No reduction is scheduled. Public Law 119-21 rewrote section 2010(c)(3) with a $15,000,000 base for estates and gifts after December 31, 2025, and Rev. Proc. 2025-32 confirms it will be adjusted for inflation for 2027 and later years. A future Congress can change it, as with any tax provision, but no date is written into the law.` },
    { q: `Can a married couple shelter ${K.usd(couple)} from federal estate tax?`, a: `Yes, when the first spouse's executor elects portability on a timely Form 706. The survivor then adds the unused exclusion of the first spouse to their own ${K.usd(ex)}. The election is not automatic: without a return filed for the first death, the survivor keeps a single exclusion.` },
    { q: 'Which state has the same estate tax exemption as the federal one?', a: `Connecticut, whose statute ties its exemption to the federal basic exclusion amount: ${K.usd(K.E.CT.exemption)} for deaths in 2026. Every other state with an estate tax exempts less, the lowest being ${K.nameOf(low)} at ${K.usd(K.E[low].exemption)}. An estate under the federal line can still owe a large state tax.` },
  ],
  tool: 'fed',
  toolArg: { estate: big },
  related: ['portability', 'estate-tax-rates', 'gift-tax', 'state-estate-tax', 'connecticut-estate-tax', 'married-couples-state-estate-tax'],
  sources: ['pl_119_21', 'rp_2025_32', 'irs_whats_new', 'irs_i706', 'irs_gift_faq'],
});
