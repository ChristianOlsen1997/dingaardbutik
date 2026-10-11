"use client";

import { useId } from "react";
import { LocationItem } from "@/components/LocationItem";
import { locations } from "@/data/locations";
import { onlineShops } from "@/data/online-shops";
import { regions } from "@/data/regions";
import type { DirectoryEntry } from "@/types/locations";
import type { RegionId } from "@/types/regions";
import { searchLocations } from "@/lib/location-search";

export function LocationSearch({ regionId, onLocationSelect, query, onQueryChange, selectedId }: {
  regionId?: RegionId;
  onLocationSelect: (entry: DirectoryEntry | null) => void;
  query: string;
  onQueryChange: (query: string) => void;
  selectedId: string | null;
}) {
  const inputId = useId();
  const searching = query.trim().length > 0;
  const scope = regions.find((region) => region.id === regionId)?.name ?? "hele Danmark";
  const entries: DirectoryEntry[] = [...locations, ...onlineShops];
  const { matches, postcode, center } = searchLocations(entries, query, regionId);
  const resultLabel = `${matches.length} ${matches.length === 1 ? "gårdbutik" : "gårdbutikker"}`;

  function changeQuery(value: string) {
    onQueryChange(value);
    onLocationSelect(null);
  }

  return (
    <div className="location-search">
      <label htmlFor={inputId}>Søg i {scope}</label>
      <div className="search-field">
        <input id={inputId} type="search" value={query} onChange={(event) => changeQuery(event.target.value)} placeholder="Navn, by, postnummer eller varer" aria-describedby={`${inputId}-status`} />
        {query && <button type="button" onClick={() => changeQuery("")} aria-label="Ryd søgning">Ryd</button>}
      </div>
      <p id={`${inputId}-status`} className="search-status" role="status">
        {searching ? `${resultLabel} fundet i ${scope}` : `Søg blandt ${resultLabel} i ${scope}.`}
      </p>
      {!searching && <p className="search-help">Oversigten vokser løbende og omfatter endnu ikke alle gårdbutikker. Søg på et postnummer for at finde steder i nærheden.</p>}
      {center && <div className="postcode-options"><p>Butikker inden for 50 km af {postcode} {center.name}. Afstande er i luftlinje fra postnummerets omtrentlige centrum{regionId ? ", inden for den valgte region" : ""}.</p></div>}
      {(regionId || searching) && <div className="location-list">
        {matches.map(({ location, distance }) => <LocationItem key={location.id} location={location} distance={distance} expanded={selectedId === location.id} onExpandedChange={(item, expanded) => onLocationSelect(expanded ? item : null)} />)}
        {matches.length === 0 && <div className="empty-state"><p>{center ? "Vi har endnu ingen registrerede butikker, der matcher inden for 50 km. Prøv en by eller se hele regionen." : postcode ? "Postnummeret kunne ikke matches med en butik i oversigten. Prøv en by eller vælg en region på kortet." : "Ingen registrerede gårdbutikker matcher din søgning. Prøv et andet navn, en by eller en vare."}</p><p>Det betyder ikke, at der ikke findes gårdbutikker i området.</p><a href="mailto:christian@olsenvideo.dk?subject=Forslag%20til%20g%C3%A5rdbutik">Foreslå en gårdbutik ↗</a></div>}
      </div>}
    </div>
  );
}
