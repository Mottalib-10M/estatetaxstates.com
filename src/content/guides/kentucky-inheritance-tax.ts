import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const KY = K.I.KY as typeof K.I.KY & { dueMonths: number; dueMonthsBeforeJuly: number; discount: { rate: number; months: number; monthsBeforeJuly: number }; installments: { over: number; count: number } };
const B = KY.classes.B, Cc = KY.classes.C;
const b = (x: number) => K.inhTax('KY', 'inlaw', x);
const c = (x: number) => K.inhTax('KY', 'cousin', x);
const lo = (s: Array<[number | null, number]>) => K.pct(s[0][1], 0), hi = (s: Array<[number | null, number]>) => K.pct(s[s.length - 1][1], 0);
const amounts = [5000, 25000, 50000, 100000, 250000, 500000];
const n150 = 150000;

export default defineGuide({
  id: 'kentucky-inheritance-tax',
  group: 'inheritance',
  order: 330,
  slug: 'kentucky-inheritance-tax',
  nav: 'Kentucky',
  card: `Nephews and nieces exempt from 2026; Class B ${lo(B.slices!)} to ${hi(B.slices!)}, Class C ${lo(Cc.slices!)} to ${hi(Cc.slices!)}`,
  title: 'Kentucky Inheritance Tax 2026: Classes, Rates and New Rules',
  description: `Kentucky inheritance tax 2026: nephews and nieces now exempt, in-laws ${lo(B.slices!)} to ${hi(B.slices!)} after ${K.usd(B.exemption!)}, others ${lo(Cc.slices!)} to ${hi(Cc.slices!)}, longer deadlines from July 1, 2026.`,
  h1: 'Kentucky inheritance tax in 2026',
  intro: `Kentucky changed its inheritance tax twice in 2026: nephews and nieces joined the exempt class, and the deadlines grew longer for deaths from July 1. Enter the share and the relationship to see the tax.`,
  facts: [['Spouse, children, siblings, nephews', 'exempt'], ['In-laws, aunts, uncles', `${lo(B.slices!)} to ${hi(B.slices!)}`], ['Everyone else', `${lo(Cc.slices!)} to ${hi(Cc.slices!)}`], ['Due, deaths from July 1, 2026', `${KY.dueMonths} months`]],
  resume: `Kentucky taxes inheritances by class of beneficiary under KRS 140.070. Class A pays nothing: the spouse, parents, children, stepchildren, grandchildren, brothers and sisters, and, for deaths on or after January 1, 2026, nephews and nieces, half-blood included, moved there by 2026 Ky. Acts chapter 198. Class B, which covers a son- or daughter-in-law, an aunt or uncle and a great-grandchild, has a ${K.usd(B.exemption!)} exemption and rates from ${lo(B.slices!)} to ${hi(B.slices!)}. Class C, everyone else, cousins and friends included, has a ${K.usd(Cc.exemption!)} exemption and rates from ${lo(Cc.slices!)} to ${hi(Cc.slices!)}. On ${K.usd(100000)}, a daughter-in-law owes ${K.usd(b(100000))} and a cousin ${K.usd(c(100000))}. For deaths before July 1, 2026, the tax is due within ${KY.dueMonthsBeforeJuly} months, with a ${K.pct(KY.discount.rate, 0)} discount if paid within ${KY.discount.monthsBeforeJuly}; for deaths from July 1, 2026, chapter 161 moved those dates to ${KY.dueMonths} and ${KY.discount.months} months. Kentucky has no estate tax of its own.`,
  body: (h) => `
<h2>What changed in 2026</h2>
<p>Two laws passed in the 2026 session rewrote parts of chapter 140 of the Kentucky Revised Statutes. Chapter 198, section 40, amended ${h.src('ky_140_070', 'KRS 140.070')} so that "nephew, niece, or a nephew or niece of the half blood" are listed in Class A; a note of the Legislative Research Commission states that the change applies to estates of persons who died on or after January 1, 2026. Before that, nephews and nieces were Class B and paid between ${lo(B.slices!)} and ${hi(B.slices!)}. Chapter 161 amended ${h.src('ky_140_210', 'KRS 140.210')} for deaths on or after July 1, 2026: the tax is payable within ${KY.dueMonths} months instead of ${KY.dueMonthsBeforeJuly}, and the ${K.pct(KY.discount.rate, 0)} discount applies to payment within ${KY.discount.months} months instead of ${KY.discount.monthsBeforeJuly}.</p>
<p>The Department of Revenue's ${h.src('ky_dor', 'inheritance tax page')} and its ${h.src('ky_guide', 'guide 92F101')}, dated January 2021, had not caught up when this page was written: both still list nephews and nieces in Class B and give the 18-month deadline only. For a death in 2026 the statute governs. A nephew inheriting ${K.usd(n150)} from an uncle who died in March 2026 owes nothing to Kentucky.</p>
<h2>The three classes</h2>
${h.table(['Class', 'Beneficiaries', 'Exemption', 'Rates'], [
  ['A', 'Spouse, parents, children by blood or adoption during infancy, stepchildren, grandchildren, brothers and sisters, nephews and nieces (half blood included)', 'everything', 'none'],
  ['B', 'Daughter-in-law, son-in-law, aunt, uncle, great-grandchild', K.usd(B.exemption!), `${lo(B.slices!)} to ${hi(B.slices!)}`],
  ['C', 'Everyone else: cousins, friends, great-nephews and great-nieces, nephews and nieces by marriage, institutions not exempt', K.usd(Cc.exemption!), `${lo(Cc.slices!)} to ${hi(Cc.slices!)}`],
], 'KRS 140.070 and 140.080 as amended by 2026 Ky. Acts ch. 198, deaths on or after January 1, 2026.', ['l', 'l', 'r', 'r'])}
<p>Exempt educational, religious and charitable institutions listed in KRS 140.060 pay nothing. The class exemption is charged against the lowest bracket or brackets, so the ${K.usd(B.exemption!)} of Class B is taken out of the slice taxed at ${lo(B.slices!)}.</p>
<h2>Brackets in dollars</h2>
<p>Class B climbs through eight brackets, from ${lo(B.slices!)} on the first ${K.usd(B.slices![0][0]!)} to ${hi(B.slices!)} on value above ${K.usd(B.slices![B.slices!.length - 2][0]!)}. Class C uses six brackets and reaches ${hi(Cc.slices!)} above ${K.usd(Cc.slices![Cc.slices!.length - 2][0]!)}, so a cousin reaches the top rate on a much smaller share than a son-in-law.</p>
${h.table(['Share received', 'Class B (in-law, aunt, uncle)', 'Class C (cousin, friend)'], amounts.map((x) => [K.usd(x), K.usd(b(x)), K.usd(c(x))]), 'Kentucky inheritance tax for one beneficiary, before the early payment discount.', ['l', 'r', 'r'])}
${h.mini('inh', { t: 'Kentucky tax on one share', p: ['amt', 'rel'], d: { st: 'KY', amt: 80000, rel: 'cousin' } })}
<h2>Deadlines, discount and installments</h2>
<p>The tax is due at death. For deaths before July 1, 2026, it is payable within ${KY.dueMonthsBeforeJuly} months, reduced by ${K.pct(KY.discount.rate, 0)} if paid within ${KY.discount.monthsBeforeJuly}, and interest at the statutory rate runs after ${KY.dueMonthsBeforeJuly} months. For deaths from July 1, 2026, the same rules apply with ${KY.dueMonths} and ${KY.discount.months} months. When a beneficiary's net tax exceeds ${K.usd(KY.installments.over)}, the beneficiary may elect in writing to pay in ${KY.installments.count} equal annual installments, the first with the return (${h.src('ky_140_222', 'KRS 140.222')}); the deferred part bears interest from ${KY.dueMonthsBeforeJuly} or ${KY.dueMonths} months, depending on the date of death, and the beneficiary is personally liable for it.</p>
<p>On a cousin's ${K.usd(100000)} share, paying ${K.usd(c(100000))} within the discount window saves ${K.usd(c(100000) * KY.discount.rate)}. The federal estate tax return, if any, is due much earlier, nine months after death: the ${h.a('estate-tax-return-deadline', 'deadlines page')} lines the dates up.</p>
<h2>Life insurance, real estate and nonresidents</h2>
<p>Life insurance paid to a designated beneficiary, a trust included, is tax-free under ${h.src('ky_140_030', 'KRS 140.030')}; paid to the insured or the estate, it becomes part of the shares and is taxed by class. All property of a Kentucky resident is taxable except real estate located in another state. A nonresident's Kentucky real estate and tangible property are taxable, and the class exemption is then prorated: it is reduced to the share of the whole estate that Kentucky taxes (${h.src('ky_140_080', 'KRS 140.080(2)')}). A Tennessee resident who leaves a Kentucky farm worth a quarter of the estate to a friend gives that friend a Class C exemption of a quarter of ${K.usd(Cc.exemption!)}.</p>
<h2>Who pays and how the shares are measured</h2>
<p>The tax falls on each beneficiary's distributive share, after the estate's debts, funeral costs and administration expenses, and the personal representative or trustee who does not pay it by the deadline must give a bond for it (KRS 140.210). Each beneficiary is taxed separately, so an estate split between a brother and a cousin produces two bills, one of them at zero. Contracts can count too: KRS 140.030 treats a sum payable under a contract at or after death as a taxable transfer, unless the other party paid substantially equal value for it during the deceased's life.</p>
<h2>When no tax is due</h2>
<p>If every taxable asset goes to Class A beneficiaries or exempt institutions and no federal estate tax return is required, the court accepts an affidavit of exemption in place of the Kentucky return, according to the Department. After the 2026 change this covers many more estates: an aunt who leaves everything to her nieces and nephews no longer needs to file a Kentucky return for tax. Kentucky has no estate tax, and the federal tax applies only above ${K.usd(K.F.basicExclusion)}. How the other four states treat the same heirs is on ${h.a('inheritance-tax-by-state', 'inheritance tax by state')}.</p>
`,
  faqs: [
    { q: 'Do nephews and nieces pay Kentucky inheritance tax in 2026?', a: `No, for deaths on or after January 1, 2026. Chapter 198 of the 2026 Kentucky Acts moved nephews and nieces, including those of the half blood, into Class A, which is fully exempt. Nephews and nieces by marriage and great-nephews or great-nieces remain Class C, with a ${K.usd(Cc.exemption!)} exemption and rates from ${lo(Cc.slices!)} to ${hi(Cc.slices!)}.` },
    { q: 'How long does a Kentucky estate have to pay the inheritance tax?', a: `It depends on the date of death. Before July 1, 2026: ${KY.dueMonthsBeforeJuly} months, with a ${K.pct(KY.discount.rate, 0)} discount within ${KY.discount.monthsBeforeJuly} months. On or after July 1, 2026: ${KY.dueMonths} months, with the discount within ${KY.discount.months} months, under chapter 161 of the 2026 Acts. Interest runs after the deadline, and a bond is required from the representative who has not paid.` },
    { q: 'What does a son-in-law pay on a Kentucky inheritance of $50,000?', a: `${K.usd(b(50000))}. A son-in-law is Class B: the ${K.usd(B.exemption!)} exemption comes off the lowest bracket, and the rest is taxed at ${lo(B.slices!)} up to ${K.usd(B.slices![0][0]!)} and then at the higher rates of KRS 140.070. A cousin receiving the same amount, in Class C, owes ${K.usd(c(50000))}.` },
    { q: 'Is life insurance taxed by Kentucky inheritance tax?', a: `Not when it is paid to a named beneficiary or a trustee: KRS 140.030 makes those proceeds tax-free. Insurance payable to the insured or the estate is added to the shares of the estate's beneficiaries and taxed according to their class. Federal government life insurance policies are tax-free in all cases.` },
  ],
  tool: 'inh',
  toolArg: { st: 'KY', amt: 100000, rel: 'inlaw' },
  related: ['inheritance-tax-by-state', 'nebraska-inheritance-tax', 'new-jersey-inheritance-tax', 'pennsylvania-inheritance-tax', 'estate-tax-return-deadline', 'property-in-another-state'],
  sources: ['ky_140_070', 'ky_140_080', 'ky_140_210', 'ky_140_222', 'ky_140_030', 'ky_dor', 'ky_guide'],
});
