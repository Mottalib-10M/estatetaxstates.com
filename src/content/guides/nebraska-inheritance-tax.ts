import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const NE = K.I.NE;
const C1 = NE.classes['1'], C2 = NE.classes['2'], C3 = NE.classes['3'];
const t = (rel: Parameters<typeof K.inhTax>[1], x: number) => K.inhTax('NE', rel, x);
const shares = [30000, 60000, 120000, 300000, 750000];
const farm = 900000;

export default defineGuide({
  id: 'nebraska-inheritance-tax',
  group: 'inheritance',
  order: 340,
  slug: 'nebraska-inheritance-tax',
  nav: 'Nebraska',
  card: `Three classes: ${K.pct(C1.rate!, 0)} above ${K.usd(C1.exemption!)}, ${K.pct(C2.rate!, 0)} above ${K.usd(C2.exemption!)}, ${K.pct(C3.rate!, 0)} above ${K.usd(C3.exemption!)}`,
  title: 'Nebraska Inheritance Tax 2026: Classes, Rates, County Rules',
  description: `Nebraska inheritance tax 2026: close family ${K.pct(C1.rate!, 0)} above ${K.usd(C1.exemption!)}, nieces and nephews ${K.pct(C2.rate!, 0)} above ${K.usd(C2.exemption!)}, others ${K.pct(C3.rate!, 0)} above ${K.usd(C3.exemption!)}, spouse and under-22s exempt.`,
  h1: 'Nebraska inheritance tax in 2026',
  intro: `Nebraska's inheritance tax is determined by a county court and paid to the county, and children owe it above an exemption. Pick the relationship and the share to see what an heir pays.`,
  facts: [['Class 1: close family', `${K.pct(C1.rate!, 0)} above ${K.usd(C1.exemption!)}`], ['Class 2: aunts, nieces', `${K.pct(C2.rate!, 0)} above ${K.usd(C2.exemption!)}`], ['Class 3: everyone else', `${K.pct(C3.rate!, 0)} above ${K.usd(C3.exemption!)}`], ['Spouse, heirs under 22', 'exempt']],
  resume: `Nebraska taxes each beneficiary on the clear market value received, in three classes set by Revised Statutes 77-2004 to 77-2006. Class 1, parents, grandparents, brothers and sisters, children and other descendants and the spouses of all of them, pays ${K.pct(C1.rate!, 0)} on what exceeds ${K.usd(C1.exemption!)}. Class 2, uncles, aunts, nieces, nephews and their descendants and spouses, pays ${K.pct(C2.rate!, 0)} on what exceeds ${K.usd(C2.exemption!)}. Class 3, everyone else, friends and non-exempt institutions included, pays ${K.pct(C3.rate!, 0)} on what exceeds ${K.usd(C3.exemption!)}. A surviving spouse pays nothing, and neither does any beneficiary under 22 years of age. A daughter inheriting ${K.usd(300000)} owes ${K.usd(t('child', 300000))}, a nephew ${K.usd(t('nephew', 300000))} and a friend ${K.usd(t('other', 300000))}. These amounts have applied since LB 310 raised the exemptions and lowered two of the rates for deaths on or after January 1, 2023. The tax is determined in a county court proceeding and paid to the county, not to the Department of Revenue. Nebraska has no estate tax.`,
  body: (h) => `
<h2>Who falls in which class</h2>
<p>The classes follow the statute, not the family tree as people describe it. ${h.src('ne_77_2004', 'Section 77-2004')} covers the father, mother, grandparents, brothers and sisters, sons and daughters, adopted children, any lineal descendant, "any person to whom the deceased for not less than ten years prior to death stood in the acknowledged relation of a parent", and the spouse or surviving spouse of any of those persons. That last clause places a son-in-law or daughter-in-law in Class 1, at ${K.pct(C1.rate!, 0)}, and it lets a stepchild raised in the home for ten years or more be treated as a child. ${h.src('ne_77_2005', 'Section 77-2005')} covers uncles, aunts, nieces and nephews related by blood or adoption, their descendants and their spouses. ${h.src('ne_77_2006', 'Section 77-2006')} covers "all other cases".</p>
${h.table(['Class', 'Beneficiaries', 'Exempt amount', 'Rate on the excess'], [
  ['Spouse', 'Surviving spouse of the deceased', 'everything', 'none'],
  ['1', 'Parents, grandparents, siblings, children, descendants, a person raised as a child for 10 years, and their spouses', K.usd(C1.exemption!), K.pct(C1.rate!, 0)],
  ['2', 'Uncles, aunts, nieces, nephews, their descendants and spouses', K.usd(C2.exemption!), K.pct(C2.rate!, 0)],
  ['3', 'Everyone else, including non-exempt institutions', K.usd(C3.exemption!), K.pct(C3.rate!, 0)],
], 'Nebraska Revised Statutes 77-2004 to 77-2006, deaths on or after January 1, 2023.', ['l', 'l', 'r', 'r'])}
<p>Children are exempt in New Jersey, Kentucky and Maryland; Pennsylvania charges them a flat rate from the first dollar, and Nebraska only on what exceeds the Class 1 exemption. A short summary of Nebraska as "1 % or 15 %" leaves out Class 2, which is the class that matters for nieces and nephews: ${K.pct(C2.rate!, 0)} above ${K.usd(C2.exemption!)}.</p>
<h2>The tax in dollars</h2>
<p>Each class subtracts its exempt amount from the share and taxes the rest at one rate. A share at or below the exempt amount is not taxed at all.</p>
${h.table(['Share received', 'Class 1 (child)', 'Class 2 (nephew)', 'Class 3 (friend)'], shares.map((x) => [K.usd(x), K.usd(t('child', x)), K.usd(t('nephew', x)), K.usd(t('other', x))]), 'Nebraska inheritance tax for one beneficiary aged 22 or older.', ['l', 'r', 'r', 'r'])}
${h.mini('inh', { t: 'Nebraska tax on one share', p: ['amt', 'rel'], d: { st: 'NE', amt: 200000, rel: 'nephew' } })}
<h2>Two exemptions that apply to every class</h2>
<p>Interests passing to the surviving spouse, by will or in any other manner, are not taxed. Any interest passing to a person under twenty-two years of age is not taxed either: the rule is written into each of the three sections, so a grandchild of 19 or a great-niece of 21 receives the share free of tax whatever the class. The homestead allowance, exempt property and the family maintenance allowance are also outside the tax under section 77-2004. The calculator applies the age rule to the "child aged 21 or younger" choice; for an older or younger heir of another relationship, the age decides.</p>
<h2>What LB 310 changed, and what LB 838 changes</h2>
<p>The Department of Revenue summarizes LB 310, operative July 21, 2022, in a table: for deaths on or after January 1, 2023 it raised the Class 1 exemption to ${K.usd(C1.exemption!)} with the rate unchanged at ${K.pct(C1.rate!, 0)}, raised the Class 2 exemption to ${K.usd(C2.exemption!)} and cut its rate to ${K.pct(C2.rate!, 0)}, and raised the Class 3 exemption to ${K.usd(C3.exemption!)} and cut its rate to ${K.pct(C3.rate!, 0)} (${h.src('ne_dor_2022', 'Department of Revenue, 2022 legislative changes')}). Tables still showing lower exemptions apply to deaths in 2022 or earlier.</p>
<p>In 2026 the Department lists LB 838, section 25, operative July 18, 2026, as a clarification of the definition of Class 1 beneficiaries (${h.src('ne_dor_2026', 'Department of Revenue, 2026 legislative changes')}). The text of the clarification could not be read on the Legislature's site when this page was written, so the Class 1 list above is the statute as published before it. Families whose case turns on the edge of Class 1, a step-relative or a person raised by the deceased, are the ones the clarification may concern.</p>
<h2>A county tax</h2>
<p>Nebraska's inheritance tax is not filed with the state. The petitioner, usually the personal representative, but also a trustee, a person using an affidavit to transfer real estate without probate or the beneficiary of a transfer on death deed, asks the county court to determine the tax, and the tax is paid to the county where that order is entered. After the order, the petitioner files Form PCIT with the county treasurer, a report of the tax paid by class of beneficiary, which counties forward to the Department for its annual report of county inheritance taxes (${h.src('ne_pad', 'Property Assessment Division')}). The form reminds the petitioner that the personal representative must pay the taxes owed from the estate in hand.</p>
<h2>Nonresidents with Nebraska land</h2>
<p>Farmland and houses in Nebraska owned by someone who lived elsewhere are a common case. Suppose a Colorado resident leaves Nebraska farmland worth ${K.usd(farm)} to a nephew: the Nebraska tax on that share is ${K.usd(t('nephew', farm))} under Class 2. The calculator applies the full class exemption to a nonresident's Nebraska property; the statutes read for this page do not set a proration, so treat the figure as an estimate and see ${h.a('property-in-another-state', 'property in another state')} for the other states' rules. Nebraska has no estate tax of its own, so the only other tax on a large estate is the federal one above ${K.usd(K.F.basicExclusion)}. The other four states are compared on ${h.a('inheritance-tax-by-state', 'inheritance tax by state')}.</p>
`,
  faqs: [
    { q: 'Do children pay Nebraska inheritance tax?', a: `Yes, above ${K.usd(C1.exemption!)} each, at ${K.pct(C1.rate!, 0)}, unless they are under 22. A son inheriting ${K.usd(500000)} owes ${K.usd(t('child', 500000))}. The same Class 1 treatment applies to grandchildren, parents, brothers and sisters, and to the spouse of any of them, such as a daughter-in-law.` },
    { q: 'What does a niece pay on a Nebraska inheritance?', a: `${K.pct(C2.rate!, 0)} of the share above ${K.usd(C2.exemption!)}, as a Class 2 beneficiary. On ${K.usd(100000)} that is ${K.usd(t('nephew', 100000))}. A niece under 22 years of age pays nothing. Before 2023 the Class 2 exemption was lower and the rate higher; LB 310 changed both.` },
    { q: 'Who collects the Nebraska inheritance tax?', a: `The county. The tax is determined in a county court proceeding and paid to the county where the order is entered, and the petitioner then files Form PCIT with the county treasurer. The Department of Revenue only compiles the counties' reports into an annual report of county inheritance taxes.` },
    { q: 'Is a Nebraska heir under 22 really exempt from inheritance tax?', a: `Yes. Sections 77-2004, 77-2005 and 77-2006 each provide that an interest passing to a person under twenty-two years of age is not subject to tax, whatever the class. A 20-year-old friend of the family therefore receives a share free of the ${K.pct(C3.rate!, 0)} Class 3 tax.` },
  ],
  tool: 'inh',
  toolArg: { st: 'NE', amt: 300000, rel: 'child' },
  related: ['inheritance-tax-by-state', 'kentucky-inheritance-tax', 'iowa-inheritance-tax', 'pennsylvania-inheritance-tax', 'property-in-another-state', 'states-without-estate-tax'],
  sources: ['ne_77_2004', 'ne_77_2005', 'ne_77_2006', 'ne_dor_2022', 'ne_dor_2026', 'ne_pad'],
});
