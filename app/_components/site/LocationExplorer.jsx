"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const mapFocus = {
  "bound-brook": { x: 70, y: 50, targetX: 50, targetY: 50, scale: 1.75 },
  plainfield: { x: 88, y: 33, targetX: 78, targetY: 50, scale: 2.05 },
  piscataway: { x: 83, y: 45, targetX: 70, targetY: 50, scale: 1.9 },
  flemington: { x: 15, y: 64, targetX: 24, targetY: 37, scale: 1.75 },
};

function MapPin({ location, index, selected, onSelect }) {
  const id = location.mapKey || `location-${index + 1}`;
  return (
    <button
      className={`real-map-pin real-map-pin--${id}${selected ? " is-active" : ""}`}
      type="button"
      aria-label={`Enfocar ${location.city} en el mapa`}
      aria-pressed={selected}
      onClick={() => onSelect(index, true)}
    >
      <i data-lucide="map-pin" aria-hidden="true" />
      <strong>{String(index + 1).padStart(2, "0")}</strong>
    </button>
  );
}

function LocationRow({ location, index, selected, onSelect, whatsappHref }) {
  const statusLabel = {
    active: location.note?.includes("principal") ? "Principal" : "Presencial",
    limited: "Con cita",
  };
  const limited = location.status === "limited";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
  const href = limited
    ? `${whatsappHref}?text=${encodeURIComponent(`Hola AIT USA, quiero consultar la atención con cita previa en ${location.city}.`)}`
    : mapsHref;
  const shortCity = location.city.split(",")[0];
  const supportingText = limited
    ? "Atención disponible con coordinación previa"
    : location.address;
  const actionLabel = limited ? "Consultar" : "Cómo llegar";

  return (
    <article
      className={`compact-location-row compact-location-row--${location.status || "active"}${selected ? " is-selected" : ""}`}
      id={`sede-${location.mapKey}`}
      data-location-card
      data-location-index={index}
    >
      <button
        className="compact-location-row__focus"
        type="button"
        aria-label={`Mostrar ${shortCity} en el mapa`}
        aria-pressed={selected}
        onClick={() => onSelect(index, false)}
      >
        <span className="compact-location-row__number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="compact-location-row__copy">
          <span><strong>{shortCity}</strong><em>{statusLabel[location.status] || "Sede"}</em></span>
          <small>{supportingText}</small>
        </span>
      </button>
      <a
        className="compact-location-row__action"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${actionLabel}: ${shortCity}. ${supportingText}`}
      >
        <span>{actionLabel}</span><i data-lucide="navigation" aria-hidden="true" />
      </a>
    </article>
  );
}

function ScheduleGroup({ group }) {
  return (
    <li className="location-hours-panel__group">
      <strong>{group.label}</strong>
      <dl>
        {group.slots.map((slot) => (
          <div className="location-hours-panel__slot" data-schedule-slot key={slot.label}>
            <dt>{slot.label}</dt>
            <dd>{slot.times}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

export function LocationExplorer({ locations, hours, whatsappHref }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [railIndex, setRailIndex] = useState(0);
  const railRef = useRef(null);
  const scrollFrame = useRef(null);

  useEffect(() => () => {
    if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current);
  }, []);

  const scrollToCard = (index) => {
    const rail = railRef.current;
    const card = rail?.querySelector(`[data-location-index="${index}"]`);
    if (!rail || !card) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left: card.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const selectLocation = (index, revealCard) => {
    setSelectedIndex(index);
    setRailIndex(index);
    const rail = railRef.current;
    if (revealCard && rail?.scrollWidth > rail.clientWidth) scrollToCard(index);
  };

  const moveRail = (direction) => {
    const nextIndex = Math.max(0, Math.min(locations.length - 1, railIndex + direction));
    selectLocation(nextIndex, true);
  };

  const handleRailScroll = () => {
    if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = window.requestAnimationFrame(() => {
      const rail = railRef.current;
      if (!rail || rail.scrollWidth <= rail.clientWidth) return;
      const cards = [...rail.querySelectorAll("[data-location-card]")];
      const closest = cards.reduce((best, card, index) => {
        const distance = Math.abs(card.offsetLeft - rail.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });
      setRailIndex(closest.index);
      setSelectedIndex(closest.index);
    });
  };

  const selectedLocation = selectedIndex === null ? null : locations[selectedIndex];
  const focus = selectedLocation ? mapFocus[selectedLocation.mapKey] : null;
  const stageTransform = focus
    ? `translate(${focus.targetX}%, ${focus.targetY}%) scale(${focus.scale}) translate(-${focus.x}%, -${focus.y}%)`
    : undefined;

  return (
    <div className="location-explorer">
      <div className="real-map-card">
        <div className="real-map-card__frame" data-map-focused={selectedLocation ? "true" : "false"}>
          <div className="real-map-card__stage" style={{ transform: stageTransform }}>
            <Image
              className="real-map-card__image"
              src="/assets/maps/new-jersey-campus-map.jpg"
              alt="Mapa del centro de Nueva Jersey con Bound Brook, Plainfield, Piscataway y Flemington."
              fill
              sizes="(max-width: 1040px) calc(100vw - 28px), 50vw"
            />
            <div className="real-map-card__pins" aria-label="Sedes marcadas en el mapa">
              {locations.map((location, index) => (
                <MapPin
                  key={location.mapKey}
                  location={location}
                  index={index}
                  selected={selectedIndex === index}
                  onSelect={selectLocation}
                />
              ))}
            </div>
          </div>
          <p className={`real-map-card__focus-label${selectedLocation ? " is-visible" : ""}`} aria-live="polite">
            {selectedLocation ? `Mostrando ${selectedLocation.city.split(",")[0]}` : "Vista general de las sedes"}
          </p>
          <a
            className="real-map-card__attribution"
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            © OpenStreetMap
          </a>
          <button
            className={`real-map-card__overview${selectedLocation ? " is-visible" : ""}`}
            type="button"
            aria-label="Volver a la vista general del mapa"
            disabled={!selectedLocation}
            onClick={() => setSelectedIndex(null)}
          >
            <i data-lucide="scan" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="location-compact-panel">
        <div className="location-rail-toolbar" aria-label="Navegar sedes">
          <span><strong>{railIndex + 1}</strong> de {locations.length}</span>
          <div>
            <button type="button" disabled={railIndex === 0} aria-label="Sede anterior" onClick={() => moveRail(-1)}>
              <i data-lucide="chevron-left" aria-hidden="true" />
            </button>
            <button type="button" disabled={railIndex === locations.length - 1} aria-label="Sede siguiente" onClick={() => moveRail(1)}>
              <i data-lucide="chevron-right" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          className="location-compact-list"
          ref={railRef}
          aria-label="Sedes presenciales en Nueva Jersey"
          onScroll={handleRailScroll}
        >
          {locations.map((location, index) => (
            <LocationRow
              key={location.mapKey}
              location={location}
              index={index}
              selected={selectedIndex === index}
              onSelect={selectLocation}
              whatsappHref={whatsappHref}
            />
          ))}
        </div>
        <section className="location-hours-panel" aria-labelledby="location-hours-title">
          <div className="location-hours-panel__header">
            <span className="location-hours-panel__heading">
              <span className="location-hours-panel__icon"><i data-lucide="clock-3" aria-hidden="true" /></span>
              <span>
                <span className="eyebrow-chip">Horario de clases</span>
                <h3 id="location-hours-title">Bound Brook · Plainfield · Piscataway</h3>
              </span>
            </span>
          </div>
          <div className="location-hours-panel__content">
            <ul>{hours.map((group) => <ScheduleGroup key={group.label} group={group} />)}</ul>
            <p className="location-hours-panel__note">Confirma disponibilidad antes de inscribirte.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
