import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const DC = K.E.DC;
const ex = DC.exemption, T = DC.table!;
const first = T[0].rate, topR = T[T.length - 1].rate;
const tax = (x: number) => K.stateTax('DC', x);
const ladder = [5000000, 6000000, 7500000, 10000000, 15000000];
const band1 = T[1].from - ex;
const mixed = K.computeCase({ estate: 8000000, st: 'DC', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'VA', reValue: 2000000 });
const md = K.computeCase({ estate: 8000000, st: 'MD', married: false, toSpouse: 'none', heir: 'child', heirs: 2 });
const va = K.computeCase({ estate: 8000000, st: 'VA', married: false, toSpouse: 'none', heir: 'child', heirs: 2 });

export default defineGuide({
  id: 'district-of-columbia-estate-tax',
  group: 'estate',
  order: 210,
  slug: 'district-of-columbia-estate-tax',
  nav: 'District of Columbia',
  card: `${K.usd(ex)} exclusion, ${K.pct(first, 1)} to ${K.pct(topR, 0)}, return due at ${DC.dueMonths} months`,
  title: `DC Estate Tax 2026: Exclusion of ${K.usd(ex)} and Rate Table`,
  description: `District of Columbia estate tax 2026: ${K.usd(ex)} exclusion, rates from ${K.pct(first, 1)} to ${K.pct(topR, 0)}, the D-76 worksheet, share of DC property and a ${DC.dueMonths}-month deadline.`,
  h1: 'District of Columbia estate tax in 2026',
  intro: `The District of Columbia taxes estates of ${K.usd(ex)} or more for deaths in 2026, with rates from ${K.pct(first, 1)} to ${K.pct(topR, 0)}. Enter the taxable estate to see the tax computed on the D-76 worksheet.`,
  facts: [['Exclusion 2026', K.usd(ex)], ['First rate', K.pct(first, 1)], ['Top rate, above ' + K.usd(T[T.length - 1].from), K.pct(topR, 0)], ['Form D-76 due', `${DC.dueMonths} months`]],
  resume: `For a death from January 1 to December 31, 2026, the District of Columbia exclusion is ${K.usd(ex)}, up from ${K.usd(DC.prev)} in 2025, according to the 2026 D-76 instructions of the Office of Tax and Revenue. The tax is read on a table whose first line starts at the exclusion with a tax of zero and a rate of ${K.pct(first, 1)}, up to ${K.usd(T[1].from)}; the next lines open at each whole million, with rates rising by steps to ${K.pct(topR, 0)} above ${K.usd(T[T.length - 1].from)}. An estate of ${K.usd(6000000)} owes ${K.usd(tax(6000000))}, one of ${K.usd(10000000)} owes ${K.usd(tax(10000000))}. The tentative tax is multiplied by the share of the gross estate located in the District, so a resident's real estate in Virginia or Maryland reduces the bill. The return, Form D-76, is filed and paid on MyTax.DC.gov within ${DC.dueMonths} months of death, and the District publishes no rule on portability between spouses.`,
  body: (h) => `
<h2>The 2026 worksheet, line by line</h2>
<p>The Office of Tax and Revenue no longer prints the computation inside the forms booklet; it posts a separate worksheet for each year of death (${h.src('dc_d76', '2026 D-76 instructions')}). The worksheet for deaths in 2026 has six lines: the tentative taxable estate, the tentative tax read on the rate table, the gross value of property located in the District, the total gross estate, the percentage of property in the District rounded to four decimal places, and the tax due, which is the tentative tax multiplied by that percentage.</p>
${h.table(['Taxable estate over', 'Not over', 'Tax on the lower amount', 'Rate on the excess'], T.map((r, i) => [K.usd(r.from), i + 1 < T.length ? K.usd(T[i + 1].from) : 'and above', K.usd(r.base), K.pct(r.rate, 1)]), 'District of Columbia rate table for deaths on or after January 1, 2026 (D-76 instructions, page 7).', ['l', 'l', 'r', 'r'])}
<p>The first band is narrow: only ${K.usd(band1)} lies between the exclusion and ${K.usd(T[1].from)}, so ${K.usd(T[1].base)} is the tax at ${K.usd(T[1].from)}. Because the later brackets begin at round amounts that do not move with the exclusion, the line printed for each year changes slightly; for 2025 the second line started from a tax of more than ten thousand dollars because the exclusion was lower.</p>
<h2>Reading one line by hand</h2>
<p>Take a taxable estate of ${K.usd(7500000)}. It falls on the line that opens at ${K.usd(T[3].from)}, where the printed tax is ${K.usd(T[3].base)} and the rate on the excess is ${K.pct(T[3].rate, 1)}. The excess is ${K.usd(7500000 - T[3].from)}, which adds ${K.usd(T[3].rate * (7500000 - T[3].from))}, for a tentative tax of ${K.usd(tax(7500000))}. If a tenth of the gross estate were real estate in another state, line 5 of the worksheet would read 0.9000 and the tax due would be nine tenths of that amount. The calculator above performs the same steps.</p>
<h2>What estates of different sizes owe</h2>
${h.table(['Taxable estate', 'DC estate tax', 'Share of the estate'], ladder.map((x) => [K.usd(x), K.usd(tax(x)), K.pct(tax(x) / x)]), 'Resident, all property in the District, no gifts.', ['l', 'r', 'r'])}
<p>The average rate stays well below the marginal one. At ${K.usd(10000000)} the District takes ${K.pct(tax(10000000) / 10000000)} of the estate even though the last dollars are taxed at ${K.pct(T[T.length - 2].rate, 1)}. The federal estate tax does not start until ${K.usd(K.F.basicExclusion)}, so for every estate in the table the District is the only death tax.</p>
${h.mini('state', { t: 'DC estate tax on your figure', p: ['estate'], d: { st: 'DC', estate: 7000000 } })}
<h2>Property outside the District</h2>
<p>Section 47-3702 of the DC Code reduces the tax of a resident whose real or tangible property has a taxable situs outside the District, in proportion to the value of that property (${h.src('dc_code', 'DC Code 47-3702')}). The instructions define situs simply: real property is located where it sits, tangible personal property where it is customarily kept, and intangible property such as bank accounts and securities follows the domicile of the deceased. A Washington resident with an ${K.usd(8000000)} estate including a ${K.usd(2000000)} house in Virginia would owe ${K.usd(mixed.home!.tax)} rather than ${K.usd(tax(8000000))}. Partnership interests count as intangible property, even when the partnership owns real estate.</p>
<p>A nonresident who owned real estate or tangible property in the District files too, and pays the tentative tax multiplied by the share of the gross estate that has its situs in the District (section 47-3703). The detailed comparison with the neighboring states is on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>A city between two very different neighbors</h2>
<p>Families in the capital region often have ties to all three jurisdictions. Virginia has no estate or inheritance tax, Maryland has both. For the same ${K.usd(8000000)} estate left to two children, the engine gives ${K.usd(tax(8000000))} in the District, ${K.usd(md.stateTotal + md.inhTotal)} in Maryland and ${K.usd(va.stateTotal + va.inhTotal)} in Virginia. The Maryland figure rises sharply if the heirs are nephews or friends, because its inheritance tax then applies (${h.a('maryland-estate-tax', 'Maryland estate tax')}). Moving does not remove the District's claim on real estate kept there, as ${h.a('moving-to-avoid-estate-tax', 'moving to avoid estate tax')} explains.</p>
<h2>Filing, extensions and payment</h2>
<p>A return is required when the gross estate, before deductions, reaches ${K.usd(ex)}, even if no federal Form 706 is due and even if a marital deduction leaves nothing taxable. The personal representative files Form D-76 or D-76EZ electronically on MyTax.DC.gov and uploads pages 1 to 3 of a federal Form 706 and its schedules A to O. Tax and return are due ${DC.dueMonths} months after death. A six-month extension to file can be requested on Form FR-77 before the due date; the District does not accept the federal Form 4768, and interest and late penalties apply without regard to that extension unless a federal extension has been obtained (${h.src('dc_otr', 'OTR estate tax information')}).</p>
<p>The exclusion is indexed: ${K.usd(DC.prev)} in 2025, ${K.usd(ex)} in 2026. The instructions say nothing about a surviving spouse using the unused exclusion of the first spouse, so the calculator gives a single exclusion per estate.</p>
`,
  faqs: [
    { q: 'What is the DC estate tax exclusion for deaths in 2026?', a: `${K.usd(ex)}, against ${K.usd(DC.prev)} for deaths in 2025. A return is required once the gross estate reaches that amount, before deductions. The tax itself is read on a table that starts at the exclusion with a rate of ${K.pct(first, 1)} and reaches ${K.pct(topR, 0)} above ${K.usd(T[T.length - 1].from)}.` },
    { q: `How much DC estate tax does a ${K.mil(6000000)} estate pay?`, a: `${K.usd(tax(6000000))} when everything is located in the District and nothing goes to a spouse or charity. That is the ${K.usd(T[2].base)} printed on the 2026 table for ${K.usd(T[2].from)}. If part of the gross estate is real estate in another state, the tax is reduced in proportion.` },
    { q: 'Does the District of Columbia accept the federal estate tax extension?', a: `Not the form: the federal Form 4768 is not accepted, and a six-month extension of time to file the D-76 is requested on Form FR-77, electronically, before the ${DC.dueMonths}-month due date. The Office of Tax and Revenue notes that when a federal extension to file has been obtained, the DC tax is not due until the return is required.` },
    { q: 'Do Virginia residents owe DC estate tax on a condo in the District?', a: `They can. A nonresident's estate owes the District the tentative tax multiplied by the share of the gross estate that has its situs there, which covers real estate and tangible property kept in the District. A return is required when the gross estate reaches ${K.usd(ex)}, counting property everywhere.` },
  ],
  tool: 'state',
  toolArg: { st: 'DC', estate: 6000000 },
  related: ['maryland-estate-tax', 'property-in-another-state', 'state-estate-tax', 'states-without-estate-tax', 'moving-to-avoid-estate-tax'],
  sources: ['dc_d76', 'dc_otr', 'dc_code'],
});
