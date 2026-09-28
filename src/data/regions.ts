import type { Region } from "@/types/regions";

export const regions: Region[] = [
  { id: "nordjylland", name: "Nordjylland", introduction: "Find gårdbutikker i det nordjyske landskab." },
  { id: "midtjylland", name: "Midtjylland", introduction: "Gå på opdagelse blandt gårdbutikker i hjertet af Jylland." },
  { id: "syddanmark", name: "Syddanmark", introduction: "Find gårdbutikker fra Sønderjylland til Fyn og øerne." },
  { id: "sjaelland", name: "Sjælland", introduction: "Se gårdbutikker på Sjælland og de omkringliggende øer." },
  { id: "hovedstaden", name: "Hovedstaden", introduction: "Find gårdbutikker i hovedstadsområdet og på Bornholm." },
];

export const regionIds = regions.map((region) => region.id);
