"use client";

import { useId, useState } from "react";
import { LocationItem } from "@/components/LocationItem";
import { locations } from "@/data/locations";
import { regions } from "@/data/regions";
import type { MapPosition } from "@/types/locations";
import type { RegionId } from "@/types/regions";

function normalize(value: string) {
  return value.toLocaleLowerCase("da").replaceAll("æ", "ae").replaceAll("ø", "oe").replaceAll("å", "aa").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function LocationSearch({ regionId, onLocationSelect, onSearchChange }: {
  regionId?: RegionId;
  onLocationSelect: (position: MapPosition | null) => void;
  onSearchChange?: (searching: boolean) => void;
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const searching = terms.length > 0;
  const scope = regions.find((region) => region.id === regionId)?.name ?? "hele Danmark";
  const matches = locations.filter((location) => {
    if (regionId && location.region !== regionId) return false;
    const text = normalize([location.name, location.address, location.postalCode, location.city, location.description].join(" "));
    return terms.every((term) => text.includes(term));
  }).sort((a, b) => a.name.localeCompare(b.name, "da"));

  function changeQuery(value: string) {
    setQuery(value);
    setExpandedId(null);
    onLocationSelect(null);
    onSearchChange?.(value.trim().length > 0);
  }

  return (
    <div className="location-search">
      <label htmlFor={inputId}>Søg i {scope}</label>
      <div className="search-field">
        <input id={inputId} type="search" value={query} onChange={(event) => changeQuery(event.target.value)} placeholder="Navn, by, postnummer eller varer" aria-describedby={`${inputId}-status`} />
        {query && <button type="button" onClick={() => changeQuery("")} aria-label="Ryd søgning">Ryd</button>}
      </div>
      <p id={`${inputId}-status`} className="search-status" role="status">
        {searching ? `${matches.length} ${matches.length === 1 ? "gårdbutik fundet" : "gårdbutikker fundet"} i ${scope}` : `Søg blandt ${matches.length} gårdbutikker i ${scope}.`}
      </p>
      {(regionId || searching) && <div className="location-list">
        {matches.map((location) => <LocationItem key={location.id} location={location} expanded={expandedId === location.id} onExpandedChange={(item, expanded) => {
          setExpandedId(expanded ? item.id : null);
          onLocationSelect(expanded ? item.mapPosition : null);
        }} />)}
        {matches.length === 0 && <div className="empty-state"><p>Ingen gårdbutikker matcher din søgning. Prøv et andet navn, en by eller en vare.</p></div>}
      </div>}
    </div>
  );
}
