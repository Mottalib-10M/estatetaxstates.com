import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const VT = K.E.VT;
const ex = VT.exemption;
const rate = VT.table![0].rate;
const at = (x: number) => K.stateTax('VT', x);
const ladder = [5500000, 6000000, 7000000, 8000000, 10000000, 15000000];
// Gift look-back: $600,000 of taxable gifts 18 months before death, $5,200,000 left at death.
const left = 5200000, gift = 600000;
// Nonresident: New Hampshire resident with a $1,500,000 ski house in Stowe, estate of $9,000,000.
const nrGross = 9000000, nrHouse = 1500000;
const nrTax = at(nrGross) * nrHouse / nrGross;
// Resident with a $2,000,000 Florida condo in an $8,000,000 estate.
const resGross = 8000000, fl = 2000000;
const resTax = at(resGross) * (resGross - fl) / resGross;

export default defineGuide({
  id: 'vermont-estate-tax',
  group: 'estate',
  order: 260,
  slug: 'vermont-estate-tax',
  nav: 'Vermont',
  card: `${K.usd(ex)} exclusion, one flat rate of ${K.pct(rate, 0)} on the excess`,
  title: `Vermont Estate Tax 2026: ${K.usd(ex)} Exclusion and ${K.pct(rate, 0)} Rate`,
  description: `Vermont estate tax 2026: ${K.usd(ex)} exclusion, one ${K.pct(rate, 0)} rate on the excess, taxable gifts of the last 2 years added back, Form EST-191 due in ${VT.dueMonths} months.`,
  h1: 'Vermont estate tax in 2026',
  intro: `Vermont's estate tax has one exclusion and one rate. Enter the Vermont taxable estate to see the tax, then the effect of property outside Vermont and of recent gifts.`,
  facts: [['Exclusion', K.usd(ex)], ['Rate on the excess', K.pct(rate, 0)], ['Gifts added back', 'last 2 years'], ['EST-191 due', `${VT.dueMonths} months`]],
  resume: `Under 32 V.S.A. section 7442a, Vermont charges no estate tax on a Vermont taxable estate under ${K.usd(ex)} and ${K.pct(rate, 0)} of the excess above it. There are no brackets: an estate of ${K.usd(6000000)} owes ${K.usd(at(6000000))}, one of ${K.usd(10000000)} owes ${K.usd(at(10000000))}, and every dollar above the exclusion costs ${K.pct(rate, 0)} however large the estate. The exclusion has been ${K.usd(ex)} for deaths since January 1, 2021 and is not indexed. The Vermont taxable estate is the federal taxable estate with the deduction for state death taxes put back and taxable gifts made within two years of death added. The tax is then multiplied by the Vermont share of the gross estate, which leaves out a resident's real estate in other states and taxes a nonresident only on Vermont real estate and tangible property. The 2026 legislature raised the filing threshold to ${K.usd(ex)} to match the exclusion, effective June 18, 2026. Form EST-191 and the payment are due ${VT.dueMonths} months after death.`,
  body: (h) => `
<h2>One rate, no brackets</h2>
<p>Most estate tax schedules are ladders. Vermont's statute, ${h.src('vt_7442a', '32 V.S.A. section 7442a')}, prints two lines: under ${K.usd(ex)}, none; ${K.usd(ex)} or more, ${K.pct(rate, 0)} of the excess. That makes the Vermont tax easy to estimate without a calculator, and it makes the average rate climb toward ${K.pct(rate, 0)} without ever reaching it.</p>
${h.table(['Vermont taxable estate', 'Vermont tax', 'Share of the estate'], ladder.map((x) => [K.usd(x), K.usd(at(x)), K.pct(at(x) / x)]), 'Resident with all property in Vermont, no gifts in the last two years, deaths in 2026.', ['l', 'r', 'r'])}
<p>Because the rate is flat and starts at the first dollar over the line, Vermont ranks differently depending on the size of the estate. On ${K.usd(6000000)} Vermont charges ${K.usd(at(6000000))}, New York ${K.usd(K.stateTax('NY', 6000000))} and Massachusetts ${K.usd(K.stateTax('MA', 6000000))}; on ${K.usd(12000000)} the three figures are ${K.usd(at(12000000))}, ${K.usd(K.stateTax('NY', 12000000))} and ${K.usd(K.stateTax('MA', 12000000))}. The state by state view is on ${h.a('state-estate-tax', 'the state estate tax page')}.</p>
${h.mini('state', { t: 'Vermont tax at your figure', p: ['estate'], d: { st: 'VT', estate: 6500000 } })}
<h2>What is in the Vermont taxable estate</h2>
<p>The definitions are in section 7402 of Title 32, which the ${h.src('vt_tax', 'Department of Taxes')} applies. The Vermont taxable estate is the federal taxable estate under section 2051 of the Internal Revenue Code, whether or not any federal tax is due, increased by three items: the federal deduction for state death taxes, the deduction for foreign death taxes, and the taxable gifts made within two years of death. The gifts are counted at their gift value, and a gift already included in the federal estate is not counted twice.</p>
<p>The two-year window is shorter than New York's and Minnesota's three years, and longer than Maine's one year. A resident who dies with ${K.usd(left)} after giving a child ${K.usd(gift)} above the annual exclusion eighteen months earlier has a Vermont taxable estate of ${K.usd(left + gift)}, which owes ${K.usd(at(left + gift))}; without the add-back the estate would owe ${K.usd(at(left))}. A gift made thirty months before death would have stayed out. Vermont has no gift tax of its own. The comparison of all the windows is on ${h.a('gifts-and-state-estate-tax', 'gifts and state estate tax')}.</p>
<h2>The Vermont fraction</h2>
<p>The tax computed on the whole Vermont taxable estate is then multiplied by a fraction no greater than one: the Vermont gross estate plus Vermont-situs gifts, over the federal gross estate plus the same gifts. The situs rules decide what is "Vermont". Real estate belongs to the state where it lies. Tangible property belongs where it was normally kept. Intangible property, such as bank accounts, stocks and bonds, follows the domicile of the deceased.</p>
${h.table(['Situation', 'Gross estate', 'Vermont part', 'Vermont tax'], [
  ['Resident, all in Vermont', K.usd(resGross), K.usd(resGross), K.usd(at(resGross))],
  [`Resident with a ${K.usd(fl)} Florida condo`, K.usd(resGross), K.usd(resGross - fl), K.usd(resTax)],
  [`New Hampshire resident, ${K.usd(nrHouse)} house in Stowe`, K.usd(nrGross), K.usd(nrHouse), K.usd(nrTax)],
], 'Vermont estate tax with the apportionment fraction of section 7442a, deaths in 2026.', ['l', 'r', 'r', 'r'])}
<p>The New Hampshire case is common: New Hampshire has no estate tax, but a house across the river is Vermont real estate, and once the whole estate is above ${K.usd(ex)} Vermont takes its fraction of the tax on the whole. One special rule protects lenders of art: a qualified work of art owned by a nonresident and on loan to a Vermont nonprofit is treated as located outside Vermont.</p>
<h2>Filing: the June 18, 2026 change</h2>
<p>The Department reports that the 2026 legislature raised the filing threshold to ${K.usd(ex)}, to match the payment threshold, effective June 18, 2026. Its page describes the rule as it now stands: a Vermont return is generally required when the deceased had an interest in Vermont property and either the federal gross estate plus adjusted taxable gifts made within two years of death exceeds ${K.usd(ex)}, or a federal Form 706 has to be filed. With the federal exclusion at ${K.usd(K.F.basicExclusion)}, the second trigger concerns few estates, mainly those filing a federal return to elect portability.</p>
<p>Form EST-191 is due ${VT.dueMonths} months after death. A six-month extension to file is available on Form EST-195, but the tax estimated to be due has to be paid with the request: an extension of time to file is not an extension of time to pay. The EST-191 instructions also ask for a pro forma federal Form 706, completed line by line, even when no federal return is required.</p>
<h2>Spouses</h2>
<p>A transfer to a surviving spouse who is a US citizen is deducted through the federal marital deduction, so the first death of a married couple usually owes Vermont nothing. Vermont publishes no rule letting the survivor use the first spouse's unused exclusion. Couples whose combined estate is above ${K.usd(ex)} meet the question explained on ${h.a('married-couples-state-estate-tax', 'married couples and state estate tax')}.</p>
`,
  faqs: [
    { q: 'What is the Vermont estate tax rate in 2026?', a: `A single rate of ${K.pct(rate, 0)} on the part of the Vermont taxable estate above ${K.usd(ex)}, with nothing below. There are no brackets, so an estate of ${K.usd(7000000)} owes ${K.usd(at(7000000))} and each further dollar adds ${K.pct(rate, 0)} of a dollar. The tax is then reduced if part of the estate is outside Vermont.` },
    { q: 'Does Vermont add back gifts made before death?', a: `Yes, taxable gifts made within two years of death, at their gift value. Gifts within the federal annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient are not taxable gifts and never come back. A gift made more than two years before death is outside the Vermont taxable estate, and Vermont has no separate gift tax.` },
    { q: 'Does a New Hampshire resident owe Vermont estate tax on a ski house?', a: `Yes, if the whole estate is above ${K.usd(ex)}. Vermont computes its ${K.pct(rate, 0)} tax on the entire estate and keeps the share that Vermont real estate and tangible property represent. For a ${K.usd(nrHouse)} house in an estate of ${K.usd(nrGross)}, that share of the tax is ${K.usd(nrTax)}, filed on Form EST-191.` },
    { q: 'What changed for Vermont estate tax filing in June 2026?', a: `The legislature raised the filing threshold to ${K.usd(ex)}, the same figure as the exclusion and payment threshold, effective June 18, 2026, according to the Department of Taxes. A return is still generally required when a federal Form 706 must be filed and there is Vermont property. The exclusion and the ${K.pct(rate, 0)} rate did not change.` },
  ],
  tool: 'state',
  toolArg: { st: 'VT', estate: 6500000 },
  related: ['state-estate-tax', 'gifts-and-state-estate-tax', 'married-couples-state-estate-tax', 'property-in-another-state', 'maine-estate-tax', 'new-york-estate-tax'],
  sources: ['vt_7442a', 'vt_tax'],
});
