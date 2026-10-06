"use client";

import { useEffect, useState } from "react";
import { isPricedRegistrationChoice, migrateUnsubmittedSpanishDraft, needsLegacySpanishDraftReconciliation, registrationSelectionForContext, REGISTRATION_DRAFT_KEY, SPANISH_ONLINE_PROGRAM_CODE } from "../../../src/registration/contract.js";
import { hasReviewableQuote, loadRegistrationQuoteOptions, quoteForSelection } from "../../../src/registration/quoteOptions.js";

const INITIAL_DRAFT = Object.freeze({
  step: 1,
  entryContext: "general",
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
const DEFAULT_COURSE_OPTIONS = [{ code: "english_program", label: "Inglés" }];

function idempotencyKey() {
  return `public:${crypto.randomUUID()}`;
}

function money(value, currency = "USD") {
  return new Intl.NumberFormat("es-US", { style: "currency", currency }).format(Number(value));
}

function learnerLineLabel(line) {
  const labels = {
    registration_book_bundle: "Inscripción y libro",
    tuition_prepayment_four_week: "Anticipo de cuatro semanas de matrícula",
  };
  return labels[line.code] || line.label;
}

function mergeDraft(saved, initialProgramCode, initialLearningModality, entryContext) {
  const compatible = saved?.entryContext === entryContext || (entryContext === "general" && !saved?.entryContext);
  const restored = compatible ? saved : null;
  return {
    ...INITIAL_DRAFT,
    ...restored,
    entryContext,
    programCode: restored?.programCode || initialProgramCode,
    learningModality: restored?.learningModality || initialLearningModality,
    idempotencyKey: restored?.idempotencyKey || idempotencyKey(),
    startedAt: restored?.startedAt || Date.now(),
    student: { ...INITIAL_DRAFT.student, ...restored?.student },
    payer: { ...INITIAL_DRAFT.payer, ...restored?.payer },
    shippingAddress: { ...INITIAL_DRAFT.shippingAddress, ...restored?.shippingAddress },
  };
}

export function RegistrationExperience({
  courseOptions = DEFAULT_COURSE_OPTIONS,
  initialProgramCode = "english_program",
  initialLearningModality = "in_person",
  entryContext = "general",
  returnToken = "",
  redirectState = "",
}) {
  const [draft, setDraft] = useState(() => ({ ...INITIAL_DRAFT, programCode: initialProgramCode, learningModality: initialLearningModality, entryContext }));
  const [ready, setReady] = useState(false);
  const [quote, setQuote] = useState(null);
  const [quoteOptions, setQuoteOptions] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paymentState, setPaymentState] = useState(null);
  const [legacyDraftReview, setLegacyDraftReview] = useState(null);
  const [portalPlacement, setPortalPlacement] = useState(null);
  const [portalStudentEmail, setPortalStudentEmail] = useState("");

  useEffect(() => {
    let active = true;
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(REGISTRATION_DRAFT_KEY) || "null"); } catch { saved = null; }
    const restored = mergeDraft(saved, initialProgramCode, initialLearningModality, entryContext);
    function finishRestore() {
      if (!active) return;
      setLegacyDraftReview(null);
      if (!courseOptions.some(({ code }) => code === restored.programCode)) {
        restored.programCode = initialProgramCode;
        restored.learningModality = initialLearningModality;
        restored.step = 1;
      }
      if (restored.programCode !== "english_program") {
        const requiredModality = registrationSelectionForContext(restored.programCode).learningModality;
        if (restored.learningModality !== requiredModality) {
          restored.learningModality = requiredModality;
          restored.step = 1;
          restored.includeTuitionPrepayment = false;
          restored.idempotencyKey = idempotencyKey();
        }
      } else if (!["in_person", "hybrid", "online"].includes(restored.learningModality)) restored.learningModality = initialLearningModality;
      if (restored.programCode !== "english_program" || restored.learningModality !== "online") {
        if (restored.residenceCountryCode !== "US" || restored.billingCountryCode !== "US") {
          restored.step = 1;
          restored.includeTuitionPrepayment = false;
          restored.idempotencyKey = idempotencyKey();
        }
        restored.residenceCountryCode = "US";
        restored.billingCountryCode = "US";
      }
      if (!isPricedRegistrationChoice(restored.programCode, restored.learningModality, restored.residenceCountryCode, restored.billingCountryCode)) {
        restored.step = 1;
        restored.includeTuitionPrepayment = false;
      }
      setDraft(restored);
      if (restored.step > 1 && !returnToken) {
        setQuoteLoading(true);
        const restoredPricing = restored.includeTuitionPrepayment
          ? loadRegistrationQuoteOptions((selection) => request("/api/registration/quote/", selection), restored)
          : request("/api/registration/quote/", { ...restored, includeTuitionPrepayment: false })
            .then((base) => ({ base, withPrepayment: null, prepaymentLine: null }));
        restoredPricing
          .then((options) => {
            if (!active) return;
            setQuoteOptions(options);
            if (options.base.state === "advisor_required") {
              setQuote(options.base);
              setDraft((current) => ({ ...current, step: 1 }));
            } else if (quoteForSelection(options, restored.includeTuitionPrepayment)) {
              const result = quoteForSelection(options, restored.includeTuitionPrepayment);
              setQuote(result);
            } else {
              throw new Error("No pudimos actualizar el precio. Confirma tu ruta para intentarlo de nuevo.");
            }
          })
          .catch((reason) => {
            if (!active) return;
            setQuote(null);
            setError(reason.message || "No pudimos actualizar el precio. Confirma tu ruta para intentarlo de nuevo.");
            setDraft((current) => ({ ...current, step: 1 }));
          })
          .finally(() => { if (active) setQuoteLoading(false); });
      }
      setReady(true);
    }
    if (!returnToken && needsLegacySpanishDraftReconciliation(saved)) {
      setLegacyDraftReview({ state: "checking" });
      request("/api/registration/reconcile/", { idempotencyKey: saved.idempotencyKey })
        .then((result) => {
          if (!active) return;
          if (result.exists === true) setLegacyDraftReview({ state: "blocked", paymentState: result.state });
          else if (result.exists === false) {
            setDraft(migrateUnsubmittedSpanishDraft(restored, saved));
            setLegacyDraftReview(null);
            setReady(true);
          }
          else throw new Error("No pudimos verificar la inscripción anterior.");
        })
        .catch(() => { if (active) setLegacyDraftReview({ state: "unavailable" }); });
    } else finishRestore();
    fetch("/api/registration/prefill/", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((body) => {
        if (!body?.authenticated || !body.student) return;
        setPortalStudentEmail(body.student.email || "");
        setPortalPlacement(body.placement ? { ...body.placement, email: body.student.email } : null);
        setDraft((current) => ({
          ...current,
          student: {
            ...current.student,
            name: current.student.name || body.student.name || "",
            email: current.student.email || body.student.email || "",
          },
        }));
      }).catch(() => {});
    return () => { active = false; };
  }, [courseOptions, initialProgramCode, initialLearningModality, entryContext, returnToken]);

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

  useEffect(() => {
    if (!ready || returnToken || draft.step !== 1) return;
    let active = true;
    if (!isPricedRegistrationChoice(draft.programCode, draft.learningModality, draft.residenceCountryCode, draft.billingCountryCode)) return;
    setQuoteLoading(true);
    setError("");
    loadRegistrationQuoteOptions((selection) => request("/api/registration/quote/", selection), draft)
      .then((options) => {
        if (!active) return;
        setQuoteOptions(options);
        setQuote(options.base.state === "advisor_required" ? options.base : quoteForSelection(options, draft.includeTuitionPrepayment));
      })
      .catch((reason) => {
        if (!active) return;
        setQuote(null); setQuoteOptions(null);
        setError(reason.message || "No pudimos confirmar el precio. Inténtalo de nuevo.");
      })
      .finally(() => { if (active) setQuoteLoading(false); });
    return () => { active = false; };
  }, [ready, returnToken, draft.step, draft.programCode, draft.learningModality, draft.residenceCountryCode, draft.billingCountryCode]);

  function update(path, value) {
    if (["residenceCountryCode", "billingCountryCode", "learningModality"].includes(path)) {
      setQuote(null);
      setQuoteOptions(null);
    }
    setDraft((current) => {
      if (path === "residenceCountryCode" || path === "billingCountryCode") return { ...current, [path]: value, includeTuitionPrepayment: false };
      if (path === "learningModality") return {
        ...current,
        learningModality: value,
        residenceCountryCode: value === "online" ? current.residenceCountryCode : "US",
        billingCountryCode: value === "online" ? current.billingCountryCode : "US",
        includeTuitionPrepayment: false,
      };
      if (!path.includes(".")) return { ...current, [path]: value };
      const [group, field] = path.split(".");
      return { ...current, [group]: { ...current[group], [field]: value } };
    });
  }

  function selectCourse(programCode) {
    setQuote(null); setQuoteOptions(null); setError("");
    setDraft((current) => ({
      ...current,
      programCode,
      learningModality: registrationSelectionForContext(programCode).learningModality,
      residenceCountryCode: "US",
      billingCountryCode: "US",
      includeTuitionPrepayment: false,
      idempotencyKey: idempotencyKey(),
      step: 1,
    }));
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
    if (!isPricedRegistrationChoice(draft.programCode, draft.learningModality, draft.residenceCountryCode, draft.billingCountryCode)) return;
    setBusy(true); setError(""); setQuote(null); setQuoteOptions(null);
    try {
      const options = await loadRegistrationQuoteOptions((selection) => request("/api/registration/quote/", selection), draft);
      setQuoteOptions(options);
      if (options.base.state === "advisor_required") {
        setQuote(options.base); setDraft((current) => ({ ...current, step: 1 }));
      } else if (quoteForSelection(options, draft.includeTuitionPrepayment)) {
        setQuote(quoteForSelection(options, draft.includeTuitionPrepayment));
        setDraft((current) => ({ ...current, step: 2 }));
      } else {
        throw new Error("No pudimos confirmar el precio. Inténtalo de nuevo.");
      }
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  function selectTuitionPrepayment(includeTuitionPrepayment) {
    const result = quoteForSelection(quoteOptions, includeTuitionPrepayment);
    if (!result) {
      setError("No pudimos confirmar el anticipo. Puedes continuar con la inscripción y el libro.");
      return;
    }
    setError("");
    setQuote(result);
    setDraft((current) => ({ ...current, includeTuitionPrepayment }));
  }

  function continueToReview(event) {
    event.preventDefault();
    setError("");
    if (!hasReviewableQuote(quote)) {
      setError("Actualiza el precio antes de continuar.");
      return;
    }
    if (!draft.student.name || (!draft.student.email && !draft.student.phone)) {
      setError("Escribe el nombre del estudiante y al menos un email o teléfono.");
      return;
    }
    if (draft.programCode === "english_program" && !draft.student.email.trim()) {
      setError("Escribe el email del estudiante para vincular su prueba de nivel.");
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
    if (!hasReviewableQuote(quote)) {
      setError("Actualiza el precio antes de ir al pago seguro.");
      return;
    }
    setBusy(true); setError("");
    try {
      const result = await request("/api/registration/checkout/", {
        ...draft,
        sourceReference: `public-site:/inscribete:${draft.programCode}`,
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
    const course = draft.programCode === "english_program"
      ? draft.learningModality === "online" ? "ingles-online-adultos" : draft.learningModality === "hybrid" ? "ingles-hibrido-adultos" : "ingles-jovenes-adultos"
      : draft.programCode;
    window.location.assign(`/inscribete/?curso=${encodeURIComponent(course)}`);
  }

  if (returnToken) {
    return <PaymentStatusPanel state={paymentState} redirectState={redirectState} busy={busy} error={error} onVerify={() => verifyPayment()} onRestart={startNewRegistration} />;
  }

  if (legacyDraftReview) return <section className="registration-status" role="status" aria-live="polite">
    <p className="section-kicker">Inscripción</p>
    <h1>{legacyDraftReview.state === "checking" ? "Revisando tu inscripción anterior" : "Revisemos tu inscripción anterior"}</h1>
    <p>{legacyDraftReview.state === "checking"
      ? "Consultamos si ya existe una solicitud de pago antes de actualizar la modalidad de Español a online."
      : legacyDraftReview.state === "unavailable"
        ? "No pudimos verificar la solicitud anterior. Para evitar un pago duplicado, no abriremos otro pago ahora."
        : legacyDraftReview.paymentState === "confirmed"
          ? "Ya existe un pago confirmado para esta inscripción. Admisiones puede ayudarte a ajustar la modalidad a online."
          : "Ya existe una solicitud de pago para esta inscripción. Admisiones debe revisar su estado y la modalidad antes de abrir otro pago."}</p>
    {legacyDraftReview.state !== "checking" ? <a className="button button--primary" href="/contactanos/?curso=espanol-extranjeros">Hablar con admisiones</a> : null}
  </section>;

  const reviewable = hasReviewableQuote(quote);
  const courseName = draft.programCode === "english_program"
    ? "Inglés" : courseOptions.find(({ code }) => code === draft.programCode)?.label || "Curso seleccionado";
  const modalityLabel = draft.learningModality === "online" ? "Online" : draft.learningModality === "hybrid" ? "Híbrido" : "Presencial";
  const courseLabel = `${courseName} · ${modalityLabel.toLowerCase()}`;
  const pricedRoute = isPricedRegistrationChoice(draft.programCode, draft.learningModality, draft.residenceCountryCode, draft.billingCountryCode);
  const inquiryCourse = draft.programCode === "english_program"
    ? draft.learningModality === "online" ? "ingles-online-adultos" : draft.learningModality === "hybrid" ? "ingles-hibrido-adultos" : "ingles-jovenes-adultos"
    : draft.programCode;
  const inquiryLabel = courseLabel;
  const linkedPlacement = draft.programCode === "english_program"
    && portalPlacement?.email?.toLowerCase() === draft.student.email.trim().toLowerCase()
    ? portalPlacement : null;
  const stepTitles = ["Elige cómo estudiar", "Completa tus datos", "Revisa antes de pagar"];
  return (
    <div className={`registration-shell registration-shell--step-${draft.step}`} data-registration-funnel>
      <header className="registration-intro">
        <div className="registration-intro__copy">
          <p className="section-kicker">Inscripción</p>
          <h1 id="registration-title">{stepTitles[draft.step - 1]}</h1>
        </div>
        <ol className="registration-steps" aria-label="Progreso de inscripción">
          {["Ruta", "Datos", "Revisar"].map((label, index) => (
            <li key={label} aria-current={draft.step === index + 1 ? "step" : undefined} className={draft.step === index + 1 ? "is-current" : draft.step > index + 1 ? "is-complete" : ""}>
              <span>{index + 1}</span>{label}
            </li>
          ))}
        </ol>
      </header>

      <label className="registration-honeypot" aria-hidden="true">Sitio web<input autoComplete="off" tabIndex={-1} value={draft.website} onChange={(event) => update("website", event.target.value)} /></label>
      {draft.step === 1 ? (
        <section className="registration-card registration-card--route" aria-labelledby="registration-title">
          <form onSubmit={quoteRoute}>
            <div className={`registration-field-grid registration-field-grid--route ${draft.programCode !== "english_program" ? "is-single" : draft.learningModality === "online" ? "is-online" : "is-dual"}`}>
              <label>Curso<select value={draft.programCode} disabled={busy || quoteLoading} onChange={(event) => selectCourse(event.target.value)}>{courseOptions.map(({ code, label }) => <option value={code} key={code}>{label}</option>)}</select></label>
              {draft.programCode === "english_program" ? <>
                <label>Modalidad<select value={draft.learningModality} disabled={busy || quoteLoading} onChange={(event) => update("learningModality", event.target.value)}><option value="in_person">Presencial</option><option value="hybrid">Híbrido</option><option value="online">Online</option></select></label>
              </> : null}
              {draft.programCode === "english_program" && draft.learningModality === "online" ? <label>País de residencia<select value={draft.residenceCountryCode} disabled={busy || quoteLoading} onChange={(event) => { update("residenceCountryCode", event.target.value); update("billingCountryCode", event.target.value); }}>{COUNTRIES.map(([code, label]) => <option value={code} key={code}>{label}</option>)}</select></label> : null}
            </div>
            {draft.programCode === SPANISH_ONLINE_PROGRAM_CODE ? <p className="registration-route-note">Español online · inscripción disponible para residentes en Estados Unidos.</p> : null}
            {draft.programCode === "english_program" && draft.learningModality === "online" ? <p className="registration-route-note">¿Tu país no aparece? <a href={`/contactanos/?curso=${encodeURIComponent(inquiryCourse)}`}>Consulta tu inscripción con admisiones.</a></p> : null}
            {pricedRoute ? <label className="registration-check registration-check--tuition"><input type="checkbox" checked={draft.includeTuitionPrepayment} disabled={busy || quoteLoading || (!quoteOptions?.prepaymentLine && !draft.includeTuitionPrepayment)} onChange={(event) => selectTuitionPrepayment(event.target.checked)} /><span><strong>Anticipar cuatro semanas de matrícula{quoteOptions?.prepaymentLine ? ` · ${money(quoteOptions.prepaymentLine.amount, quoteOptions.prepaymentLine.currency)}` : ""}</strong><small>Opcional y adicional a la inscripción y el libro. Queda como crédito para la matrícula al confirmar tu grupo.</small>{quoteLoading ? <small role="status">Consultando el precio del anticipo.</small> : !quoteOptions?.prepaymentLine ? <small>El anticipo no está disponible para añadirlo ahora. Puedes continuar con la inscripción y el libro o consultar con admisiones.</small> : null}</span></label> : null}
            {quote?.state === "advisor_required" ? <AdvisorState course={inquiryCourse} /> : null}
            <FormError error={error} />
            {pricedRoute ? <button className="button button--primary registration-next" disabled={busy || quoteLoading || !ready} type="submit">{busy ? "Calculando…" : "Ver precio y continuar"}</button>
              : <div className="registration-route-handoff"><p>Esta combinación de curso y país necesita confirmación de admisiones antes del pago.</p><a className="button button--primary registration-next" href={`/contactanos/?curso=${encodeURIComponent(inquiryCourse)}`}>Consultar inscripción</a></div>}
          </form>
        </section>
      ) : null}

      {draft.step > 1 && quoteLoading ? <div className="registration-quote-loading" role="status">Actualizando el precio de tu inscripción…</div> : null}

      {draft.step === 2 && !quoteLoading && reviewable ? (
        <div className="registration-checkout">
          <section className="registration-card" aria-labelledby="registration-title">
            <form onSubmit={continueToReview}>
              <IdentityFields legend="Estudiante" prefix="student" value={draft.student} update={update} requireEmail={draft.programCode === "english_program"} intro={<div className="registration-portal-choice">
                <strong>Estudiante</strong>
                {portalStudentEmail ? <span>{portalStudentEmail.toLowerCase() === draft.student.email.trim().toLowerCase()
                  ? "Portal conectado" : `Para vincular tu cuenta, usa ${portalStudentEmail} como email del estudiante.`}</span>
                  : <a href={`/portal/sign-in/?returnTo=${encodeURIComponent(entryContext === "general" ? "/inscribete/" : `/inscribete/?curso=${entryContext}`)}`} onClick={() => sessionStorage.setItem(REGISTRATION_DRAFT_KEY, JSON.stringify(draft))}>Entrar al Portal <small>(opcional)</small></a>}
              </div>} />
              {draft.programCode === "english_program" ? <div className="registration-placement-note">
                {linkedPlacement ? <><strong>{linkedPlacement.status === "confirmed" ? "Nivel confirmado por AIT" : "Nivel recomendado"}</strong><span>{linkedPlacement.levelLabel}{linkedPlacement.status !== "confirmed" ? " · AIT confirmará el nivel final" : ""}</span></>
                  : <><strong>Prueba de nivel pendiente</strong><span>Podrás hacerla después del pago.</span></>}
              </div> : null}

              <label className="registration-check"><input type="checkbox" checked={draft.separatePayer} onChange={(event) => update("separatePayer", event.target.checked)} /><span><strong>Otra persona pagará</strong>{draft.separatePayer ? <small>Registraremos sus datos por separado.</small> : null}</span></label>
              {draft.separatePayer ? <IdentityFields legend="Persona que paga" prefix="payer" value={draft.payer} update={update} /> : null}
              {quote?.fulfillment?.deliveryMode === "shipment" ? <AddressFields value={draft.shippingAddress} update={update} /> : null}
              <FormError error={error} />
              <div className="registration-actions"><button className="button button--ghost" type="button" disabled={busy} onClick={() => update("step", 1)}>Atrás</button><button className="button button--primary" type="submit" disabled={busy}>Revisar inscripción</button></div>
            </form>
          </section>
          <OrderSummary quote={quote.quote} fulfillment={quote.fulfillment} courseLabel={courseLabel} stage="details" />
        </div>
      ) : null}

      {draft.step === 3 && !quoteLoading && reviewable ? (
        <div className="registration-checkout">
          <section className="registration-card" aria-labelledby="registration-title">
            <dl className="registration-review">
              <div><dt>Estudiante</dt><dd>{draft.student.name}<br /><small>{draft.student.email || draft.student.phone}</small></dd></div>
              <div><dt>Curso</dt><dd>{courseName}</dd></div>
              {draft.programCode === "english_program" ? <div><dt>Modalidad</dt><dd>{modalityLabel}</dd></div> : null}
              {draft.programCode === "english_program" ? <div><dt>Nivel</dt><dd>{linkedPlacement?.levelLabel || "Prueba pendiente"}<br /><small>{linkedPlacement?.status === "confirmed" ? "Confirmado por AIT" : linkedPlacement ? "AIT confirmará el nivel final" : "Podrás hacer la prueba después del pago"}</small></dd></div> : null}
              {draft.separatePayer ? <div><dt>Persona que paga</dt><dd>{draft.payer.name}<br /><small>{draft.payer.email || draft.payer.phone}</small></dd></div> : null}
              {quote.fulfillment.deliveryMode === "shipment" ? <div><dt>Envío</dt><dd>{draft.shippingAddress.addressLine1}<br /><small>{draft.shippingAddress.city}, {draft.shippingAddress.state} {draft.shippingAddress.postalCode}</small></dd></div> : null}
            </dl>
            <p className="registration-legal">El pago se abre en una página segura. AIT confirma el pago antes de continuar con tu nivel y grupo, si aplica.</p>
            <FormError error={error} />
            <div className="registration-actions"><button className="button button--ghost" type="button" onClick={() => update("step", 2)}>Editar datos</button><button className="button button--primary" type="button" disabled={busy || !reviewable} onClick={beginCheckout}>{busy ? "Preparando pago…" : "Ir al pago seguro"}</button></div>
          </section>
          <OrderSummary quote={quote.quote} fulfillment={quote.fulfillment} courseLabel={courseLabel} stage="review" />
        </div>
      ) : null}
    </div>
  );
}

function FormError({ error }) { return error ? <p className="registration-error" role="alert">{error}</p> : null; }
function IdentityFields({ legend, prefix, value, update, requireEmail = false, intro = null }) {
  return <fieldset className="registration-fieldset registration-fieldset--identity">
    <legend className={intro ? "registration-visually-hidden" : undefined}>{legend}</legend>
    {intro}
    <div className="registration-field-grid">
      <label>Nombre completo<input autoComplete="name" value={value.name} onChange={(event) => update(`${prefix}.name`, event.target.value)} /></label>
      <label>Email{requireEmail ? " del estudiante" : ""}<input autoComplete="email" type="email" required={requireEmail} value={value.email} onChange={(event) => update(`${prefix}.email`, event.target.value)} /></label>
      <label>Teléfono{requireEmail ? " (opcional)" : ""}<input autoComplete="tel" type="tel" value={value.phone} onChange={(event) => update(`${prefix}.phone`, event.target.value)} /></label>
    </div>
  </fieldset>;
}
function AddressFields({ value, update }) { return <fieldset className="registration-fieldset"><legend>Dirección para enviar el libro</legend><p className="registration-field-help">Solo la pedimos para estudiantes online dentro de Estados Unidos.</p><div className="registration-field-grid"><label>Nombre de quien recibe<input autoComplete="name" value={value.recipientName} onChange={(event) => update("shippingAddress.recipientName", event.target.value)} /></label><label>Dirección<input autoComplete="address-line1" value={value.addressLine1} onChange={(event) => update("shippingAddress.addressLine1", event.target.value)} /></label><label>Apartamento (opcional)<input autoComplete="address-line2" value={value.addressLine2} onChange={(event) => update("shippingAddress.addressLine2", event.target.value)} /></label><label>Ciudad<input autoComplete="address-level2" value={value.city} onChange={(event) => update("shippingAddress.city", event.target.value)} /></label><label>Estado<input autoComplete="address-level1" maxLength={2} value={value.state} onChange={(event) => update("shippingAddress.state", event.target.value.toUpperCase())} /></label><label>Código postal<input autoComplete="postal-code" value={value.postalCode} onChange={(event) => update("shippingAddress.postalCode", event.target.value)} /></label></div></fieldset>; }
function FulfillmentNote({ mode }) {
  const note = mode === "digital"
    ? { title: "Entrega digital", copy: "Tu libro se entrega en formato digital. No pedimos dirección." }
    : mode === "shipment"
      ? { title: "Envío a domicilio", copy: "Tu libro físico se enviará a la dirección de Estados Unidos que confirmaste." }
      : { title: "Recogida en sede", copy: "Tu libro físico se recoge en AIT USA. No pedimos dirección de envío." };
  return <div className="registration-fulfillment"><strong>{note.title}</strong><p>{note.copy}</p></div>;
}
function QuoteSummary({ quote, fulfillment }) { return <div className="registration-quote"><ul>{quote?.lines?.map((line) => <li key={line.code}><span>{learnerLineLabel(line)}</span><strong>{money(line.amount, line.currency)}</strong></li>)}</ul><div className="registration-quote__total"><span>Total</span><strong>{money(quote?.total, quote?.currency)}</strong></div><FulfillmentNote mode={fulfillment?.deliveryMode} /></div>; }
function OrderSummary({ quote, fulfillment, courseLabel, stage }) {
  const deliveryLabel = fulfillment?.deliveryMode === "digital" ? "Entrega digital"
    : fulfillment?.deliveryMode === "shipment" ? "Envío a domicilio" : "Recogida en sede";
  const lineCount = quote?.lines?.length ?? 0;
  const registrationLine = quote?.lines?.find((line) => line.code === "registration_book_bundle");
  const includesPrepayment = quote?.lines?.some((line) => line.code === "tuition_prepayment_four_week");
  const tuitionNote = includesPrepayment ? "Incluye el anticipo de cuatro semanas de matrícula seleccionado." : "La matrícula de las clases se paga por separado.";
  const [detailsOpen, setDetailsOpen] = useState(stage === "review" || lineCount > 1);
  useEffect(() => { setDetailsOpen(stage === "review" || lineCount > 1); }, [stage, lineCount]);
  return <aside className={`registration-order registration-order--${stage}`} aria-label="Tu pedido">
    <div className="registration-order__desktop">
      <h2>Tu pedido</h2>
      <p className="registration-order__program">{courseLabel}</p>
      <QuoteSummary quote={quote} fulfillment={fulfillment} />
      <p className="registration-order__tuition">{tuitionNote}</p>
      <p className="registration-order__secure">Sin datos de tarjeta en AIT. El pago se abre en la página segura del proveedor.</p>
    </div>
    <details className="registration-order__mobile" open={detailsOpen} onToggle={(event) => setDetailsOpen(event.currentTarget.open)}>
      <summary>
        <span><strong>{registrationLine ? `Inscripción y libro · ${money(registrationLine.amount, registrationLine.currency)}` : "Tu pedido"}</strong><small>{courseLabel} · {deliveryLabel}</small><small>{tuitionNote}</small></span>
        <span className="registration-order__mobile-total">
          <strong>{money(quote?.total, quote?.currency)}</strong>
          <small className="registration-order__expand">Ver detalle</small>
          <small className="registration-order__collapse">Ocultar detalle</small>
        </span>
      </summary>
      <QuoteSummary quote={quote} fulfillment={fulfillment} />
    </details>
  </aside>;
}
function AdvisorState({ course }) { return <div className="registration-advisor" role="status"><strong>Un asesor debe confirmar esta ruta</strong><p>No mostraremos un precio ni abriremos un pago hasta confirmar el programa o la región.</p><a className="button button--ghost" href={`/contactanos/?curso=${encodeURIComponent(course)}`}>Hablar con admisiones</a></div>; }

function PaymentStatusPanel({ state, redirectState, busy, error, onVerify, onRestart }) {
  const value = state?.state || "verifying";
  const confirmed = value === "confirmed";
  const stopped = ["failed", "cancelled", "expired"].includes(value);
  const needsEnglishPlacement = confirmed && state?.programCode === "english_program" && state?.registration?.placement === "not_started";
  return <section className={`registration-status registration-status--${value}`} aria-live="polite">
    <span className="registration-status__mark" aria-hidden="true">{confirmed ? "✓" : stopped ? "!" : "…"}</span>
    <p className="section-kicker">Estado de inscripción</p>
    <h1>{confirmed ? "Pago confirmado" : stopped ? "El pago no quedó confirmado" : "Estamos verificando tu pago"}</h1>
    <p>{confirmed ? needsEnglishPlacement ? "AIT confirmó el pago. Haz la prueba de nivel con el mismo email del estudiante para vincular el resultado; un asesor confirmará tu nivel y grupo." : "AIT confirmó el pago. Tu nivel y grupo, si aplica, se coordinan por separado." : stopped ? "No registramos dinero. Puedes volver a intentarlo o pedir ayuda." : redirectState === "failed" || redirectState === "cancelled" ? "La página de pago regresó sin confirmación. CRM sigue siendo la fuente de verdad." : "La redirección no es una confirmación. Consultamos el estado guardado por CRM."}</p>
    {state?.quote ? <QuoteSummary quote={state.quote} fulfillment={state.fulfillment} /> : null}
    {error ? <FormError error={error} /> : null}
    <div className="registration-actions">{!confirmed ? <button className="button button--primary" disabled={busy} type="button" onClick={onVerify}>{busy ? "Verificando…" : "Verificar de nuevo"}</button> : needsEnglishPlacement ? <a className="button button--primary" href="/placement-test/">Hacer la prueba de nivel</a> : <a className="button button--primary" href="/portal/">Ir al Portal</a>}{!confirmed && (stopped || redirectState === "failed" || redirectState === "cancelled") ? <button className="button button--ghost" type="button" onClick={onRestart}>Nueva solicitud</button> : null}<a className="button button--ghost" href="/contactanos/">Necesito ayuda</a></div>
  </section>;
}
