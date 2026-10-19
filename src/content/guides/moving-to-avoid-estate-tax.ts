import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const FROM = ['NY', 'MA', 'WA', 'OR', 'MN', 'IL'];
const kids = (st: string, estate: number, reState?: string, reValue = 0) => K.computeCase({ estate, st, married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState, reValue });
const stTax = (st: string, estate: number) => { const r = kids(st, estate); return r.stateTotal + r.inhTotal; };
const A = 5000000, B = 10000000;
// After the move to Florida, a house worth $2,000,000 is kept in the old state, in a $10,000,000 estate.
const KEEP = 2000000;
const kept = (st: string) => kids('FL', B, st, KEEP).other?.tax ?? 0;
const pa = K.I.PA.classes as Record<string, { rate: number }>;
const paKids = stTax('PA', A);

export default defineGuide({
  id: 'moving-to-avoid-estate-tax',
  group: 'guides',
  order: 410,
  slug: 'moving-to-avoid-estate-tax',
  nav: 'Moving to another state',
  card: 'What a change of domicile saves, and the property it does not reach',
  title: 'Moving to Avoid Estate Tax: 2026 Savings, State by State',
  description: `Moving to avoid estate tax in 2026: state tax on ${K.mil(A)} and ${K.mil(B)} estates in NY, MA, WA, OR, MN and IL against Florida, and the house left behind.`,
  h1: 'Moving to a state without estate tax: what changes in 2026',
  intro: 'A change of domicile removes the estate tax of the state left behind on everything except the real estate and tangible property still located there. Compare the state you live in with the one you are considering.',
  facts: [[`${K.usd(B)} estate, New York`, K.usd(stTax('NY', B))], [`Same estate, Washington`, K.usd(stTax('WA', B))], ['Same estate, Florida or Texas', K.usd(stTax('FL', B))], ['What decides', 'Domicile at death']],
  resume: `State estate taxes follow the domicile of the person who dies, the place that person treated as a permanent home, and not a simple count of days. Someone who moves from New York, Massachusetts, Washington, Oregon, Minnesota or Illinois to Florida or Texas before death takes the bank accounts, securities and business interests out of reach of the old state, because intangible property is taxed by the state of domicile. On an estate of ${K.usd(B)} left to two children, the state tax in 2026 is ${K.usd(stTax('NY', B))} in New York, ${K.usd(stTax('MA', B))} in Massachusetts, ${K.usd(stTax('WA', B))} in Washington, ${K.usd(stTax('OR', B))} in Oregon and ${K.usd(stTax('IL', B))} in Illinois, against zero in Florida. Two limits apply. Real estate kept in the old state remains taxable there, under the nonresident rules. And the old state can claim that the domicile never changed, which is decided on facts. The federal tax is the same everywhere: none on this estate, under the ${K.usd(K.F.basicExclusion)} exclusion.`,
  body: (h) => `
<h2>State tax on the same estate in seven places</h2>
<p>The table applies each state's 2026 rules to an unmarried person whose net estate goes in equal shares to two children, with no gifts and no property elsewhere. The difference with Florida or Texas, which tax nothing, is the whole state column.</p>
${h.table(['State of domicile', `Estate of ${K.usd(A)}`, `Estate of ${K.usd(B)}`, `Share of the ${K.usd(B)} estate`], [...FROM, 'FL', 'TX'].map((st) => [K.nameOf(st), K.usd(stTax(st, A)), K.usd(stTax(st, B)), K.pct(stTax(st, B) / B, 1)]), 'Death in 2026, unmarried, two children inheriting equally, no lifetime gifts. Washington: death from July 1, 2026.', ['l', 'r', 'r', 'r'])}
<p>The pattern is not the one a list of exemptions suggests. New York owes nothing at ${K.usd(A)} because its exclusion is ${K.usd(K.E.NY.exemption)}, but takes ${K.usd(stTax('NY', B))} at ${K.usd(B)}, since the cliff removes the exclusion entirely. Oregon taxes from ${K.usd(K.E.OR.exemption)} and Massachusetts from ${K.usd(K.E.MA.exemption)}, so both already take hundreds of thousands at ${K.usd(A)}. Inheritance-tax states behave differently again: in Pennsylvania the same ${K.usd(A)} going to two children costs ${K.usd(paKids)}, the ${K.pct(pa.lineal.rate, 1)} lineal rate on every dollar.</p>
${h.mini('compare', { t: 'Your two states, side by side', p: ['estate', 'a', 'b'], d: { estate: 7000000, a: 'MA', b: 'FL' } })}
<h2>Domicile, not residence, is the test</h2>
<p>The states define the taxable estate by where the person was domiciled. Connecticut, for instance, describes a resident estate as that of a decedent who at death was domiciled in Connecticut, and a nonresident estate as one that was not but owned real or tangible property there (${h.src('ct_drs', 'Connecticut DRS')}). Domicile is a single place, the one a person intends to return to, and it is proved by a bundle of facts: the declared homestead, the driver's license and voter registration, where the person files income tax returns, where the doctors, the club memberships, the family heirlooms and the pets are, how many days are spent in each home. Keeping the old house and the old habits while filing a declaration in Florida is the pattern that ends in a dispute with the former state's tax department, which can audit the estate after the death, when the person is no longer there to explain.</p>
<p>Washington adds a nuance that matters for the move itself: it allocates intangible property to the state of domicile, and treats a domiciled decedent's real estate and tangible property outside Washington as out of state (${h.src('wa_apport', 'Washington DOR')}). Once domicile has truly moved, securities and accounts leave the Washington computation entirely.</p>
<h2>What stays behind: the house you keep</h2>
<p>Real estate and tangible property keep the tax of the state where they sit, whatever the owner's domicile. The second table keeps the ${K.usd(B)} estate and the move to Florida, but leaves a ${K.usd(KEEP)} house in the old state.</p>
${h.table(['House kept in', 'Tax before the move', 'Tax after the move', 'Why'], FROM.map((st) => [K.nameOf(st), K.usd(stTax(st, B)), K.usd(kept(st)), K.E[st].apportion === 'situs' ? 'Only the local property is taxed, with the local credit' : 'Tax on the whole estate times the local share']), `Estate of ${K.usd(B)}, of which ${K.usd(KEEP)} of real estate left in the former state; owner domiciled in Florida at death.`, ['l', 'r', 'r', 'l'])}
<p>The split between the two methods is clear. In ratio states such as Oregon, Washington, Minnesota and Illinois, the former home brings back a fraction of a tax computed on everything, ${K.pct(KEEP / B, 0)} here, and that fraction is applied at the rates of a ${K.usd(B)} estate. In New York and Massachusetts only the property itself is taxed, against the local exclusion or credit, so a house of that size leaves little or nothing to pay. The details, and the inheritance-tax states, are on ${h.a('property-in-another-state', 'property in another state')}.</p>
<h2>Moving toward a tax</h2>
<p>The same rules work in reverse. A retiree who leaves Texas for Washington, Oregon or Maryland brings the whole estate under a state tax with a lower threshold than the federal one: ${K.usd(K.E.WA.exemption)} in Washington from July 1, 2026, ${K.usd(K.E.OR.exemption)} in Oregon, ${K.usd(K.E.MD.exemption)} in Maryland, which also has an inheritance tax on nieces, nephews and friends. A move to Pennsylvania or New Jersey changes nothing for children in New Jersey, but adds Pennsylvania's ${K.pct(pa.lineal.rate, 1)} on what children receive. Each state has its own page, starting from ${h.a('state-estate-tax', 'the estate tax by state')}.</p>
<h2>What the move does not change</h2>
<p>The federal estate tax ignores the state: the exclusion is ${K.usd(K.F.basicExclusion)} per person for deaths in 2026, the rate ${K.pct(K.F.topRate, 0)} above it, and portability lets a surviving spouse add the unused amount of the first. Lifetime gifts made before the move may still be added back by the former state if death comes within its look-back period, three years in New York and Minnesota (${h.a('gifts-and-state-estate-tax', 'gifts and state estate taxes')}). A married couple that has used a credit shelter trust under the former state's rules keeps the trust; its terms were drafted for that state and may be reviewed by an attorney in the new one. The calculator shows the arithmetic of a move; whether a move suits a given family is a question for an estate attorney who knows both states.</p>
`,
  faqs: [
    { q: 'How many days a year in Florida make a New Yorker a Florida domiciliary for estate tax?', a: 'No number of days settles it. Domicile is the permanent home a person intends to return to, shown by many facts together: homestead, license, voting, tax returns, where family, doctors and valued belongings are, and where time is spent. Day counts are one piece of evidence. The former state can contest domicile after death, which is why a move that is only on paper is fragile.' },
    { q: `Does a Massachusetts native who moved to Florida still owe Massachusetts estate tax on a summer house?`, a: `Only on the Massachusetts real estate and tangible property, minus the related deductions, with Table B and the ${K.usd(K.E.MA.credit!)} credit applied to that amount alone. A house of a few hundred thousand dollars owes nothing, but the return can still be due if the worldwide estate plus gifts exceeds ${K.usd(K.E.MA.exemption)}.` },
    { q: 'Why does a house kept in Oregon after a move still cost so much?', a: `Oregon computes its tax on the whole estate wherever the property is, as if the owner had lived there, then keeps the Oregon share. With ${K.usd(KEEP)} of Oregon real estate in a ${K.usd(B)} estate, the bill after a move to Florida is ${K.usd(kept('OR'))}: ${K.pct(KEEP / B, 0)} of the tax on the full estate, at the rate of the full estate.` },
    { q: 'Does moving out of Pennsylvania remove the inheritance tax on what a parent leaves the children?', a: `On bank accounts, securities and other intangible property, yes, once domicile has moved: Pennsylvania taxes a nonresident only on real and tangible property located in the Commonwealth. Pennsylvania real estate that stays in the estate remains taxed at ${K.pct(pa.lineal.rate, 1)} for children, on its value net of the mortgage.` },
  ],
  tool: 'compare',
  toolArg: { estate: B, a: 'NY', b: 'FL' },
  related: ['property-in-another-state', 'states-without-estate-tax', 'state-estate-tax', 'new-york-estate-tax', 'washington-estate-tax', 'massachusetts-estate-tax'],
  sources: ['ct_drs', 'wa_apport', 'ny_960', 'ma_dor', 'or_706i', 'pa_dor'],
});
