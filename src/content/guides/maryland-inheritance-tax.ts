import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const MD = K.I.MD;
const rate = MD.rate as number, floor = MD.smallExempt as number;
const t = (rel: Parameters<typeof K.inhTax>[1], x: number) => K.inhTax('MD', rel, x);
const KB33 = 'https://services.marylandcomptroller.gov/taxes/en/estate-and-inheritance-tax-information?id=kb_article_view&sysparm_article=KB0010033';
const KB45 = 'https://services.marylandcomptroller.gov/taxes/en/estate-and-inheritance-tax?id=kb_article_view&sysparm_article=KB0010045';
// Same Maryland estate, two families: two nephews, then two children.
const E = 7000000;
const toNephews = K.computeCase({ estate: E, st: 'MD', married: false, toSpouse: 'none', heir: 'nephew', heirs: 2 });
const toChildren = K.computeCase({ estate: E, st: 'MD', married: false, toSpouse: 'none', heir: 'child', heirs: 2 });
const amts = [floor, 25000, 100000, 400000];

export default defineGuide({
  id: 'maryland-inheritance-tax',
  group: 'inheritance',
  order: 350,
  slug: 'maryland-inheritance-tax',
  nav: 'Maryland (inheritance)',
  card: `${K.pct(rate, 0)} on nieces, nephews, cousins and friends; close family exempt; credited against the estate tax`,
  title: `Maryland Inheritance Tax 2026: Rate, Exempt Heirs, Credit`,
  description: `Maryland inheritance tax 2026: ${K.pct(rate, 0)} on what nieces, nephews and friends receive; spouse, children, parents, siblings exempt; credited against the estate tax.`,
  h1: 'Maryland inheritance tax in 2026',
  intro: `Maryland is the one state that keeps both death taxes: an inheritance tax on what some heirs receive and an estate tax above ${K.usd(K.E.MD.exemption)}. Pick the relationship and the amount to see the inheritance tax.`,
  facts: [['Rate', K.pct(rate, 0)], ['Close family', 'exempt'], ['Shares of', `${K.usd(floor)} or less: exempt`], ['Collected by', 'Register of Wills']],
  resume: `Maryland's inheritance tax is ${K.pct(rate, 0)} of the clear value, fair market value minus expenses, of property passing from a person who dies to a beneficiary who is not in the exempt list of Tax-General section 7-203. The exempt list is long: the spouse, children and stepchildren and their descendants, the spouses of those descendants, the surviving spouse of a deceased child who has not remarried, parents and stepparents, grandparents, brothers and sisters, a registered domestic partner, and companies owned only by such persons. Nieces, nephews, aunts, uncles, cousins, friends and unregistered partners pay ${K.pct(rate, 0)} on their share, so a nephew receiving ${K.usd(100000)} owes ${K.usd(t('nephew', 100000))}. Shares worth ${K.usd(floor)} or less are exempt, as is life insurance paid to a named beneficiary. The Register of Wills of the county collects the tax when the property is distributed, and the amount paid is subtracted from any Maryland estate tax on line 14a of Form MET 1. For a ${K.usd(E)} estate left to two nephews the inheritance tax is ${K.usd(toNephews.inhTotal)} and the estate tax falls to ${K.usd(toNephews.home!.tax)}.`,
  body: (h) => `
<h2>Exempt relatives, as the statute lists them</h2>
<p>Section ${h.src('md_7203', '7-203(b) of the Tax-General Article')} does not set classes like New Jersey or Kentucky. It lists the people whose receipts are exempt, and everyone else pays the single rate of ${h.src('md_7204', 'section 7-204')}. The list, item by item:</p>
<ul>
<li>a grandparent, a parent, the spouse of the deceased;</li>
<li>a child or a lineal descendant of a child, with "child" defined to include a stepchild or former stepchild, and "parent" a stepparent or former stepparent;</li>
<li>the spouse of a child or of a lineal descendant of a child, such as a son-in-law or a grandson's wife;</li>
<li>the surviving spouse of a deceased child or descendant who was married to that child at death, provided the surviving spouse has not remarried;</li>
<li>a brother or sister;</li>
<li>a corporation, partnership or limited liability company owned entirely by those persons.</li>
</ul>
<p>A domestic partner whose partnership is registered under section 2-214 of the Estates and Trusts Article is exempt on everything received; a domestic partner who is not registered but proves the partnership is exempt on a jointly held primary residence. Everyone outside the list, nieces and nephews, aunts and uncles, cousins, friends, a former spouse, a stepsibling, pays ${K.pct(rate, 0)}.</p>
<h2>Other exemptions</h2>
<p>Section 7-203 adds exemptions by type of property or size. Receipts of ${K.usd(floor)} or less by any one person are exempt, and so are distributions from an estate administered as a small estate. Life insurance proceeds paid to any beneficiary other than the estate are exempt, as are payments under a pension or benefit plan that are not taxable for federal estate tax purposes. Gifts to the State, a county or a municipality are exempt, and so are gifts to charities exempt under section 501(c)(3) when the charity is incorporated in Maryland, works substantially in Maryland or the District of Columbia, or is based in a jurisdiction that grants a similar exemption. Farmland under a perpetual conservation easement left to a niece or nephew is exempt, with a recapture if it stops being farmed.</p>
${h.table(['Amount received', 'Nephew, cousin or friend', 'Brother, child or parent'], amts.map((x) => [K.usd(x), K.usd(t('nephew', x)), K.usd(t('sibling', x))]), `Maryland inheritance tax at ${K.pct(rate, 0)} of the clear value, deaths in 2026.`, ['l', 'r', 'r'])}
${h.mini('inh', { t: 'Maryland inheritance tax on one share', p: ['amt', 'rel'], d: { st: 'MD', amt: 60000, rel: 'cousin' } })}
<h2>How the inheritance tax meets the estate tax</h2>
<p>Maryland's estate tax applies when the estate plus adjusted taxable gifts reaches ${K.usd(K.E.MD.exemption)}. Form ${h.src('md_met1', 'MET 1')} computes it and then, on line 14a, subtracts the Maryland inheritance tax paid. The two taxes are therefore not simply added: the larger of them tends to absorb the smaller. Two families with the same ${K.usd(E)} estate show the effect.</p>
${h.table(['', 'Two nephews', 'Two children'], [
  ['Inheritance tax, both heirs', K.usd(toNephews.inhTotal), K.usd(toChildren.inhTotal)],
  ['Maryland estate tax after the line 14a credit', K.usd(toNephews.home!.tax), K.usd(toChildren.home!.tax)],
  ['Total Maryland tax', K.usd(toNephews.inhTotal + toNephews.home!.tax), K.usd(toChildren.inhTotal + toChildren.home!.tax)],
], `Maryland resident, unmarried, ${K.usd(E)} net estate, deaths in 2026. Computed by the engine of this site.`, ['l', 'r', 'r'])}
<p>For the children, there is no inheritance tax and the estate tax applies in full. For the nephews, the inheritance tax exceeds the estate tax, the credit wipes the estate tax out, and the family pays more in total. The Comptroller also describes how the two offices settle with each other when one tax changes after the other is paid: an additional inheritance tax payment can be covered by an estate tax refund paid directly to the Register of Wills, using Form MET-2 ADJ (${h.ext(KB33, 'Comptroller of Maryland, estate and inheritance tax information')}). The estate tax side is explained on ${h.a('maryland-estate-tax', 'Maryland estate tax')}.</p>
<h2>Who collects it, and when</h2>
<p>The Comptroller administers the estate tax; the inheritance tax is collected by the Register of Wills of the county where the deceased lived or owned property, and the Comptroller's guidance states that it is not due until the property is distributed from the estate (${h.ext(KB45, 'Comptroller of Maryland, estate and inheritance tax')}). The tax reaches property passing by will, by intestacy, under a trust or deed, by joint ownership or otherwise, so a joint account with a niece does not escape it. This page could not confirm the Register of Wills' own filing calendar, whose site was unreachable when it was written; the office of the county concerned gives the dates.</p>
<h2>Nonresidents</h2>
<p>A person who lived elsewhere and owned a house or land in Maryland leaves property that Maryland can tax when it passes to a nephew or a friend. Section 7-203(f) exempts a nonresident's personal property, but not tangible property located in Maryland, when the home state imposes no death tax on similar property of Maryland residents or grants a reciprocal exemption. The tax paid on Maryland real estate appears on ${h.a('property-in-another-state', 'property in another state')}; the other four inheritance tax states are compared on ${h.a('inheritance-tax-by-state', 'inheritance tax by state')}.</p>
`,
  faqs: [
    { q: 'Does a Maryland stepchild pay inheritance tax?', a: `No. Section 7-203 defines "child" to include a stepchild or former stepchild, and exempts children and their lineal descendants, so step-grandchildren descended from that stepchild are exempt too. The spouse of a stepchild is exempt as well. Only relatives outside the statutory list, such as nieces, nephews and cousins, pay the ${K.pct(rate, 0)} rate.` },
    { q: 'What does a niece pay on a Maryland inheritance of $80,000?', a: `${K.usd(t('nephew', 80000))}, which is ${K.pct(rate, 0)} of the clear value received, with no exempt slice. Maryland exempts only shares of ${K.usd(floor)} or less in total, life insurance paid to the niece as named beneficiary, and farmland under a perpetual conservation easement, which the statute exempts when it passes to a niece or nephew.` },
    { q: 'Can the Maryland inheritance tax and estate tax both apply to one estate?', a: `Yes, when the estate reaches ${K.usd(K.E.MD.exemption)} and some heirs are outside the exempt list. The inheritance tax paid is then subtracted from the Maryland estate tax on line 14a of Form MET 1, so the family pays roughly the larger of the two, not their sum. A ${K.usd(E)} estate left to two nephews pays ${K.usd(toNephews.inhTotal)} in inheritance tax and ${K.usd(toNephews.home!.tax)} in estate tax.` },
    { q: 'Is an unmarried partner taxed by the Maryland inheritance tax?', a: `It depends on registration. A domestic partner registered under section 2-214 of the Estates and Trusts Article is exempt on everything received. An unregistered partner who proves the partnership is exempt only on a jointly held primary residence and pays ${K.pct(rate, 0)} on the rest, like a friend.` },
  ],
  tool: 'inh',
  toolArg: { st: 'MD', amt: 150000, rel: 'nephew' },
  related: ['maryland-estate-tax', 'inheritance-tax-by-state', 'estate-tax-vs-inheritance-tax', 'pennsylvania-inheritance-tax', 'district-of-columbia-estate-tax', 'property-in-another-state'],
  sources: ['md_7203', 'md_7204', 'md_met1'],
});
