"use client";

import type { DirectoryEntry } from "@/types/locations";

function formatPhone(phone: string) {
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
}

export function LocationItem({ location, expanded, onExpandedChange, distance }: { location: DirectoryEntry; expanded: boolean; onExpandedChange: (location: DirectoryEntry, expanded: boolean) => void; distance?: number }) {
  const panelId = `location-${location.id}`;
  const isOnline = location.kind === "webshop";
  const mapsUrl = isOnline ? null : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address}, ${location.postalCode} ${location.city}`)}`;

  return (
    <article className="location-item">
      <button id={`select-${location.id}`} className="location-summary" type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => {
        const next = !expanded;
        onExpandedChange(location, next);
      }}>
        <span className="location-main">
          <span className="location-title-line">
            <span className="location-name">{location.name}</span>
          </span>
          {(!isOnline || location.phone) && <span className="location-address">{!isOnline && <>{location.address}<br />{location.postalCode} {location.city}</>}{location.phone && <>{!isOnline && " · "}{formatPhone(location.phone)}</>}</span>}
          {distance !== undefined && <span className="location-distance">Ca. {Math.round(distance)} km i luftlinje</span>}
        </span>
        <span className="expand-icon" aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <div id={panelId} className="location-details" data-open={expanded} inert={!expanded}>
        <div className="location-details-inner">
          <p>{location.description}</p>
          <div className="location-actions">
            {location.phone && <a href={`tel:+45${location.phone}`} aria-label={`Ring til ${location.name} på ${formatPhone(location.phone)}`}>Ring {formatPhone(location.phone)}</a>}
            {location.website && <a href={location.website} target="_blank" rel="noreferrer">Besøg {isOnline ? "webshoppen" : new URL(location.website).hostname.endsWith("facebook.com") ? "Facebook" : "hjemmesiden"} <span aria-hidden="true">↗</span></a>}
            {mapsUrl && <a href={mapsUrl} target="_blank" rel="noreferrer">Se adresse på Google Maps <span aria-hidden="true">↗</span></a>}
          </div>
          <p className="travel-note">{isOnline ? "Se aktuelle leveringsvilkår og udvalg i webshoppen." : "Kontakt gerne gårdbutikken før dit besøg for at høre om det aktuelle udvalg."}</p>
          <p className="listing-meta">{location.source && <><a href={location.source} target="_blank" rel="noreferrer">Kilde til oplysninger ↗</a><span> · </span></>}<a href={`mailto:christian@olsenvideo.dk?subject=${encodeURIComponent(`Rettelse eller fjernelse: ${location.name}`)}`}>Ret oplysninger eller få stedet fjernet</a></p>
        </div>
      </div>
    </article>
  );
}
