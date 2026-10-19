import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const IL = K.E.IL;
const th = IL.exemption;
const il = (x: number, g = 0) => K.ilTax(x, g);
const capped = (x: number) => Math.abs(il(x) - (0.4 * (x - th)) / 1.4) < 1;
/** First estate size, on a $10,000 grid, where the Table B credit is lower than the 40/140 limit. */
let switchAt = th + 10000;
while (capped(switchAt) && switchAt < 30000000) switchAt += 10000;
const ladder = [4000000, 4500000, 5000000, 6000000, 8000000, 10000000, 15000000];
const fl = K.computeCase({ estate: 5000000, st: 'FL', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'IL', reValue: 2500000 });

export default defineGuide({
  id: 'illinois-estate-tax',
  group: 'estate',
  order: 220,
  slug: 'illinois-estate-tax',
  nav: 'Illinois',
  card: `${K.usd(th)} threshold, not a credit; interrelated computation by the Attorney General`,
  title: `Illinois Estate Tax 2026: $${K.dec(th / 1e6, 1)} Million Threshold, Calculator`,
  description: `Illinois estate tax 2026: ${K.usd(th)} threshold, not a credit, Attorney General's interrelated computation, ${K.usd(il(5000000))} on 5 million, Form 700 due in 9 months.`,
  h1: 'Illinois estate tax in 2026',
  intro: `Illinois taxes estates whose value, gifts included, exceeds ${K.usd(th)}, and the tax is computed with an interrelated formula published by the Attorney General. Enter the taxable estate to see the Illinois tax for a death in 2026.`,
  facts: [['Threshold', K.usd(th)], ['Tax on 5 million', K.usd(il(5000000))], ['Spouse carryover', 'none'], ['Form 700 due', `${IL.dueMonths} months`]],
  resume: `Illinois owes no estate tax on estates of ${K.usd(th)} or less, gross value plus adjusted taxable gifts. The Attorney General, who administers the tax, stresses that this ${K.usd(th)} is a taxable threshold and not a credit: once it is crossed, the tax is computed on the whole estate, and it rises quickly. An estate of ${K.usd(5000000)} entirely in Illinois owes ${K.usd(il(5000000))}, which is ${K.pct(il(5000000) / 1000000)} of the ${K.usd(1000000)} above the threshold; the same estate with half its assets in Florida owes ${K.usd(il(5000000) / 2)}. The computation is interrelated because the Illinois tax reduces the estate on which it is calculated, and it uses the old federal credit table with a limit tied to a ${K.pct(K.F.topRate, 0)} federal rate. Illinois does not apply federal portability, so a surviving spouse cannot add the first spouse's unused amount. Form 700 is filed with the Attorney General within nine months of death, with a federal Form 706 or equivalent information attached.`,
  body: (h) => `
<h2>A threshold, not a credit</h2>
<p>The Attorney General's fact sheet says it plainly: "The exclusion amount is a taxable threshold and not a credit against tax" (${h.src('il_fact', 'Illinois estate tax fact sheet')}). In a credit system such as the federal one, ${K.usd(th)} would be tax free in every estate and only the excess would bear tax. In Illinois, an estate at ${K.usd(th)} owes nothing, but an estate above it owes a tax measured on the whole taxable estate, held down near the threshold by a ceiling that keeps the tax below the amount by which the estate exceeds ${K.usd(th)}.</p>
${h.table(['Taxable estate, all in Illinois', 'Illinois tax', 'Tax as a share of the excess over the threshold'], ladder.map((x) => [K.usd(x), K.usd(il(x)), x > th ? K.pct(il(x) / (x - th)) : 'none']), 'Computed with the interrelated formula of the Attorney General’s calculator; no lifetime gifts.', ['l', 'r', 'r'])}
<p>Up to about ${K.usd(switchAt)}, the tax equals 40/140 of the excess, ${K.pct(0.4 / 1.4)} of each dollar above ${K.usd(th)}. That is the ceiling at work. Beyond that size the Table B computation becomes the smaller of the two and the tax follows the old federal credit for state death taxes, whose top rate is ${K.pct(K.P.tableB[K.P.tableB.length - 1].rate, 0)}. The federal estate tax adds nothing until the estate passes ${K.usd(K.F.basicExclusion)}, so for most Illinois estates this is the only death tax.</p>
${h.mini('state', { t: 'Illinois tax on another estate', p: ['estate'], d: { st: 'IL', estate: 6000000 } })}
<h2>How the interrelated computation works</h2>
<p>The Attorney General publishes an online calculator for decedents from 2013 to 2026 and asks estates to enter two figures from Form 700: the taxable estate and the adjusted taxable gifts. The logic, which this site reproduces, runs in two steps. First, the Illinois tax is the credit read on Table B for an adjusted taxable estate equal to the taxable estate, less the Illinois tax itself, less ${K.usd(60000)}; since the tax appears on both sides, it is found by repeating the computation until it stops changing. Second, the tax may not exceed what a ${K.pct(K.F.topRate, 0)} tax on the amount above ${K.usd(th)} would leave after deducting the Illinois tax, which gives the 40/140 ceiling. The engine of this site reproduces the examples printed in the fact sheet to the dollar, and they are run as tests.</p>
<h2>The Attorney General's own examples</h2>
${h.table(['Situation', 'Illinois tax'], [[`Estate of ${K.usd(3000000)}`, K.usd(il(3000000))], [`Estate of ${K.usd(3000100)} with ${K.usd(1000000)} of adjusted taxable gifts`, K.usd(il(3000100, 1000000))], [`Estate of ${K.usd(th)}, all in Illinois`, K.usd(il(th))], [`Estate of ${K.usd(5000000)}, all in Illinois`, K.usd(il(5000000))], [`Estate of ${K.usd(5000000)}, half in Illinois and half in Florida`, K.usd(il(5000000) / 2)]], 'Examples from the Illinois estate tax fact sheet, recomputed by this site’s engine.', ['l', 'r'])}
<p>The second line shows what gifts do. They are not taxed themselves, yet they count toward the threshold: ${K.usd(3000100)} plus ${K.usd(1000000)} of gifts is ${K.usd(100)} over ${K.usd(th)}, and the estate owes a small tax. A large gift made years earlier can therefore bring an estate under ${K.usd(th)} into the tax.</p>
<h2>Property in Illinois and elsewhere</h2>
<p>For residents and nonresidents alike, a preliminary tax is computed as if all assets were in Illinois, then multiplied by the ratio of Illinois assets to total assets, with the Form 700 Addendum for estates below 100 % (${h.src('il_ag', 'Illinois Attorney General, estate taxes')}). The fact sheet notes that the Florida half of the example estate is excluded from the Illinois tax even though Florida itself imposes none. Conversely, a Florida resident with a ${K.usd(5000000)} estate including a ${K.usd(2500000)} Chicago property would owe Illinois ${K.usd(fl.other?.tax ?? 0)} on this basis. The rules of the other states are compared on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Spouses, QTIP and the missing portability</h2>
<p>Property left outright to a spouse is deducted, as federally. Illinois also allows a QTIP election for Illinois purposes only, made on a timely Illinois return, separate from any federal QTIP election; the fact sheet's last example, an estate of ${K.usd(K.F.history['2024'])} with a surviving spouse and an Illinois QTIP election of ${K.usd(K.F.history['2024'] - th)}, owes nothing. What Illinois does not accept is portability: the note at the end of the fact sheet says that the carry-over of the unused federal exemption to the surviving spouse "is inapplicable to the computation and assessment of the Illinois Estate Tax". Couples whose combined estate exceeds ${K.usd(th)} therefore face the question discussed on ${h.a('married-couples-state-estate-tax', 'married couples')}.</p>
<h2>Filing with the Attorney General</h2>
<p>Form 700 must be filed with the Illinois Attorney General within nine months of the date of death, with the federal Form 706 and its schedules, appraisals, wills and trusts. An estate that does not need a federal return may present the same information in another format. Extensions are granted on Form 700-EXT or another written request, and the Attorney General recognizes federal extensions.</p>
`,
  faqs: [
    { q: 'What does "threshold, not a credit" mean for the Illinois estate tax?', a: `It means the ${K.usd(th)} is not subtracted from every estate. Below it, no tax; above it, the tax is computed on the whole estate, held down by a ceiling near the line. An estate of ${K.usd(5000000)} owes ${K.usd(il(5000000))}, not a tax on the ${K.usd(1000000)} excess at an ordinary bracket rate.` },
    { q: `Do lifetime gifts count toward the Illinois ${K.mil(th)} threshold?`, a: `Yes. Form 700 is due when the gross estate plus adjusted taxable gifts exceeds ${K.usd(th)}, and the gifts enter the ceiling of the computation. In the Attorney General's example, an estate of ${K.usd(3000100)} with ${K.usd(1000000)} of gifts owes ${K.usd(il(3000100, 1000000))}. Gifts under the federal annual exclusion are not adjusted taxable gifts.` },
    { q: 'Can a surviving spouse in Illinois use federal portability for the state tax?', a: `No. The Attorney General's fact sheet states that portability of the unused federal exemption does not apply to the Illinois estate tax. The surviving spouse's estate is measured against a single ${K.usd(th)} threshold, whatever the first spouse left unused. An Illinois-only QTIP election is available at the first death.` },
    { q: 'Where is the Illinois estate tax return filed?', a: `With the Office of the Illinois Attorney General, not the Department of Revenue, on Form 700 within nine months of death. The estate attaches the federal Form 706 with schedules, appraisals, wills and trusts, or the same information in another format when no federal return is required. Extensions are requested on Form 700-EXT.` },
  ],
  tool: 'state',
  toolArg: { st: 'IL', estate: 5000000 },
  related: ['state-estate-tax', 'married-couples-state-estate-tax', 'gifts-and-state-estate-tax', 'property-in-another-state', 'minnesota-estate-tax'],
  sources: ['il_fact', 'il_ag'],
});
