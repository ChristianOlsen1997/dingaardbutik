import type { Region } from "@/types/regions";

export const regions: Region[] = [
  { id: "nordjylland", name: "Nordjylland", introduction: "Find rå mælk tæt på gårdene i det nordjyske landskab." },
  { id: "midtjylland", name: "Midtjylland", introduction: "Gå på opdagelse blandt producenter i hjertet af Jylland." },
  { id: "syddanmark", name: "Syddanmark", introduction: "Find gårdsalg fra Sønderjylland til Fyn og øerne." },
  { id: "sjaelland", name: "Sjælland", introduction: "Se steder med rå mælk på Sjælland og de omkringliggende øer." },
  { id: "hovedstaden", name: "Hovedstaden", introduction: "Find producenter i hovedstadsområdet og på Bornholm." },
];

export const regionIds = regions.map((region) => region.id);
