import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const NY = K.E.NY;
const bea = NY.exemption, prevBea = NY.prev;
const k = NY.cliff!;
const edge = Math.round(bea * k), prevEdge = Math.round(prevBea * k);
const width = edge - bea;
const tax = (x: number) => K.nyTax(x);
const full = (x: number) => K.taxFromTable(NY.table!, x);
// Steps of 0.5 % of the exclusion across the band.
const steps = Array.from({ length: 11 }, (_, i) => Math.round(bea * (1 + i * 0.005)));
// Marginal cost of the next $10,000 at several points.
const d = 10000;
const marg = (x: number) => (tax(x + d) - tax(x)) / d;
// Calibrated charitable gift: an estate at 102 % of the exclusion.
const e = Math.round(bea * 1.02);
const gift = e - bea;
const keepNoGift = e - tax(e), keepGift = bea - tax(bea);
// Point where heirs keep as much as at the exclusion with no gift.
let breakEven = edge;
for (let x = bea + 1000; x <= edge * 1.3; x += 1000) { if (x - tax(x) >= bea) { breakEven = x; break; } }

export default defineGuide({
  id: 'new-york-estate-tax-cliff',
  group: 'estate',
  order: 246,
  slug: 'new-york-estate-tax-cliff',
  nav: 'New York cliff',
  card: `Between ${K.usd(bea)} and ${K.usd(edge)}, each dollar can cost more than a dollar`,
  title: `New York Estate Tax Cliff 2026: The ${K.pct(k, 0)} Band in Numbers`,
  description: `New York estate tax cliff 2026: the credit vanishes between ${K.usd(bea)} and ${K.usd(edge)}, marginal cost above 100 %, and the estate size where heirs break even.`,
  h1: 'The New York estate tax cliff in 2026',
  intro: `New York's credit does not stop at a threshold, it collapses across a band only ${K.usd(width)} wide. Enter a New York taxable estate to see where it falls on the cliff and what the next dollar costs.`,
  facts: [['Band starts at', K.usd(bea)], ['Band ends at', K.usd(edge)], ['Width of the band', K.usd(width)], ['Heirs break even near', K.usd(breakEven)]],
  resume: `For deaths in 2026 the New York cliff runs from ${K.usd(bea)}, the basic exclusion amount, to ${K.usd(edge)}, which is ${K.pct(k, 0)} of it. Below the band the applicable credit wipes out the tax. Inside it the credit is recomputed on a shrinking amount, so the tax rises from zero to ${K.usd(tax(edge))} over a stretch of only ${K.usd(width)}. Past the band the credit is gone and the tax is the full table amount on the whole estate. The result is a marginal cost above 100 % across most of the band: an extra ${K.usd(d)} near the middle adds about ${K.usd(marg(Math.round(bea * 1.025)) * d)} of tax. Heirs of an estate at ${K.usd(e)} keep ${K.usd(keepNoGift)}, less than the ${K.usd(keepGift)} they would keep from an estate of exactly ${K.usd(bea)}; they only get back to that level around ${K.usd(breakEven)}. That is why New York wills sometimes leave to charity the exact amount above the exclusion. The band moves each year with the exclusion: in 2025 it ran from ${K.usd(prevBea)} to ${K.usd(prevEdge)}.`,
  body: (h) => `
<h2>Where the band comes from</h2>
<p>Section 952(c) of the ${h.src('ny_952', 'New York Tax Law')} gives every estate an applicable credit. When the New York taxable estate is at or below the basic exclusion amount, the credit equals the tax and nothing is due. When it is above, the credit is not the tax on the exclusion, as a federal reader would expect, but the tax on a reduced figure: the exclusion multiplied by one minus the excess divided by ${K.pct(k - 1, 0)} of the exclusion. The ET-706 instructions turn this into an eight-line worksheet (${h.src('ny_et706i', 'Form ET-706 instructions')}). At ${K.usd(edge)} the reduced figure reaches zero, the credit is zero, and the estate pays the table tax on every dollar.</p>
<p>The table itself is ordinary, with rates that start low on the first dollars of the estate. That is the source of the shock: when the credit disappears, the estate suddenly pays the low brackets it never paid before, in one go.</p>
${h.table(['New York taxable estate', 'Over the exclusion', 'Tax', 'Tax without credit'], steps.map((x) => [K.usd(x), K.pct((x - bea) / bea, 1), K.usd(tax(x)), K.usd(full(x))]), `The band for deaths in 2026, in steps of half a percent of the ${K.usd(bea)} exclusion.`, ['l', 'r', 'r', 'r'])}
<h2>What the next dollar costs</h2>
<p>The figure that matters to an executor or a family is the marginal one: how much tax a little more estate brings. Inside the band it is well above 100 %. The table below adds ${K.usd(d)} at different points and reads the extra tax.</p>
${h.table(['Estate before', 'Extra tax on the next ' + K.usd(d), 'Marginal cost'], [bea, Math.round(bea * 1.01), Math.round(bea * 1.025), Math.round(bea * 1.04), edge, edge + 500000].map((x) => [K.usd(x), K.usd(marg(x) * d), K.pct(marg(x), 0)]), 'Computed with the section 952 table and the 2026 exclusion.', ['l', 'r', 'r'])}
<p>Just past ${K.usd(edge)}, the marginal cost falls back to the ordinary rate of the table bracket. The estate is then taxed like any other large estate, except that it has paid tax from its first dollar. For most estates in the band the federal estate tax is not involved at all, since the federal exclusion is ${K.usd(K.F.basicExclusion)}.</p>
${h.mini('cliff', { t: 'Try an amount inside the band', p: ['estate'], d: { estate: Math.round(bea * 1.035) } })}
<h2>The calibrated charitable bequest</h2>
<p>Because the cost of the band is higher than the band itself, removing the excess can leave heirs better off. Some New York wills contain a clause that leaves to charity whatever amount would bring the taxable estate down to the exclusion, and only if the estate lands inside the band. The charitable deduction is subtracted before the New York tax is computed, so the estate sits at the exclusion and owes nothing.</p>
${h.table(['', 'No clause', 'Clause gives the excess to charity'], [['Estate', K.usd(e), K.usd(e)], ['Charitable bequest', K.usd(0), K.usd(gift)], ['New York estate tax', K.usd(tax(e)), K.usd(tax(bea))], ['Left to heirs', K.usd(keepNoGift), K.usd(keepGift)]], `An estate at 102 % of the 2026 exclusion, no federal tax.`, ['l', 'r', 'r'])}
<p>The heirs receive ${K.usd(keepGift - keepNoGift)} more with the clause, and a charity receives ${K.usd(gift)}. The same arithmetic stops working past about ${K.usd(breakEven)}: above that size heirs keep more than ${K.usd(bea)} even after the tax, and a gift large enough to reach the exclusion would cost them more than it saves. This is a description of a technique, not a recommendation; whether a clause fits a will depends on the family, the charity and the drafting, which is the work of an attorney admitted in New York.</p>
<h2>Other ways estates leave the band</h2>
<p>Three other levers move the New York taxable estate. Deductions: debts, funeral and administration expenses, and what passes to a spouse who is a US citizen come off before the tax. Gifts during life: New York has no gift tax, but taxable gifts made within three years of death are added back for deaths before ${K.month(NY.giftsUntil!)}, so a gift made late in life does not take an estate out of the band. Location: real estate and tangible property located outside New York are left out of a resident's taxable estate, and taxed, if at all, where they sit (${h.a('property-in-another-state', 'property in another state')}).</p>
<p>Valuation is the lever no one controls. An appraisal of a house, a business interest or art that comes out a few percent higher than expected can move an estate from the safe side of ${K.usd(bea)} into the band, and the extra tax can be several times the extra value. For an estate close to the line, the appraisals can matter more than any planning choice.</p>
<h2>A moving target</h2>
<p>The exclusion is indexed each year, so the band moves with it: ${K.usd(prevBea)} to ${K.usd(prevEdge)} for deaths in 2025, ${K.usd(bea)} to ${K.usd(edge)} for deaths in 2026 (${h.src('ny_dtf', 'Department of Taxation and Finance')}). An estate that was inside the band under last year's figures can be below it this year without any change in its value. The general rules of the tax, the nonresident rules and the filing deadline are on ${h.a('new-york-estate-tax', 'the New York estate tax page')}.</p>
`,
  faqs: [
    { q: 'How wide is the New York estate tax cliff in 2026?', a: `${K.usd(width)}. The credit starts to shrink above the ${K.usd(bea)} basic exclusion and disappears at ${K.usd(edge)}, which is ${K.pct(k, 0)} of it. Within that stretch the tax goes from zero to ${K.usd(tax(edge))}, so an estate at the top of the band pays tax on its whole value and not only on the excess.` },
    { q: 'Can an extra dollar of estate cost more than a dollar of New York tax?', a: `Yes, inside the band. Near the middle, adding ${K.usd(d)} to the estate adds about ${K.usd(marg(Math.round(bea * 1.025)) * d)} of New York tax, a marginal cost of ${K.pct(marg(Math.round(bea * 1.025)), 0)}. Heirs of an estate in the band can therefore receive less than heirs of an estate at exactly the exclusion.` },
    { q: 'At what estate size do New York heirs come out ahead of the exclusion again?', a: `Around ${K.usd(breakEven)} for deaths in 2026. Below that, heirs keep less after the New York tax than the ${K.usd(bea)} they would keep from an estate right at the exclusion. Above it the estate is large enough that the tax, although charged on every dollar, leaves them more.` },
    { q: 'How does a New York will clause leaving the excess to charity work?', a: `The will leaves to charity the amount needed to bring the New York taxable estate down to the basic exclusion, only if the estate would otherwise fall inside the band. The charitable deduction removes the excess, the tax is zero, and the heirs receive the exclusion amount. Drafting and limits are a matter for a New York estate attorney.` },
  ],
  tool: 'cliff',
  toolArg: { estate: Math.round(bea * 1.02) },
  related: ['new-york-estate-tax', 'state-estate-tax', 'gifts-and-state-estate-tax', 'married-couples-state-estate-tax', 'moving-to-avoid-estate-tax'],
  sources: ['ny_952', 'ny_et706i', 'ny_dtf'],
});
