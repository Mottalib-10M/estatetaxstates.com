import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

type Rel = Parameters<typeof K.inhTax>[1];
const ST = K.INHERITANCE_CODES;
const AMT = 200000;
const HEIRS: Array<[Rel, string]> = [['child', 'Adult child'], ['sibling', 'Brother or sister'], ['nephew', 'Niece or nephew'], ['other', 'Friend']];
const rows = HEIRS.map(([r, l]) => [l, ...ST.map((s) => K.usd(K.inhTax(s, r, AMT)))]);
const KY = K.I.KY as typeof K.I.KY & { installments: { over: number; count: number } };
const NE1 = K.I.NE.classes['1'];
// A New Jersey resident leaves a Pennsylvania cabin and other assets to a friend: two states tax the one heir.
const two = K.computeCase({ estate: 1000000, st: 'NJ', married: false, toSpouse: 'none', heir: 'other', heirs: 1, reState: 'PA', reValue: 300000 });

export default defineGuide({
  id: 'taxes-on-inheritance',
  group: 'inheritance',
  order: 380,
  slug: 'taxes-on-inheritance',
  nav: 'Taxes an heir can owe',
  card: 'What reaches the person who inherits: state inheritance tax, never the heir’s own state',
  title: 'Taxes on Inheritance 2026: What an Heir Pays, State by State',
  description: `Taxes on inheritance in 2026: which death taxes reach the heir, why the deceased's state decides, and what a sibling, nephew or friend pays on ${K.usd(AMT)}.`,
  h1: 'Taxes on an inheritance: what the heir pays',
  intro: `Most people who inherit in the United States owe no death tax at all. Whether one is due depends on the state where the deceased lived or owned real estate, and on how the heir was related. Enter a state, an amount and a relationship.`,
  facts: [['States taxing heirs', String(ST.length)], ['Heir’s own state', 'irrelevant'], ['Spouse', 'never taxed'], ['Federal tax', 'paid by the estate']],
  resume: `Two kinds of death tax exist in the United States, and only one of them is charged on the heir. The estate tax, federal above ${K.usd(K.F.basicExclusion)} and state-level in ${K.ESTATE_CODES.length} jurisdictions, is computed on the whole estate and paid by the executor before anything is distributed, so the heir receives a share that has already borne it. The inheritance tax, in ${ST.length} states, is computed on each share. Which inheritance tax applies is decided by the deceased: the state where the deceased lived taxes the shares, and a state where the deceased owned real estate taxes that property; the heir's own state of residence plays no part. The relationship then sets the rate. On ${K.usd(AMT)}, a brother or sister pays ${ST.map((s) => `${K.usd(K.inhTax(s, 'sibling', AMT))} in ${K.nameOf(s)}`).join(', ')}. A spouse pays nothing anywhere, and life insurance paid to a named beneficiary is outside the inheritance tax in Pennsylvania, New Jersey, Kentucky and Maryland.`,
  body: (h) => `
<h2>The deceased's state decides, not yours</h2>
<p>New Jersey's Division of Taxation puts it in one line: where the beneficiaries lived is not a factor (${h.src('nj_inh', 'New Jersey Division of Taxation')}). The same logic runs through the five inheritance tax states. A son in Arizona whose mother lived in Pennsylvania pays Pennsylvania's tax on his share; a nephew in Pennsylvania whose aunt lived in Arizona pays none, because Arizona has no inheritance tax, unless the aunt owned real estate in one of the five states. Moving to a state without the tax does nothing for the heir. Only the residence of the person who dies, and the location of the property, count.</p>
<h2>What a share of ${K.usd(AMT)} costs</h2>
${h.table(['Heir', ...ST.map(K.nameOf)], rows, `Inheritance tax on a ${K.usd(AMT)} share from a resident of each state, heir aged 22 or older, deaths in 2026.`, ['l', ...ST.map(() => 'r' as const)])}
<p>The table explains why an inheritance tax surprises families. Children rarely pay, so the tax goes unnoticed in most estates; it shows up when an aunt leaves her savings to nieces, when siblings inherit from a brother with no children, or when a friend or unmarried partner is named in a will. Outside the five states every cell of this table would be zero.</p>
${h.mini('inh', { t: 'What one heir pays', p: ['st', 'amt', 'rel'], d: { st: 'NJ', amt: 120000, rel: 'other' } })}
<h2>One heir, two states</h2>
<p>An heir can owe two inheritance taxes on one estate when the deceased lived in one taxing state and owned real estate in another. A New Jersey resident leaves a ${K.usd(1000000)} estate, including a ${K.usd(300000)} cabin in Pennsylvania, to a friend. Pennsylvania taxes the cabin as a nonresident's real estate: ${K.usd(two.inhOther?.tax ?? 0)}. New Jersey taxes the rest of the share, without the out-of-state real estate: ${K.usd(two.inhHome?.tax ?? 0)}. Pennsylvania's own guidance confirms the split: for a nonresident, real and tangible property located in Pennsylvania is taxable and intangible property is not (${h.src('pa_rev584', 'REV-584')}).</p>
<h2>Who actually pays</h2>
<p>The tax is measured on the heir's share, but the paperwork usually sits with the estate. In Pennsylvania the return is filed by the personal representative named in the will or approved by the Register of Wills; only when there is none do the people receiving the property file and pay. In Nebraska the petitioner, often the personal representative but sometimes a trustee or the beneficiary of a transfer on death deed, has the tax determined by the county court. In Kentucky a beneficiary whose net tax exceeds ${K.usd(KY.installments.over)} may elect to pay in ${KY.installments.count} annual installments, and then becomes personally liable for the deferred tax (${h.src('ky_140_222', 'KRS 140.222')}). A beneficiary who receives property directly, outside probate, can therefore end up dealing with the tax personally.</p>
<h2>What an heir does not pay</h2>
<p>An heir never files the federal estate tax return; the executor does, and the tax is paid from the estate (${h.a('estate-tax-exemption', 'federal estate tax exemption')}). Several kinds of property reach heirs without inheritance tax in the states that have one: life insurance paid to a named beneficiary in Pennsylvania, New Jersey, Kentucky and Maryland; property passing to a surviving spouse everywhere; most IRAs in Pennsylvania when the owner could not have withdrawn without penalty; and, in Nebraska, any interest passing to a person under 22, while close relatives there are taxed only above ${K.usd(NE1.exemption!)}.</p>
<p>Income tax is a separate subject. The death taxes described on this site are not income taxes. For federal income tax, 26 U.S.C. 102 excludes from gross income the value of property received by inheritance, but not the income that property later produces, such as interest or dividends (${h.src('usc_102', '26 U.S.C. 102')}). Pennsylvania's Department of Revenue states that inheritances are not taxable for Pennsylvania personal income tax purposes, with a reporting rule for people claiming its Tax Forgiveness credit (${h.src('pa_rev584', 'REV-584')}). For a particular case, such as an inherited retirement account, the IRS or a tax professional is the reference.</p>
<h2>Before accepting a share</h2>
<p>It helps to know three facts: where the deceased was domiciled, where any real estate is, and how the law of that state classifies the relationship. With those, the five state pages give the rate: ${ST.map((s) => h.a(`${K.nameOf(s).toLowerCase().replace(/ /g, '-')}-inheritance-tax`, K.nameOf(s))).join(', ')}. The comparison of all five is on ${h.a('inheritance-tax-by-state', 'inheritance tax by state')}, and the difference with an estate tax on ${h.a('estate-tax-vs-inheritance-tax', 'estate tax vs inheritance tax')}.</p>
`,
  faqs: [
    { q: 'Do I pay inheritance tax if I live in a state that has one but the deceased did not?', a: `No. An inheritance tax depends on where the deceased lived and where the deceased's real estate is, not on where the heir lives. Someone living in New Jersey who inherits from a parent in Florida owes no New Jersey inheritance tax, unless the parent owned real estate in one of the five taxing states.` },
    { q: 'Who files the inheritance tax return, the heir or the executor?', a: `Usually the executor or personal representative, who pays the tax out of the share before distribution. In Pennsylvania the recipients file and pay only when there is no personal representative. In Kentucky an heir who elects installment payments becomes personally liable for the deferred tax. In Nebraska the tax is set in a county court proceeding.` },
    { q: 'Is a life insurance payout taxed when a friend is the named beneficiary?', a: `Not by the inheritance tax of Pennsylvania, New Jersey, Kentucky or Maryland, which all exempt insurance paid to a named beneficiary rather than to the estate. If the deceased owned the policy, the proceeds still count in the federal gross estate, which matters only for estates above ${K.usd(K.F.basicExclusion)}.` },
  ],
  tool: 'inh',
  toolArg: { st: 'PA', amt: AMT, rel: 'sibling' },
  related: ['inheritance-tax-by-state', 'estate-tax-vs-inheritance-tax', 'pennsylvania-inheritance-tax', 'new-jersey-inheritance-tax', 'property-in-another-state', 'states-without-estate-tax'],
  sources: ['nj_inh', 'pa_rev584', 'ky_140_222', 'ne_pad', 'irs_i706'],
});
