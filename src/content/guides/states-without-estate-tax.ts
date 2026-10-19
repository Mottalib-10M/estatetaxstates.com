import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const NONE = K.NONE_CODES;
const names = NONE.map((c) => K.nameOf(c));
const n = NONE.length;
const est = 8000000;
const stateTaxes = (st: string, x = est, heir: Parameters<typeof K.computeCase>[0]['heir'] = 'child') => {
  const r = K.computeCase({ estate: x, st, married: false, toSpouse: 'none', heir, heirs: 2 });
  return r.stateTotal + r.inhTotal;
};
// Neighbours across a state line.
const pairs: Array<[string, string]> = [['NH', 'VT'], ['NH', 'MA'], ['ID', 'WA'], ['ID', 'OR'], ['WI', 'MN'], ['WI', 'IL'], ['VA', 'MD'], ['DE', 'NJ'], ['FL', 'NY'], ['CA', 'OR']];
// A Texas resident with a $1,500,000 house in Massachusetts and a $1,500,000 house in Oregon, estate $6,000,000.
const tx = K.computeCase({ estate: 6000000, st: 'TX', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'OR', reValue: 1500000 });
const fed = (x: number) => K.federalEstateTax({ taxableEstate: x, gifts: 0, dsue: 0 }).tax;
const NJ = K.R.NJ_estate, IA = K.R.IA;

export default defineGuide({
  id: 'states-without-estate-tax',
  group: 'guides',
  order: 290,
  slug: 'states-without-estate-tax',
  nav: 'States without estate tax',
  card: `${n} states owe nothing at death in 2026, but property elsewhere and federal tax still count`,
  title: `States Without Estate Tax 2026: The ${n} With No Death Tax`,
  description: `States without estate tax 2026: the ${n} states with no estate or inheritance tax, Iowa included since 2025, and what residents still owe on property elsewhere.`,
  h1: 'States with no estate or inheritance tax in 2026',
  intro: `In ${n} states a death in 2026 triggers no state tax at all, neither on the estate nor on the heirs. Compare an estate in two states to see what the state line is worth, then read what still applies.`,
  facts: [['States with no death tax', String(n)], ['Estate tax states', String(K.ESTATE_CODES.length)], ['Inheritance tax states', String(K.INHERITANCE_CODES.length)], ['Federal exclusion', K.usd(K.F.basicExclusion)]],
  resume: `For deaths in 2026, ${n} states charge neither an estate tax nor an inheritance tax: ${names.join(', ')}. ${K.ESTATE_CODES.length - 1} other states and the District of Columbia have an estate tax, and ${K.INHERITANCE_CODES.length} states tax heirs through an inheritance tax, Maryland doing both. Iowa joined the list of states with no death tax for deaths on or after January 1, 2025, when its inheritance tax ended, and New Jersey stopped charging an estate tax for deaths from January 1, 2018 but kept its inheritance tax. Living in one of these ${n} states removes the state layer, not every tax. The federal estate tax still applies above ${K.usd(K.F.basicExclusion)} per person. Real estate and tangible property located in a taxing state are taxed by that state as a nonresident estate, whatever the owner's home state. And the inheritance tax of Pennsylvania, New Jersey, Kentucky, Nebraska or Maryland depends on where the deceased lived, not where the heir lives. On an ${K.usd(est)} estate left to two children, the state line can be worth ${K.usd(stateTaxes('OR'))} between Idaho and Oregon.`,
  body: (h) => `
<h2>The ${n} states, and how the list was built</h2>
<p>A state belongs here only if it has no estate tax and no inheritance tax for deaths in 2026. The ${K.ESTATE_CODES.length} estate tax jurisdictions and the ${K.INHERITANCE_CODES.length} inheritance tax states each have their own page, with the law and the revenue department page they were read on. Every state not in either group is in the table below.</p>
${h.table(['State', 'Estate tax', 'Inheritance tax', 'Note'], NONE.map((c) => [K.nameOf(c), 'none', 'none', c === 'IA' ? `inheritance tax ended for deaths from ${K.month(IA.endedFor)}` : '']), `States with no death tax for deaths in 2026 (${n}).`, ['l', 'l', 'l', 'l'])}
<p>Two states left the taxing side recently, in different ways. The ${h.src('ia_dor', 'Iowa Department of Revenue')} writes that Iowa inheritance tax is not applicable for deaths on or after ${K.month(IA.endedFor)}; estates of people who died earlier still follow the old rules, covered on ${h.a('iowa-inheritance-tax', 'the Iowa page')}. New Jersey's Division of Taxation states that the New Jersey estate tax is no longer imposed for deaths on or after ${K.month(NJ.endedFor)} (${h.src('nj_inh', 'NJ Division of Taxation')}), but its inheritance tax continues, so New Jersey is not on this list (${h.a('new-jersey-inheritance-tax', 'New Jersey inheritance tax')}).</p>
<h2>What the state line is worth</h2>
<p>The gap between neighbours can be large. The table puts the same estate, ${K.usd(est)}, unmarried, left in equal shares to two children, on each side of ten state lines, with no gifts and all property in the home state. The federal estate tax is zero at that size in every case.</p>
${h.table(['State with no death tax', 'Its neighbour', 'State tax in the neighbour'], pairs.map(([a, b]) => [K.nameOf(a), K.nameOf(b), K.usd(stateTaxes(b))]), `State estate and inheritance taxes on ${K.usd(est)} left to two children, deaths after June 30, 2026.`, ['l', 'l', 'r'])}
<p>Two lines stand out. New Jersey shows zero for children, since they are exempt from its inheritance tax, but the same estate left to two nephews would owe ${K.usd(stateTaxes('NJ', est, 'nephew'))}. Pennsylvania, not in the table, would charge ${K.usd(stateTaxes('PA'))} to the two children, because it taxes lineal heirs too.</p>
${h.mini('compare', { t: 'Your estate in two states', p: ['estate', 'a', 'b'], d: { estate: 6000000, a: 'MA', b: 'NH' } })}
<h2>Property in a taxing state</h2>
<p>A home state with no death tax does not protect real estate located elsewhere. Every estate tax state can tax its own real estate and tangible property when the owner lived in another state, each with its own threshold test and method, and the inheritance tax states do the same on real estate located there. A Texas resident leaving ${K.usd(6000000)} to two children, including a ${K.usd(1500000)} house in Oregon, owes Oregon ${K.usd(tx.other?.tax ?? 0)} although Texas charges nothing. The executor files a nonresident return in Oregon even though the Texas estate itself has nothing to file at the state level, and the same house would also go through a probate procedure in Oregon unless it was held in a way that avoids one. The full set of rules is on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Where the heir lives does not matter</h2>
<p>An inheritance tax follows the deceased, not the heir. A nephew living in Florida who inherits from an aunt in Pennsylvania pays Pennsylvania inheritance tax on his share; a nephew living in Pennsylvania who inherits from an aunt in Florida pays nothing to Pennsylvania, unless the aunt left Pennsylvania real estate or tangible property. The same holds for estate taxes, which are computed on the estate before anything is distributed.</p>
<h2>The federal layer stays</h2>
<p>The federal estate tax applies in every state above ${K.usd(K.F.basicExclusion)} per person, at ${K.pct(K.F.topRate, 0)} on the excess: ${K.usd(fed(20000000))} on a ${K.usd(20000000)} taxable estate with no lifetime gifts. A surviving spouse can add the first spouse's unused exclusion if the executor elects portability on Form 706 (${h.a('portability', 'portability')}). Residents of the ${n} states face that tax alone; residents of the others add the state tax on top, and the state tax paid is deducted from the federal base (${h.a('estate-tax-exemption', 'federal estate tax exemption')}).</p>
<h2>Moving into one of these states</h2>
<p>A move only changes the state tax if the domicile changes, which is a question of where a person lives and intends to stay, shown by facts such as the home, the driver's license, voter registration and where the time is spent. Some estate tax states examine the last years of a former resident's life closely. And a house kept in the old state keeps its tax there. The details and the figures by state are on ${h.a('moving-to-avoid-estate-tax', 'moving to avoid estate tax')}; nothing on this page is advice to move.</p>
`,
  faqs: [
    { q: 'How many states have no estate or inheritance tax in 2026?', a: `${n}: ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}. The other ${51 - n} jurisdictions, counting the District of Columbia, have an estate tax, an inheritance tax or, in Maryland's case, both. Iowa is on the list for deaths from January 1, 2025, when its inheritance tax ended.` },
    { q: 'Why is New Jersey missing from the list of states with no death tax?', a: `Because only half of its death taxes ended. The New Jersey Division of Taxation states that the estate tax is no longer imposed for deaths on or after ${K.month(NJ.endedFor)}. New Jersey still has its inheritance tax, which spares spouses, children, grandchildren and parents but taxes brothers and sisters, nieces, nephews and friends, so a New Jersey estate can still owe tax.` },
    { q: 'Does a Florida resident with a house in Oregon owe Oregon estate tax?', a: `Yes, once the whole gross estate reaches Oregon's ${K.usd(K.E.OR.exemption)} threshold. Oregon computes its tax on the entire estate and keeps the share its real estate and tangible property represent. Florida itself charges nothing. The same reasoning applies to houses in the other estate tax states, each with its own threshold.` },
    { q: 'Do heirs living in Pennsylvania pay inheritance tax on an estate from Texas?', a: `No. The Pennsylvania inheritance tax applies to the property of a person who lived in Pennsylvania, and to Pennsylvania real estate and tangible property of a nonresident. What a Pennsylvania resident inherits from a Texas resident's accounts or Texas house is outside it. Income later earned on the inheritance is a separate question.` },
  ],
  tool: 'compare',
  toolArg: { estate: est, a: 'OR', b: 'ID', heir: 'child' },
  related: ['state-estate-tax', 'inheritance-tax-by-state', 'property-in-another-state', 'moving-to-avoid-estate-tax', 'iowa-inheritance-tax', 'new-jersey-inheritance-tax'],
  sources: ['ia_dor', 'nj_inh', 'or_706i'],
});
