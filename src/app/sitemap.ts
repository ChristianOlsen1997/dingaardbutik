import type { MetadataRoute } from "next";
import { regions } from "@/data/regions";
import { siteUrl } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/privatliv` },
    { url: `${siteUrl}/kontakt` },
    ...regions.map((region) => ({ url: `${siteUrl}/gaardbutikker/${region.id}` })),
  ];
}
