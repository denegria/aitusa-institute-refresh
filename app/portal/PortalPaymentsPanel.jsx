'use client';

import { useEffect, useRef, useState } from 'react';
import { formatPortalPaymentDate } from '../../src/portalPayments/format.js';

const STATE_COPY = Object.freeze({
  verifying: ['Estamos verificando tu pago', 'No mostraremos el saldo como pagado hasta que AIT USA confirme la transacción.'],
  confirmed: ['Pago confirmado', 'Tu saldo y recibo ya reflejan el pago verificado.'],
  declined: ['El pago no fue aprobado', 'No se registró dinero. Puedes intentarlo nuevamente con otra forma de pago.'],
  cancelled: ['Pago cancelado', 'Tu saldo no cambió. Puedes volver a intentarlo cuando estés listo.'],
  expired: ['La sesión de pago venció', 'Tu saldo no cambió. Crea una nueva sesión segura para continuar.'],
});

function money(value, currency = 'USD') {
  return new Intl.NumberFormat('es-US', { style: 'currency', currency }).format(Number(value || 0));
}

export function PortalPaymentsPanel({ payments, paymentReturn = null }) {
  const [returnStatus, setReturnStatus] = useState(paymentReturn?.kind && paymentReturn.kind !== 'return'
    ? { state: paymentReturn.kind }
    : null);
  const [busyChargeId, setBusyChargeId] = useState(null);
  const [error, setError] = useState('');
  const intentKeys = useRef(new Map());
  const openCharges = payments.charges.filter((charge) => charge.state !== 'paid');
  const returnKind = paymentReturn?.kind || '';
  const returnState = paymentReturn?.state || '';

  useEffect(() => {
    if (returnKind !== 'return' || !returnState) return;
    let active = true;
    fetch('/api/portal/payments/status/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ state: returnState }),
    }).then(async (response) => {
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error?.message || 'No pudimos verificar el pago.');
      if (active) setReturnStatus(body.result);
    }).catch((caught) => {
      if (active) setError(caught.message);
    });
    return () => { active = false; };
  }, [returnKind, returnState]);

  async function startPayment(event, charge) {
    event.preventDefault();
    setError('');
    setBusyChargeId(charge.id);
    const form = new FormData(event.currentTarget);
    let key = intentKeys.current.get(charge.id);
    if (!key) {
      key = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      intentKeys.current.set(charge.id, key);
    }
    try {
      const response = await fetch('/api/portal/payments/checkout/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chargeId: charge.id, amount: form.get('amount'), idempotencyKey: key }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.checkoutUrl) throw new Error(body?.error?.message || 'No pudimos abrir el pago seguro.');
      window.location.assign(body.checkoutUrl);
    } catch (caught) {
      setError(caught.message);
      setBusyChargeId(null);
    }
  }

  if (payments.state !== 'ready') {
    return (
      <section className="portal-payments-state" role="status">
        <strong>{payments.state === 'support_required' ? 'Necesitamos vincular tu cuenta' : 'Pagos temporalmente no disponibles'}</strong>
        <p>{payments.state === 'support_required'
          ? 'Tu información sigue segura. Un asesor debe confirmar la relación con tu expediente antes de mostrar datos financieros.'
          : 'No se modificó tu saldo. Intenta nuevamente más tarde o contacta soporte.'}</p>
        <a className="portal-button portal-button--quiet" href="/contactanos">Contactar soporte</a>
      </section>
    );
  }

  return (
    <div className="portal-payments" aria-live="polite">
      {returnStatus ? (
        <section className={`portal-payment-notice portal-payment-notice--${returnStatus.state}`} role="status">
          <strong>{STATE_COPY[returnStatus.state]?.[0] || STATE_COPY.verifying[0]}</strong>
          <p>{STATE_COPY[returnStatus.state]?.[1] || STATE_COPY.verifying[1]}</p>
        </section>
      ) : null}
      {error ? <p className="portal-payment-error" role="alert">{error}</p> : null}

      <section className="portal-balance-hero" aria-labelledby="portal-balance-title">
        <div>
          <p className="portal-eyebrow">Saldo de matrícula</p>
          <h2 id="portal-balance-title">Tu cuenta, sin sorpresas</h2>
          <p>AIT USA calcula el saldo en el CRM. El Portal solo muestra importes verificados y abre pagos de monto fijo.</p>
        </div>
        <div className="portal-credit-card">
          <span>Crédito disponible</span>
          <strong>{money(payments.unappliedCredit.amount, payments.unappliedCredit.currency)}</strong>
          <small>Se aplicará por el equipo de AIT USA según corresponda.</small>
        </div>
      </section>

      <section className="portal-charge-list" aria-labelledby="portal-charges-title">
        <div className="portal-payments-heading">
          <div><p className="portal-eyebrow">Cargos actuales</p><h2 id="portal-charges-title">Saldo y próximos pasos</h2></div>
          <span>{openCharges.length} pendiente{openCharges.length === 1 ? '' : 's'}</span>
        </div>
        {payments.charges.length ? payments.charges.map((charge) => (
          <article className={`portal-charge-card portal-charge-card--${charge.state}`} key={charge.id}>
            <div className="portal-charge-card__top">
              <div><span className="portal-charge-card__state">{charge.state === 'overdue' ? 'Vencido' : charge.state === 'partially_paid' ? 'Pago parcial' : charge.state === 'paid' ? 'Pagado' : 'Pendiente'}</span><h3>{charge.description}</h3></div>
              <strong>{money(charge.remainingAmount, charge.currency)}</strong>
            </div>
            <dl className="portal-charge-facts">
              <div><dt>Original</dt><dd>{money(charge.originalAmount, charge.currency)}</dd></div>
              <div><dt>Aplicado</dt><dd>{money(charge.appliedAmount, charge.currency)}</dd></div>
              <div><dt>Vence</dt><dd>{formatPortalPaymentDate(charge.originalDueDate)}</dd></div>
              <div><dt>Próximo período</dt><dd>{formatPortalPaymentDate(charge.upcomingPeriodStart)}</dd></div>
            </dl>
            {charge.state !== 'paid' ? (
              <form className="portal-payment-form" onSubmit={(event) => startPayment(event, charge)}>
                <label htmlFor={`amount-${charge.id}`}>Monto a pagar</label>
                <div className="portal-payment-form__row"><span aria-hidden="true">$</span><input id={`amount-${charge.id}`} name="amount" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" defaultValue={charge.remainingAmount} required /><button className="portal-button portal-button--primary" disabled={busyChargeId === charge.id} type="submit">{busyChargeId === charge.id ? 'Abriendo…' : 'Pagar de forma segura'}</button></div>
                <small>Mínimo $1.00 · Máximo mostrado: {money(charge.remainingAmount, charge.currency)}. CRM vuelve a validar antes de crear el pago.</small>
              </form>
            ) : null}
          </article>
        )) : (
          <div className="portal-payments-empty"><strong>No tienes cargos activos</strong><p>Cuando AIT USA publique un cargo de matrícula, aparecerá aquí con su fecha original.</p></div>
        )}
      </section>

      <section className="portal-receipts" aria-labelledby="portal-receipts-title">
        <div className="portal-payments-heading"><div><p className="portal-eyebrow">Historial</p><h2 id="portal-receipts-title">Recibos verificados</h2></div></div>
        {payments.receipts.length ? <ul>{payments.receipts.map((receipt) => <li key={receipt.id}><div><strong>{receipt.number}</strong><time>{formatPortalPaymentDate(receipt.issueDate)}</time></div><span>{money(receipt.total, receipt.currency)}</span></li>)}</ul> : <p className="portal-receipts__empty">Todavía no hay recibos verificados.</p>}
      </section>
    </div>
  );
}
