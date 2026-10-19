/**
 * The 50 states and DC: name, tile position on the home map, and the page that covers them. Which tax a
 * death triggers comes from params-2026.json (estate and inheritance blocks), never from this list.
 */
import P from '../data/params-2026.json';

export interface Jurisdiction { code: string; name: string; row: number; col: number; page?: string }
const J = (code: string, name: string, row: number, col: number, page?: string): Jurisdiction => ({ code, name, row, col, page });

export const JURISDICTIONS: Jurisdiction[] = [
  J('AK', 'Alaska', 0, 0), J('ME', 'Maine', 0, 10, 'maine-estate-tax'),
  J('VT', 'Vermont', 1, 9, 'vermont-estate-tax'), J('NH', 'New Hampshire', 1, 10),
  J('WA', 'Washington', 2, 0, 'washington-estate-tax'), J('ID', 'Idaho', 2, 1), J('MT', 'Montana', 2, 2), J('ND', 'North Dakota', 2, 3),
  J('MN', 'Minnesota', 2, 4, 'minnesota-estate-tax'), J('IL', 'Illinois', 2, 5, 'illinois-estate-tax'), J('WI', 'Wisconsin', 2, 6), J('MI', 'Michigan', 2, 7),
  J('NY', 'New York', 2, 8, 'new-york-estate-tax'), J('RI', 'Rhode Island', 2, 9, 'rhode-island-estate-tax'), J('MA', 'Massachusetts', 2, 10, 'massachusetts-estate-tax'),
  J('OR', 'Oregon', 3, 0, 'oregon-estate-tax'), J('NV', 'Nevada', 3, 1), J('WY', 'Wyoming', 3, 2), J('SD', 'South Dakota', 3, 3), J('IA', 'Iowa', 3, 4, 'iowa-inheritance-tax'),
  J('IN', 'Indiana', 3, 5), J('OH', 'Ohio', 3, 6), J('PA', 'Pennsylvania', 3, 7, 'pennsylvania-inheritance-tax'), J('NJ', 'New Jersey', 3, 8, 'new-jersey-inheritance-tax'),
  J('CT', 'Connecticut', 3, 9, 'connecticut-estate-tax'),
  J('CA', 'California', 4, 0), J('UT', 'Utah', 4, 1), J('CO', 'Colorado', 4, 2), J('NE', 'Nebraska', 4, 3, 'nebraska-inheritance-tax'), J('MO', 'Missouri', 4, 4),
  J('KY', 'Kentucky', 4, 5, 'kentucky-inheritance-tax'), J('WV', 'West Virginia', 4, 6), J('VA', 'Virginia', 4, 7), J('MD', 'Maryland', 4, 8, 'maryland-estate-tax'), J('DE', 'Delaware', 4, 9),
  J('AZ', 'Arizona', 5, 1), J('NM', 'New Mexico', 5, 2), J('KS', 'Kansas', 5, 3), J('AR', 'Arkansas', 5, 4), J('TN', 'Tennessee', 5, 5), J('NC', 'North Carolina', 5, 6),
  J('SC', 'South Carolina', 5, 7), J('DC', 'District of Columbia', 5, 8, 'district-of-columbia-estate-tax'),
  J('OK', 'Oklahoma', 6, 3), J('LA', 'Louisiana', 6, 4), J('MS', 'Mississippi', 6, 5), J('AL', 'Alabama', 6, 6), J('GA', 'Georgia', 6, 7),
  J('HI', 'Hawaii', 7, 0, 'hawaii-estate-tax'), J('TX', 'Texas', 7, 3), J('FL', 'Florida', 7, 8),
];

const EST = P.estate as Record<string, unknown>;
const INH = P.inheritance as Record<string, unknown>;
export const hasEstateTax = (code: string) => code in EST;
export const hasInheritanceTax = (code: string) => code in INH;
export function kindOf(code: string): 'estate' | 'inheritance' | 'both' | 'none' {
  const e = hasEstateTax(code), i = hasInheritanceTax(code);
  return e && i ? 'both' : e ? 'estate' : i ? 'inheritance' : 'none';
}
export const nameOf = (code: string) => JURISDICTIONS.find((j) => j.code === code)?.name ?? code;
export const STATE_OPTIONS = [...JURISDICTIONS].sort((a, b) => a.name.localeCompare(b.name)).map((j) => ({ value: j.code, label: j.name }));
export const ESTATE_CODES = JURISDICTIONS.filter((j) => hasEstateTax(j.code)).map((j) => j.code).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
export const INHERITANCE_CODES = JURISDICTIONS.filter((j) => hasInheritanceTax(j.code)).map((j) => j.code).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
export const NONE_CODES = JURISDICTIONS.filter((j) => kindOf(j.code) === 'none').map((j) => j.code).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
