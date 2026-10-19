import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const ex = F.basicExclusion, top = F.topRate, nc = F.nonCitizenSpouse, ae = F.annualExclusion;
const NC = F.nonCitizenSpouseHistory as Record<string, number>;
const fed = (x: number, gifts = 0) => K.federalEstateTax({ taxableEstate: x, gifts, dsue: 0 }).tax;
const e1 = 12000000, e2 = 20000000, e3 = 30000000;
const g = 250000;

export default defineGuide({
  id: 'non-citizen-spouse',
  group: 'federal',
  order: 150,
  slug: 'non-citizen-spouse',
  nav: 'Spouse not a US citizen',
  card: `No marital deduction without a QDOT, ${K.usd(nc)} of yearly gifts, the ${K.usd(F.nraThreshold)} threshold`,
  title: 'Non-Citizen Spouse Estate Tax 2026: QDOT and Gift Limit',
  description: `Non-citizen spouse estate tax 2026: no marital deduction without a QDOT, gifts excluded up to ${K.usd(nc)} a year, and the ${K.usd(F.nraThreshold)} rule for nonresident aliens.`,
  h1: 'Estate tax when the spouse is not a US citizen',
  intro: `The unlimited marital deduction, which lets most couples pass everything to the survivor tax free, does not apply when the surviving spouse is not a US citizen. Enter the estate and this year's gifts to see the federal tax at the first death, with and without a qualified domestic trust.`,
  facts: [['Yearly gift exclusion to the spouse', K.usd(nc)], ['Exclusion of the citizen spouse', K.usd(ex)], ['Rate above it', K.pct(top, 0)], ['Nonresident alien threshold', K.usd(F.nraThreshold)]],
  resume: `Under section 2056(d) of the Internal Revenue Code, property left to a surviving spouse who is not a US citizen does not qualify for the marital deduction, unless it passes to a qualified domestic trust, or QDOT, or is transferred to one before the estate tax return is filed. Without a QDOT the estate is taxed as if the spouse were any other heir. In 2026 that matters only above the ${K.usd(ex)} exclusion: a citizen who dies with ${K.usd(e1)} and leaves it all to a noncitizen spouse owes nothing, but an estate of ${K.usd(e2)} owes ${K.usd(fed(e2))} at the first death. With a QDOT the tax is deferred and charged later, on principal distributed from the trust and on what remains at the survivor's death. Lifetime gifts follow a parallel rule: instead of an unlimited deduction, gifts to a noncitizen spouse are excluded up to ${K.usd(nc)} in 2026, up from ${K.usd(NC['2025'])} in 2025. A spouse who is neither a citizen nor domiciled in the United States is taxed at death only on US assets, with a filing threshold of ${K.usd(F.nraThreshold)}.`,
  body: (h) => `
<h2>The rule: no marital deduction without a QDOT</h2>
<p>For most couples, everything left to the surviving spouse is deducted from the estate, whatever the amount. ${h.src('usc_2056', 'Section 2056(d)')} removes that deduction when the surviving spouse is not a citizen of the United States, and also switches off the rule that counts only half of property held jointly by spouses. The effect is that the first estate is taxed as if the survivor were a child or a friend: everything above the exclusion bears the federal rate.</p>
<p>The deduction comes back for property that passes to a qualified domestic trust, or that the survivor transfers or irrevocably assigns to such a trust before the estate tax return is filed. The executor makes the QDOT election on the return, as the ${h.src('irs_i706', 'Form 706 instructions')} describe. Without the election, the deduction is lost even if the trust exists.</p>
${h.table(['Estate of the citizen spouse', 'Left outright to a noncitizen spouse', 'Left to a QDOT or to a citizen spouse'], [e1, ex, 18000000, e2, e3].map((x) => [K.usd(x), K.usd(fed(x)), K.usd(0)]), `Federal estate tax at the first death in 2026, everything left to the surviving spouse, no lifetime taxable gifts. The QDOT column is a deferral, not an exemption.`, ['l', 'r', 'r'])}
${h.mini('nca', { t: 'Federal tax at the first death', p: ['estate', 'qdot'], d: { estate: e2 } })}
<h2>What a QDOT defers, and when the tax comes due</h2>
<p>A QDOT postpones the tax; it does not cancel it. In the words of the Form 706 instructions, when property passes to a QDOT, estate tax is imposed under section 2056A as distributions are made from the trust. The tax deferred at the first death is therefore charged later, while the survivor lives or when the trust ends, on the property that was kept out of the first estate. For an estate above the exclusion, that means the ${K.pct(top, 0)} rate is applied to the trust assets at a later date instead of at once. A QDOT has its own requirements on trustees and reporting, set by section 2056A and the regulations, and is drafted by an estate attorney; this page does not describe them.</p>
<p>The QDOT also delays portability. The executor computes a provisional DSUE amount for the survivor, which shrinks as tax is charged on QDOT distributions, and it generally cannot be used against the survivor's lifetime gifts until it is final, usually at the survivor's death or when the trust ends (${h.a('portability', 'portability')}).</p>
<h2>Gifts during life: ${K.usd(nc)} a year</h2>
<p>A citizen can give a citizen spouse any amount with no tax and no return. Gifts to a noncitizen spouse are instead excluded up to a special annual amount, ${K.usd(nc)} for 2026 under ${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}, against ${K.usd(ae)} for gifts to anyone else. The amount is indexed every year: ${K.usd(NC['2024'])} in 2024, ${K.usd(NC['2025'])} in 2025. A gift of ${K.usd(g)} to a noncitizen spouse in 2026 is a taxable gift of ${K.usd(g - nc)}, reported on Form 709 and absorbed by the donor's lifetime exclusion. Couples sometimes use the yearly amount to move assets to the noncitizen spouse over time, so that less of the estate depends on a QDOT at the first death.</p>
<h2>When the deceased is not a citizen or resident</h2>
<p>A different set of rules applies when the person who dies is a nonresident who is not a US citizen. The estate is taxed only on assets situated in the United States, such as US real estate, and the executor files Form 706-NA when those assets plus adjusted taxable gifts exceed ${K.usd(F.nraThreshold)}, a threshold the ${h.src('irs_nra', 'IRS page on nonresidents')} notes is not indexed. The credit against the tax is ${K.usd(F.nraCredit)} instead of the ${K.usd(F.basicCredit)} available to citizens and residents, as the Form 706-NA instructions state for the general case. The difference is stark: a nonresident alien's US property of ${K.usd(1000000)} can owe federal estate tax, while a citizen's estate of ${K.usd(ex)} owes none.</p>
<h2>Joint property held with a noncitizen spouse</h2>
<p>Between citizen spouses, a home or account held jointly with right of survivorship is counted at half its value in the estate of the first to die, whoever paid for it. Section 2056(d) switches that rule off when the survivor is not a citizen. The half-value rule then cannot be relied on, and the general rules of section 2040 on joint ownership decide how much of the property is included, which turns on who paid for it. A house bought with the citizen spouse's earnings and held jointly can therefore weigh more in the citizen's estate than the half a couple of citizens would count. With the marital deduction also gone, that difference can push the estate over the ${K.usd(ex)} exclusion. Records of who paid for jointly held property are worth keeping for that reason.</p>
<h2>State estate taxes</h2>
<p>The QDOT rule is federal. State estate taxes start from the federal taxable estate, but each state sets its own treatment of property left to a noncitizen spouse, and this site does not summarize them. The state amounts that apply to everything else, including the spouse's share when it is deductible, are on each state's page, starting from ${h.a('state-estate-tax', 'the state estate tax overview')}.</p>
`,
  faqs: [
    { q: 'Does my green card holder wife get the unlimited marital deduction?', a: `Not for federal estate tax. The deduction requires a surviving spouse who is a US citizen. A permanent resident spouse inherits under the same rule as any noncitizen: property left outright is taxable in the first estate, above the ${K.usd(ex)} exclusion, unless it passes to a qualified domestic trust, or is transferred to one before the estate tax return is filed.` },
    { q: 'Is a QDOT needed if the estate is below the federal exclusion?', a: `Not for the federal tax. An estate of ${K.usd(e1)} owes no federal estate tax in 2026 even with no marital deduction, because the ${K.usd(ex)} exclusion covers it. A QDOT matters when the part left to the noncitizen spouse, added to the rest of the taxable estate and lifetime gifts, would exceed the exclusion.` },
    { q: `How much can I give my noncitizen husband in 2026 without filing Form 709?`, a: `${K.usd(nc)}, the special annual exclusion for gifts to a spouse who is not a US citizen, set by Rev. Proc. 2025-32. It was ${K.usd(NC['2025'])} in 2025. Above that amount the gift is taxable, reported on Form 709 by April 15, 2027, and covered by your lifetime exclusion unless your taxable gifts exceed ${K.usd(ex)}.` },
    { q: 'What estate tax threshold applies to a foreign national who owns a US home?', a: `${K.usd(F.nraThreshold)}. A person who was neither a US citizen nor domiciled in the US is taxed on US assets only, and Form 706-NA is required when they exceed ${K.usd(F.nraThreshold)} with adjusted taxable gifts. The credit is generally ${K.usd(F.nraCredit)}, so the ${K.usd(ex)} exclusion of citizens does not apply.` },
  ],
  tool: 'nca',
  toolArg: { estate: e2, gift: g },
  related: ['portability', 'gift-tax-limit', 'estate-tax-exemption', 'gift-tax', 'property-in-another-state'],
  sources: ['usc_2056', 'irs_i706', 'rp_2025_32', 'irs_nra', 'irs_i709'],
});
