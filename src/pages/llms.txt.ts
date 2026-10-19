/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Estate and inheritance tax for deaths in 2026, computed on one estate: the estate tax of the 12 states and the District of Columbia that have one, with each state's 2026 exemption, table and method (New York cliff, Massachusetts and Rhode Island credit tables, Illinois interrelated computation, Maryland Form MET 1, Washington's two 2026 tables); the inheritance tax of Pennsylvania, New Jersey, Kentucky, Nebraska and Maryland by class of heir; real estate in another state; and the federal estate tax with the $15,000,000 exclusion of Public Law 119-21 and portability. Every figure read on the state statute, the revenue department or irs.gov. Independent site published by Radif Partners; general information, not legal or tax advice. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
