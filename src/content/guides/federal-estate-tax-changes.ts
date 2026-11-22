import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

// Campagne 2027 (2026-11-22): 2027 amounts from Rev. Proc. 2026-35 (params federal.y2027). State 2027 amounts are not
// published except where the statute ties them to the federal amount (Connecticut).
const F = K.F, Y = F.y2027;
const ex = F.basicExclusion, ex27 = Y.basicExclusion;
const fed = (x: number, y: '2026' | '2027', dsue = 0) => K.federalEstateTax({ taxableEstate: x, gifts: 0, dsue, bea: y === '2027' ? ex27 : ex }).tax;
const credit27 = K.federalEstateTax({ taxableEstate: ex27, gifts: 0, dsue: 0, bea: 0 }).tax;
const saved = fed(20000000, '2026') - fed(20000000, '2027');
const cases = [15000000, 15480000, 16000000, 20000000, 30000000].map((x) => [K.usd(x), K.usd(fed(x, '2026')), K.usd(fed(x, '2027')), K.usd(fed(x, '2026') - fed(x, '2027'))]);
const INDEXED = ['DC', 'ME', 'NY', 'RI'];
const status = (c: string) => c === 'CT' ? `${K.usd(ex27)}, tied to the federal amount by statute` : c === 'WA' ? 'Disputed: see the Washington page' : INDEXED.includes(c) ? 'Indexed, 2027 amount not published yet' : 'Fixed amount, no 2027 change published';
const slugOf = (c: string) => c === 'DC' ? 'district-of-columbia-estate-tax' : `${K.nameOf(c).toLowerCase().replace(/ /g, '-')}-estate-tax`;

export default defineGuide({
  id: 'federal-estate-tax-changes',
  group: 'federal',
  order: 105,
  slug: 'federal-estate-tax-changes',
  nav: 'Estate tax in 2027',
  card: `${K.usd(ex27)} exclusion and ${K.usd(Y.annualExclusion)} annual gift exclusion for 2027, next to 2026`,
  title: 'Federal Estate Tax 2027 vs 2026: $15.48 Million Exclusion',
  description: `Federal estate tax in 2027 vs 2026: ${K.usd(ex27)} exclusion per person, ${K.usd(Y.annualExclusion)} annual gift exclusion, ${K.usd(Y.nonCitizenSpouse)} to a noncitizen spouse, top rate 40% (IRS).`,
  h1: 'Federal estate tax in 2027: what changes from 2026',
  intro: `The federal estate tax for deaths in 2027 uses an exclusion of ${K.usd(ex27)}, against ${K.usd(ex)} in 2026. Enter a taxable estate to compare the two years.`,
  facts: [['Exclusion 2027', K.usd(ex27)], ['Exclusion 2026', K.usd(ex)], ['Annual gift exclusion 2027', K.usd(Y.annualExclusion)], ['Top rate', K.pct(F.topRate, 0)]],
  resume: `For a death in 2027 the federal basic exclusion amount is ${K.usd(ex27)} per person, published by the IRS in Rev. Proc. 2026-35, up from ${K.usd(ex)} in 2026. It is the first year the amount set by Public Law 119-21 is adjusted for inflation. The same exclusion covers lifetime taxable gifts, so it also rises for gifts made in 2027, and the generation-skipping transfer exemption follows it. A married couple who elect portability can shelter ${K.usd(2 * ex27)}. The annual gift exclusion moves from ${K.usd(F.annualExclusion)} to ${K.usd(Y.annualExclusion)} per recipient, the first increase since 2025, and gifts to a spouse who is not a US citizen are excluded up to ${K.usd(Y.nonCitizenSpouse)}, against ${K.usd(F.nonCitizenSpouse)}. The rate does not change: ${K.pct(F.topRate, 0)} on every dollar above the exclusion, so an estate of ${K.usd(20000000)} owes ${K.usd(saved)} less in 2027 than in 2026. State exemptions are a separate matter: only Connecticut follows the federal amount, and most indexed states have not yet published their 2027 figures.`,
  body: (h) => `
${h.mini('fed2027', { t: 'Federal estate tax, death in 2027 against 2026', p: ['estate'], d: { estate: 20000000 } })}
<h2>The 2027 federal amounts next to 2026</h2>
<p>Every 2027 figure below comes from ${h.src('rp_2026_35', 'Rev. Proc. 2026-35')}, sections 3.44 and 3.46. The 2026 figures come from ${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}.</p>
${h.table(['Amount', '2026', '2027'], [
    ['Basic exclusion amount (estate and lifetime gifts)', K.usd(ex), K.usd(ex27)],
    ['Couple with portability', K.usd(2 * ex), K.usd(2 * ex27)],
    ['Generation-skipping transfer exemption', K.usd(F.gstExemption), K.usd(ex27)],
    ['Basic credit amount', K.usd(F.basicCredit), K.usd(credit27)],
    ['Annual gift exclusion per recipient', K.usd(F.annualExclusion), K.usd(Y.annualExclusion)],
    ['Annual exclusion, gifts to a noncitizen spouse', K.usd(F.nonCitizenSpouse), K.usd(Y.nonCitizenSpouse)],
    ['Top rate', K.pct(F.topRate, 0), K.pct(F.topRate, 0)],
  ], 'Federal estate and gift tax amounts for deaths and gifts in 2026 and 2027.', ['l', 'r', 'r'])}
<h2>How much less federal estate tax in 2027</h2>
<p>The rate schedule of section 2001(c) is not indexed, and above ${K.usd(1000000)} every dollar is taxed at ${K.pct(F.topRate, 0)}. A higher exclusion therefore saves the same amount for every estate above it: ${K.pct(F.topRate, 0)} of the ${K.usd(ex27 - ex)} increase, or ${K.usd(saved)}. An estate between the two amounts owes tax for a death in 2026 and none for a death in 2027.</p>
${h.table(['Taxable estate', 'Federal tax, death in 2026', 'Federal tax, death in 2027', 'Difference'], cases, 'Unmarried decedent, no lifetime taxable gifts, no state tax deducted.', ['r', 'r', 'r', 'r'])}
<p>The year that counts is the year of death, not the year the return is filed. Someone who dies on December 20, 2026 has the ${K.usd(ex)} exclusion even though the ${h.a('estate-tax-return-deadline', 'Form 706')} is due in September 2027. A survivor who received a deceased spouse's unused exclusion keeps that DSUE amount as it was fixed at the first death; only the survivor's own basic exclusion moves to ${K.usd(ex27)}.</p>
<h2>Gifts in 2027</h2>
<p>From January 1, 2027, a donor can give ${K.usd(Y.annualExclusion)} to each person without filing Form 709, or ${K.usd(2 * Y.annualExclusion)} when a married couple elects to split gifts. A gift above that line is a taxable gift: it is reported by April 15, 2028 and uses part of the ${K.usd(ex27)} lifetime exclusion, without any tax to pay. Gifts to a spouse who is a US citizen remain unlimited; gifts to a spouse who is not are excluded up to ${K.usd(Y.nonCitizenSpouse)}. People who used their full ${K.usd(ex)} in 2026 get ${K.usd(ex27 - ex)} of new room in 2027. The ${h.a('gift-tax-limit', 'annual exclusion page')} and the ${h.a('non-citizen-spouse', 'noncitizen spouse page')} still show the 2026 figures for gifts made this year.</p>
<h2>State estate taxes in 2027</h2>
<p>A state exemption follows the federal one only when the state law says so. Connecticut does: section 12-391 of its General Statutes uses the federal basic exclusion amount, so the Connecticut exemption becomes ${K.usd(ex27)} for deaths in 2027, although the Department of Revenue Services has not printed it yet. The District of Columbia, Maine, New York and Rhode Island index their own exemptions and usually publish the new amount in December or January. The others are fixed amounts written in the statute, and no change for 2027 has been published.</p>
${h.table(['Jurisdiction', '2026 exemption', '2027'], [...K.ESTATE_CODES].sort((a, b) => K.E[a].exemption - K.E[b].exemption).map((c) => [h.a(slugOf(c), K.nameOf(c)), K.usd(K.E[c].exemption), status(c)]), 'State estate tax exemptions: what is known for deaths in 2027, as of November 22, 2026.', ['l', 'r', 'l'])}
<p>For a resident of one of these states, the federal increase changes little in practice. A Massachusetts estate of ${K.usd(5000000)} owes no federal tax in either year and the same Massachusetts tax in both, because the state exemption stays at ${K.usd(K.E.MA.exemption)}. Connecticut is the exception: since its exemption moves with the federal amount, an estate of ${K.usd(15400000)} that owes Connecticut tax for a death in 2026 owes none for a death in 2027.</p>
<h2>What does not change in 2027</h2>
<p>The structure of the tax stays as Public Law 119-21 left it. The rate schedule of section 2001(c) still runs from 18% to ${K.pct(F.topRate, 0)}, and it is not indexed. Portability still requires a timely Form 706 at the first death, even when no tax is due, and the return is still due nine months after death with an automatic six-month extension available on Form 4768. The marital deduction for a spouse who is a US citizen stays unlimited, and the charitable deduction stays unlimited. Property held by a nonresident who is not a citizen keeps the old ${K.usd(F.nraThreshold)} filing threshold, which is fixed by statute and not adjusted for inflation.</p>
<p>Nothing in the law ends the higher exclusion. Section 70106 has no sunset date, so the ${K.usd(ex27)} amount is the starting point for the 2028 adjustment, which the IRS will publish in the autumn of 2027. Any future cut would need a new act of Congress.</p>
<h2>Gifts at the turn of the year</h2>
<p>The annual exclusion applies per calendar year, so the two years add up. A parent who gives a child ${K.usd(F.annualExclusion)} on December 28, 2026 and ${K.usd(Y.annualExclusion)} on January 4, 2027 has made two gifts that are both fully excluded, ${K.usd(F.annualExclusion + Y.annualExclusion)} in total, with no Form 709 to file. A check written in December but cashed in January is generally treated as a January gift, so a donor who wants the 2026 exclusion should make sure the payment clears before December 31. Payments of tuition made straight to a school and medical bills paid straight to the provider are not gifts at all, in 2027 as before.</p>
<p>This site prints no forecast for the indexed states. Each state page will carry its 2027 amount once the revenue department publishes it, with the date it was read.</p>
`,
  faqs: [
    { q: 'What is the federal estate tax exemption for a death in 2027?', a: `${K.usd(ex27)} per person, the basic exclusion amount set by the IRS in Rev. Proc. 2026-35 for deaths and gifts in calendar year 2027. It was ${K.usd(ex)} in 2026. Above it the estate pays ${K.pct(F.topRate, 0)} on each dollar, after deducting what goes to a spouse or to charity.` },
    { q: 'How much can I give one person in 2027 without filing a gift tax return?', a: `${K.usd(Y.annualExclusion)}, up from ${K.usd(F.annualExclusion)} in 2026. A married couple who split their gifts can give ${K.usd(2 * Y.annualExclusion)} to each person. Above that amount you file Form 709 by April 15, 2028, and the excess uses part of your lifetime exclusion; no tax is due until gifts and estate together pass ${K.usd(ex27)}.` },
    { q: 'Does an estate pay less federal tax if the death happens in January 2027 rather than December 2026?', a: `Yes, when the estate is above ${K.usd(ex)}. The exclusion is fixed by the year of death, so a death in 2027 uses ${K.usd(ex27)}. Since the extra ${K.usd(ex27 - ex)} would have been taxed at ${K.pct(F.topRate, 0)}, a large estate saves ${K.usd(saved)}, and an estate between the two amounts owes nothing at all.` },
    { q: 'Will my state estate tax exemption also rise in 2027?', a: `Only in some states. Connecticut ties its exemption to the federal amount, so it becomes ${K.usd(ex27)}. The District of Columbia, Maine, New York and Rhode Island adjust theirs for inflation but have not published 2027 amounts yet. The other states with an estate tax use fixed amounts that do not change unless the legislature acts.` },
  ],
  tool: 'fed2027',
  toolArg: { estate: 20000000 },
  related: ['estate-tax-exemption', 'gift-tax-limit', 'portability', 'non-citizen-spouse', 'connecticut-estate-tax', 'state-estate-tax'],
  sources: ['rp_2026_35', 'rp_2025_32', 'pl_119_21', 'ct_statute'],
});
