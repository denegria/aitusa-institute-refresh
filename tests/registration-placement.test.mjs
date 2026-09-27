import assert from 'node:assert/strict';
import test from 'node:test';

import { registrationPlacementDisplay, registrationPortalActor } from '../src/registration/placement.server.js';

const result = {
  attemptId: '11111111-1111-4111-8111-111111111111',
  recommendedLevelLabel: 'Nivel 2', placementReviewStatus: 'pending', finalLevel: null,
};
const snapshot = {
  account: { accountId: 'portal-1', accountType: 'adult_student', email: 'student@example.com' },
  result,
};

test('matching adult portal identity carries its existing placement recommendation', () => {
  const actor = registrationPortalActor(snapshot, ' STUDENT@example.com ');
  assert.equal(actor.portalAccountId, 'portal-1');
  assert.equal(actor.placement.attemptId, result.attemptId);
  assert.deepEqual(registrationPlacementDisplay(actor.placement), {
    status: 'recommended', levelLabel: 'Nivel 2',
  });
});

test('placement cannot follow a changed student email or guardian identity', () => {
  assert.deepEqual(registrationPortalActor(snapshot, 'different@example.com'), {
    portalAccountId: null, placement: null,
  });
  assert.deepEqual(registrationPortalActor({
    ...snapshot, account: { ...snapshot.account, accountType: 'guardian' },
  }, 'student@example.com'), { portalAccountId: null, placement: null });
});

test('confirmed placement carries AIT final level; malformed attempt is omitted', () => {
  const confirmed = registrationPortalActor({ ...snapshot, result: {
    ...result, placementReviewStatus: 'confirmed', finalLevel: 'Nivel 3',
  } }, 'student@example.com');
  assert.deepEqual(registrationPlacementDisplay(confirmed.placement), {
    status: 'confirmed', levelLabel: 'Nivel 3',
  });
  const invalid = registrationPortalActor({ ...snapshot, result: {
    ...result, attemptId: 'not-an-attempt-id',
  } }, 'student@example.com');
  assert.equal(invalid.placement, null);
});
