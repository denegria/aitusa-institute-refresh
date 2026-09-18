"use client";

import { useEffect, useState } from "react";
import { REGISTRATION_DRAFT_KEY } from "../../../src/registration/contract.js";

const INITIAL_DRAFT = Object.freeze({
  step: 1,
  startedAt: 0,
  website: "",
  idempotencyKey: "",
  programCode: "english_program",
  residenceCountryCode: "US",
  billingCountryCode: "US",
  learningModality: "in_person",
  includeTuitionPrepayment: false,
  separatePayer: false,
  student: { name: "", email: "", phone: "" },
  payer: { name: "", email: "", phone: "" },
  shippingAddress: { recipientName: "", addressLine1: "", addressLine2: "", city: "", state: "NJ", postalCode: "" },
});

const COUNTRIES = [
  ["US", "Estados Unidos"], ["CO", "Colombia"], ["MX", "México"], ["DO", "República Dominicana"],
  ["EC", "Ecuador"], ["PE", "Perú"], ["VE", "Venezuela"], ["AR", "Argentina"], ["CL", "Chile"],
  ["ES", "España"], ["FR", "Francia"], ["IT", "Italia"], ["DE", "Alemania"], ["GB", "Reino Unido"],
];

function idempotencyKey() {
  return `public:${crypto.randomUUID()}`;
}

function money(value, currency = "USD") {
  return new Intl.NumberFormat("es-US", { style: "currency", currency }).format(Number(value || 0));
}

function mergeDraft(saved, programCode) {
  return {
    ...INITIAL_DRAFT,
    ...saved,
    programCode: programCode || saved?.programCode || "english_program",
    idempotencyKey: saved?.idempotencyKey || idempotencyKey(),
    startedAt: saved?.startedAt || Date.now(),
    student: { ...INITIAL_DRAFT.student, ...saved?.student },
    payer: { ...INITIAL_DRAFT.payer, ...saved?.payer },
    shippingAddress: { ...INITIAL_DRAFT.shippingAddress, ...saved?.shippingAddress },
  };
}

export function RegistrationExperience({
  programCode = "english_program",
  courseLabel = "Inglés",
  returnToken = "",
  redirectState = "",
}) {
  const [draft, setDraft] = useState(() => ({ ...INITIAL_DRAFT, programCode }));
  const [ready, setReady] = useState(false);
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paymentState, setPaymentState] = useState(null);

  useEffect(() => {
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(REGISTRATION_DRAFT_KEY) || "null"); } catch { saved = null; }
    setDraft(mergeDraft(saved, programCode));
    setReady(true);
    fetch("/api/registration/prefill/", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((body) => {
        if (!body?.authenticated || !body.student) return;
        setDraft((current) => ({
          ...current,
          student: {
            ...current.student,
            name: current.student.name || body.student.name || "",
            email: current.student.email || body.student.email || "",
          },
        }));
      }).catch(() => {});
  }, [programCode]);

  useEffect(() => {
    if (!ready || returnToken) return;
    sessionStorage.setItem(REGISTRATION_DRAFT_KEY, JSON.stringify(draft));
  }, [draft, ready, returnToken]);

  useEffect(() => {
    if (!returnToken) return;
    verifyPayment(returnToken);
  // The signed token is stable for this page load; verification is intentionally single-shot.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnToken]);

  function update(path, value) {
    setDraft((current) => {
      if (!path.includes(".")) return { ...current, [path]: value };
      const [group, field] = path.split(".");
      return { ...current, [group]: { ...current[group], [field]: value } };
    });
  }

  async function request(path, body) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error?.message || "No pudimos continuar. Inténtalo de nuevo.");
    return payload;
  }

  async function quoteRoute(event) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const result = await request("/api/registration/quote/", draft);
      if (result.state === "advisor_required") {
        setQuote(result); setDraft((current) => ({ ...current, step: 1 }));
      } else {
        setQuote(result); setDraft((current) => ({ ...current, step: 2 }));
      }
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  function continueToReview(event) {
    event.preventDefault();
    setError("");
    if (!draft.student.name || (!draft.student.email && !draft.student.phone)) {
      setError("Escribe el nombre del estudiante y al menos un email o teléfono.");
      return;
    }
    if (draft.separatePayer && (!draft.payer.name || (!draft.payer.email && !draft.payer.phone))) {
      setError("Completa el nombre y un medio de contacto para la persona que paga.");
      return;
    }
    if (quote?.fulfillment?.deliveryMode === "shipment") {
      const address = draft.shippingAddress;
      if (!address.recipientName || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
        setError("Completa la dirección de envío para el libro físico.");
        return;
      }
    }
    setDraft((current) => ({ ...current, step: 3 }));
  }

  async function beginCheckout() {
    setBusy(true); setError("");
    try {
      const result = await request("/api/registration/checkout/", {
        ...draft,
        sourceReference: `public-site:/inscribete:${programCode}`,
        shippingAddress: quote?.fulfillment?.deliveryMode === "shipment" ? draft.shippingAddress : undefined,
      });
      if (result.state === "advisor_required") {
        setQuote({ state: "advisor_required", reason: result.reason });
        setDraft((current) => ({ ...current, step: 1 }));
        return;
      }
      const target = new URL(result.checkoutUrl);
      if (target.protocol !== "https:" && target.hostname !== "localhost") throw new Error("El pago seguro no está disponible.");
      window.location.assign(target.toString());
    } catch (reason) { setError(reason.message); setBusy(false); }
  }

  async function verifyPayment(token = returnToken) {
    setBusy(true); setError(""); setPaymentState({ state: "verifying" });
    try {
      const result = await request("/api/registration/status/", { state: token });
      setPaymentState(result.result || { state: "verifying" });
      if (result.result?.state === "confirmed") sessionStorage.removeItem(REGISTRATION_DRAFT_KEY);
    } catch (reason) { setError(reason.message); setPaymentState({ state: "verifying" }); }
    finally { setBusy(false); }
  }

  function startNewRegistration() {
    sessionStorage.removeItem(REGISTRATION_DRAFT_KEY);
    window.location.assign(`/inscribete/?curso=${encodeURIComponent(programCode)}`);
  }

  if (returnToken) {
    return <PaymentStatusPanel state={paymentState} redirectState={redirectState} busy={busy} error={error} onVerify={() => verifyPayment()} onRestart={startNewRegistration} />;
  }

  return (
    <div className="registration-shell" data-registration-funnel>
      <section className="registration-intro" aria-labelledby="registration-title">
        <p className="section-kicker">Inscripción segura</p>
        <h1 id="registration-title">Empieza tu ruta en AIT USA</h1>
        <p>Confirma modalidad, datos y precio antes de abrir el pago seguro. AIT verifica el pago en su servidor; una redirección nunca cuenta como pago.</p>
        <ol className="registration-steps" aria-label="Progreso de inscripción">
          {["Tu ruta", "Estudiante y pago", "Revisar y pagar"].map((label, index) => (
            <li key={label} className={draft.step === index + 1 ? "is-current" : draft.step > index + 1 ? "is-complete" : ""}>
              <span>{index + 1}</span>{label}
            </li>
          ))}
        </ol>
        <div className="registration-trust">
          <strong>Sin datos de tarjeta en AIT</strong>
          <span>El pago se completa en la página alojada del proveedor.</span>
        </div>
      </section>

      <section className="registration-card" aria-live="polite">
        <label className="registration-honeypot" aria-hidden="true">Sitio web<input autoComplete="off" tabIndex={-1} value={draft.website} onChange={(event) => update("website", event.target.value)} /></label>
        {draft.step === 1 ? (
          <form onSubmit={quoteRoute}>
            <FormHeading number="01" title="Elige cómo estudiar" text={`Ruta seleccionada: ${courseLabel}. El precio final siempre lo calcula CRM.`} />
            <div className="registration-field-grid">
              <label>País de residencia<select value={draft.residenceCountryCode} onChange={(event) => { update("residenceCountryCode", event.target.value); update("billingCountryCode", event.target.value); }}>{COUNTRIES.map(([code, label]) => <option value={code} key={code}>{label}</option>)}</select></label>
              <label>Modalidad<select value={draft.learningModality} onChange={(event) => update("learningModality", event.target.value)}><option value="in_person">Presencial</option><option value="online">Online</option></select></label>
            </div>
            <label className="registration-check"><input type="checkbox" checked={draft.includeTuitionPrepayment} onChange={(event) => update("includeTuitionPrepayment", event.target.checked)} /><span><strong>Agregar las primeras cuatro semanas de matrícula</strong><small>Opcional. Se muestra como crédito no aplicado hasta confirmar tu grupo.</small></span></label>
            {quote?.state === "advisor_required" ? <AdvisorState /> : null}
            <FormError error={error} />
            <button className="button button--primary registration-next" disabled={busy || !ready} type="submit">{busy ? "Calculando…" : "Ver precio y continuar"}</button>
          </form>
        ) : null}

        {draft.step === 2 ? (
          <form onSubmit={continueToReview}>
            <FormHeading number="02" title="¿Quién estudia y quién paga?" text="Si ya entraste al Portal, usamos tu nombre y email como ayuda. CRM vuelve a verificar la identidad." />
            <IdentityFields legend="Datos del estudiante" prefix="student" value={draft.student} update={update} />
            <label className="registration-check"><input type="checkbox" checked={draft.separatePayer} onChange={(event) => update("separatePayer", event.target.checked)} /><span><strong>Otra persona realizará el pago</strong><small>El estudiante y la persona que paga quedarán vinculados por separado.</small></span></label>
            {draft.separatePayer ? <IdentityFields legend="Datos de la persona que paga" prefix="payer" value={draft.payer} update={update} /> : null}
            {quote?.fulfillment?.deliveryMode === "shipment" ? <AddressFields value={draft.shippingAddress} update={update} /> : <FulfillmentNote mode={quote?.fulfillment?.deliveryMode} />}
            <FormError error={error} />
            <div className="registration-actions"><button className="button button--ghost" type="button" onClick={() => update("step", 1)}>Atrás</button><button className="button button--primary" type="submit">Revisar inscripción</button></div>
          </form>
        ) : null}

        {draft.step === 3 ? (
          <div>
            <FormHeading number="03" title="Revisa antes de pagar" text="El monto y los conceptos vienen del CRM. AIT no acepta importes enviados por el navegador." />
            <QuoteSummary quote={quote?.quote} fulfillment={quote?.fulfillment} />
            <dl className="registration-review"><div><dt>Estudiante</dt><dd>{draft.student.name}<br /><small>{draft.student.email || draft.student.phone}</small></dd></div><div><dt>Modalidad</dt><dd>{draft.learningModality === "online" ? "Online" : "Presencial"}</dd></div></dl>
            <p className="registration-legal">Al continuar, serás enviado al pago seguro. La inscripción queda pendiente hasta que AIT confirme el pago directamente con el proveedor.</p>
            <FormError error={error} />
            <div className="registration-actions"><button className="button button--ghost" type="button" onClick={() => update("step", 2)}>Atrás</button><button className="button button--primary" type="button" disabled={busy} onClick={beginCheckout}>{busy ? "Preparando pago…" : "Ir al pago seguro"}</button></div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function FormHeading({ number, title, text }) { return <header className="registration-form-heading"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></header>; }
function FormError({ error }) { return error ? <p className="registration-error" role="alert">{error}</p> : null; }
function IdentityFields({ legend, prefix, value, update }) { return <fieldset className="registration-fieldset"><legend>{legend}</legend><div className="registration-field-grid"><label>Nombre completo<input autoComplete="name" value={value.name} onChange={(event) => update(`${prefix}.name`, event.target.value)} /></label><label>Email<input autoComplete="email" type="email" value={value.email} onChange={(event) => update(`${prefix}.email`, event.target.value)} /></label><label>Teléfono<input autoComplete="tel" type="tel" value={value.phone} onChange={(event) => update(`${prefix}.phone`, event.target.value)} /></label></div></fieldset>; }
function AddressFields({ value, update }) { return <fieldset className="registration-fieldset"><legend>Dirección para enviar el libro</legend><p className="registration-field-help">Solo la pedimos para estudiantes online dentro de Estados Unidos.</p><div className="registration-field-grid"><label>Nombre de quien recibe<input autoComplete="name" value={value.recipientName} onChange={(event) => update("shippingAddress.recipientName", event.target.value)} /></label><label>Dirección<input autoComplete="address-line1" value={value.addressLine1} onChange={(event) => update("shippingAddress.addressLine1", event.target.value)} /></label><label>Apartamento (opcional)<input autoComplete="address-line2" value={value.addressLine2} onChange={(event) => update("shippingAddress.addressLine2", event.target.value)} /></label><label>Ciudad<input autoComplete="address-level2" value={value.city} onChange={(event) => update("shippingAddress.city", event.target.value)} /></label><label>Estado<input autoComplete="address-level1" maxLength={2} value={value.state} onChange={(event) => update("shippingAddress.state", event.target.value.toUpperCase())} /></label><label>Código postal<input autoComplete="postal-code" value={value.postalCode} onChange={(event) => update("shippingAddress.postalCode", event.target.value)} /></label></div></fieldset>; }
function FulfillmentNote({ mode }) { const copy = mode === "digital" ? "Tu libro se entrega en formato digital. No pedimos dirección." : "Tu libro físico se recoge en AIT USA. No pedimos dirección de envío."; return <div className="registration-fulfillment"><strong>{mode === "digital" ? "Entrega digital" : "Recogida en sede"}</strong><p>{copy}</p></div>; }
function QuoteSummary({ quote, fulfillment }) { return <div className="registration-quote"><ul>{quote?.lines?.map((line) => <li key={line.code}><span>{line.label}</span><strong>{money(line.amount, line.currency)}</strong></li>)}</ul><div className="registration-quote__total"><span>Total</span><strong>{money(quote?.total, quote?.currency)}</strong></div><FulfillmentNote mode={fulfillment?.deliveryMode} /></div>; }
function AdvisorState() { return <div className="registration-advisor" role="status"><strong>Un asesor debe confirmar esta ruta</strong><p>No mostraremos un precio ni abriremos un pago hasta confirmar el programa o la región.</p><a className="button button--ghost" href="/contactanos/">Hablar con admisiones</a></div>; }

function PaymentStatusPanel({ state, redirectState, busy, error, onVerify, onRestart }) {
  const value = state?.state || "verifying";
  const confirmed = value === "confirmed";
  const stopped = ["failed", "cancelled", "expired"].includes(value);
  return <section className={`registration-status registration-status--${value}`} aria-live="polite">
    <span className="registration-status__mark" aria-hidden="true">{confirmed ? "✓" : stopped ? "!" : "…"}</span>
    <p className="section-kicker">Estado de inscripción</p>
    <h1>{confirmed ? "Pago confirmado" : stopped ? "El pago no quedó confirmado" : "Estamos verificando tu pago"}</h1>
    <p>{confirmed ? "AIT verificó el pago directamente con el proveedor. Tu inscripción ya puede continuar." : stopped ? "No registramos dinero. Puedes volver a intentarlo o pedir ayuda." : redirectState === "failed" || redirectState === "cancelled" ? "La página de pago regresó sin confirmación. CRM sigue siendo la fuente de verdad." : "La redirección no es una confirmación. Consultamos el estado guardado por CRM."}</p>
    {state?.quote ? <QuoteSummary quote={state.quote} fulfillment={state.fulfillment} /> : null}
    {error ? <FormError error={error} /> : null}
    <div className="registration-actions">{!confirmed ? <button className="button button--primary" disabled={busy} type="button" onClick={onVerify}>{busy ? "Verificando…" : "Verificar de nuevo"}</button> : <a className="button button--primary" href="/portal/">Ir al Portal</a>}{!confirmed && (stopped || redirectState === "failed" || redirectState === "cancelled") ? <button className="button button--ghost" type="button" onClick={onRestart}>Nueva solicitud</button> : null}<a className="button button--ghost" href="/contactanos/">Necesito ayuda</a></div>
  </section>;
}
