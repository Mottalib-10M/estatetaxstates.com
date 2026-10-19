import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const IA = K.R.IA;
const ended = K.month(IA.endedFor);
const RATES_2024 = 'https://revenue.iowa.gov/media/3955/download?inline=';
const IA706 = 'https://revenue.iowa.gov/media/2372/download?inline=';
const iaCase = (estate: number, heir: Parameters<typeof K.computeCase>[0]['heir'], reState: string, reValue: number) =>
  K.computeCase({ estate, st: 'IA', married: false, toSpouse: 'none', heir, heirs: 2, reState, reValue });
const ne = iaCase(3000000, 'nephew', 'NE', 1000000);
const mn = iaCase(5000000, 'child', 'MN', 1500000);
const il = iaCase(6000000, 'child', 'IL', 2000000);
const sd = iaCase(3000000, 'nephew', 'SD', 1000000);
const neighborTax = (r: ReturnType<typeof iaCase>) => (r.other?.tax ?? 0) + (r.inhOther?.tax ?? 0) * 2;

export default defineGuide({
  id: 'iowa-inheritance-tax',
  group: 'inheritance',
  order: 360,
  slug: 'iowa-inheritance-tax',
  nav: 'Iowa (repealed)',
  card: `Repealed for deaths from ${ended}; what still applies to earlier deaths and to property next door`,
  title: 'Iowa Inheritance Tax 2026: Repealed, What Still Applies',
  description: `Iowa inheritance tax 2026: repealed for deaths on or after ${ended}. Rules for earlier deaths, and neighbor state taxes on Iowa families' land next door.`,
  h1: 'Iowa inheritance tax: repealed in 2025',
  intro: `Iowa no longer taxes inheritances for anyone who died on or after ${ended}. The calculator compares Iowa with a neighbor that still taxes, for the same estate and the same heirs.`,
  facts: [['Deaths from', ended], ['Iowa inheritance tax', 'none'], ['Iowa estate tax', 'none'], ['Federal exclusion 2026', K.usd(K.F.basicExclusion)]],
  resume: `Iowa's inheritance tax has been repealed for estates of people who died on or after ${ended}: the Department of Revenue states that the tax is not applicable to those deaths, and the instructions of the IA 706 return say the same. For a death in 2026, no Iowa inheritance tax is due on any share, whoever the heir is, and Iowa has no estate tax either, so the only tax that can reach a large Iowa estate is the federal estate tax above ${K.usd(K.F.basicExclusion)}. The repeal does not erase the past. A death before ${ended} is still governed by the old law: an Iowa return may be due when a beneficiary's gross share exceeds the exemption that applied or a federal return was filed, and supplemental and amended returns are still processed. Before the repeal, spouses, children, stepchildren, grandchildren and parents were already exempt, and the rates for 2024 deaths had been cut sharply. The other tax risk for Iowa families is land across the border: Nebraska, Minnesota and Illinois still tax.`,
  body: (h) => `
<h2>What the repeal covers</h2>
<p>The Department's ${h.src('ia_dor', 'introduction to Iowa inheritance tax')} opens with one line: Iowa inheritance tax is not applicable for deaths occurring on or after ${ended}. The ${h.ext(IA706, 'IA 706 instructions')} of July 2025 repeat that the tax "has been repealed for estates of individuals with a date of death on or after January 1, 2025". The date that counts is the date of death, not the date the will was signed, the date the estate is opened or the date property is distributed. A parent who died in December 2024 and a parent who died in January 2025 leave estates under two different regimes, even if both are administered in 2026.</p>
<p>The tax was always a tax on the beneficiary's right to receive property, as the Department explains, in contrast to the federal estate tax on everything the deceased owned. Its repeal therefore matters most to the heirs who used to pay: brothers and sisters, sons- and daughters-in-law, nieces, nephews, cousins, friends and some organizations.</p>
<h2>Deaths before 2025</h2>
<p>For a death before ${ended}, the old law still applies. The IA 706 instructions say a return must be filed when the gross share of any beneficiary, heir, transferee or surviving joint tenant, counted without reduction for liabilities, exceeds the allowable exemption from that share, or when a federal estate tax return has been filed; the estate includes property held in trust or otherwise outside probate. Supplemental and amended returns are still handled. The rules had already been narrowed over the years, as the Department's ${h.ext(RATES_2024, '2024 rate sheet')} recalls: the surviving spouse's share has been exempt since 1988, the shares of parents, grandparents, children, stepchildren, grandchildren and other lineal ascendants and descendants since July 1997, and the descendants of a stepchild since July 2016. For deaths in 2024, the last year of the tax, the statutory rates were applied after a large reduction, and the rate sheet prints the reduced brackets by beneficiary class. This site does not compute the pre-2025 tax; the rate sheet and the return instructions are the references.</p>
<h2>Land across the border</h2>
<p>The repeal is Iowa's. A neighbor state still taxes real estate located in its territory when the owner dies, even if the owner lived in Iowa. Farmland in Nebraska, a lake house in Minnesota and land in Illinois are the usual cases. Each of the four examples below concerns an unmarried Iowa resident with two heirs; the amounts are the taxes owed to the neighbor state on the property there.</p>
${h.table(['Case', 'Estate', 'Property next door', 'Tax owed to that state'], [
  ['Nebraska farmland to two nephews', K.usd(3000000), K.usd(1000000), K.usd(neighborTax(ne))],
  ['Minnesota lake house to two children', K.usd(5000000), K.usd(1500000), K.usd(neighborTax(mn))],
  ['Illinois farmland to two children', K.usd(6000000), K.usd(2000000), K.usd(neighborTax(il))],
  ['South Dakota land to two nephews', K.usd(3000000), K.usd(1000000), K.usd(neighborTax(sd))],
], 'Computed by the engine of this site with each state’s 2026 rules for a nonresident owner. Iowa itself charges nothing.', ['l', 'r', 'r', 'r'])}
<p>Nebraska taxes the nephews through its inheritance tax, class by class (${h.a('nebraska-inheritance-tax', 'Nebraska inheritance tax')}). Minnesota and Illinois tax through their estate taxes, which reach a nonresident's real estate in proportion to the whole estate once the estate crosses the state's threshold (${h.a('minnesota-estate-tax', 'Minnesota')}, ${h.a('illinois-estate-tax', 'Illinois')}). South Dakota, like Missouri and Wisconsin, has neither tax.</p>
${h.mini('compare', { t: 'Iowa against a neighbor, same estate', p: ['estate', 'b'], d: { a: 'IA', b: 'NE', heir: 'nephew', estate: 1000000 } })}
<h2>Joint property and trusts</h2>
<p>Under the old law, the Iowa estate for inheritance tax purposes included property held in trust or otherwise outside probate, and a surviving joint tenant was one of the persons whose share counted toward the filing test. That is why estates of people who died before ${ended} sometimes still need a return even though nothing went through probate. For deaths from ${ended}, the form of ownership no longer changes anything in Iowa: a payable-on-death account, a joint account with a niece or a trust share left to a friend carries no Iowa tax. It can still matter in the neighbor state, since Nebraska, for instance, taxes property passing by a transfer on death deed.</p>
<h2>What remains for an Iowa estate in 2026</h2>
<p>With the inheritance tax gone and no estate tax, an Iowa resident's estate faces only the federal estate tax, which starts above ${K.usd(K.F.basicExclusion)} per person and ${K.usd(2 * K.F.basicExclusion)} for a married couple who elect portability (${h.a('estate-tax-exemption', 'federal exemption')}). The Department's page adds that other state or federal law may apply to the deceased or the estate, which is the case for the property described above. Probate itself is not a tax, and the Department's introduction says plainly that its information is not about probate and is not legal advice.</p>
<p>Iowa thus joins the states listed on ${h.a('states-without-estate-tax', 'states without estate tax')}. Among the five states that still tax inheritances, the closest to Iowa are Nebraska and Kentucky; ${h.a('inheritance-tax-by-state', 'inheritance tax by state')} sets out the rates for the same heirs in each.</p>
`,
  faqs: [
    { q: 'Is there an Iowa inheritance tax for a death in 2026?', a: `No. The Iowa Department of Revenue states that the inheritance tax is not applicable to deaths on or after ${ended}, and the IA 706 instructions describe it as repealed for those estates. No Iowa tax is due on any share, whether the heir is a child, a niece or a friend. Iowa has no estate tax either.` },
    { q: 'Does an Iowa estate still file an IA 706 for a death in late 2024?', a: `It can. For deaths before ${ended} the old law applies: a return is required when a beneficiary's gross share exceeds the allowable exemption or a federal estate tax return was filed, and supplemental and amended returns are still processed. The 2024 rates were reduced before the repeal and are printed on the Department's rate sheet.` },
    { q: 'Do Iowa heirs owe tax on Nebraska farmland after the repeal?', a: `Yes, if they are not exempt in Nebraska. Nebraska taxes Nebraska real estate whoever the owner was: nephews pay its Class 2 rate above the class exemption. For ${K.usd(1000000)} of farmland shared by two nephews of an Iowa resident, the engine finds ${K.usd(neighborTax(ne))} of Nebraska tax in total.` },
  ],
  tool: 'compare',
  toolArg: { a: 'IA', b: 'NE', heir: 'nephew', estate: 1000000 },
  related: ['nebraska-inheritance-tax', 'inheritance-tax-by-state', 'states-without-estate-tax', 'minnesota-estate-tax', 'illinois-estate-tax', 'property-in-another-state'],
  sources: ['ia_dor'],
});
