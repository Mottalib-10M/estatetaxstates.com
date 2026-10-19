import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const ex = F.basicExclusion;
const PA = K.I.PA as unknown as { dueMonths: number; discount: { rate: number; months: number } };
const NJ = K.I.NJ as unknown as { dueMonths: number };
const KY = K.I.KY as unknown as { dueMonths: number; dueMonthsBeforeJuly: number; discount: { rate: number; months: number; monthsBeforeJuly: number } };
const MD = K.I.MD as unknown as { dueAt: string };
const months = (n: number) => `${n} months`;
const byDue = [...K.ESTATE_CODES].sort((a, b) => K.E[a].dueMonths - K.E[b].dueMonths || K.nameOf(a).localeCompare(K.nameOf(b)));
const shortest = byDue[0], longest = byDue[byDue.length - 1];
const nineCount = K.ESTATE_CODES.filter((c) => K.E[c].dueMonths === F.returnMonths).length;
const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const plus = (m: number, k: number) => { const t = m - 1 + k; return `${M[t % 12]} ${2026 + Math.floor(t / 12)}`; };

export default defineGuide({
  id: 'estate-tax-return-deadline',
  group: 'federal',
  order: 160,
  slug: 'estate-tax-return-deadline',
  nav: 'Return deadlines',
  card: `Form 706 at ${F.returnMonths} months, every state return, inheritance tax discounts`,
  title: 'Estate Tax Return Deadline 2026: Form 706 and State Dates',
  description: `Estate tax return deadline 2026: Form 706 at ${F.returnMonths} months plus a ${F.extensionMonths}-month extension, every state estate tax return, and inheritance tax due dates and discounts.`,
  h1: 'Estate tax return deadlines for a death in 2026',
  intro: `Every deadline runs from the date of death. The federal return and most state returns are due nine months later, but Connecticut is earlier, and Pennsylvania pays a discount for early payment. Pick the state and month of death.`,
  facts: [['Form 706', months(F.returnMonths)], ['Automatic extension to file', months(F.extensionMonths)], ['Earliest state return', `${K.nameOf(shortest)}, ${months(K.E[shortest].dueMonths)}`], ['Pennsylvania discount', `${K.pct(PA.discount.rate, 0)} within ${months(PA.discount.months)}`]],
  resume: `The federal estate tax return, Form 706, is due ${F.returnMonths} months after the date of death, and so is any tax owed. Form 4768 gives an automatic ${F.extensionMonths}-month extension to file, but not to pay, so an estimate of the tax still goes in at ${F.returnMonths} months. The return is required when the gross estate plus adjusted taxable gifts exceeds ${K.usd(ex)} in 2026, or when the executor elects portability for the surviving spouse. State estate tax returns follow their own calendars: ${nineCount} of the 13 jurisdictions use ${F.returnMonths} months, ${K.nameOf(shortest)} wants its tax at ${months(K.E[shortest].dueMonths)}, the District of Columbia allows ${months(K.E.DC.dueMonths)} and ${K.nameOf(longest)} ${months(K.E[longest].dueMonths)}. Inheritance taxes have their own rules. Pennsylvania tax becomes delinquent at ${months(PA.dueMonths)} and is reduced by ${K.pct(PA.discount.rate, 0)} if paid within ${months(PA.discount.months)}; New Jersey wants its return within ${months(NJ.dueMonths)}; Kentucky allows ${months(KY.dueMonths)} for deaths from July 1, 2026, with a discount within ${months(KY.discount.months)}.`,
  body: (h) => `
<h2>Federal: Form 706 at nine months</h2>
<p>The ${h.src('irs_i706', 'Form 706 instructions')} set the rule: the return is filed within ${F.returnMonths} months after the date of death, and the estate and generation-skipping taxes are due at the same date. The deadline falls on the same day of the month: a death on March 14, 2026 gives December 14, 2026. Form 4768 requests an automatic ${F.extensionMonths}-month extension to file, which moves that return to June 14, 2027. An extension of time to pay is a separate request, made on the same form; without it, the tax is still due at ${F.returnMonths} months. In some cases the estate can also elect on the return to pay in installments under section 6166, or to postpone the part of the tax due on a reversionary or remainder interest under section 6163, as the instructions note. The statute behind the dates is ${h.src('usc_6075', 'section 6075')}.</p>
<p>Who files: for deaths in 2026, the executor of every citizen or resident whose gross estate, plus adjusted taxable gifts and any pre-1977 specific exemption, exceeds ${K.usd(ex)}. An executor who wants to pass the unused exclusion to a surviving spouse files too, whatever the size of the estate, and must meet the same deadline; the late relief for that case runs to the fifth anniversary of the death (${h.a('portability', 'portability')}).</p>
${h.mini('deadline', { t: 'Due dates for a death this year', p: ['st', 'm'], d: { st: 'NY', m: '5' } })}
<h2>State estate tax returns</h2>
<p>A state return is due whenever the estate exceeds the state's filing threshold, which is far below the federal one in most states. Maryland, for one, states on Form MET 1 that its return is due within nine months even when no federal Form 706 is required.</p>
${h.table(['Jurisdiction', 'Return', 'Due after death', 'Death on March 14, 2026'], byDue.map((c) => [K.nameOf(c), K.E[c].form, months(K.E[c].dueMonths), plus(3, K.E[c].dueMonths)]), 'Due dates of the state estate tax returns for deaths in 2026, as given by each state. The month shown keeps the day of death.', ['l', 'l', 'r', 'r'])}
<p>${K.nameOf(shortest)} stands out: its estate tax is due ${months(K.E[shortest].dueMonths)} after death under section 12-392 of its ${h.src('ct_statute', 'General Statutes')}, earlier than the federal date; tax unpaid at that date bears a penalty and interest of one percent per month. The District of Columbia allows ${months(K.E.DC.dueMonths)} for Form D-76 (${h.src('dc_d76', '2026 D-76 instructions')}), and ${K.nameOf(longest)} allows ${months(K.E[longest].dueMonths)} for Form OR-706 (${h.src('or_706i', 'Oregon instructions')}). Each state sets its own extension rules on its own form.</p>
<h2>Inheritance taxes: due dates and discounts</h2>
<p>Inheritance taxes fall on what each heir receives, and their deadlines differ from the estate tax calendar.</p>
${h.table(['State', 'Due', 'Early payment discount'], [
  ['Pennsylvania', `delinquent at ${months(PA.dueMonths)}`, `${K.pct(PA.discount.rate, 0)} if paid within ${months(PA.discount.months)}`],
  ['New Jersey', `return within ${months(NJ.dueMonths)}`, 'none; interest after the due date'],
  ['Kentucky, death before July 1, 2026', `${months(KY.dueMonthsBeforeJuly)}`, `${K.pct(KY.discount.rate, 0)} if paid within ${months(KY.discount.monthsBeforeJuly)}`],
  ['Kentucky, death from July 1, 2026', `${months(KY.dueMonths)}`, `${K.pct(KY.discount.rate, 0)} if paid within ${months(KY.discount.months)}`],
  ['Maryland', MD.dueAt, 'none'],
  ['Nebraska', 'set in the county court proceeding', 'none'],
], 'Inheritance tax deadlines for deaths in 2026.', ['l', 'l', 'l'])}
<p>Pennsylvania's rule is unusual: the tax is due at death and only becomes delinquent at ${months(PA.dueMonths)}, and the ${h.src('pa_dor', 'Department of Revenue')} reduces it by ${K.pct(PA.discount.rate, 0)} when paid within ${months(PA.discount.months)}. An estate that can value the assets quickly can therefore pay within three months and keep the discount. Kentucky changed its calendar in 2026: for deaths on or after July 1, 2026, ${h.src('ky_140_210', 'KRS 140.210')} gives ${months(KY.dueMonths)} before interest and a discount within ${months(KY.discount.months)}, against ${months(KY.dueMonthsBeforeJuly)} and ${months(KY.discount.monthsBeforeJuly)} before. New Jersey charges interest from ${months(NJ.dueMonths)} after death, as its ${h.src('nj_general', 'general information sheet')} explains. In Nebraska the tax is determined by the county court and collected by the county, with a report to the county treasurer. The ${h.a('inheritance-tax-by-state', 'inheritance tax page')} compares the rates.</p>
<h2>Gift tax returns</h2>
<p>Lifetime gifts have a separate calendar. Form 709 is due on April 15 of the year after the gift: April 15, 2027 for gifts made in 2026. If the donor dies during the year, the executor files the last Form 709 by the earlier of the estate tax return due date, with extensions, and the regular April 15 date. Connecticut's own gift and estate tax return, CT-706/709, is also due on April 15 of the following year for gifts.</p>
<h2>Why the dates matter even when no tax is due</h2>
<p>A missed deadline does more than add interest. The portability election is lost if Form 706 is late and the estate was required to file. Connecticut adds a penalty of ten percent, or fifty dollars if greater, to tax unpaid at six months. Pennsylvania's discount is gone after ${months(PA.discount.months)}. The calculator at the top of this page puts the dates for a given state and month of death side by side.</p>
`,
  faqs: [
    { q: 'When is Form 706 due for someone who died in May 2026?', a: `Nine months after the date of death, on the same day of February 2027, together with any tax owed. Form 4768 gives an automatic six-month extension to file, to August 2027. Payment is a separate matter: the tax is due at nine months unless an extension to pay is also requested. The return is required above ${K.usd(ex)} of gross estate plus adjusted taxable gifts, or to elect portability.` },
    { q: 'Which state estate tax return is due before the federal one?', a: `${K.nameOf(shortest)}: its estate tax is due ${months(K.E[shortest].dueMonths)} after death, three months before Form 706. Every other jurisdiction with an estate tax allows at least ${F.returnMonths} months, and some allow longer: the District of Columbia ${months(K.E.DC.dueMonths)}, ${K.nameOf(longest)} ${months(K.E[longest].dueMonths)}. Each state sets its own extension rules.` },
    { q: 'How does the Pennsylvania inheritance tax discount work?', a: `Pennsylvania allows a ${K.pct(PA.discount.rate, 0)} discount when the inheritance tax is paid within ${months(PA.discount.months)} of the death. The tax is due at death and becomes delinquent at ${months(PA.dueMonths)}, when interest starts. On a tax of ${K.usd(K.inhTax('PA', 'child', 1000000))}, owed by children inheriting ${K.usd(1000000)} in total, the discount is worth ${K.usd(K.inhTax('PA', 'child', 1000000) * PA.discount.rate)}.` },
    { q: 'Did Kentucky change its inheritance tax deadline in 2026?', a: `Yes. For deaths on or after July 1, 2026, Kentucky allows ${months(KY.dueMonths)} before interest and gives its ${K.pct(KY.discount.rate, 0)} discount for payment within ${months(KY.discount.months)}. For deaths before July 1, 2026, the earlier periods apply: ${months(KY.dueMonthsBeforeJuly)} before interest and a discount within ${months(KY.discount.monthsBeforeJuly)}.` },
  ],
  tool: 'deadline',
  toolArg: { st: 'PA', m: '3' },
  related: ['portability', 'pennsylvania-inheritance-tax', 'kentucky-inheritance-tax', 'connecticut-estate-tax', 'state-estate-tax', 'gift-tax'],
  sources: ['irs_i706', 'usc_6075', 'ct_statute', 'dc_d76', 'or_706i', 'pa_dor', 'ky_140_210', 'nj_general'],
});
