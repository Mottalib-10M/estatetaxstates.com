import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const NJ = K.I.NJ;
const Cs = NJ.classes.C.slices!, Ds = NJ.classes.D.slices!;
const free = Cs[0][0]!;
const NJE = K.R.NJ_estate as { exemption2016: number; exemption2017: number };
const intr = K.pct(NJ.interestRate as number, 0);
const c = (x: number) => K.inhTax('NJ', 'sibling', x);
const d = (x: number) => K.inhTax('NJ', 'nephew', x);
const amounts = [20000, 100000, 400000, 800000, 1500000, 2500000];
const r = (s: Array<[number | null, number]>, i: number) => K.pct(s[i][1], 0);
// A Pennsylvania resident's New Jersey shore house, 40 % of an estate left to a niece.
const whole = 1500000, house = 600000;
const nr = K.computeCase({ estate: whole, st: 'PA', married: false, toSpouse: 'none', heir: 'nephew', heirs: 1, reState: 'NJ', reValue: house });

export default defineGuide({
  id: 'new-jersey-inheritance-tax',
  group: 'inheritance',
  order: 320,
  slug: 'new-jersey-inheritance-tax',
  nav: 'New Jersey',
  card: `Class A exempt, siblings ${r(Cs, 1)} to ${r(Cs, 4)} after ${K.usd(free)}, others ${r(Ds, 0)} to ${r(Ds, 1)}`,
  title: 'New Jersey Inheritance Tax 2026: Classes A, C, D and Rates',
  description: `New Jersey inheritance tax 2026: Class A heirs exempt, siblings and in-laws ${r(Cs, 1)} to ${r(Cs, 4)} above ${K.usd(free)}, others ${r(Ds, 0)} to ${r(Ds, 1)}, due in ${NJ.dueMonths} months; no estate tax.`,
  h1: 'New Jersey inheritance tax in 2026',
  intro: `New Jersey no longer taxes estates, but it still taxes what brothers, sisters, in-laws, nephews and friends inherit. Pick the relationship and the amount received to see the tax.`,
  facts: [['Spouse, children, parents', 'exempt'], ['Siblings, in-laws', `${r(Cs, 1)} to ${r(Cs, 4)}`], ['Everyone else', `${r(Ds, 0)} to ${r(Ds, 1)}`], ['Return and payment', `${NJ.dueMonths} months`]],
  resume: `New Jersey taxes each transfer from a person who dies, according to the class of the person who receives it. Class A, which covers the spouse, civil union or domestic partner, children, stepchildren, grandchildren and further descendants, parents and grandparents, pays nothing. Class C, brothers and sisters and the spouse or surviving spouse of a child, pays nothing on the first ${K.usd(free)} and then ${r(Cs, 1)}, ${r(Cs, 2)}, ${r(Cs, 3)} and ${r(Cs, 4)} by bracket. Class D, everyone else, nieces, nephews, cousins and friends included, pays ${r(Ds, 0)} on the first ${K.usd(Ds[0][0]!)} and ${r(Ds, 1)} above, from the first dollar. Charities and the state are Class E and exempt. A sister receiving ${K.usd(400000)} owes ${K.usd(c(400000))}; a nephew receiving the same amount owes ${K.usd(d(400000))}. The return and the tax are due ${NJ.dueMonths} months after death, and interest at ${intr} a year runs after that. New Jersey's estate tax ended for deaths on or after January 1, 2018, so only this tax remains.`,
  body: (h) => `
<h2>The four classes</h2>
<p>The Division of Taxation sorts every beneficiary into a class (${h.src('nj_classes', 'beneficiary classes')}). The rules turn on the legal relationship, not on closeness. A stepchild is Class A, but a step-grandchild is not, and falls into Class D. A domestic partner registered after July 10, 2004 or a civil union partner after February 19, 2007 is Class A, like a spouse. A son-in-law or daughter-in-law is Class C, as is the civil union partner of a child. Class B was abolished in 1963, which is why the letters jump.</p>
${h.table(['Class', 'Who', 'Rates'], [
  ['A', 'Spouse, civil union or domestic partner, children, stepchildren, grandchildren and further descendants, parents, grandparents, a mutually acknowledged child', 'exempt'],
  ['C', 'Brothers and sisters, the spouse or surviving spouse of a child', `first ${K.usd(free)} exempt, then ${Cs.slice(1).map((s, i) => r(Cs, i + 1)).join(', ')}`],
  ['D', 'Everyone else: nieces, nephews, aunts, uncles, cousins, friends, step-grandchildren', `${r(Ds, 0)} up to ${K.usd(Ds[0][0]!)}, ${r(Ds, 1)} above`],
  ['E', 'Qualified charities, religious, educational and medical institutions, the State of New Jersey', 'exempt'],
], 'New Jersey Division of Taxation, General Information O-10-C.', ['l', 'l', 'l'])}
<h2>Class C brackets in dollars</h2>
<p>For Class C the brackets are cumulative for each beneficiary: after the first ${K.usd(free)}, the next ${K.usd(Cs[1][0]! - free)} is taxed at ${r(Cs, 1)}, the next ${K.usd(Cs[2][0]! - Cs[1][0]!)} at ${r(Cs, 2)}, the next ${K.usd(Cs[3][0]! - Cs[2][0]!)} at ${r(Cs, 3)} and anything over ${K.usd(Cs[3][0]!)} at ${r(Cs, 4)}. Class D has no exempt slice at all, which makes the gap between a brother and a nephew largest on small inheritances.</p>
${h.table(['Amount received', 'Brother or sister (C)', 'Nephew or friend (D)', 'Difference'], amounts.map((x) => [K.usd(x), K.usd(c(x)), K.usd(d(x)), K.usd(d(x) - c(x))]), 'New Jersey inheritance tax for one beneficiary, deaths in 2026.', ['l', 'r', 'r', 'r'])}
<p>The table shows the effect of the exempt ${K.usd(free)}. A brother receiving ${K.usd(20000)} owes nothing, a nephew owes ${K.usd(d(20000))}. On ${K.usd(2500000)} the gap narrows to ${K.usd(d(2500000) - c(2500000))}, because both classes end at ${r(Cs, 4)}.</p>
${h.mini('inh', { t: 'New Jersey tax on one share', p: ['amt', 'rel'], d: { st: 'NJ', amt: 150000, rel: 'sibling' } })}
<h2>What is exempt besides Class A and E</h2>
<p>Three exemptions apply whatever the class. Transfers to a beneficiary worth less than ${K.usd(NJ.minTaxable as number)} in total are not taxed. Life insurance paid to a named beneficiary is not taxed, which is often the largest asset that passes to a nephew or friend without tax. Certain pensions are exempt as well: the New Jersey Public Employees Retirement System, the Teachers' Pension and Annuity Fund, the Police and Firemen's Retirement System, and federal Civil Service Retirement benefits paid to a beneficiary other than the estate (${h.src('nj_general', 'General Information O-10-C')}).</p>
<h2>A nonresident with New Jersey real estate</h2>
<p>If the deceased lived in another state, New Jersey taxes only real estate and tangible property located in New Jersey. Bank accounts and securities are not taxed directly, but they are reported, because the tax is computed by the ratio method: the tax on the whole share as if everything were taxable, multiplied by the New Jersey property's share of the gross estate. The old flat tax method has been replaced by this method, called Method 3 in the Division's nonresident questions. Real estate held by a married couple or civil union partners as tenants by the entirety is not taxed at the first death.</p>
<p>Example: a Pennsylvania resident leaves an estate of ${K.usd(whole)} to a niece, including a New Jersey shore house worth ${K.usd(house)}. New Jersey charges ${K.usd(nr.inhOther?.tax ?? 0)}, and Pennsylvania taxes the rest of the estate at its own collateral rate, ${K.usd(nr.inhHome?.tax ?? 0)}. The details of other states are on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Deadlines, interest and waivers</h2>
<p>The return is filed and the tax paid within ${NJ.dueMonths} months of death, with the Inheritance and Estate Tax Branch in Trenton. Interest accrues at ${intr} a year on any tax unpaid after that date, and the tax is a lien on New Jersey property for ${NJ.lienYears} years unless it is paid or bonded. A return is needed whenever tax is due or property passes to anyone outside Class A. For a nonresident, form L-9 NR can be used when every beneficiary of the whole estate is Class A or E, with no dollar limit, and filing the nonresident return is how the waiver that releases New Jersey real estate is obtained (${h.src('nj_nrfaq', 'nonresident questions')}).</p>
<h2>The estate tax that no longer exists</h2>
<p>Many pages still mention a New Jersey estate tax with a ${K.usd(NJE.exemption2016)} exemption. That threshold applied to deaths up to December 31, 2016; it was ${K.usd(NJE.exemption2017)} for deaths in 2017, and there is no New Jersey estate tax for deaths from January 1, 2018 (${h.src('nj_inh', 'Division of Taxation')}). New Jersey is therefore, with Pennsylvania, Kentucky and Nebraska, a state where only the inheritance tax applies. The comparison is on ${h.a('inheritance-tax-by-state', 'inheritance tax by state')}.</p>
`,
  faqs: [
    { q: 'Do New Jersey children and grandchildren pay inheritance tax?', a: `No. Children, adopted children, stepchildren, grandchildren and further descendants are Class A and exempt, like the spouse and the parents. A step-grandchild is the exception: not Class A, so Class D, taxed at ${r(Ds, 0)} from the first dollar. The estate may still need a short form to release accounts.` },
    { q: 'How much New Jersey inheritance tax does a brother pay on $200,000?', a: `${K.usd(c(200000))}. The first ${K.usd(free)} is exempt for Class C, and the next amount up to ${K.usd(Cs[1][0]!)} is taxed at ${r(Cs, 1)}, so ${K.usd(200000 - free)} times ${r(Cs, 1)}. A nephew receiving the same ${K.usd(200000)} would owe ${K.usd(d(200000))}, as Class D starts at ${r(Ds, 0)} on the first dollar.` },
    { q: 'Is life insurance taxed by the New Jersey inheritance tax?', a: `Not when it is paid to a named beneficiary: the Division lists those proceeds as exempt. Paid to the estate, the proceeds become part of what the beneficiaries of the estate receive and can be taxed by class. Federally, insurance owned by the deceased is in the gross estate in both cases.` },
    { q: 'Does New Jersey still have an estate tax in 2026?', a: `No. The New Jersey estate tax applies only to residents who died before January 1, 2018. Its exemption was ${K.usd(NJE.exemption2016)} until the end of 2016 and ${K.usd(NJE.exemption2017)} for 2017. For deaths in 2026 only the inheritance tax remains, and it never applies to transfers to a spouse, children or parents.` },
    { q: 'Where do New Jersey nephews and nieces fall?', a: `In Class D, with friends and cousins: ${r(Ds, 0)} on the first ${K.usd(Ds[0][0]!)} received and ${r(Ds, 1)} above, from the first dollar except shares under ${K.usd(NJ.minTaxable as number)} in total. A niece receiving ${K.usd(100000)} owes ${K.usd(d(100000))}. Kentucky, by contrast, moved nephews and nieces to its exempt class in 2026.` },
  ],
  tool: 'inh',
  toolArg: { st: 'NJ', amt: 300000, rel: 'sibling' },
  related: ['inheritance-tax-by-state', 'pennsylvania-inheritance-tax', 'new-york-estate-tax', 'property-in-another-state', 'kentucky-inheritance-tax', 'states-without-estate-tax'],
  sources: ['nj_inh', 'nj_classes', 'nj_general', 'nj_nrfaq'],
});
