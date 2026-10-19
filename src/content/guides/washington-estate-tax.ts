import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const WA = K.E.WA;
const H1 = WA.firstHalf!;
const exH2 = WA.exemption, exH1 = H1.exemption;
const T2 = WA.table!, T1 = H1.table;
const top2 = K.pct(T2[T2.length - 1].rate, 0), top1 = K.pct(T1[T1.length - 1].rate, 0);
const h1 = (x: number) => K.stateTax('WA', x, 'h1');
const h2 = (x: number) => K.stateTax('WA', x, 'h2');
const sizes = [3500000, 4000000, 5000000, 7000000, 10000000, 15000000, 25000000];
// Resident with a $1,200,000 cabin in Idaho inside a $6,000,000 estate, death in the second half.
const g = 6000000, cabin = 1200000;
const resApp = h2(g) * (g - cabin) / g;
// Oregon resident with a $2,000,000 Seattle condo inside a $9,000,000 estate.
const nrG = 9000000, condo = 2000000;
const nrApp = h2(nrG) * condo / nrG;

export default defineGuide({
  id: 'washington-estate-tax',
  group: 'estate',
  order: 265,
  slug: 'washington-estate-tax',
  nav: 'Washington',
  card: `Two tables in 2026: ${K.usd(exH1)} and up to ${top1} until June 30, ${K.usd(exH2)} and up to ${top2} after`,
  title: 'Washington Estate Tax 2026: Two Exclusions, Two Rate Tables',
  description: `Washington estate tax 2026: ${K.usd(exH1)} exclusion and rates to ${top1} for deaths to June 30, then ${K.usd(exH2)} and a ${top2} top rate from July 1 under ESB 6347.`,
  h1: 'Washington estate tax in 2026',
  intro: `Washington changed its estate tax twice in twelve months, so a death in 2026 is taxed under one of two tables depending on the date. Enter the estate and the half of the year to see the tax.`,
  facts: [['Jan. 1 to June 30, 2026', `${K.usd(exH1)}, up to ${top1}`], ['From July 1, 2026', `${K.usd(exH2)}, up to ${top2}`], ['Portability', 'none'], ['Return due', `${WA.dueMonths} months`]],
  resume: `Washington's estate tax for 2026 depends on the date of death. For deaths from January 1 to June 30, 2026, the exclusion is ${K.usd(exH1)} and the Washington taxable estate above it is taxed on the table in force since July 1, 2025, with rates from ${K.pct(T1[0].rate, 0)} to ${top1}. For deaths from July 1, 2026, Engrossed Senate Bill 6347, chapter 209 of the Laws of 2026, brings back the earlier table, from ${K.pct(T2[0].rate, 0)} to ${top2}, with an exclusion of ${K.usd(exH2)}. On a ${K.usd(5000000)} estate the tax is ${K.usd(h1(5000000))} in the first half of the year and ${K.usd(h2(5000000))} in the second; on ${K.usd(15000000)} it is ${K.usd(h1(15000000))} against ${K.usd(h2(15000000))}. The filing test uses the gross estate, wherever the property is, before deductions. Washington does not recognize portability between spouses. Property outside the state is removed by apportionment. Return and payment are due ${WA.dueMonths} months after death. For 2027, the Department and the statute read differently; the 2027 figure will be confirmed when published.`,
  body: (h) => `
<h2>Two laws in a year</h2>
<p>In 2025 the legislature passed Engrossed Substitute Senate Bill 5813, chapter 421 of the Laws of 2025, which raised the exclusion to ${K.usd(exH2)} and replaced the rate table with a steeper one, up to ${top1}, for deaths from July 1, 2025. In 2026 it passed ${h.src('wa_esb6347', 'Engrossed Senate Bill 6347')}, "relating to undoing certain changes to the estate tax", approved by the governor on March 24, 2026 and effective June 11, 2026. For deaths from July 1, 2026, the law restores the table that applied from 2014 to June 2025 and sets the exclusion at ${K.usd(exH2)}. In between, the inflation adjustment then in the statute raised the exclusion to ${K.usd(exH1)} for deaths in the first half of 2026.</p>
${h.table(['Washington taxable estate', 'Jan. 1 to June 30, 2026', 'From July 1, 2026'], T1.map((r, i) => [K.usd(r.from) + (i === T1.length - 1 ? ' and up' : ''), K.pct(r.rate, 1), K.pct(T2[i].rate, 1)]), 'Marginal rates of Table W on the Washington taxable estate, after the exclusion and all deductions (Department of Revenue).', ['l', 'r', 'r'])}
<p>Both tables apply to the Washington taxable estate, which is the gross estate minus the deductions of the federal schedules J, K, L, M and O, the farm deduction and the qualified family-owned business deduction when they apply, and the exclusion itself (${h.src('wa_tables', 'estate tax tables')}). The table is read on what is left: the first ${K.usd(T2[1].from)} of it is taxed at ${K.pct(T2[0].rate, 0)} in both periods.</p>
<h2>What the date of death changes</h2>
${h.table(['Estate after deductions', 'Tax, death Jan. 1 to June 30', 'Tax, death from July 1', 'Difference'], sizes.map((x) => [K.usd(x), K.usd(h1(x)), K.usd(h2(x)), K.usd(h1(x) - h2(x))]), 'Washington resident, all property in Washington, deaths in 2026.', ['l', 'r', 'r', 'r'])}
<p>At modest sizes the two periods are close, because the first million above the exclusion is taxed at the same rate and the earlier exclusion is a little higher. The gap opens once the taxable estate passes ${K.usd(T2[1].from)} and becomes large for big estates, where the top rate falls from ${top1} to ${top2}. Pages that print a single Washington figure for 2026 are therefore right for only half of the year. The calculator asks for the half of the year under "More options".</p>
${h.mini('state', { t: 'Washington tax, second half of 2026', p: ['estate'], d: { st: 'WA', estate: 6000000, dod: 'h2' } })}
<h2>Filing: gross estate, wherever located</h2>
<p>The ${h.src('wa_dor', 'Department of Revenue')} requires a return when the gross value of all the person's property, wherever it is, exceeds the filing threshold, and the person was domiciled in Washington or owned real estate or tangible property in Washington. The threshold is the same figure as the exclusion in each period, and it is measured before deductions, so an estate with large debts can have to file and owe nothing. A return is required even when no tax is due.</p>
<p>Married couples have a filing relief since 2025: the personal residence that passes to the surviving spouse can be left out when testing whether a return is needed, provided both spouses lived in it for at least six months of the year before death and no other election requires a return. It only affects the filing test; if the rest of the estate is above the threshold, the house is counted in full.</p>
<h2>No portability</h2>
<p>The Department's ${h.src('wa_faq', 'estate tax FAQ')} is explicit: Washington law does not have, nor does it incorporate, the federal portability provisions, and each estate is entitled to the exclusion of its own date of death. A couple who leave everything to each other use the marital deduction at the first death and only one exclusion at the second. Estate lawyers can use a trust at the first death to keep the first exclusion; the figures are on ${h.a('married-couples-state-estate-tax', 'married couples and state estate tax')}.</p>
<h2>Property in Washington and elsewhere</h2>
<p>An estate with property in other states first computes the tax as if everything were Washington property, then apportions it on Addendum 4 (${h.src('wa_apport', 'apportionment for out-of-state property')}). For a Washington resident, out-of-state property is real estate and tangible property located elsewhere; intangible property such as accounts and securities follows the domicile and stays Washington property. For a nonresident, everything is out of state except Washington real estate and tangible property.</p>
${h.table(['Situation', 'Gross estate', 'Washington part', 'Washington tax'], [
  ['Resident, all in Washington', K.usd(g), K.usd(g), K.usd(h2(g))],
  [`Resident with a ${K.usd(cabin)} cabin in Idaho`, K.usd(g), K.usd(g - cabin), K.usd(resApp)],
  [`Oregon resident, ${K.usd(condo)} Seattle condo`, K.usd(nrG), K.usd(condo), K.usd(nrApp)],
], 'Deaths from July 1, 2026, apportionment by the Washington share of the gross estate.', ['l', 'r', 'r', 'r'])}
<p>The Oregon resident in the last line also files in Oregon on the rest of the estate (${h.a('oregon-estate-tax', 'Oregon estate tax')}).</p>
<h2>Paying, and the 2027 question</h2>
<p>The return, or a request for a six-month extension with an estimated payment, is due ${WA.dueMonths} months after death. An extension to file does not extend the time to pay: interest accrues daily on any tax unpaid after the ${WA.dueMonths}-month date.</p>
<p>For 2027 the sources do not agree. The Department of Revenue writes that the ${K.usd(exH2)} exclusion "is not set to increase going forward due to an expired CPI in the statute", and its table lists ${K.usd(exH2)} for 2027 and after. The text of chapter 209 contains an annual adjustment from 2027, based on the October consumer price index against October 2024 and rounded to the nearest thousand dollars. The Department and the statute read differently; the 2027 figure will be confirmed when published.</p>
`,
  faqs: [
    { q: 'Which Washington estate tax table applies to a death in May 2026?', a: `The table in force from July 1, 2025 to June 30, 2026, with an exclusion of ${K.usd(exH1)} and rates from ${K.pct(T1[0].rate, 0)} to ${top1}. A death on or after July 1, 2026 uses the restored table, with ${K.usd(exH2)} and a top rate of ${top2}. The date of death decides, not the date the return is filed.` },
    { q: `How much Washington estate tax does a ${K.usd(10000000)} estate owe in 2026?`, a: `${K.usd(h1(10000000))} for a death from January 1 to June 30, 2026, and ${K.usd(h2(10000000))} for a death from July 1, if the ${K.usd(10000000)} is the estate after deductions and all of it is in Washington. No federal estate tax is due at that size in 2026.` },
    { q: 'Can a Washington widow use her late husband’s state exclusion?', a: `No. The Department of Revenue states that Washington law does not have or incorporate the federal portability rules. Each estate has only the exclusion of its own date of death, so a survivor who received everything has one exclusion, even if the husband's estate filed a federal portability election.` },
    { q: 'Does Washington tax an Oregon resident’s condo in Seattle?', a: `Yes, if the whole gross estate is above the filing threshold. Washington computes its tax as if all the property were in Washington, then keeps the share of Washington real estate and tangible property. For a ${K.usd(condo)} condo in a ${K.usd(nrG)} estate after July 1, 2026, that is ${K.usd(nrApp)}.` },
  ],
  tool: 'state',
  toolArg: { st: 'WA', estate: 6000000, dod: 'h2' },
  related: ['state-estate-tax', 'oregon-estate-tax', 'married-couples-state-estate-tax', 'property-in-another-state', 'moving-to-avoid-estate-tax', 'estate-tax-return-deadline'],
  sources: ['wa_tables', 'wa_dor', 'wa_esb6347', 'wa_faq', 'wa_apport'],
});
