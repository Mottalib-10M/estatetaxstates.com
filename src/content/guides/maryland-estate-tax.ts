import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const MD = K.E.MD;
const ex = MD.exemption, r = MD.rate!;
const unified = K.tentativeTax(ex);
const line9 = (x: number) => Math.max(0, r * (x - ex));
const sdtc = (x: number) => Math.min(Math.max(0, K.tentativeTax(x) - unified), K.tableB(Math.max(0, x - 60000)));
const sizes = [5000000, 6000000, 7000000, 10000000, 15000000];
const inhRate = K.I.MD.classes.T.rate!;
const toKids = K.computeCase({ estate: 7000000, st: 'MD', married: false, toSpouse: 'none', heir: 'child', heirs: 2 });
const toNephews = K.computeCase({ estate: 7000000, st: 'MD', married: false, toSpouse: 'none', heir: 'nephew', heirs: 2 });
const portable = K.stateTax('MD', 9000000);
const withDsue = K.computeCase({ estate: 9000000, st: 'MD', married: false, toSpouse: 'none', heir: 'child', heirs: 2, dsue: 4000000 }).home!.tax;

export default defineGuide({
  id: 'maryland-estate-tax',
  group: 'estate',
  order: 230,
  slug: 'maryland-estate-tax',
  nav: 'Maryland',
  card: `${K.usd(ex)} exemption, ${K.pct(r, 0)} on the excess, and an inheritance tax as well`,
  title: `Maryland Estate Tax 2026: $${K.dec(ex / 1e6, 1)} Million Exemption and MET 1`,
  description: `Maryland estate tax 2026: ${K.usd(ex)} exemption, ${K.pct(r, 0)} of the excess or the old federal credit, portability, credit for ${K.pct(inhRate, 0)} inheritance tax, MET 1 at 9 months.`,
  h1: 'Maryland estate tax in 2026',
  intro: `Maryland is the only state that charges both an estate tax and an inheritance tax. Enter the Maryland estate tax base to see the estate tax for a death in 2026; the full calculator on the home page adds the inheritance tax by heir.`,
  facts: [['Exemption', K.usd(ex)], ['Rate on the excess', K.pct(r, 0)], ['Spouse carryover', `up to ${K.usd(ex)}`], ['Form MET 1 due', `${MD.dueMonths} months`]],
  resume: `For deaths in 2026, Maryland's estate tax exclusion is ${K.usd(ex)}, the amount fixed by Tax-General Article section 7-309 for every death since January 1, 2019; it is not indexed. Form MET 1 computes the tax as the lesser of two figures: ${K.pct(r, 0)} of the Maryland estate tax base above the exclusion, and the maximum credit for state death taxes of the old federal law, apportioned to the Maryland part of the estate. For a typical estate the ${K.pct(r, 0)} figure is the lower one, so an estate of ${K.usd(7000000)} owes ${K.usd(line9(7000000))} before credits. Maryland is one of two states with portability: a surviving spouse can add the unused Maryland exclusion of the first spouse, up to ${K.usd(ex)}. The inheritance tax of ${K.pct(inhRate, 0)}, owed by heirs other than close family, is credited against the estate tax, so the same ${K.usd(7000000)} estate left to two nephews pays ${K.usd(toNephews.inhTotal)} of inheritance tax and ${K.usd(toNephews.home!.tax)} of estate tax. MET 1 is due nine months after death, even when no federal return is required.`,
  body: (h) => `
<h2>Two computations, the smaller one wins</h2>
<p>Lines 7 to 13 of Form MET 1, revised in July 2026, set out the method (${h.src('md_met1', 'Form MET 1')}). The Maryland estate tax base is the federal gross estate, plus property for which a Maryland QTIP election was made at an earlier spouse's death, minus the federal deductions and any Maryland QTIP elected on this return. Line 8 subtracts the exclusion of ${K.usd(ex)} and any Maryland unused exclusion of a late spouse. Line 9 multiplies the result by ${K.pct(r, 0)}. Line 10 is the allowable maximum credit for state death taxes from Schedule B: the federal tentative tax on the base plus adjusted taxable gifts, minus a unified credit of ${K.usd(unified)}, capped by the Table B credit on the base less ${K.usd(60000)}. When property lies partly outside Maryland, line 12 multiplies that credit by the Maryland percentage. Line 13 keeps the smallest of the applicable lines.</p>
${h.table(['Maryland estate tax base', `${K.pct(r, 0)} of the excess (line 9)`, 'Credit for state death taxes (line 10)', 'Tax (line 13)'], sizes.map((x) => [K.usd(x), K.usd(line9(x)), K.usd(sdtc(x)), K.usd(Math.min(line9(x), sdtc(x)))]), 'All property in Maryland, no lifetime gifts, no unused exclusion of a spouse, before the credit for inheritance tax.', ['l', 'r', 'r', 'r'])}
<p>In each of these lines the ${K.pct(r, 0)} computation is the smaller one, and for estates without large lifetime gifts this is the usual case. The Table B credit matters mostly when property is spread across states, since only that line is apportioned: an estate with half its property in Virginia keeps the ${K.pct(r, 0)} figure as a ceiling and compares it with half the credit.</p>
${h.mini('state', { t: 'Maryland estate tax on another base', p: ['estate'], d: { st: 'MD', estate: 8000000 } })}
<h2>The inheritance tax credit</h2>
<p>Line 14 subtracts the Maryland inheritance tax paid, and any death tax paid to another state on assets also included in the Maryland estate. The inheritance tax is ${K.pct(inhRate, 0)} of what each heir receives, but the spouse, children and stepchildren, their descendants and the spouses of those descendants, parents, grandparents, brothers and sisters are exempt, as are life insurance proceeds paid to a named beneficiary (${h.a('maryland-inheritance-tax', 'Maryland inheritance tax')}). The two taxes therefore combine very differently according to who inherits.</p>
${h.table(['Estate of ' + K.usd(7000000) + ' left to', 'Inheritance tax', 'Estate tax after the credit', 'Total to Maryland'], [['two children', K.usd(toKids.inhTotal), K.usd(toKids.home!.tax), K.usd(toKids.stateTotal + toKids.inhTotal)], ['two nephews', K.usd(toNephews.inhTotal), K.usd(toNephews.home!.tax), K.usd(toNephews.stateTotal + toNephews.inhTotal)]], 'Unmarried Maryland resident, no gifts; computed by this site’s engine.', ['l', 'r', 'r', 'r'])}
<p>For the nephews, the inheritance tax is larger than the estate tax and absorbs it entirely. For the children, there is no inheritance tax and the estate tax is due in full.</p>
${h.mini('estate', { t: 'Both Maryland taxes for your heirs', p: ['estate', 'heir'], d: { st: 'MD', estate: 7000000, heir: 'nephew', n: 2 } })}
<h2>Portability of the Maryland exclusion</h2>
<p>Section 7-309 adds to the ${K.usd(ex)} any deceased spousal unused exclusion amount (${h.src('md_7309', 'Tax-General 7-309')}). The MET 1 instructions limit it to ${K.usd(ex)} or the unused exclusion of the last deceased spouse, whichever is less, and to surviving spouses dying since January 1, 2019. The election is made on the Maryland return of the first spouse to die, filed even if that estate owes nothing; a return filed only to elect portability may be filed within five years of that death. With a full carryover of ${K.usd(4000000)}, a ${K.usd(9000000)} estate owes ${K.usd(withDsue)} instead of ${K.usd(portable)}.</p>
<h2>Lifetime gifts and the frozen exclusion</h2>
<p>Gifts made during life are not part of the Maryland estate tax base on line 7. They appear in two places only: in the filing test, where adjusted taxable gifts are added to the gross estate, and on line 5 of Schedule B, where they raise the federal tentative tax used for the credit line. Because line 9 does not include them, a gift above the annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient usually lowers the Maryland estate tax by ${K.pct(r, 0)} of its value, a point covered on ${h.a('gifts-and-state-estate-tax', 'gifts and state estate tax')}. Gifts to heirs who would pay inheritance tax are a separate question, since the inheritance tax applies to property passing at death.</p>
<p>The exclusion itself has not moved since 2019, while the federal basic exclusion went to ${K.usd(K.F.basicExclusion)} for 2026. The gap means that most Maryland estates that pay estate tax pay no federal tax at all, and that inflation brings more estates over the line each year.</p>
<h2>Who must file</h2>
<p>MET 1 is required when the federal gross estate, plus adjusted taxable gifts, plus Maryland QTIP property from a predeceased spouse, equals or exceeds ${K.usd(ex)}, and the decedent was a Maryland resident or a nonresident owning real property or tangible property located in Maryland. It is filed with the Comptroller within nine months of death, even if no federal Form 706 is required. The inheritance tax is collected separately by the Register of Wills of the county where the decedent lived or owned property, and is due when the property is distributed (${h.src('md_met1', 'Comptroller of Maryland')}). A nonresident with Maryland real estate computes the same lines, with the Maryland percentage applied to the credit. How Maryland compares with its neighbors, the District of Columbia and Virginia, is shown on ${h.a('district-of-columbia-estate-tax', 'the District of Columbia page')}.</p>
`,
  faqs: [
    { q: 'What is the Maryland estate tax exemption in 2026?', a: `${K.usd(ex)}, unchanged since 2019 and not indexed. A surviving spouse can add the unused Maryland exclusion of the first spouse, up to another ${K.usd(ex)}, if it was elected on that spouse's Maryland return. Above the exclusion the tax is ${K.pct(r, 0)} of the excess, or the apportioned old federal credit if that is lower.` },
    { q: 'Why can a Maryland estate pay both estate tax and inheritance tax?', a: `Because Maryland levies both: the estate tax on the estate as a whole above ${K.usd(ex)}, and a ${K.pct(inhRate, 0)} inheritance tax on what each heir outside the close family receives. The inheritance tax paid is subtracted from the estate tax on line 14 of MET 1, so the total is not simply the sum of the two.` },
    { q: `Is the Maryland estate tax always ${K.pct(r, 0)} of the excess?`, a: `Not always. MET 1 compares ${K.pct(r, 0)} of the amount above the exclusion with the maximum credit for state death taxes of the old federal law, apportioned when property lies outside Maryland, and keeps the lesser. For an estate wholly in Maryland without large lifetime gifts, the ${K.pct(r, 0)} figure is usually the smaller one.` },
    { q: 'Does a Pennsylvania resident with a beach house in Ocean City owe Maryland estate tax?', a: `A Maryland return is required if the whole estate, plus adjusted taxable gifts, reaches ${K.usd(ex)}, because the house is real property located in Maryland. The credit line is then apportioned to the Maryland share of the estate. Heirs outside the close family may also owe Maryland inheritance tax on the house.` },
  ],
  tool: 'state',
  toolArg: { st: 'MD', estate: 7000000 },
  related: ['maryland-inheritance-tax', 'estate-tax-vs-inheritance-tax', 'district-of-columbia-estate-tax', 'portability', 'married-couples-state-estate-tax', 'state-estate-tax'],
  sources: ['md_met1', 'md_7309', 'md_7203', 'md_7204'],
});
