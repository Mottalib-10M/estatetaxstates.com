import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const W = 10000000, W2 = 6000000;
const c = (st: string, estate = W) => K.tool('couple', { estate, st });
const PORT: Record<string, string> = { yes: 'Yes, capped at the state exclusion', no: 'No', 'none-found': 'No rule published by the state' };
const FX = K.F.basicExclusion;
// Federal portability: a couple worth $25,000,000 that leaves everything to the survivor.
const fedBig = 25000000;
const fedNo = K.federalEstateTax({ taxableEstate: fedBig, gifts: 0, dsue: 0 }).tax;
const fedYes = K.federalEstateTax({ taxableEstate: fedBig, gifts: 0, dsue: FX }).tax;
const ma = c('MA'), ny = c('NY'), md = c('MD');
const cell = (o: ReturnType<typeof c>, i: number) => o.rows[i][1];

export default defineGuide({
  id: 'married-couples-state-estate-tax',
  group: 'guides',
  order: 430,
  slug: 'married-couples-state-estate-tax',
  nav: 'Married couples',
  card: 'Portability stops at the federal tax in most states',
  title: 'Married Couples and State Estate Tax 2026: Portability',
  description: `Married couples and state estate tax in 2026: the marital deduction, why most states lack portability, and what a bypass trust saves at the second death.`,
  h1: 'Married couples and state estate taxes in 2026',
  intro: 'Leaving everything to a spouse costs nothing at the first death, in every state. The bill comes at the second death, and in most estate-tax states the first spouse’s exemption is lost by then. Compare the two ways a couple’s estate can pass.',
  facts: [['Federal exclusion, couple with portability', K.usd(2 * FX)], ['States with portability', 'Maryland, Hawaii'], [`${K.usd(W)} couple in Massachusetts, saved by a trust`, ma.value], [`Same couple in New York`, ny.value]],
  resume: `Property that passes to a surviving spouse who is a US citizen is deducted from the estate, so the first death of a married couple usually owes no estate tax, federal or state. At the second death the survivor's estate holds everything. Federal law lets that estate add the unused exclusion of the first spouse, the deceased spousal unused exclusion amount, so a couple can pass ${K.usd(2 * FX)} free of federal tax in 2026 if the first estate elected portability on a timely Form 706. Among the thirteen estate-tax jurisdictions only Maryland and Hawaii let the survivor carry over the first spouse's state exclusion. In the other eleven, an estate left outright to the spouse uses no exemption at the first death and has a single exemption at the second. That is why estate attorneys in those states often use a credit shelter trust, which keeps up to the state exemption outside the survivor's estate. For a couple worth ${K.usd(W)}, the state tax at the second death falls by ${ma.value} in Massachusetts and by ${ny.value} in New York.`,
  body: (h) => `
<h2>The first death: the marital deduction</h2>
<p>Everything that passes to a surviving spouse who is a US citizen, outright or in a qualifying trust, is deducted from the federal taxable estate under ${h.src('usc_2056', '26 U.S.C. 2056')}. The states start from the federal taxable estate, so the same deduction applies to the state tax: a couple can leave any amount to each other without a state or federal estate tax at the first death. A spouse who is not a US citizen is the exception; the deduction then requires a qualified domestic trust (${h.a('non-citizen-spouse', 'noncitizen spouse')}). Inheritance-tax states are simpler still: Pennsylvania, New Jersey, Kentucky, Nebraska and Maryland all exempt the surviving spouse.</p>
<h2>The second death: who keeps the first exemption</h2>
${h.table(['Jurisdiction', 'Exemption 2026', 'Portability of the first spouse’s exemption'], K.ESTATE_CODES.map((st) => [K.nameOf(st), K.usd(K.E[st].exemption), PORT[K.E[st].portability]]), 'Rules read on each state’s revenue department and statute. Washington: exemption for deaths from July 1, 2026.', ['l', 'r', 'l'])}
<p>Federal portability is written in ${h.src('usc_2010', '26 U.S.C. 2010(c)')}: the survivor's applicable exclusion is the basic exclusion plus the unused amount of the last deceased spouse, provided the executor elected it on a timely estate tax return. A couple worth ${K.usd(fedBig)} who leave everything to each other owes ${K.usd(fedYes)} of federal tax at the second death with portability, ${K.usd(fedNo)} without it. Maryland follows the same logic for its own exclusion, under ${h.src('md_7309', 'Tax-General section 7-309')}, with an election on a timely Maryland return of the first spouse and a cap of ${K.usd(K.E.MD.exemption)}. Hawaii allows it too, capped at its ${K.usd(K.E.HI.exemption)} exclusion. New York, Illinois and Washington say expressly that a federal portability election does not carry into their tax; the other states publish no portability rule in the pages and forms read for this site.</p>
<h2>What everything to the spouse costs, state by state</h2>
<p>The table compares two plans for a couple whose estate is ${K.usd(W)}, and then ${K.usd(W2)}, with no growth between the deaths. Plan A leaves everything to the survivor. Plan B has the first spouse to die leave an amount equal to the state exemption, or half the estate if that is less, in a credit shelter trust for the survivor; the trust is not part of the survivor's estate at the second death.</p>
${h.table(['Jurisdiction', `${K.usd(W)}: plan A`, `${K.usd(W)}: plan B`, `Saved at ${K.usd(W)}`, `Saved at ${K.usd(W2)}`], K.ESTATE_CODES.map((st) => { const o = c(st), o2 = c(st, W2); return [K.nameOf(st), cell(o, 0), cell(o, 1), o.value, o2.value]; }), 'State estate tax at the second death (plan B also counts any state tax at the first death). Deaths in 2026, residents, no lifetime gifts, no growth.', ['l', 'r', 'r', 'r', 'r'])}
<p>Three groups appear. In Maryland and Hawaii, portability already gives the survivor two exemptions, so the trust changes nothing at these amounts. In Connecticut the exemption equals the federal ${K.usd(FX)}, so a ${K.usd(W)} couple owes nothing either way. Everywhere else the trust saves real money, and the saving is largest where the exemption is high relative to the estate and the tax is steep around it: in New York the second estate drops under the ${K.usd(K.E.NY.exemption)} exclusion and the cliff never applies, and in Vermont the second estate falls back to the ${K.usd(K.E.VT.exemption)} line.</p>
${h.mini('couple', { t: 'Your combined estate and state', p: ['estate', 'st'], d: { estate: 8000000, st: 'WA' } })}
<h2>How a credit shelter trust works, and what it costs</h2>
<p>A credit shelter trust, also called a bypass or family trust, is created by the will or the revocable trust of the first spouse to die. It receives an amount sized to the state exemption, often by a formula clause, and pays income to the survivor, sometimes principal for health and support, before passing to the children. Because the survivor does not own it, it is not in the survivor's estate, and any growth after the first death escapes state tax too. The calculator lets you add growth to see that effect. The trade-offs are practical: a separate trust with its own records and tax filings, and a plan fixed at the first death that may suit a later move to another state less well. Drafting belongs to an estate attorney in the state concerned; this page only shows the tax arithmetic.</p>
<h2>Federal portability still matters in these states</h2>
<p>Even where the state ignores it, the federal election is made on Form 706 filed for the first spouse, within nine months of death plus the six-month extension, and executors who were not required to file can still elect within five years under Rev. Proc. 2022-32 (${h.src('rp_2022_32', 'the IRS procedure')}). An estate in Massachusetts or Oregon that files a state return at the first death can also file a federal return only to elect portability, so that the survivor keeps the unused federal amount in reserve.usd(FX)} in reserve. A New York couple with ${K.usd(W)} can therefore owe ${cell(ny, 0)} to the state at the second death and nothing to the federal government, as the table shows. The state pages give the forms: ${h.a('maryland-estate-tax', 'Maryland')}, ${h.a('massachusetts-estate-tax', 'Massachusetts')}, ${h.a('new-york-estate-tax', 'New York')}, ${h.a('washington-estate-tax', 'Washington')}.</p>
`,
  faqs: [
    { q: 'Does a federal portability election protect a Massachusetts survivor from state estate tax?', a: `No. Massachusetts computes its tax with Table B and a fixed ${K.usd(K.E.MA.credit!)} credit, and publishes no rule carrying the first spouse's exemption over. A ${K.usd(W)} estate left entirely to the survivor owes ${cell(ma, 0)} at the second death; a credit shelter trust of ${K.usd(K.E.MA.exemption)} brings that to ${cell(ma, 1)}.` },
    { q: 'How does Maryland portability work for a widow who inherited everything?', a: `Her own ${K.usd(K.E.MD.exemption)} exclusion is increased by the unused Maryland exclusion of her late husband, capped at ${K.usd(K.E.MD.exemption)}, if his personal representative elected it on a timely Maryland estate tax return. The election can be made on a return filed only for that purpose within five years of his death. A ${K.usd(W)} estate then owes ${cell(md, 0)}.` },
    { q: 'Why does a credit shelter trust save so much for a New York couple worth ten million?', a: `Because the second estate falls under the cliff. Left outright, the survivor's ${K.usd(W)} is taxed from the first dollar and owes ${cell(ny, 0)}. With a trust holding the first spouse's share, the survivor's estate is under the ${K.usd(K.E.NY.exemption)} exclusion and owes ${cell(ny, 1)} to New York, a difference of ${ny.value}.` },
    { q: 'Do married couples pay inheritance tax when one spouse dies in Pennsylvania or New Jersey?', a: 'No. All five inheritance-tax states, Pennsylvania, New Jersey, Kentucky, Nebraska and Maryland, exempt property passing to a surviving spouse; New Jersey extends that to civil union and domestic partners. Inheritance tax appears only when children, siblings or others inherit, at the rates of each state.' },
  ],
  tool: 'couple',
  toolArg: { estate: W, st: 'MA' },
  related: ['portability', 'state-estate-tax', 'maryland-estate-tax', 'massachusetts-estate-tax', 'new-york-estate-tax', 'non-citizen-spouse'],
  sources: ['usc_2056', 'usc_2010', 'md_7309', 'hi_m6', 'rp_2022_32', 'ny_dtf', 'ma_dor', 'wa_faq'],
});
