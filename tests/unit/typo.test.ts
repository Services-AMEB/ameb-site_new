import { test } from 'node:test';
import assert from 'node:assert/strict';
import { typoFr, NBSP } from '../../src/lib/typo.ts';

test('espace insécable avant : ; ? ! et dans les guillemets', () => {
  assert.equal(typoFr('Ça vous dit quelque chose ?'), `Ça vous dit quelque chose${NBSP}?`);
  assert.equal(typoFr('Prix fixe : 3 000 $'), `Prix fixe${NBSP}: 3${NBSP}000${NBSP}$`);
  assert.equal(typoFr('« En silo »'), `«${NBSP}En silo${NBSP}»`);
  assert.equal(typoFr('Merci!'), `Merci${NBSP}!`);
});

test('URL et heures intactes', () => {
  assert.equal(typoFr('https://ameb.ca/?a=1'), 'https://ameb.ca/?a=1');
  assert.equal(typoFr('9:30'), '9:30');
});
