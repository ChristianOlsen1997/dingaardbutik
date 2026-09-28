"use client";

import type { Location } from "@/types/locations";

function formatPhone(phone: string) {
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
}

export function LocationItem({ location, expanded, onExpandedChange }: { location: Location; expanded: boolean; onExpandedChange: (location: Location, expanded: boolean) => void }) {
  const panelId = `location-${location.id}`;
  const fullAddress = `${location.address}, ${location.postalCode} ${location.city}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <article className="location-item">
      <button className="location-summary" type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => {
        const next = !expanded;
        onExpandedChange(location, next);
      }}>
        <span className="location-main">
          <span className="location-title-line">
            <span className="location-name">{location.name}</span>
          </span>
          <span className="location-address">{location.address}<br />{location.postalCode} {location.city}{location.phone && <> · {formatPhone(location.phone)}</>}</span>
        </span>
        <span className="expand-icon" aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <div id={panelId} className="location-details" data-open={expanded} inert={!expanded}>
        <div className="location-details-inner">
          <p>{location.description}</p>
          <div className="location-actions">
            {location.phone && <a href={`tel:+45${location.phone}`} aria-label={`Ring til ${location.name} på ${formatPhone(location.phone)}`}>Ring {formatPhone(location.phone)}</a>}
            {location.website && <a href={location.website} target="_blank" rel="noreferrer">Besøg {new URL(location.website).hostname.endsWith("facebook.com") ? "Facebook" : "hjemmesiden"} <span aria-hidden="true">↗</span></a>}
            <a href={mapsUrl} target="_blank" rel="noreferrer">Se adresse på Google Maps <span aria-hidden="true">↗</span></a>
          </div>
          <p className="travel-note">Kontakt gerne gårdbutikken før dit besøg for at høre om det aktuelle udvalg.</p>
        </div>
      </div>
    </article>
  );
}
