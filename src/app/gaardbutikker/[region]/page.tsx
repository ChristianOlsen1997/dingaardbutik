import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locations } from "@/data/locations";
import { regions } from "@/data/regions";

type Props = { params: Promise<{ region: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return regions.map((region) => ({ region: region.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: id } = await params;
  const region = regions.find((item) => item.id === id);
  if (!region) notFound();
  return {
    alternates: { canonical: `/gaardbutikker/${region.id}` },
    title: `Gårdbutikker i ${region.name} | Din Gårdbutik`,
    description: `${region.introduction} Se adresser, lokale varer og kontaktoplysninger, og planlæg dit besøg.`,
  };
}

export default async function RegionPage({ params }: Props) {
  const { region: id } = await params;
  const region = regions.find((item) => item.id === id);
  if (!region) notFound();
  const matches = locations.filter((location) => location.region === id)
    .sort((a, b) => a.name.localeCompare(b.name, "da"));

  return (
    <div className="page-frame">
      <header className="site-header">
        <Link className="wordmark" href="/">dingårdbutik</Link>
        <Link href="/#kort">Find på kortet</Link>
      </header>
      <main className="region-page">
        <Link className="back-button" href="/">← Hele Danmark</Link>
        <p className="eyebrow">{matches.length} gårdbutikker i oversigten</p>
        <h1>Gårdbutikker i {region.name}</h1>
        <p className="region-intro">{region.introduction} Her finder du adresser, beskrivelser af udvalget og links til producenterne.</p>
        <p>Kontakt gårdbutikken inden dit besøg for at bekræfte åbningstider og det aktuelle udvalg.</p>
        <div className="region-list">
          {matches.map((location) => (
            <article className="region-entry" key={location.id} id={location.id}>
              <h2>{location.name}</h2>
              <p>{location.description}</p>
              <address>{location.address}<br />{location.postalCode} {location.city}</address>
              <div className="location-actions">
                {location.phone && <a href={`tel:+45${location.phone}`}>Ring {location.phone.replace(/(\d{2})(?=\d)/g, "$1 ")}</a>}
                {location.website && <a href={location.website} target="_blank" rel="noreferrer">Besøg {location.name} ↗</a>}
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address}, ${location.postalCode} ${location.city}`)}`} target="_blank" rel="noreferrer">Se på Google Maps ↗</a>
              </div>
            </article>
          ))}
        </div>
        <nav className="region-links" aria-label="Gårdbutikker i andre regioner">
          {regions.map((item) => <Link href={`/gaardbutikker/${item.id}`} key={item.id} aria-current={item.id === id ? "page" : undefined}>{item.name}</Link>)}
        </nav>
      </main>
      <footer className="footer"><p>Din Gårdbutik — en uafhængig oversigt over danske gårdbutikker.</p><Link href="/#annoncering">Kontakt</Link></footer>
    </div>
  );
}
