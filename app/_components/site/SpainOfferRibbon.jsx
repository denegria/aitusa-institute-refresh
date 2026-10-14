"use client";

import { useEffect, useRef, useState } from "react";

const OFFER = "30% de descuento para nuevos alumnos y 10% adicional para parejas y grupos";

export function SpainOfferRibbon() {
  const viewportRef = useRef(null);
  const pausedRef = useRef(false);
  const interactionHeldRef = useRef(false);
  const interactionTimerRef = useRef(null);
  const motionTimerRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let phase = "initial";
    let phaseStarted = performance.now();
    let lastFrame = phaseStarted;
    const initialDwell = 700;
    // Preserve the finite pass at 75% of its previous speed.
    const traversalDuration = 4000 / 0.75;

    const holdForInteraction = () => {
      if (reducedMotion.matches) return;
      // Once a visitor touches, swipes, wheels, or uses the keyboard, preserve
      // their position instead of letting the finite auto pass overwrite it.
      phase = "done";
      interactionHeldRef.current = true;
      pausedRef.current = true;
      window.clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = window.setTimeout(() => {
        interactionHeldRef.current = false;
        pausedRef.current = false;
      }, 1600);
    };

    const tick = (now) => {
      if (reducedMotion.matches || pausedRef.current) {
        lastFrame = now;
        return;
      }
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      if (maxScroll === 0) {
        lastFrame = now;
        return;
      }
      if (phase === "initial" && now - phaseStarted < initialDwell) {
        return;
      }
      if (phase === "initial") {
        phase = "moving";
        phaseStarted = now;
        lastFrame = now;
      }
      if (phase === "moving") {
        const progress = Math.min(1, (now - phaseStarted) / traversalDuration);
        viewport.scrollLeft = Math.round(maxScroll * progress);
        if (progress >= 1) {
          viewport.scrollLeft = maxScroll;
          phase = "done";
        }
      }
      lastFrame = now;
    };

    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        pausedRef.current = true;
        viewport.scrollLeft = 0;
        phase = "initial";
        phaseStarted = performance.now();
        lastFrame = performance.now();
      } else {
        pausedRef.current = interactionHeldRef.current;
        lastFrame = performance.now();
      }
    };
    const onKeyDown = (event) => {
      holdForInteraction();
      if (event.key === "Home") {
        event.preventDefault();
        viewport.scrollLeft = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        viewport.scrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        viewport.scrollLeft = Math.max(0, viewport.scrollLeft - viewport.clientWidth * 0.7);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        viewport.scrollLeft = Math.min(viewport.scrollWidth - viewport.clientWidth, viewport.scrollLeft + viewport.clientWidth * 0.7);
      }
    };

    viewport.addEventListener("pointerdown", holdForInteraction, { passive: true });
    viewport.addEventListener("touchstart", holdForInteraction, { passive: true });
    viewport.addEventListener("wheel", holdForInteraction, { passive: true });
    viewport.addEventListener("keydown", onKeyDown);
    reducedMotion.addEventListener?.("change", onReducedMotionChange);
    motionTimerRef.current = window.setInterval(() => tick(performance.now()), 32);

    return () => {
      window.clearTimeout(interactionTimerRef.current);
      window.clearInterval(motionTimerRef.current);
      viewport.removeEventListener("pointerdown", holdForInteraction);
      viewport.removeEventListener("touchstart", holdForInteraction);
      viewport.removeEventListener("wheel", holdForInteraction);
      viewport.removeEventListener("keydown", onKeyDown);
      reducedMotion.removeEventListener?.("change", onReducedMotionChange);
    };
  }, []);

  return (
    <div className="approved-hero__offer" aria-label="Oferta para nuevos alumnos">
      <span className="approved-hero__spain-location">
        <i data-lucide="globe-2" aria-hidden="true" />ESPAÑA<span className="approved-hero__spain-online"> · ONLINE</span>
      </span>
      <span className="approved-hero__offer-divider" aria-hidden="true" />
      <div className="approved-hero__offer-viewport" ref={viewportRef} tabIndex="0" role="region" aria-label={OFFER}>
        <p className="approved-hero__offer-copy">{OFFER}</p>
      </div>
    </div>
  );
}
