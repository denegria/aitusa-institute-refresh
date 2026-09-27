import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizePortalReturnTo } from '../src/portalAuth/returnTo.js';

test('student sign-in returns only to the registration route', () => {
  assert.equal(sanitizePortalReturnTo('/inscribete/', 'student'), '/inscribete/');
  assert.equal(sanitizePortalReturnTo('/inscribete/?curso=ged', 'student'), '/inscribete/?curso=ged');
  assert.equal(sanitizePortalReturnTo('/inscribete/?curso=ingles-hibrido-adultos', 'student'), '/inscribete/?curso=ingles-hibrido-adultos');
  assert.equal(sanitizePortalReturnTo('/inscribete/?curso=made-up', 'student'), '/portal/');
  assert.equal(sanitizePortalReturnTo('/inscribete/?state=private', 'student'), '/portal/');
  assert.equal(sanitizePortalReturnTo('//evil.example/inscribete/', 'student'), '/portal/');
  assert.equal(sanitizePortalReturnTo('/employee', 'student'), '/portal/');
});
