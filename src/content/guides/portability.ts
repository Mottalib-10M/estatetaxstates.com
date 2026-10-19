import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const ex = F.basicExclusion, top = F.topRate;
const fed = (x: number, dsue: number) => K.federalEstateTax({ taxableEstate: x, gifts: 0, dsue }).tax;
const toKids = 4000000, dsue = ex - toKids, second = 25000000;
const yes = K.ESTATE_CODES.filter((c) => K.E[c].portability === 'yes');
const no = K.ESTATE_CODES.filter((c) => K.E[c].portability === 'no');
const silent = K.ESTATE_CODES.filter((c) => K.E[c].portability !== 'yes' && K.E[c].portability !== 'no');
const list = (cs: string[]) => { const n = cs.map(K.nameOf); return n.length < 2 ? n.join('') : `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`; };
const widow = (st: string, estate: number, d: number) => K.computeCase({ estate, st, married: false, toSpouse: 'none', heir: 'child', heirs: 2, dsue: d }).home!.tax;
const mdEstate = 9000000, mdDsue = K.E.MD.exemption;
const status = (c: string) => (K.E[c].portability === 'yes' ? 'Yes' : K.E[c].portability === 'no' ? 'No' : 'No rule published');

export default defineGuide({
  id: 'portability',
  group: 'federal',
  order: 140,
  slug: 'portability',
  nav: 'Portability (DSUE)',
  card: 'Passing the unused federal exclusion to the survivor, and the two states that allow it',
  title: 'Estate Tax Portability 2026: DSUE Election and State Rules',
  description: `Estate tax portability 2026: how a survivor adds the unused ${K.usd(ex)} exclusion of the first spouse, the Form 706 election, the 5-year relief, state rules.`,
  h1: 'Portability of the estate tax exclusion in 2026',
  intro: `Portability lets a surviving spouse use the federal exclusion the first spouse did not need. It has to be elected on a timely Form 706, and only two states copy it. Enter the estate of the survivor and the unused amount received.`,
  facts: [['Most a survivor can hold', K.usd(2 * ex)], ['Election', 'Timely Form 706'], ['Late relief', `${F.latePortabilityYears} years`], ['States with portability', list(yes)]],
  resume: `When a married person dies, whatever passes to a spouse who is a US citizen is deducted, so the first estate usually uses little of its ${K.usd(ex)} exclusion. The unused part is the deceased spousal unused exclusion, or DSUE amount. Under section 2010(c) the executor can transfer it to the survivor, but only by filing a timely Form 706, due nine months after death plus a six-month extension, even when no return would otherwise be required. Executors who missed that date and were not required to file can still elect within ${F.latePortabilityYears} years of the death under Rev. Proc. 2022-32. A survivor who receives a full DSUE amount can shelter ${K.usd(2 * ex)} in 2026: if the first spouse left ${K.usd(toKids)} to the children, the DSUE amount is ${K.usd(dsue)}, and a second estate of ${K.usd(second)} owes ${K.usd(fed(second, dsue))} instead of ${K.usd(fed(second, 0))}. The states are another matter. Only ${list(yes)} have portability of their own exemption; ${list(no)} reject it, and the other states publish no portability rule.`,
  body: (h) => `
<h2>How the DSUE amount is figured</h2>
<p>The DSUE amount is the smaller of the basic exclusion amount and the part of the first spouse's applicable exclusion that was not used against the taxable estate and lifetime taxable gifts (${h.src('usc_2010', 'section 2010(c)(4)')}). Take a first spouse who dies in 2026 with ${K.usd(12000000)}, leaving ${K.usd(toKids)} to the children and the rest to the surviving spouse. The ${K.usd(12000000 - toKids)} to the spouse is deducted, the ${K.usd(toKids)} to the children is taxable, and that uses ${K.usd(toKids)} of the ${K.usd(ex)} exclusion. The DSUE amount is ${K.usd(dsue)}, computed in Part VI of that Form 706 and carried to the survivor's own returns.</p>
${h.table(['Survivor’s estate', 'Tax with DSUE of ' + K.usd(dsue), 'Tax without the election'], [16000000, 20000000, 25000000, 30000000, 40000000].map((x) => [K.usd(x), K.usd(fed(x, dsue)), K.usd(fed(x, 0))]), `Federal estate tax of a surviving spouse dying in 2026, no lifetime gifts, with and without the DSUE amount of ${K.usd(dsue)}.`, ['l', 'r', 'r'])}
<h2>The election: a timely Form 706</h2>
<p>Portability is not automatic. The ${h.src('irs_i706', 'Form 706 instructions')} allow the executor to transfer the DSUE amount only on a return filed within nine months of the death, or before the end of the six-month extension obtained with Form 4768. This applies to estates far below the filing threshold: a couple worth ${K.usd(6000000)} has no federal tax to worry about today, but the survivor may live for decades, and the estate may grow or the law may change. Estates that file only to elect portability can use simplified valuation for property passing to the spouse or to charity, as the IRS notes on its ${h.src('irs_whats_new', 'estate and gift tax news page')}.</p>
${h.mini('fed', { t: 'The survivor’s federal tax with a DSUE amount', p: ['estate', 'dsue'], d: { estate: second, dsue } })}
<h2>Missed the date: the ${F.latePortabilityYears}-year relief</h2>
<p>An executor who was not required to file, because the gross estate plus adjusted taxable gifts did not exceed the filing threshold, and who did not file in time, can still elect under ${h.src('rp_2022_32', 'Rev. Proc. 2022-32')}. The return must be filed on or before the fifth anniversary of the death and must say at the top: "Filed Pursuant to Rev. Proc. 2022-32 to Elect Portability under section 2010(c)(5)(A)." The relief does not help an estate that had to file anyway: if the gross estate was above the threshold, a late return cannot make the election, as the ${h.src('irs_estate_faq', 'IRS estate tax questions')} explain.</p>
<h2>Rules on using the DSUE amount</h2>
<p>The survivor can use the DSUE amount for lifetime gifts as well as at death; when the survivor makes a taxable gift, the DSUE amount is applied before the survivor's own exclusion. Only the DSUE amount of the last deceased spouse counts. A survivor who remarries and outlives a second spouse loses the first spouse's amount once the second one dies, and amounts from several spouses cannot be added together at the same time, although gifts made between the deaths can use each in turn. When property passes to a noncitizen spouse in a qualified domestic trust, the DSUE amount stays provisional until the trust ends (${h.a('non-citizen-spouse', 'noncitizen spouse')}).</p>
<h2>Why file when there is no tax</h2>
<p>The decision to elect is made at the first death, often by a grieving survivor with an estate well below any threshold, and it is easy to skip. The cost is a full Form 706 with values for the assets, although the simplified valuation helps for property going to the spouse. The benefit only appears at the second death, and only if the survivor's estate then exceeds the survivor's own exclusion. A survivor who receives ${K.usd(8000000)} today, inherits from parents later and owns a business that grows can cross ${K.usd(ex)} long after the first death, when the election can no longer be made. The DSUE amount is computed once, on the return of the first spouse, and the survivor's estate is then measured against it years later. Executors weigh the cost of the return against that risk.</p>
<h2>State portability: two out of thirteen</h2>
<p>The federal election has no effect on state estate taxes. Each state decides whether its own exemption can pass to the survivor, and almost none allow it.</p>
${h.table(['Jurisdiction', 'Portability of the state exemption', '2026 exemption'], K.ESTATE_CODES.map((c) => [K.nameOf(c), status(c), K.usd(K.E[c].exemption)]), 'Portability of the state exemption for deaths in 2026, as stated on the state form or statute. "No rule published" means the state materials read do not provide for it.', ['l', 'l', 'r'])}
<p>Maryland allows a Maryland DSUE amount, elected on a timely Maryland return of the first spouse and capped at ${K.usd(K.E.MD.exemption)}, under ${h.src('md_7309', 'Tax-General section 7-309')}. A Maryland widow dying in 2026 with ${K.usd(mdEstate)} owes ${K.usd(widow('MD', mdEstate, mdDsue))} to Maryland with a full Maryland DSUE amount, and ${K.usd(widow('MD', mdEstate, 0))} without it. Hawaii also allows portability, limited to its own exclusion of ${K.usd(K.E.HI.exemption)}, as its ${h.src('hi_m6', 'Form M-6 instructions')} describe.</p>
<p>Everywhere else, a couple that leaves everything to the survivor keeps a single state exemption. In New York a widower with ${K.usd(mdEstate)} owes ${K.usd(widow('NY', mdEstate, dsue))} whatever DSUE amount he holds for federal purposes. This is why a credit shelter trust, which keeps the first spouse's state exemption outside the survivor's estate, is still common in those states. The comparison is on ${h.a('married-couples-state-estate-tax', 'the page on married couples')}.</p>
`,
  faqs: [
    { q: 'Do I have to file Form 706 for my husband to keep his unused exclusion?', a: `Yes. The DSUE amount passes only if the executor files Form 706 within nine months of the death, or within the six-month extension. This holds even for a small estate with no tax. If the deadline passed and no return was required, Rev. Proc. 2022-32 allows the election until the fifth anniversary of the death.` },
    { q: 'Can a widow use the unused exclusions of two late husbands?', a: `Not at the same time. Only the DSUE amount of the last deceased spouse is available. A widow who made taxable gifts while holding the first husband's DSUE amount used it at that time, and after a second husband dies his DSUE amount replaces any remainder of the first. Amounts from several spouses never add up at death.` },
    { q: 'Which states let a surviving spouse use the first spouse’s state exemption?', a: `Only ${list(yes)} in 2026. Maryland caps the Maryland DSUE amount at ${K.usd(K.E.MD.exemption)} and Hawaii at ${K.usd(K.E.HI.exemption)}, and both require their own timely state return at the first death. ${list(no)} say there is no portability, and the other estate tax states publish no rule allowing it.` },
    { q: `How much federal tax does a ${K.usd(second)} estate save with a DSUE amount of ${K.usd(dsue)}?`, a: `${K.usd(fed(second, 0) - fed(second, dsue))} in 2026. Without the DSUE amount the tax is ${K.pct(top, 0)} of the ${K.usd(second - ex)} above the survivor's own exclusion, ${K.usd(fed(second, 0))}. With it the exclusion becomes ${K.usd(ex + dsue)} and the tax ${K.usd(fed(second, dsue))}. The saving equals ${K.pct(top, 0)} of the DSUE amount actually used.` },
  ],
  tool: 'fed',
  toolArg: { estate: second, dsue },
  related: ['estate-tax-exemption', 'married-couples-state-estate-tax', 'maryland-estate-tax', 'hawaii-estate-tax', 'non-citizen-spouse', 'estate-tax-return-deadline'],
  sources: ['usc_2010', 'irs_i706', 'rp_2022_32', 'irs_estate_faq', 'md_7309', 'hi_m6'],
});
