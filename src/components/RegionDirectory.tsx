import { locations } from "@/data/locations";
import { regions } from "@/data/regions";
import type { MapPosition } from "@/types/locations";
import type { RegionId } from "@/types/regions";
import { LocationItem } from "@/components/LocationItem";

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
  const matches = locations.filter((location) => location.region === regionId);
  if (!region) return null;

  return (
    <section className="directory" aria-labelledby="directory-heading">
      <button className="back-button" type="button" onClick={onReset}><span aria-hidden="true">←</span> Hele Danmark</button>
      <p className="eyebrow">Region</p>
      <h1 id="directory-heading">{region.name}</h1>
      <p className="directory-count">{matches.length} {matches.length === 1 ? "registreret sted" : "registrerede steder"}</p>
      <p className="directory-intro">{region.introduction}</p>
      <div className="location-list">
        {matches.length > 0 ? matches.map((location) => <LocationItem
          key={location.id}
          location={location}
          onExpandedChange={(item, expanded) => onLocationSelect(expanded ? item.mapPosition : null)}
        />) : (
          <div className="empty-state">
            <p>Vi har endnu ikke registreret steder i denne region.</p>
          </div>
        )}
      </div>
    </section>
  );
}
