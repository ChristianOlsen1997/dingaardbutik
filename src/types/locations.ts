import type { RegionId } from "@/types/regions";

export type MapPosition = {
  x: number;
  y: number;
};

export type Location = {
  kind?: "farm";
  id: string;
  name: string;
  region: RegionId;
  address: string;
  postalCode: string;
  city: string;
  phone?: string;
  website?: string;
  mapPosition: MapPosition;
  description: string;
};

export type OnlineShop = {
  kind: "webshop";
  id: string;
  name: string;
  description: string;
  website: string;
  phone?: string;
};

export type DirectoryEntry = Location | OnlineShop;
