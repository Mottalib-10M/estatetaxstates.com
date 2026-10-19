import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const NY = K.E.NY;
const bea = NY.exemption, top = Math.round(bea * NY.cliff!);
const at = (x: number) => K.nyTax(x);
const ex1 = 7000000, ex2 = 7500000, ex3 = 9000000;
const fed = K.F.basicExclusion;
const T = NY.table!;
const r0 = K.pct(T[0].rate, 2), rTop = K.pct(T[T.length - 1].rate, 0), band = K.pct(NY.cliff! - 1, 0);
const marg = (x: number) => K.pct([...T].reverse().find((r) => x > r.from)!.rate);

export default defineGuide({
  id: 'new-york-estate-tax',
  group: 'estate',
  order: 245,
  slug: 'new-york-estate-tax',
  nav: 'New York',
  card: `Exclusion of ${K.usd(bea)}, the ${K.pct(NY.cliff!, 0)} cliff, rates up to ${rTop}`,
  title: 'New York Estate Tax 2026: Exclusion, Cliff and Calculator',
  description: `New York estate tax 2026: basic exclusion of ${K.usd(bea)}, tax on the whole estate above ${K.usd(top)}, rates from ${r0} to ${rTop}, gifts and nonresident property.`,
  h1: 'New York estate tax in 2026',
  intro: `New York taxes estates above ${K.usd(bea)} for deaths in 2026, and an estate a little larger than that loses the exclusion entirely. Enter the New York taxable estate to see the tax, the cliff and the rate on each dollar.`,
  facts: [['Basic exclusion 2026', K.usd(bea)], ['Credit lost entirely at', K.usd(top)], ['Top rate', rTop], ['Return ET-706 due', `${NY.dueMonths} months`]],
  resume: `For a death in 2026, New York owes no estate tax when the New York taxable estate is ${K.usd(bea)} or less, the basic exclusion amount set by the Department of Taxation and Finance (it was ${K.usd(NY.prev)} in 2025). Above that line New York does not tax only the excess, as the federal system does. The applicable credit shrinks as the estate grows and disappears at ${K.pct(NY.cliff!, 0)} of the exclusion, ${K.usd(top)}; past that point the tax is computed on the entire estate with the table of Tax Law section 952, from ${r0} on the first ${K.usd(T[1].from)} to ${rTop} above ${K.usd(T[T.length - 1].from)}. An estate of ${K.usd(ex2)} owes ${K.usd(at(ex2))}, an estate of ${K.usd(ex3)} owes ${K.usd(at(ex3))}. There is no portability between spouses in New York, gifts made in the three years before death are added back, and nonresidents pay only on real estate and tangible property located in the state. The federal exclusion is ${K.usd(fed)}, so most New York estates that pay state tax pay no federal tax at all.`,
  body: (h) => `
<h2>How the New York tax is computed</h2>
<p>The starting point is the federal gross estate, minus the deductions allowed on the federal return: debts, funeral and administration costs, the marital deduction for what passes to a spouse who is a US citizen, and the charitable deduction. Two adjustments follow. A resident's real estate and tangible property located outside New York are left out, since they are taxed, if at all, by the state where they sit. Taxable gifts made within three years of death are added back, a rule that runs for deaths before ${K.month(NY.giftsUntil!)} (${h.src('ny_et706i', 'Form ET-706 instructions')}). The result is the New York taxable estate.</p>
<p>The tax on that amount is read on the table of ${h.src('ny_952', 'Tax Law section 952')}. Then comes the applicable credit, and this is where New York departs from every other state. At or below ${K.usd(bea)} the credit equals the tax, so nothing is owed. Between ${K.usd(bea)} and ${K.usd(top)} the credit is the tax on a shrinking amount: the exclusion multiplied by one minus the excess divided by ${band} of the exclusion. Above ${K.usd(top)} there is no credit.</p>
${h.table(['New York taxable estate', 'Tax', 'Tax per dollar above the exclusion'], [ex1, bea, Math.round(bea * 1.01), Math.round(bea * 1.025), ex2, top, ex3, 12000000].map((x) => [K.usd(x), K.usd(at(x)), x > bea ? K.pct(at(x) / (x - bea)) : 'none']), `New York estate tax for deaths in 2026, computed with the section 952 table and the 2026 basic exclusion.`, ['l', 'r', 'r'])}
<h2>The cliff in numbers</h2>
<p>The last column of the table is the one that matters for planning. An estate of ${K.usd(Math.round(bea * 1.01))}, one percent over the line, owes ${K.usd(at(Math.round(bea * 1.01)))}: far more than the ${K.usd(Math.round(bea * 0.01))} by which it exceeds the exclusion. Inside the band the tax grows faster than the estate, so each extra dollar costs more than a dollar. Past ${K.usd(top)} the curve calms down to the ordinary marginal rate of the table, ${marg(top)} at that level, but the estate has by then paid tax on its first dollar.</p>
${h.mini('cliff', { t: 'Where is your estate on the cliff?', p: ['estate'], d: { estate: Math.round(bea * 1.03) } })}
<p>Two consequences follow. A gift to charity that brings the taxable estate back to ${K.usd(bea)} can leave heirs with more money than they would have received without it, because the tax saved is larger than the gift. This is why New York wills sometimes contain a clause leaving to charity exactly the amount needed to avoid the cliff. And a valuation dispute that adds a few hundred thousand dollars to the estate can change the tax by several hundred thousand.</p>
<h2>Married couples and the missing portability</h2>
<p>Everything left to a spouse who is a US citizen is deducted, so the first death usually owes nothing. The problem appears at the second death. Federal law lets the survivor add the unused federal exclusion of the first spouse; New York does not. A couple worth ${K.usd(ex3)} who leave everything to each other pass the whole amount to the second estate, which then owes ${K.usd(at(ex3))} to New York. If the first spouse to die leaves ${K.usd(bea)} to a credit shelter trust for the survivor instead, that money is outside the second estate, and the second estate of ${K.usd(ex3 - bea)} owes ${K.usd(at(ex3 - bea))}. The comparison, with other states, is on ${h.a('married-couples-state-estate-tax', 'the page on married couples')}.</p>
<h2>Gifts, and the three-year rule</h2>
<p>New York has no gift tax. That makes lifetime gifts the classic way to bring an estate under the line, with one limit: taxable gifts made while a resident, within three years of death, are added back to the New York taxable estate. A gift within the federal annual exclusion of ${K.usd(K.F.annualExclusion)} per person is not a taxable gift and is never added back. Gifts of more than that use part of the federal lifetime exclusion and are reported on Form 709 (${h.a('gifts-and-state-estate-tax', 'gifts and state estate taxes')}).</p>
<h2>Nonresidents with a New York apartment or house</h2>
<p>A person who lived in Florida or Connecticut and owned a home in New York may owe New York estate tax. Under ${h.src('ny_960', 'Tax Law section 960')}, the tax is computed as for a resident, but on New York real estate and tangible property only; bank accounts, securities and other intangible assets are left out. The return is due when that property plus includible gifts exceeds the basic exclusion. In practice a New York apartment worth less than ${K.usd(bea)} leaves nothing to pay, but a large Manhattan property can by itself cross the cliff. The ${h.a('property-in-another-state', 'property in another state')} page covers the other twelve jurisdictions.</p>
<h2>Filing and paying</h2>
<p>Form ET-706 is due nine months after death, with an extension of up to six months to file; the tax is also due at nine months, and interest runs after that date. The Department publishes the exclusion and the forms on its ${h.src('ny_dtf', 'estate tax pages')}. A return is required whenever the federal gross estate plus includible gifts exceeds ${K.usd(bea)}, even if deductions bring the tax to zero. The exclusion is indexed to inflation each year: ${K.usd(NY.prev)} in 2025, ${K.usd(bea)} in 2026.</p>
`,
  faqs: [
    { q: 'What is the New York estate tax exemption for 2026?', a: `The basic exclusion amount is ${K.usd(bea)} for deaths from January 1 to December 31, 2026, up from ${K.usd(NY.prev)} in 2025. It applies to the New York taxable estate, after deductions and the gifts added back. Unlike the federal exclusion it is not portable between spouses, and it disappears entirely once the estate exceeds ${K.usd(top)}.` },
    { q: 'What happens to a New York estate just over the exclusion?', a: `It pays tax on more than the excess. At ${K.usd(Math.round(bea * 1.01))} the tax is ${K.usd(at(Math.round(bea * 1.01)))}, while the estate is only ${K.usd(Math.round(bea * 0.01))} over the line, because the credit phases out over a band of ${band} of the exclusion. Above ${K.usd(top)} the credit is gone and the whole estate is taxed from the first dollar.` },
    { q: 'Does New York tax a Florida resident who owns a condo in Manhattan?', a: `Only on the condo and other tangible property located in New York, never on bank or brokerage accounts. The tax is computed with the resident table on that property alone, so it is zero when the New York property is worth ${K.usd(bea)} or less. A nonresident return is still needed when the whole federal estate plus gifts exceeds the exclusion.` },
    { q: 'Can a surviving spouse in New York use the unused exclusion of the first spouse?', a: `No. New York has no portability. The federal election on Form 706 does not carry into New York, so a survivor who received everything has a single ${K.usd(bea)} exclusion. Couples whose combined estate exceeds that amount often keep the first exclusion through a credit shelter trust created at the first death.` },
  ],
  tool: 'cliff',
  toolArg: { estate: ex2 },
  related: ['new-york-estate-tax-cliff', 'state-estate-tax', 'married-couples-state-estate-tax', 'connecticut-estate-tax', 'new-jersey-inheritance-tax', 'property-in-another-state'],
  sources: ['ny_dtf', 'ny_952', 'ny_960', 'ny_et706i'],
});
