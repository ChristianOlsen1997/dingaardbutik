import postalCodes from "@/data/postal-codes.json";
import type { DirectoryEntry } from "@/types/locations";
import type { RegionId } from "@/types/regions";

export function normalize(value: string) {
  return value.toLocaleLowerCase("da").replaceAll("æ", "ae").replaceAll("ø", "oe").replaceAll("å", "aa").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}

export function searchLocations(entries: DirectoryEntry[], query: string, regionId?: RegionId, radius = 30) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const postcode = terms.find((term) => /^\d{4}$/.test(term));
  const center = postcode ? (postalCodes as Record<string, { name: string; latitude: number; longitude: number }>)[postcode] : undefined;
  const textTerms = center ? terms.filter((term) => term !== postcode) : terms;
  const matches = entries.flatMap<{ location: DirectoryEntry; distance: number | undefined }>((location) => {
    if (regionId && (location.kind === "webshop" || location.region !== regionId)) return [];
    const addressTerms = location.kind === "webshop" ? "online webshop" : [location.address, location.postalCode, location.city].join(" ");
    const text = normalize([location.name, addressTerms, location.description].join(" "));
    if (!textTerms.every((term) => text.includes(term))) return [];
    if (center) {
      if (location.kind === "webshop") return [];
      const distance = distanceKm(center, location.coordinates);
      if (location.postalCode !== postcode && distance > radius) return [];
      return [{ location, distance }];
    }
    return [{ location, distance: undefined }];
  }).sort((a, b) => center ? (a.distance ?? 0) - (b.distance ?? 0) || a.location.name.localeCompare(b.location.name, "da") : a.location.name.localeCompare(b.location.name, "da"));
  return { matches, postcode, center };
}
