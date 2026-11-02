"use client";
import type { Location } from "@/types/locations";
import { ProductionBadges, ProductionFilterProvider, ProductionFilters, useProductionFilters } from "./ProductionFilters";
import { descriptionFor, productionNotes } from "../../shared/production";
export function RegionFilteredList({ locations }: { locations: Location[] }) { return <ProductionFilterProvider><List locations={locations} /></ProductionFilterProvider>; }
function List({ locations }: { locations: Location[] }) {
 const { accepts } = useProductionFilters();
 const matches = locations.filter(accepts);
 return <><ProductionFilters /><p role="status">{matches.length} gårdbutikker</p><div className="region-list">
 {matches.map(location => <article className="region-entry" key={location.id} id={location.id}>
  <h2>{location.name} <ProductionBadges farm={location} /></h2><p>{descriptionFor(location)}</p>
  {productionNotes(location).map((info, index) => <p className="travel-note" key={index}>{info.note} {info.source_url && <a href={info.source_url} target="_blank" rel="noreferrer">Se producentens oplysninger ↗</a>}</p>)}
  <address>{location.address}<br />{location.postalCode} {location.city}</address>
  {location.openingHoursNote && <p className="travel-note">{location.openingHoursNote} {location.source && <a href={location.source} target="_blank" rel="noreferrer">Se kilden ↗</a>}</p>}
          <div className="location-actions">
   {location.phone && <a href={`tel:+45${location.phone}`}>Ring {location.phone.replace(/(\d{2})(?=\d)/g, "$1 ")}</a>}
   {location.website && <a href={location.website} target="_blank" rel="noreferrer">Besøg {location.name} ↗</a>}
   <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.id === "den-lille-mark" ? `${location.coordinates.latitude},${location.coordinates.longitude}` : `${location.address}, ${location.postalCode} ${location.city}`)}`} target="_blank" rel="noreferrer">Se på Google Maps ↗</a>
  </div></article>)}
 {!matches.length && <p>Ingen butikker matcher filtrene i denne region. Prøv at fjerne et filter.</p>}
 </div></>;
}
