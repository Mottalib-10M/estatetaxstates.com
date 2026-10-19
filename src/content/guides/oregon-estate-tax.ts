import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const OR = K.E.OR;
const ex = OR.exemption;
const T = OR.table!;
const r0 = K.pct(T[0].rate, 0), rTop = K.pct(T[T.length - 1].rate, 0);
const at = (x: number) => K.stateTax('OR', x);
const ladder = [1200000, 1700000, 2500000, 3500000, 5000000, 7500000, 10000000];
// The Department's own example.
const dorEx = 1700000;
// Nonresident: Idaho owner of a $900,000 house in Bend, estate of $3,000,000.
const nrGross = 3000000, nrHouse = 900000;
const nrTax = at(nrGross) * nrHouse / nrGross;
// Same estate in the neighbouring states.
const cmp = ['OR', 'WA'].map((st) => [K.nameOf(st), K.usd(K.stateTax(st, 2500000)), K.usd(K.stateTax(st, 5000000))]);

export default defineGuide({
  id: 'oregon-estate-tax',
  group: 'estate',
  order: 250,
  slug: 'oregon-estate-tax',
  nav: 'Oregon',
  card: `The lowest threshold, ${K.usd(ex)}, rates from ${r0} to ${rTop}, 12 months to file`,
  title: `Oregon Estate Tax 2026: ${K.usd(ex)} Threshold and Rate Table`,
  description: `Oregon estate tax 2026: the lowest threshold in the US at ${K.usd(ex)}, not indexed, rates from ${r0} to ${rTop} on the value above it, Form OR-706 due in ${OR.dueMonths} months.`,
  h1: 'Oregon estate tax in 2026',
  intro: `Oregon's estate tax starts at ${K.usd(ex)}, the lowest line of any state, and that line has not moved since it was set. Enter the taxable estate to see the Oregon tax and how it grows.`,
  facts: [['Threshold', K.usd(ex)], ['First rate', r0], ['Top rate', rTop], ['OR-706 due', `${OR.dueMonths} months`]],
  resume: `Oregon requires an estate tax return when the gross estate of a resident, or of a nonresident with Oregon real estate or tangible property, is worth ${K.usd(ex)} or more at death. The threshold is a fixed amount in the statute and is not adjusted for inflation, which makes Oregon the state where an ordinary house and a retirement account are most likely to trigger the tax. The first ${K.usd(ex)} of the taxable estate is not taxed. Above it the 2026 table of Form OR-706 charges ${r0} on the next ${K.usd(T[1].from - T[0].from)}, then rising rates up to ${rTop} above ${K.usd(T[T.length - 1].from)}. The Department's own example, a taxable estate of ${K.usd(dorEx)}, owes ${K.usd(at(dorEx))}. An estate of ${K.usd(2500000)} owes ${K.usd(at(2500000))} and one of ${K.usd(5000000)} owes ${K.usd(at(5000000))}. When property lies outside Oregon the tax is prorated by the Oregon share of the gross estate. The return and the payment are due ${OR.dueMonths} months after death, three months later than in most states. A 2026 bill to raise the threshold did not pass.`,
  body: (h) => `
<h2>The table, line by line</h2>
<p>Part 6 of the ${h.src('or_706i', '2026 Form OR-706 instructions')} prints the table in four columns: the taxable estate from which a row applies, the row's upper limit, the tax on the amount in the first column, and the rate on everything above it. The table starts at ${K.usd(ex)} with a tax of zero, so the first ${K.usd(ex)} is never taxed, and the tax grows smoothly from there. There is no jump at the threshold: an estate a dollar over the line owes ${r0} of one dollar.</p>
${h.table(['Taxable estate from', 'Tax on that amount', 'Rate above it'], T.map((r) => [K.usd(r.from), K.usd(r.base), K.pct(r.rate, 2)]), 'Oregon estate transfer tax table for deaths in 2026, Form OR-706 instructions, part 6.', ['l', 'r', 'r'])}
<p>The instructions work through one case. A taxable estate of ${K.usd(dorEx)} falls in the row that starts at ${K.usd(T[1].from)}: the tax on that amount is ${K.usd(T[1].base)}, the remaining ${K.usd(dorEx - T[1].from)} is taxed at ${K.pct(T[1].rate, 2)}, and the total is ${K.usd(at(dorEx))}. The engine of this site reproduces that figure; it is one of the automated tests listed on the ${h.a('method', 'method page')}.</p>
${h.mini('state', { t: 'Oregon tax on another estate', p: ['estate'], d: { st: 'OR', estate: 2000000 } })}
<h2>What the ladder looks like</h2>
${h.table(['Taxable estate', 'Oregon tax', 'Share of the estate', 'Share of the part above the threshold'], ladder.map((x) => [K.usd(x), K.usd(at(x)), K.pct(at(x) / x), K.pct(at(x) / (x - ex))]), 'Resident with all property in Oregon, deaths in 2026.', ['l', 'r', 'r', 'r'])}
<p>Two readings come out of the ladder. Measured against the whole estate, the tax stays modest at small sizes: an estate of ${K.usd(1200000)} pays ${K.pct(at(1200000) / 1200000)} of its value. Measured against what lies above the threshold, the rate is never below ${r0} and reaches ${K.pct(at(10000000) / (10000000 - ex))} at ${K.usd(10000000)}. For comparison, the federal estate tax starts at ${K.usd(K.F.basicExclusion)}, so none of the estates in this table owes any federal tax.</p>
<h2>Why the threshold matters so much here</h2>
<p>A gross estate includes the house at market value, bank and brokerage accounts, retirement accounts, a share of a business, and life insurance the deceased owned. Without any planning, many Oregon homeowners cross ${K.usd(ex)}. The Department's ${h.src('or_2026_leg', '2026 summary of legislation')} lists Senate Bill 1511 among the notable bills not passed: it would have raised the filing threshold, indexed it to inflation and replaced the rate table with a phase-in starting at the threshold. Because it did not pass, the ${K.usd(ex)} line and the table above apply to every death in 2026.</p>
${h.table(['State', `Tax on ${K.usd(2500000)}`, `Tax on ${K.usd(5000000)}`], cmp, 'Oregon and Washington, residents, deaths after June 30, 2026.', ['l', 'r', 'r'])}
<h2>Property inside and outside Oregon</h2>
<p>Oregon computes the tax on the whole estate, wherever its property is, and then multiplies it by the Oregon percentage: the gross value of the property Oregon taxes, divided by the gross estate, rounded to six decimals and capped at 100 %. For a resident, Oregon taxes all real estate and tangible property located in Oregon and all intangible property, such as accounts and securities, unless another state or country taxes those intangibles because of the death. For a nonresident, Oregon taxes only real estate and tangible property located in Oregon.</p>
<p>So a person living in Idaho whose ${K.usd(nrGross)} estate includes a ${K.usd(nrHouse)} house in Bend files Form OR-706. Oregon computes ${K.usd(at(nrGross))} on the whole estate and keeps ${K.pct(nrHouse / nrGross, 0)} of it: ${K.usd(nrTax)}. The tax is due even though Idaho has no estate tax of its own; ${h.a('property-in-another-state', 'property in another state')} shows the same situation in other states.</p>
<h2>Deductions and the natural resource relief</h2>
<p>The taxable estate is the gross estate minus the deductions of the federal Form 706 schedules: debts, funeral and administration expenses, the marital deduction for a surviving spouse, and the charitable deduction. Oregon asks for the same schedules, appraisals and documents that a federal return would carry, even when no federal return is due. Owners of farm, forest and fishing property can claim a natural resource credit or exemption under conditions that the 2025 legislature modified; both are now certified each year on Form OR-NRP-CERT, and they come with recapture rules if the property stops qualifying. Oregon allows its own election for qualified terminable interest property, separate from the federal one.</p>
<p>Oregon prints no rule letting a surviving spouse use the first spouse's unused threshold. A couple who leave everything to each other therefore pass the whole amount to one estate, which is the question covered on ${h.a('married-couples-state-estate-tax', 'married couples and state estate tax')}.</p>
<h2>Twelve months to file and pay</h2>
<p>The return and the payment are both due twelve months after death, on the same day of the month: a death on February 16 gives a due date of February 16 the next year. An extension of time to pay has to be requested and approved before that date; without it, interest and penalties apply. The ${h.a('estate-tax-return-deadline', 'deadlines page')} lists every state side by side.</p>
`,
  faqs: [
    { q: 'Is the Oregon estate tax threshold adjusted for inflation?', a: `No. The ${K.usd(ex)} threshold is a fixed figure in the statute and in the 2026 Form OR-706 instructions, with no yearly adjustment. A 2026 bill, Senate Bill 1511, would have raised it and indexed it to inflation, but the Department of Revenue lists it among the notable bills that did not pass.` },
    { q: 'Does Oregon tax the first $1 million of an estate?', a: `No. The table starts at ${K.usd(ex)} with a tax of zero, so only the value above that line is taxed, at ${r0} on the next ${K.usd(T[1].from - T[0].from)} and at rising rates after that. An estate just over the threshold owes very little; there is no cliff of the New York kind.` },
    { q: 'How is Oregon estate tax computed for a house owned by an Idaho resident?', a: `Oregon computes its tax on the whole estate, then keeps the share that Oregon real estate and tangible property represent in the gross estate. For a ${K.usd(nrHouse)} house in an estate of ${K.usd(nrGross)}, that is ${K.usd(nrTax)}. A return is needed once the gross estate reaches ${K.usd(ex)}.` },
    { q: 'When is the Oregon estate tax return due?', a: `Twelve months after the date of death, for both Form OR-706 and the payment, unless the Department approved an extension of time to pay requested before that date. Most other states and the federal Form 706 use nine months, so an Oregon estate that also files federally has two different calendars.` },
  ],
  tool: 'state',
  toolArg: { st: 'OR', estate: dorEx },
  related: ['state-estate-tax', 'washington-estate-tax', 'property-in-another-state', 'married-couples-state-estate-tax', 'estate-tax-return-deadline', 'states-without-estate-tax'],
  sources: ['or_706i', 'or_2026_leg'],
});
