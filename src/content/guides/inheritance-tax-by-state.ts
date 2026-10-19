import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

type Rel = Parameters<typeof K.inhTax>[1];
const ST = K.INHERITANCE_CODES;
const I = K.I;
const RELS: Array<[Rel, string]> = [['spouse', 'Spouse'], ['child', 'Adult child'], ['grandchild', 'Grandchild'], ['inlaw', 'Son- or daughter-in-law'], ['sibling', 'Brother or sister'], ['nephew', 'Niece or nephew'], ['auntuncle', 'Aunt or uncle'], ['cousin', 'Cousin'], ['other', 'Friend or partner']];
const row = (amt: number) => RELS.map(([r, l]) => [l, ...ST.map((s) => K.usd(K.inhTax(s, r, amt)))]);
const PA = I.PA.classes, NJC = I.NJ.classes.C.slices!, NJD = I.NJ.classes.D.slices!, NE = I.NE.classes, KYB = I.KY.classes.B, KYC = I.KY.classes.C;
const mdRate = I.MD.rate as number;
const top = (s: Array<[number | null, number]>) => s[s.length - 1][1];
const nephew = (amt: number) => ST.map((s) => [K.nameOf(s), K.usd(K.inhTax(s, 'nephew', amt))]);
const worst = (rel: Rel, amt: number) => [...ST].sort((a, b) => K.inhTax(b, rel, amt) - K.inhTax(a, rel, amt))[0];
const worstNames = (rel: Rel, amt: number) => { const m = K.inhTax(worst(rel, amt), rel, amt); return ST.filter((x) => Math.abs(K.inhTax(x, rel, amt) - m) < 0.5).map(K.nameOf).join(' and '); };
const ended = K.month(K.R.IA.endedFor);

export default defineGuide({
  id: 'inheritance-tax-by-state',
  group: 'inheritance',
  order: 300,
  slug: 'inheritance-tax-by-state',
  nav: 'Inheritance tax by state',
  card: 'The five states that tax heirs, side by side for each relationship',
  title: 'Inheritance Tax by State 2026: Rates for Each Heir, 5 States',
  description: `Inheritance tax by state 2026: Pennsylvania, New Jersey, Kentucky, Nebraska and Maryland compared for children, siblings, nephews, friends; Iowa repealed.`,
  h1: 'Inheritance tax by state, 2026',
  intro: `Five states tax what heirs receive: Pennsylvania, New Jersey, Kentucky, Nebraska and Maryland. Choose a state, a relationship and an amount, or read the tables below for every heir at once.`,
  facts: [['States with the tax', String(ST.length)], ['Spouse', 'exempt everywhere'], ['Highest top rate', K.pct(Math.max(top(NJD), top(KYC.slices!)), 0)], ['Iowa', `repealed from ${ended}`]],
  resume: `For deaths in 2026 an inheritance tax applies in five states: Pennsylvania, New Jersey, Kentucky, Nebraska and Maryland. Iowa repealed its tax for deaths on or after ${ended}. The tax depends on the state where the deceased lived, or where the real estate lies, never on where the heir lives, and the rate depends on the heir's relationship to the deceased. A surviving spouse pays nothing in all five. Children pay nothing in New Jersey, Kentucky and Maryland, ${K.pct(PA.lineal.rate!, 1)} in Pennsylvania and ${K.pct(NE['1'].rate!, 0)} above ${K.usd(NE['1'].exemption!)} in Nebraska. Brothers and sisters are exempt in Kentucky and Maryland, but pay ${K.pct(PA.sibling.rate!, 0)} in Pennsylvania. Nieces and nephews, exempt in Kentucky since January 1, 2026, pay ${K.pct(mdRate, 0)} in Maryland, ${K.pct(NE['2'].rate!, 0)} above ${K.usd(NE['2'].exemption!)} in Nebraska and ${K.pct(NJD[0][1], 0)} or more in New Jersey and Pennsylvania. On ${K.usd(100000)}, a nephew pays ${nephew(100000).map(([s, v]) => `${v} in ${s}`).join(', ')}.`,
  body: (h) => `
<h2>Every heir, every state, on ${K.usd(100000)}</h2>
<p>The table gives the tax one person pays on a share of ${K.usd(100000)} received from a resident of each state, for a death in 2026, before any early payment discount. The heir is assumed to be 22 or older, which matters only in Nebraska.</p>
${h.table(['Heir', ...ST.map(K.nameOf)], row(100000), `Inheritance tax on a ${K.usd(100000)} share, deaths in 2026. Computed with each state's classes and rates.`, ['l', ...ST.map(() => 'r' as const)])}
<p>Two patterns stand out. Close family is almost always exempt, Pennsylvania and Nebraska being the exceptions for children. And the gap between states is widest for the middle of the family tree: a nephew who pays nothing in Kentucky pays ${K.usd(K.inhTax(worst('nephew', 100000), 'nephew', 100000))} in ${worstNames('nephew', 100000)} on the same share.</p>
<h2>The same table on ${K.usd(1000000)}</h2>
<p>On a large share the exempt amounts matter less and the top rates more. New Jersey and Kentucky ${top(NJD) === top(KYC.slices!) ? `both reach ${K.pct(top(NJD), 0)}` : `reach ${K.pct(top(NJD), 0)} and ${K.pct(top(KYC.slices!), 0)}`} at the top of their brackets, Pennsylvania stays flat, Nebraska taxes the excess over its class exemption at a single rate, and Maryland keeps its single ${K.pct(mdRate, 0)}.</p>
${h.table(['Heir', ...ST.map(K.nameOf)], row(1000000), `Inheritance tax on a ${K.usd(1000000)} share, deaths in 2026.`, ['l', ...ST.map(() => 'r' as const)])}
${h.mini('inh', { t: 'One heir, one state', p: ['st', 'amt', 'rel'], d: { st: 'NE', amt: 500000, rel: 'nephew' } })}
<h2>How each state is built</h2>
<p><strong>Pennsylvania</strong> taxes every share from the first dollar, at ${K.pct(PA.lineal.rate!, 1)} for lineal heirs, ${K.pct(PA.sibling.rate!, 0)} for siblings and ${K.pct(PA.other.rate!, 0)} for everyone else, with 0 for a spouse and for a child aged 21 or younger inheriting from a parent. Life insurance is exempt, and payment within ${(I.PA.discount as { months: number }).months} months earns a discount (${h.a('pennsylvania-inheritance-tax', 'Pennsylvania')}).</p>
<p><strong>New Jersey</strong> sorts heirs into classes. Class A, close family and registered partners, is exempt. Class C, siblings and children's spouses, pays nothing on the first ${K.usd(NJC[0][0]!)} and then ${K.pct(NJC[1][1], 0)} to ${K.pct(top(NJC), 0)}. Class D, everyone else, pays ${K.pct(NJD[0][1], 0)} up to ${K.usd(NJD[0][0]!)} and ${K.pct(top(NJD), 0)} above (${h.a('new-jersey-inheritance-tax', 'New Jersey')}).</p>
<p><strong>Kentucky</strong> exempts Class A, which for deaths from January 1, 2026 includes nephews and nieces. Class B, in-laws, aunts, uncles and great-grandchildren, has a ${K.usd(KYB.exemption!)} exemption and brackets from ${K.pct(KYB.slices![0][1], 0)} to ${K.pct(top(KYB.slices!), 0)}; Class C has a ${K.usd(KYC.exemption!)} exemption and brackets from ${K.pct(KYC.slices![0][1], 0)} to ${K.pct(top(KYC.slices!), 0)} (${h.a('kentucky-inheritance-tax', 'Kentucky')}).</p>
<p><strong>Nebraska</strong> has three classes, each with an exempt amount and one rate on the excess: ${K.pct(NE['1'].rate!, 0)} above ${K.usd(NE['1'].exemption!)} for close family, ${K.pct(NE['2'].rate!, 0)} above ${K.usd(NE['2'].exemption!)} for aunts, uncles, nieces and nephews, ${K.pct(NE['3'].rate!, 0)} above ${K.usd(NE['3'].exemption!)} for everyone else. Summaries that reduce Nebraska to two rates drop Class 2, the one that applies to nieces and nephews. Heirs under 22 and the spouse pay nothing (${h.a('nebraska-inheritance-tax', 'Nebraska')}).</p>
<p><strong>Maryland</strong> lists exempt relatives, from grandparents to siblings and the spouses of descendants, and taxes everyone else at ${K.pct(mdRate, 0)}; it is also the only state with an estate tax, which is reduced by the inheritance tax paid (${h.a('maryland-inheritance-tax', 'Maryland inheritance tax')}).</p>
<h2>Which state's tax applies</h2>
<p>The state is set by the deceased, not by the heir. New Jersey's Division of Taxation says it directly: where the beneficiaries lived is not a factor, and filing depends on where the deceased legally lived (${h.src('nj_inh', 'New Jersey Division of Taxation')}). A daughter in California who inherits from a mother in Philadelphia pays Pennsylvania tax; a nephew in Philadelphia who inherits from an aunt in Florida pays none. A resident's estate is taxed on everything except real estate located in another state. A nonresident's estate is taxed by each of these states on the real estate, and generally the tangible property, located there: a Florida retiree's house at the Jersey Shore or farmland in Nebraska can carry an inheritance tax even though Florida has none. The methods differ, from New Jersey's ratio computation to Kentucky's prorated exemption, and are compared on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Iowa, the sixth state until 2024</h2>
<p>Iowa reduced its inheritance tax rates for 2024 deaths and then ended the tax: for deaths on or after ${ended} it no longer applies at all (${h.src('ia_dor', 'Iowa Department of Revenue')}). Tables that still list six states, or Iowa rates, are out of date for a death in 2026. Returns for earlier deaths are still processed under the old law, as ${h.a('iowa-inheritance-tax', 'the Iowa page')} explains.</p>
<h2>Deadlines and who pays</h2>
<p>The tax falls on the heir's share, but the executor or personal representative files the return and usually pays it out of the estate before distributing the share. The calendars differ: Pennsylvania's tax becomes delinquent after ${I.PA.dueMonths} months, New Jersey's return and payment are due within ${I.NJ.dueMonths} months, Kentucky allows ${(I.KY as { dueMonthsBeforeJuly: number }).dueMonthsBeforeJuly} months for deaths before July 1, 2026 and ${I.KY.dueMonths} months after, Nebraska sets the tax in a county court proceeding, and Maryland's Register of Wills collects it when the property is distributed. All five inheritance taxes are deductible from the federal taxable estate under section 2058, which matters only above ${K.usd(K.F.basicExclusion)}. The full calendar is on ${h.a('estate-tax-return-deadline', 'estate tax return deadlines')}, and the difference between the two kinds of death tax on ${h.a('estate-tax-vs-inheritance-tax', 'estate tax vs inheritance tax')}.</p>
`,
  faqs: [
    { q: 'Which states have an inheritance tax in 2026?', a: `Five: Pennsylvania, New Jersey, Kentucky, Nebraska and Maryland. Iowa repealed its inheritance tax for deaths on or after ${ended}, so a list of six states is out of date. Maryland is the only one of the five that also has an estate tax; the other four tax heirs only.` },
    { q: 'In which state do nephews pay the most inheritance tax?', a: `On ${K.usd(100000)}, ${worstNames('nephew', 100000)}: ${K.usd(K.inhTax(worst('nephew', 100000), 'nephew', 100000))}, against ${K.usd(K.inhTax('NE', 'nephew', 100000))} in Nebraska, ${K.usd(K.inhTax('MD', 'nephew', 100000))} in Maryland and nothing in Kentucky since January 1, 2026. On a share of ${K.usd(1000000)} the highest is ${worstNames('nephew', 1000000)}, at ${K.usd(K.inhTax(worst('nephew', 1000000), 'nephew', 1000000))}, because its rates apply from the first dollar while Nebraska's ${K.pct(NE['2'].rate!, 0)} applies only above the class exemption.` },
    { q: 'Does the inheritance tax depend on where the heir lives?', a: `No. It depends on where the deceased lived, plus the state where any real estate is located. An heir living in Texas who inherits from a parent in Pennsylvania pays Pennsylvania's tax; an heir living in Pennsylvania who inherits from a parent in Texas pays none, unless the parent owned real estate in one of the five states.` },
    { q: 'Do children pay inheritance tax in any state?', a: `In two states. Pennsylvania charges ${K.pct(PA.lineal.rate!, 1)} on every share left to an adult child, and Nebraska ${K.pct(NE['1'].rate!, 0)} on what exceeds ${K.usd(NE['1'].exemption!)} per child aged 22 or older. New Jersey, Kentucky and Maryland exempt children, stepchildren and grandchildren entirely.` },
  ],
  tool: 'inh',
  toolArg: { st: 'NE', amt: 400000, rel: 'nephew' },
  related: ['pennsylvania-inheritance-tax', 'new-jersey-inheritance-tax', 'kentucky-inheritance-tax', 'nebraska-inheritance-tax', 'maryland-inheritance-tax', 'iowa-inheritance-tax', 'estate-tax-vs-inheritance-tax'],
  sources: ['pa_dor', 'nj_inh', 'ky_140_070', 'ne_77_2004', 'md_7204', 'ia_dor'],
});
