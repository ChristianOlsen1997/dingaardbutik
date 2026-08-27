export type RegionId =
  | "nordjylland"
  | "midtjylland"
  | "syddanmark"
  | "sjaelland"
  | "hovedstaden";

export type Region = {
  id: RegionId;
  name: string;
  introduction: string;
};
