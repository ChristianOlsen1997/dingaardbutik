"use client";

import { useState } from "react";
import type { Location } from "@/types/locations";

function formatPhone(phone: string) {
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
}

export function LocationItem({ location, onExpandedChange }: { location: Location; onExpandedChange: (location: Location, expanded: boolean) => void }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `location-${location.id}`;
  const fullAddress = `${location.address}, ${location.postalCode} ${location.city}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <article className="location-item">
      <button className="location-summary" type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => {
        const next = !expanded;
        setExpanded(next);
        onExpandedChange(location, next);
      }}>
        <span className="location-main">
          <span className="location-title-line">
            <span className="location-name">{location.name}</span>
          </span>
          <span className="location-address">{location.address}<br />{location.postalCode} {location.city} · {formatPhone(location.phone)}</span>
        </span>
        <span className="expand-icon" aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <div id={panelId} className="location-details" data-open={expanded}>
        <div className="location-details-inner">
          <p>{location.description}</p>
          <div className="location-actions">
            <a href={`tel:+45${location.phone}`} aria-label={`Ring til ${location.name} på ${formatPhone(location.phone)}`}>Ring {formatPhone(location.phone)}</a>
            {location.website && <a href={location.website} target="_blank" rel="noreferrer">Bes&oslash;g hjemmesiden <span aria-hidden="true">&#8599;</span></a>}
            <a href={mapsUrl} target="_blank" rel="noreferrer">Se adresse på Google Maps <span aria-hidden="true">↗</span></a>
          </div>
          <p className="travel-note">Kontakt altid gården, før du tager afsted. Åbningstider og udvalg kan ændre sig.</p>
        </div>
      </div>
    </article>
  );
}
