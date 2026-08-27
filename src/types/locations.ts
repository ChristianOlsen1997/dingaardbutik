import type { RegionId } from "@/types/regions";

export type MapPosition = {
  x: number;
  y: number;
};

export type Location = {
  id: string;
  name: string;
  region: RegionId;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  website?: string;
  mapPosition: MapPosition;
  description: string;
};
