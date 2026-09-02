"use client";

import DenmarkSvg from "@/assets/danmark-regioner.svg";
import { regionIds } from "@/data/regions";
import { useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type { MapPosition } from "@/types/locations";
import type { RegionId } from "@/types/regions";

type DenmarkMapProps = {
  selectedRegion: RegionId | null;
  markerPosition: MapPosition | null;
  onSelect: (region: RegionId) => void;
};

function isRegionId(value: string | undefined): value is RegionId {
  return regionIds.includes(value as RegionId);
}

function findRegion(target: EventTarget | null, boundary: EventTarget): RegionId | null {
  if (!(target instanceof Element)) return null;
  const group = target.closest<SVGElement>("[data-region]");
  if (!group || !(boundary instanceof Node) || !boundary.contains(group)) return null;
  const value = group.dataset.region;
  return isRegionId(value) ? value : null;
}

export function DenmarkMap({ selectedRegion, markerPosition, onSelect }: DenmarkMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);

  return (
    <div className="map-shell" data-has-selection={selectedRegion !== null}>
      <p className="map-instruction"><span aria-hidden="true">&#8599;</span> V&aelig;lg en region p&aring; kortet</p>
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
      {markerPosition && (
        <svg className="map-marker-overlay" viewBox="-6 -5 1012 820" aria-hidden="true">
          <circle className="map-marker-ring" cx={markerPosition.x} cy={markerPosition.y} r="15" />
          <circle className="map-marker-dot" cx={markerPosition.x} cy={markerPosition.y} r="8" />
        </svg>
      )}
    </div>
  );
}
