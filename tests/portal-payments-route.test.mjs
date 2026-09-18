import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';

const checkout = fs.readFileSync(new URL('../app/api/portal/payments/checkout/route.js', import.meta.url), 'utf8');
const status = fs.readFileSync(new URL('../app/api/portal/payments/status/route.js', import.meta.url), 'utf8');
const route = fs.readFileSync(new URL('../app/portal/PortalRoute.jsx', import.meta.url), 'utf8');
const panel = fs.readFileSync(new URL('../app/portal/PortalPaymentsPanel.jsx', import.meta.url), 'utf8');

describe('MIS-420 authenticated payment routes and UI', () => {
  it('resolves authentication before every payment action', () => {
    assert.match(checkout, /resolveAuthenticatedPortalIdentity\(request\)/);
    assert.match(status, /resolveAuthenticatedPortalIdentity\(request\)/);
    assert.match(checkout, /account\.accountId/);
    assert.match(status, /identity\.account\.accountId/);
  });

  it('supports payments as a real portal section with CRM snapshot data', () => {
    assert.match(route, /"payments"/);
    assert.match(route, /callPortalPaymentsCrm\("snapshot", account\)/);
    assert.match(panel, /Crédito disponible/);
    assert.match(panel, /Recibos verificados/);
  });

  it('uses hosted checkout and never renders card fields', () => {
    assert.match(checkout, /hosted_link/);
    assert.match(panel, /Pagar de forma segura/);
    assert.doesNotMatch(panel, /cardNumber|cvv|cvc|expiry/i);
  });

  it('states that pending remains verifying and CRM revalidates limits', () => {
    assert.match(panel, /No mostraremos el saldo como pagado/);
    assert.match(panel, /CRM vuelve a validar/);
  });
});
