import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const HI = K.E.HI;
const ex = HI.exemption, T = HI.table!;
const topR = T[T.length - 1].rate;
const tax = (x: number) => K.stateTax('HI', x);
const withGifts = (x: number, g: number) => K.computeCase({ estate: x, st: 'HI', married: false, toSpouse: 'none', heir: 'child', heirs: 2, gifts: g }).home!.tax;
const withDsue = (x: number, d: number) => K.computeCase({ estate: x, st: 'HI', married: false, toSpouse: 'none', heir: 'child', heirs: 2, dsue: d }).home!.tax;
const sizes = [6000000, 8000000, 10490000, 15490000, 20000000];
const gap = K.F.basicExclusion - ex;
const WA = K.E.WA;
const waTop2 = WA.table![WA.table!.length - 1].rate, waTop1 = WA.firstHalf!.table[WA.firstHalf!.table.length - 1].rate;

export default defineGuide({
  id: 'hawaii-estate-tax',
  group: 'estate',
  order: 215,
  slug: 'hawaii-estate-tax',
  nav: 'Hawaii',
  card: `${K.usd(ex)} fixed exclusion, ${K.pct(T[0].rate, 0)} to ${K.pct(topR, 0)}, portability allowed`,
  title: `Hawaii Estate Tax 2026: ${K.usd(ex)} Exclusion and Rates`,
  description: `Hawaii estate tax 2026: fixed ${K.usd(ex)} exclusion, rates from ${K.pct(T[0].rate, 0)} to ${K.pct(topR, 0)} on the excess, portability between spouses, gifts that cut the exclusion, Form M-6.`,
  h1: 'Hawaii estate tax in 2026',
  intro: `Hawaii taxes the part of an estate above ${K.usd(ex)}, an amount frozen since 2018, at rates that reach ${K.pct(topR, 0)} on the largest estates. Enter the Hawaii taxable estate to see the tax for a death in 2026.`,
  facts: [['Exclusion', K.usd(ex)], ['Rates on the excess', `${K.pct(T[0].rate, 0)} to ${K.pct(topR, 0)}`], ['Spouse carryover', `up to ${K.usd(ex)}`], ['Form M-6 due', `${HI.dueMonths} months`]],
  resume: `Hawaii's applicable exclusion amount is ${K.usd(ex)}, set by Act 27 of 2018 as the federal figure of December 2017 and not indexed since, so it applies unchanged to deaths in 2026. The tax falls only on the net taxable estate above that amount, at ${K.pct(T[0].rate, 0)} on the first ${K.usd(T[1].from)}, then ${K.pct(T[1].rate, 0)}, ${K.pct(T[2].rate, 0)}, ${K.pct(T[3].rate, 0)} and ${K.pct(T[4].rate, 0)} by million, ${K.pct(T[5].rate, 1)} from ${K.usd(T[5].from)} over and ${K.pct(topR, 0)} beyond ${K.usd(T[6].from)} over. An estate of ${K.usd(8000000)} owes ${K.usd(tax(8000000))}; one of ${K.usd(20000000)} owes ${K.usd(tax(20000000))}. Hawaii is one of the two states that allow portability: a surviving spouse can add the unused Hawaii exclusion of the first spouse, up to ${K.usd(ex)}. There is no Hawaii gift tax, but federal adjusted taxable gifts reduce the exclusion. Form M-6 is due nine months after death. These figures come from the Rev. 2025 instructions; the 2026 revision was not yet posted when they were read.`,
  body: (h) => `
<h2>A tax on the excess, at the highest top rate</h2>
<p>The Department of Taxation's instructions for Form M-6 set out the computation (${h.src('hi_m6', 'Form M-6 instructions, Rev. 2025')}). The Hawaii taxable estate is worked out with the federal rules, then the exclusion is subtracted, and the rate schedule is applied to what is left, the net taxable estate.</p>
${h.table(['Net taxable estate over', 'Not over', 'Tax'], T.map((r, i) => [K.usd(r.from), i + 1 < T.length ? K.usd(T[i + 1].from) : 'no limit', r.base ? `${K.usd(r.base)} plus ${K.pct(r.rate, 1)} of the amount over ${K.usd(r.from)}` : `${K.pct(r.rate, 1)} of the net taxable estate`]), 'Hawaii tax rate schedule, in force since January 1, 2020, applied to the amount above the exclusion.', ['l', 'l', 'l'])}
<p>Because the brackets are counted from the exclusion, the first dollar over ${K.usd(ex)} is taxed at ${K.pct(T[0].rate, 0)} and the tax grows smoothly. The ${K.pct(topR, 0)} rate starts only once the estate exceeds ${K.usd(ex + T[6].from)}. Among the other states only Washington reaches that level: ${K.pct(waTop2, 0)} for deaths from July 1, 2026, and ${K.pct(waTop1, 0)} for deaths in the first half of the year.</p>
${h.table(['Taxable estate', 'Net taxable estate', 'Hawaii tax', 'Share of the estate'], sizes.map((x) => [K.usd(x), K.usd(x - ex), K.usd(tax(x)), K.pct(tax(x) / x)]), 'Resident, no lifetime taxable gifts, no unused exclusion from a spouse.', ['l', 'r', 'r', 'r'])}
${h.mini('state', { t: 'Hawaii tax on another estate', p: ['estate'], d: { st: 'HI', estate: 9000000 } })}
<h2>Why the exclusion stopped moving</h2>
<p>Hawaii's estate tax follows the Internal Revenue Code, and Act 123 of 2025 conformed it to the Code as amended through December 31, 2024. The exception is the exclusion: Act 27 of 2018 decoupled it from the federal amount and fixed it at the figure that chapter 11 of the Code gave for a death on December 31, 2017. For deaths in 2026 the federal basic exclusion is ${K.usd(K.F.basicExclusion)}, a gap of ${K.usd(gap)}. The instructions draw the practical consequence: an estate can owe a Hawaii return without any federal return. In that case the personal representative prepares a "Computed-Hawaii only" Form 706 to arrive at the Hawaii taxable estate.</p>
<h2>Portability between spouses</h2>
<p>Hawaii allows the surviving spouse, or civil union partner, to use the deceased spousal unused exclusion amount of the first spouse. The election has to be made on a timely filed Hawaii return of the first spouse to die, even if that estate owes nothing, and the amount carried over cannot exceed the lesser of ${K.usd(ex)} and the unused exclusion of the last predeceased spouse. The survivor's estate enters it on line 8 of Schedule A and attaches the earlier M-6. With a full carryover, an estate of ${K.usd(10000000)} owes ${K.usd(withDsue(10000000, ex))} instead of ${K.usd(tax(10000000))}; the comparison with states that have no portability is on ${h.a('married-couples-state-estate-tax', 'married couples')}.</p>
<p>Three conditions are set out in the same instructions. The first spouse must have died after January 25, 2012, the date the current Hawaii estate tax began. Both must have been US residents or citizens, validly married or in a Hawaii civil union or its equivalent at the date of death. And a decedent who was a nonresident not a citizen can pass on no unused exclusion, unless a tax treaty of the United States allows it, in which case a statement naming the treaty is attached to the return.</p>
<h2>Gifts: no gift tax, but a smaller exclusion</h2>
<p>Hawaii has neither a gift tax nor an inheritance tax. Lifetime gifts still count: the instructions state that the applicable exclusion amount is reduced by the federal adjusted taxable gifts made by the decedent, that is gifts above the annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient. A person who gave ${K.usd(1000000)} of taxable gifts and dies with an estate of ${K.usd(7000000)} is left with an exclusion of ${K.usd(ex - 1000000)} and owes ${K.usd(withGifts(7000000, 1000000))}, against ${K.usd(tax(7000000))} without the gifts.</p>
<h2>Nonresidents and the reciprocity exemption</h2>
<p>The tax also applies to the taxable estate located in Hawaii of a nonresident, typically a house or condominium on one of the islands, computed on Schedule B with a federal Form 706 completed under Hawaii law. A nonresident who was a US citizen and resident may be exempt under the reciprocity rule: when the state of domicile exempts the property of Hawaii residents from its own death taxes, by a provision that names Hawaii or a reciprocal clause, Hawaii exempts that estate in turn. The return must then still be filed, showing the Hawaii property at zero. Estates of nonresidents who were not US citizens follow Schedule C. How other states treat out-of-state real estate is on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Filing</h2>
<p>The personal representative files Form M-6 nine months after the date of death; the instructions also set out how an extension of time to file is obtained. A form for 2026 had not been posted by the Department when this page was checked, on ${K.day(K.P.retrieved_at)}; the exclusion and the rate schedule, both fixed by statute, are the same in the Rev. 2025 instructions.</p>
`,
  faqs: [
    { q: `Why is the Hawaii estate tax exclusion still ${K.usd(ex)}?`, a: `Act 27 of 2018 fixed it at the amount the federal Code gave for a death on December 31, 2017, and it has not been indexed since. Later federal increases, up to ${K.usd(K.F.basicExclusion)} in 2026, do not reach Hawaii, so many Hawaii estates file a state return without any federal return.` },
    { q: 'Can a surviving spouse in Hawaii use the first spouse\'s unused exclusion?', a: `Yes. Hawaii allows portability of the deceased spousal unused exclusion, capped at ${K.usd(ex)} or the unused amount of the last predeceased spouse, whichever is less. The election must be made on a timely Form M-6 of the first spouse, filed even if that estate owes no Hawaii tax.` },
    { q: 'Does Hawaii tax gifts made before death?', a: `There is no Hawaii gift tax. Federal adjusted taxable gifts reduce the Hawaii exclusion at death, though, so ${K.usd(1000000)} of taxable gifts leaves an exclusion of ${K.usd(ex - 1000000)}. Gifts within the annual exclusion of ${K.usd(K.F.annualExclusion)} per recipient are not taxable gifts and do not reduce it.` },
    { q: 'Do mainland owners of a Hawaii condo owe Hawaii estate tax?', a: `They can: the tax applies to the taxable estate located in Hawaii of a nonresident. The reciprocity exemption removes it when the owner was a US citizen and resident whose home state exempts Hawaii residents' property from its own death taxes. A return is still filed in that case, with the Hawaii property shown at zero.` },
  ],
  tool: 'state',
  toolArg: { st: 'HI', estate: 8000000 },
  related: ['married-couples-state-estate-tax', 'portability', 'state-estate-tax', 'washington-estate-tax', 'property-in-another-state'],
  sources: ['hi_m6'],
});
