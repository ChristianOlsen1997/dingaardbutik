"use client";

import { locations } from "@/data/locations";
import { regions } from "@/data/regions";
import type { MapPosition } from "@/types/locations";
import type { RegionId } from "@/types/regions";
import { LocationSearch } from "@/components/LocationSearch";

export function RegionDirectory({
  regionId,
  onReset,
  onLocationSelect,
}: {
  regionId: RegionId;
  onReset: () => void;
  onLocationSelect: (position: MapPosition | null) => void;
}) {
  const region = regions.find((item) => item.id === regionId);
  const matches = locations.filter((location) => location.region === regionId).sort((a, b) => a.name.localeCompare(b.name, "da"));
  if (!region) return null;

  return (
    <section className="directory" aria-labelledby="directory-heading">
      <button className="back-button" type="button" onClick={onReset}><span aria-hidden="true">←</span> Hele Danmark</button>
      <p className="eyebrow">Region</p>
      <h1 id="directory-heading">{region.name}</h1>
      <p className="directory-count">{matches.length} {matches.length === 1 ? "registreret gårdbutik" : "registrerede gårdbutikker"}</p>
      <p className="directory-intro">{region.introduction}</p>
      <LocationSearch regionId={regionId} onLocationSelect={onLocationSelect} />
    </section>
  );
}
