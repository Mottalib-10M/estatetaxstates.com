/** Engine tests: published tables are consistent, official examples are reproduced, edge cases hold. */
import { describe, expect, it } from 'vitest';
import P from '../src/data/params-2026.json';
import { impliedBases, taxFromTable, taxFromSlices, type Bracket } from '../src/lib/engine/brackets';
import { federalEstateTax, tentativeTax } from '../src/lib/engine/federal';
import { RULES, nyTax, ilTax, mdTax, stateEstateTax, tableB } from '../src/lib/engine/state';
import { inheritanceTax } from '../src/lib/engine/inheritance';
import { computeCase } from '../src/lib/engine/estate';

const base = (st: string, taxable: number, extra: Partial<Parameters<typeof stateEstateTax>[0]> = {}) =>
  stateEstateTax({ st, taxable, gross: taxable, inState: taxable, resident: true, gifts: 0, giftWhen: 'old', dsue: 0, half: 'h2', ...extra }).tax;

describe('published tables', () => {
  const tables: Array<[string, Bracket[]]> = [['federal', P.federal.rateTable as Bracket[]], ['Table B', P.tableB as Bracket[]]];
  for (const [st, r] of Object.entries(RULES)) { if (r.table && r.method !== 'whole') tables.push([st, r.table]); if (r.firstHalf) tables.push([`${st} first half`, r.firstHalf.table]); }
  for (const [name, t] of tables) it(`${name}: printed bases match the rates`, () => {
    const imp = impliedBases(t); t.forEach((row, i) => expect(Math.abs(row.base - imp[i]), `${name} row ${i}`).toBeLessThan(1.01));
  });
  it('DC and OR (tables starting at the exemption) are consistent', () => {
    for (const st of ['DC', 'OR']) { const t = RULES[st].table!; const imp = impliedBases(t); t.forEach((row, i) => expect(Math.abs(row.base - imp[i])).toBeLessThan(1.01)); }
  });
});

describe('federal', () => {
  it('basic credit is the tentative tax on $15,000,000 ($5,945,800, Form 706 instructions)', () => expect(tentativeTax(15000000)).toBe(5945800));
  it('$1,945,800 is the tentative tax on $5,000,000 (Maryland Schedule B)', () => expect(tentativeTax(5000000)).toBe(1945800));
  it('no tax at $15,000,000, 40 % above', () => {
    expect(federalEstateTax({ taxableEstate: 15000000, gifts: 0, dsue: 0 }).tax).toBe(0);
    expect(federalEstateTax({ taxableEstate: 16000000, gifts: 0, dsue: 0 }).tax).toBeCloseTo(400000, 0);
    expect(federalEstateTax({ taxableEstate: 25000000, gifts: 0, dsue: 10000000 }).tax).toBe(0);
  });
});

describe('state methods', () => {
  it('RI credit equals Table B at the threshold, so no tax below it', () => {
    expect(tableB(RULES.RI.exemption - 60000)).toBeCloseTo(RULES.RI.credit!, 0);
    expect(base('RI', 1800000)).toBe(0);
    expect(base('RI', 2838056)).toBeGreaterThan(0);
  });
  it('MA credit $99,600 equals Table B on $1,940,000; nothing at $2,000,000', () => {
    expect(tableB(1940000)).toBe(99600);
    expect(base('MA', 2000000)).toBe(0);
    expect(base('MA', 3000000)).toBeCloseTo(tableB(2940000) - 99600, 0);
  });
  it('NY: no tax at the exclusion, full tax above 105 %, phase-in between', () => {
    expect(nyTax(7350000)).toBe(0);
    expect(nyTax(7717501)).toBeCloseTo(taxFromTable(RULES.NY.table!, 7717501), 0);
    const mid = nyTax(7500000);
    expect(mid).toBeGreaterThan(0); expect(mid).toBeLessThan(taxFromTable(RULES.NY.table!, 7500000));
  });
  it('IL: Attorney General examples', () => {
    expect(ilTax(5000000, 0)).toBeCloseTo(285714.29, 1);
    expect(base('IL', 5000000, { inState: 2500000 })).toBeCloseTo(142857.14, 1);
    expect(ilTax(3000100, 1000000)).toBeCloseTo(28.57, 1);
    expect(ilTax(4000000, 0)).toBe(0);
  });
  it('DC: $1,299 at $5,000,000; OR: $70,500 at $1,700,000', () => {
    expect(base('DC', 5000000)).toBeCloseTo(1299, 0);
    expect(base('DC', 4988400)).toBe(0);
    expect(base('OR', 1700000)).toBeCloseTo(70500, 0);
    expect(base('OR', 1000000)).toBe(0);
  });
  it('CT: 12 % above $15,000,000, capped at $15,000,000', () => {
    expect(base('CT', 16000000)).toBeCloseTo(120000, 0);
    expect(base('CT', 300000000)).toBe(15000000);
  });
  it('WA: two tables in 2026', () => {
    expect(base('WA', 4000000, { half: 'h1' })).toBeCloseTo(0.10 * 924000, 0);
    expect(base('WA', 4000000)).toBeCloseTo(100000, 0);
    expect(base('WA', 13000000)).toBeCloseTo(1490000 + 0.20 * 1000000, 0);
  });
  it('ME, VT, MN: tax on the excess', () => {
    expect(base('ME', 8160000)).toBeCloseTo(80000, 0);
    expect(base('VT', 6000000)).toBeCloseTo(160000, 0);
    expect(base('MN', 4000000)).toBeCloseTo(130000, 0);
  });
  it('MD: 16 % above $5,000,000 until the Table B credit is lower', () => {
    const m = mdTax(6000000, 0, 0, 1);
    expect(m.line9).toBeCloseTo(160000, 0);
    expect(m.tax).toBe(Math.min(m.line9, m.sdtc));
    expect(mdTax(5000000, 0, 0, 1).tax).toBe(0);
    expect(mdTax(9000000, 0, 4000000, 1).tax).toBe(0);
  });
  it('HI: portability adds the unused exclusion', () => {
    expect(base('HI', 6490000)).toBeCloseTo(100000, 0);
    expect(base('HI', 6490000, { dsue: 2000000 })).toBe(0);
  });
});

describe('inheritance', () => {
  it('PA rates', () => {
    expect(inheritanceTax('PA', 'child', 100000).tax).toBeCloseTo(4500, 0);
    expect(inheritanceTax('PA', 'sibling', 100000).tax).toBeCloseTo(12000, 0);
    expect(inheritanceTax('PA', 'nephew', 100000).tax).toBeCloseTo(15000, 0);
    expect(inheritanceTax('PA', 'spouse', 100000).tax).toBe(0);
    expect(inheritanceTax('PA', 'minorchild', 100000).tax).toBe(0);
  });
  it('NJ Class C and D', () => {
    expect(inheritanceTax('NJ', 'sibling', 25000).tax).toBe(0);
    expect(inheritanceTax('NJ', 'sibling', 125000).tax).toBeCloseTo(11000, 0);
    expect(inheritanceTax('NJ', 'nephew', 100000).tax).toBeCloseTo(15000, 0);
    expect(inheritanceTax('NJ', 'nephew', 800000).tax).toBeCloseTo(105000 + 16000, 0);
    expect(inheritanceTax('NJ', 'child', 900000).tax).toBe(0);
  });
  it('KY 2026: nephews exempt, Class C with $500 exemption', () => {
    expect(inheritanceTax('KY', 'nephew', 100000).tax).toBe(0);
    expect(inheritanceTax('KY', 'cousin', 10500).tax).toBeCloseTo(600, 0);
    expect(taxFromSlices([[10000, 0.04], [20000, 0.05]], 15000)).toBeCloseTo(650, 0);
  });
  it('NE: 1 % above $100,000, 11 % above $40,000, 15 % above $25,000', () => {
    expect(inheritanceTax('NE', 'child', 200000).tax).toBeCloseTo(1000, 0);
    expect(inheritanceTax('NE', 'nephew', 140000).tax).toBeCloseTo(11000, 0);
    expect(inheritanceTax('NE', 'other', 125000).tax).toBeCloseTo(15000, 0);
  });
  it('MD: 10 % on collateral heirs, $1,000 floor', () => {
    expect(inheritanceTax('MD', 'nephew', 50000).tax).toBeCloseTo(5000, 0);
    expect(inheritanceTax('MD', 'sibling', 50000).tax).toBe(0);
    expect(inheritanceTax('MD', 'cousin', 900).tax).toBe(0);
  });
});

describe('full case', () => {
  it('Maryland resident leaving $6,000,000 to two nephews pays both taxes, with the credit', () => {
    const r = computeCase({ estate: 6000000, st: 'MD', married: false, toSpouse: 'none', heir: 'nephew', heirs: 2 });
    expect(r.inhTotal).toBeCloseTo(600000, 0);
    expect(r.home!.tax).toBe(0); // the inheritance tax paid exceeds the estate tax
  });
  it('a married couple leaving everything to the spouse owes nothing', () => {
    const r = computeCase({ estate: 20000000, st: 'NY', married: true, toSpouse: 'all', heir: 'child', heirs: 2 });
    expect(r.total).toBe(0);
  });
  it('a Florida resident with a $2,000,000 Oregon house pays Oregon on the share', () => {
    const r = computeCase({ estate: 4000000, st: 'FL', married: false, toSpouse: 'none', heir: 'child', heirs: 2, reState: 'OR', reValue: 2000000 });
    expect(r.home).toBeNull();
    expect(r.other!.tax).toBeCloseTo(taxFromTable(RULES.OR.table!, 4000000) / 2, 0);
  });
});
