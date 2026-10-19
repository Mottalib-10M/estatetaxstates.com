import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const RI = K.E.RI;
const th = RI.exemption, prev = RI.prev, credit = RI.credit!, creditPrev = (RI as unknown as { creditPrev: number }).creditPrev;
const at = (x: number) => K.stateTax('RI', x);
const adj = (x: number) => x - 60000;
const ladder = [2000000, 2500000, 3000000, 4000000, 5000000, 7500000, 10000000];
// Walk-through of the RI-706 lines for a $3,000,000 net taxable estate.
const net = 3000000;
const line6 = K.tableB(adj(net));
// A nonresident with a $1,200,000 house in Newport inside a $4,000,000 estate.
const nrGross = 4000000, nrHouse = 1200000;
const nrTax = at(nrGross) * nrHouse / nrGross;
const topRate = K.P.tableB[K.P.tableB.length - 1].rate;

export default defineGuide({
  id: 'rhode-island-estate-tax',
  group: 'estate',
  order: 255,
  slug: 'rhode-island-estate-tax',
  nav: 'Rhode Island',
  card: `${K.usd(th)} threshold, old federal credit table minus ${K.usd(credit)}`,
  title: 'Rhode Island Estate Tax 2026: Threshold, Credit and Table',
  description: `Rhode Island estate tax 2026: threshold of ${K.usd(th)}, tax read on the old federal credit table minus a ${K.usd(credit)} credit, rates up to ${K.pct(topRate, 0)}, due in ${RI.dueMonths} months.`,
  h1: 'Rhode Island estate tax in 2026',
  intro: `Rhode Island still computes its estate tax with the federal credit table of 2001, then subtracts a credit that grows with inflation. Enter the net taxable estate to see the Rhode Island tax.`,
  facts: [['Threshold 2026', K.usd(th)], ['Credit 2026', K.usd(credit)], ['Top rate', K.pct(topRate, 0)], ['RI-706 due', `${RI.dueMonths} months`]],
  resume: `For deaths in 2026 Rhode Island taxes estates whose gross value is above ${K.usd(th)}, up from ${K.usd(prev)} in 2025; the Division of Taxation has indexed that threshold for inflation every year since 2016. The tax itself follows the four steps of Form RI-706. From the net taxable estate, the gross estate minus deductions, the form subtracts a flat $60,000 to get the adjusted taxable estate. It reads the tax on that amount in the rate schedule of the old federal credit for state death taxes, which climbs from ${K.pct(K.P.tableB[1].rate, 1)} to ${K.pct(topRate, 0)}. It then subtracts the Rhode Island credit, ${K.usd(credit)} for 2026 against ${K.usd(creditPrev)} in 2025, and multiplies the result by the Rhode Island share of the estate. A net taxable estate of ${K.usd(2500000)} owes ${K.usd(at(2500000))}; one of ${K.usd(5000000)} owes ${K.usd(at(5000000))}. The credit is exactly the table amount at the threshold, so there is no jump just over the line. Return and payment are due ${RI.dueMonths} months after death, and there has been no filing fee since 2025.`,
  body: (h) => `
<h2>Four lines of Form RI-706</h2>
<p>The first page of ${h.src('ri_706', 'Form RI-706')} does the whole computation, and following it is the clearest way to see how the tax works. Take a resident whose net taxable estate, after debts, expenses and deductions, is ${K.usd(net)}:</p>
${h.table(['Line', 'What it says', 'Amount'], [
  ['3', 'Net taxable estate', K.usd(net)],
  ['4', 'Exclusion', K.usd(60000)],
  ['5', 'Adjusted taxable estate', K.usd(adj(net))],
  ['6', 'Tax from the computation schedule', K.usd(line6)],
  ['7', 'Rhode Island credit for 2026', K.usd(credit)],
  ['8', 'Tax due before apportionment', K.usd(line6 - credit)],
], 'Form RI-706, part 1, for a resident with all property in Rhode Island.', ['l', 'l', 'r'])}
<p>The $60,000 of line 4 and the schedule of line 6 both come from the old federal credit for state death taxes, which no longer exists in federal law. Rhode Island kept them and added its own credit on line 7. The credit chart on page 22 of the form lists one amount per year of death, from 2015 to 2026, and the 2026 amount is ${K.usd(credit)}.</p>
<h2>Why there is no jump at the threshold</h2>
<p>The credit is not an arbitrary figure. It equals the schedule tax on the threshold minus $60,000, so an estate exactly at ${K.usd(th)} owes nothing and an estate a little above it owes a little. The engine of this site checks that identity every time it is built: the schedule gives ${K.usd(K.tableB(adj(th)))} at the 2026 threshold, the credit is ${K.usd(credit)}. Above the line the tax rises at the schedule's marginal rate, ${K.pct(K.P.tableB[9].rate, 1)} at first, and the share of the estate paid in tax creeps up slowly.</p>
${h.table(['Net taxable estate', 'Rhode Island tax', 'Share of the estate'], ladder.map((x) => [K.usd(x), K.usd(at(x)), K.pct(at(x) / x)]), 'Resident with all property in Rhode Island, deaths in 2026.', ['l', 'r', 'r'])}
${h.mini('state', { t: 'Rhode Island tax on your figure', p: ['estate'], d: { st: 'RI', estate: 3500000 } })}
<h2>A threshold and a credit that move every January</h2>
<p>Rhode Island indexes both numbers each year. The threshold went from ${K.usd(prev)} for deaths in 2025 to ${K.usd(th)} for deaths in 2026, a rise of ${K.usd(th - prev)} or ${K.pct((th - prev) / prev)}, and the credit moved with it, from ${K.usd(creditPrev)} to ${K.usd(credit)}. The two always move together, since the credit is the schedule tax at the threshold. For an estate that does not change in value, the tax therefore falls a little each year: an estate of ${K.usd(3000000)} would owe ${K.usd(Math.max(0, K.tableB(adj(3000000)) - creditPrev))} under the 2025 credit and ${K.usd(at(3000000))} under the 2026 one. The date of death, not the date of filing, decides which year's figures apply.</p>
<h2>Gross estate for the test, net estate for the tax</h2>
<p>The Division's ${h.src('ri_tax', 'estate tax page')} draws a line that matters in practice: an estate is taxable when its gross estate, the full market value before any deduction, exceeds the threshold. Mortgages, debts and claims are deductions, applied afterwards. An estate with a ${K.usd(2200000)} house and a large mortgage can therefore have to file even if the net estate, after the mortgage, is below ${K.usd(th)}. Whether it owes tax is then decided by the computation above. Every Rhode Island return, taxable or not, uses Form RI-706 for deaths since 2015, and Form T-77 goes with it when the deceased had an interest in Rhode Island real estate.</p>
<h2>Property in other states, and nonresidents</h2>
<p>Part 4 of the form apportions the tax. For a person domiciled in Rhode Island, the Rhode Island gross estate is everything except real estate and tangible property located outside the state. For a nonresident, it is only the Rhode Island real estate and tangible property. The tax of line 8 is multiplied by that amount divided by the gross estate, carried to four decimals.</p>
<p>A Connecticut resident with an estate of ${K.usd(nrGross)} that includes a ${K.usd(nrHouse)} house in Newport files Form RI-706. Rhode Island computes ${K.usd(at(nrGross))} on the whole estate and keeps ${K.pct(nrHouse / nrGross, 0)}: ${K.usd(nrTax)}. The estate also deals with Connecticut, whose own exemption is far higher (${h.a('connecticut-estate-tax', 'Connecticut estate tax')}). A Rhode Island resident with a house in Florida sees the opposite effect: the Florida house reduces the Rhode Island share.</p>
<h2>Spouses and gifts</h2>
<p>What passes to a surviving spouse who is a US citizen is deducted like on the federal return. Rhode Island prints no rule letting the survivor use the first spouse's unused threshold, and the instructions read for this site add no lifetime gifts back to the estate. With a threshold this low, many Rhode Island couples cross the line at the second death even when the first death owed nothing; ${h.a('married-couples-state-estate-tax', 'married couples and state estate tax')} puts numbers on it.</p>
<h2>Paying on time</h2>
<p>The return and the full payment are due ${RI.dueMonths} months after death. A six-month extension to file can be requested on Form RI-4768, with a copy of the federal Form 4768 if one was filed, but it does not stop the clock on the tax. From the due date, interest and a monthly penalty, capped by the Division, run until the tax is paid. The filing fee that applied before was dropped for deaths from January 1, 2025. Other states' calendars are on ${h.a('estate-tax-return-deadline', 'the deadlines page')}.</p>
`,
  faqs: [
    { q: 'What is the Rhode Island estate tax threshold for 2026?', a: `${K.usd(th)} of gross estate for deaths from January 1 to December 31, 2026, against ${K.usd(prev)} in 2025. The Division of Taxation adjusts it for inflation each year. The test uses the gross value before deductions, so a mortgaged house counts at its full market value when deciding whether a return is required.` },
    { q: 'How much is the Rhode Island estate tax credit in 2026?', a: `${K.usd(credit)}, the amount on line 7 of Form RI-706 for deaths in 2026, up from ${K.usd(creditPrev)} in 2025. It is subtracted from the tax read on the old federal credit schedule. It equals the schedule tax at the threshold, which is why estates at or below ${K.usd(th)} owe nothing.` },
    { q: 'Does Rhode Island tax a Connecticut resident’s summer house in Newport?', a: `Yes, when the whole gross estate is above ${K.usd(th)}. Rhode Island computes its tax on the entire estate and multiplies it by the share that Rhode Island real estate and tangible property represent. With a ${K.usd(nrHouse)} house in a ${K.usd(nrGross)} estate, that is ${K.usd(nrTax)}, filed on Form RI-706 with Form T-77.` },
    { q: 'Does a Rhode Island filing extension also delay the estate tax payment?', a: `No. Form RI-4768 can give six more months to file the return, but the tax is still due ${RI.dueMonths} months after death. Whether or not the extension is approved, interest and penalty run from that date until the tax is paid, so an estimated payment can go with the extension request.` },
  ],
  tool: 'state',
  toolArg: { st: 'RI', estate: net },
  related: ['state-estate-tax', 'massachusetts-estate-tax', 'connecticut-estate-tax', 'married-couples-state-estate-tax', 'property-in-another-state', 'estate-tax-return-deadline'],
  sources: ['ri_706', 'ri_tax'],
});
