/** Every page id the site is meant to have (id = file name = URL slug). Content tests accept links to these ids
 *  while pages are being written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  // Federal estate and gift tax
  'estate-tax-exemption', 'gift-tax', 'gift-tax-limit', 'estate-tax-rates', 'portability', 'non-citizen-spouse',
  // State estate tax
  'state-estate-tax', 'connecticut-estate-tax', 'district-of-columbia-estate-tax', 'hawaii-estate-tax', 'illinois-estate-tax', 'maine-estate-tax',
  'maryland-estate-tax', 'massachusetts-estate-tax', 'minnesota-estate-tax', 'new-york-estate-tax', 'new-york-estate-tax-cliff', 'oregon-estate-tax',
  'rhode-island-estate-tax', 'vermont-estate-tax', 'washington-estate-tax',
  // Inheritance tax
  'inheritance-tax-by-state', 'pennsylvania-inheritance-tax', 'new-jersey-inheritance-tax', 'kentucky-inheritance-tax', 'nebraska-inheritance-tax',
  'maryland-inheritance-tax', 'iowa-inheritance-tax',
  // Guides
  'states-without-estate-tax', 'estate-tax-vs-inheritance-tax', 'property-in-another-state', 'moving-to-avoid-estate-tax', 'gifts-and-state-estate-tax',
  'married-couples-state-estate-tax', 'estate-tax-return-deadline', 'taxes-on-inheritance',
];
export const PLANNED_IDS = new Set<string>(PLANNED_GUIDES);
