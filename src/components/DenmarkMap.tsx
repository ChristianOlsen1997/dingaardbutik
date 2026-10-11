"use client";

import DenmarkSvg from "@/assets/danmark-regioner.svg";
import { regionIds } from "@/data/regions";
import { locations } from "@/data/locations";
import { useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type { Location, MapPosition } from "@/types/locations";
import type { RegionId } from "@/types/regions";

type DenmarkMapProps = {
  selectedRegion: RegionId | null;
  markerPosition: MapPosition | null;
  onSelect: (region: RegionId) => void;
  selectedLocationId: string | null;
  onLocationSelect: (id: string) => void;
};

function isRegionId(value: string | undefined): value is RegionId {
  return regionIds.includes(value as RegionId);
}

function groupMarkers(items: Location[]) {
  const groups = items.map((location) => ({ position: location.mapPosition, locations: [location] }));
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        if (Math.hypot(groups[i].position.x - groups[j].position.x, groups[i].position.y - groups[j].position.y) >= 18) continue;
        const members = [...groups[i].locations, ...groups[j].locations];
        groups[i] = { locations: members, position: { x: members.reduce((sum, item) => sum + item.mapPosition.x, 0) / members.length, y: members.reduce((sum, item) => sum + item.mapPosition.y, 0) / members.length } };
        groups.splice(j, 1);
        merged = true;
        break outer;
      }
    }
  }
  return groups;
}

const markersByRegion = Object.fromEntries(regionIds.map((region) => [region, groupMarkers(locations.filter((location) => location.region === region))])) as Record<RegionId, ReturnType<typeof groupMarkers>>;

function findRegion(target: EventTarget | null, boundary: EventTarget): RegionId | null {
  if (!(target instanceof Element)) return null;
  const group = target.closest<SVGElement>("[data-region]");
  if (!group || !(boundary instanceof Node) || !boundary.contains(group)) return null;
  const value = group.dataset.region;
  return isRegionId(value) ? value : null;
}

export function DenmarkMap({ selectedRegion, markerPosition, onSelect, selectedLocationId, onLocationSelect }: DenmarkMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);
  const [openGroup, setOpenGroup] = useState<{ region: RegionId; locations: Location[] } | null>(null);
  const groups = selectedRegion ? markersByRegion[selectedRegion] : [];
  function selectGroup(members: Location[]) {
    if (members.length === 1) { setOpenGroup(null); onLocationSelect(members[0].id); }
    else if (selectedRegion) setOpenGroup({ region: selectedRegion, locations: members });
  }

  return (
    <div className="map-shell" data-has-selection={selectedRegion !== null}>
      <p className="map-instruction"><span aria-hidden="true">&#8599;</span> {selectedRegion ? "Tryk på en prik · tal viser flere butikker" : "Vælg en region på kortet"}</p>
      <DenmarkSvg
        className="denmark-map"
        data-active-region={selectedRegion ?? undefined}
        data-hover-region={hoveredRegion ?? undefined}
        onMouseDown={(event: MouseEvent<SVGSVGElement>) => {
          event.preventDefault();
        }}
        onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
          const region = findRegion(event.target, event.currentTarget);
          setHoveredRegion((current) => current === region ? current : region);
        }}
        onPointerLeave={() => setHoveredRegion(null)}
        onClick={(event: MouseEvent<SVGSVGElement>) => {
          const region = findRegion(event.target, event.currentTarget);
          if (region) onSelect(region);
        }}
        onKeyDown={(event: KeyboardEvent<SVGSVGElement>) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          const region = findRegion(event.target, event.currentTarget);
          if (!region) return;
          event.preventDefault();
          onSelect(region);
        }}
      />
      {selectedRegion && <svg className="map-marker-overlay map-shop-markers" viewBox="-6 -5 1012 820" role="group" aria-label="Gårdbutikker i den valgte region">
        {groups.map((group) => <circle key={`hit-${group.locations[0].id}`} className="map-shop-hit" cx={group.position.x} cy={group.position.y} r="15" aria-hidden="true" onClick={() => selectGroup(group.locations)} />)}
        {groups.map((group) => <g key={group.locations[0].id} className="map-shop-marker" role="button" tabIndex={0} aria-label={group.locations.length === 1 ? `Vis ${group.locations[0].name}, ${group.locations[0].city}` : `Vis ${group.locations.length} gårdbutikker ved ${group.locations[0].city}`} aria-pressed={group.locations.some((location) => selectedLocationId === location.id)} onClick={() => selectGroup(group.locations)} onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectGroup(group.locations); }
        }}>
          <title>{group.locations.map((location) => location.name).join(" · ")}</title>
          <circle className="map-shop-focus" cx={group.position.x} cy={group.position.y} r="13" />
          <circle className="map-shop-dot" cx={group.position.x} cy={group.position.y} r={group.locations.length > 1 ? 9 : 5} />
          {group.locations.length > 1 && <text className="map-cluster-count" x={group.position.x} y={group.position.y} dy=".35em">{group.locations.length}</text>}
        </g>)}
      </svg>}
      {openGroup && openGroup.region === selectedRegion && <div className="map-location-picker" role="group" aria-label="Vælg en gårdbutik i området"><div><strong>Gårdbutikker i området</strong><button type="button" onClick={() => setOpenGroup(null)} aria-label="Luk butikker på kortet">×</button></div>{openGroup.locations.map((location) => <button key={location.id} type="button" onClick={() => { setOpenGroup(null); onLocationSelect(location.id); }}>{location.name}<span>{location.city}</span></button>)}</div>}
      {markerPosition && (
        <svg className="map-marker-overlay" viewBox="-6 -5 1012 820" aria-hidden="true">
          <circle className="map-marker-ring" cx={markerPosition.x} cy={markerPosition.y} r="15" />
          <circle className="map-marker-dot" cx={markerPosition.x} cy={markerPosition.y} r="8" />
        </svg>
      )}
    </div>
  );
}
