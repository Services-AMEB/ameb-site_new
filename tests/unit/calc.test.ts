import { test } from 'node:test';
import assert from 'node:assert/strict';
import { annualCost, parseInput, formatMoney, approxRange, formatRange } from '../../src/lib/calc.ts';

test('formule du brief : 5 × 48 × 45 = 10 800 $', () => {
  assert.equal(annualCost({ employees: 1, hours: 5, rate: 45 }), 10800);
  assert.equal(formatMoney(10800, 'fr').replace(/\s/g, ' '), '10 800 $');
  assert.equal(formatMoney(10800, 'en'), '$10,800');
});

test('entrées bornées et arrondies au pas', () => {
  const v = parseInput((k) => ({ employees: '999', hours: '3,3', rate: '' })[k]);
  assert.deepEqual(v, { employees: 200, hours: 3.5, rate: 45 });
  assert.deepEqual(parseInput(() => null), { employees: 1, hours: 5, rate: 45 });
});

test('fourchette approximative arrondie (jamais le chiffre exact)', () => {
  assert.deepEqual(approxRange(10800), { lo: 10000, hi: 12000 });
  assert.deepEqual(approxRange(1234), { lo: 1000, hi: 1500 });
  assert.equal(formatRange(10800, 'fr', { about: 'environ', to: 'à' }).replace(/\s/g, ' '), '10 000 à 12 000 $');
  assert.equal(formatRange(10800, 'en', { about: 'about', to: 'to' }), '$10,000 to $12,000');
  assert.equal(formatRange(480, 'fr', { about: 'environ', to: 'à' }).replace(/\s/g, ' '), 'environ 500 $');
});
