"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { regions } from "@/data/regions";
import { locations } from "@/data/locations";
import { DenmarkMap } from "@/components/DenmarkMap";
import { Header } from "@/components/Header";
import { RegionDirectory } from "@/components/RegionDirectory";
import { LocationSearch } from "@/components/LocationSearch";
import { SiteFooter } from "@/components/SiteFooter";
import type { DirectoryEntry } from "@/types/locations";
import type { RegionId } from "@/types/regions";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<DirectoryEntry | null>(null);
  const [query, setQuery] = useState("");
  const markerPosition = selectedLocation && selectedLocation.kind !== "webshop" ? selectedLocation.mapPosition : null;
  const searching = query.trim().length > 0;

  return (
    <>
      <div id="top" className="page-frame">
        <Header />
        <main id="find-gaardbutik" className="finder" data-selected={selectedRegion !== null} data-searching={searching}>
          <div className="content-column">
            {selectedRegion ? <RegionDirectory
                key={selectedRegion}
                regionId={selectedRegion}
                onReset={() => {
                  setSelectedRegion(null);
                  setSelectedLocation(null);
                  setQuery("");
                }}
                onLocationSelect={setSelectedLocation}
                query={query}
                onQueryChange={setQuery}
                selectedId={selectedLocation?.id ?? null}
              /> : (
              <section className="introduction" aria-labelledby="intro-heading">
                <p className="eyebrow">Direkte fra gården</p>
                <h1 id="intro-heading"><span>Find din</span><span>gårdbutik</span><span>i Danmark.</span></h1>
                <p>Find gårdbutikker, der sælger lokale varer direkte fra gården.</p>
                <LocationSearch onLocationSelect={setSelectedLocation} query={query} onQueryChange={setQuery} selectedId={selectedLocation?.id ?? null} />
                <a className="intro-link" href="#kort">Vælg en region <span aria-hidden="true">↓</span></a>
              </section>
            )}
          </div>
          <div id="kort" className="map-column">
            <DenmarkMap
              selectedRegion={selectedRegion}
              markerPosition={markerPosition}
              selectedLocationId={selectedLocation?.id ?? null}
              onLocationSelect={(id) => {
                setQuery("");
                setSelectedLocation(locations.find((location) => location.id === id) ?? null);
                requestAnimationFrame(() => {
                  const button = document.getElementById(`select-${id}`);
                  button?.scrollIntoView({ behavior: "instant", block: "center" });
                  button?.focus({ preventScroll: true });
                });
              }}
              onSelect={(region) => {
                setSelectedRegion(region);
                setQuery("");
                setSelectedLocation(null);
              }}
            />
          </div>
        </main>
        <section id="om" className="about-strip">
          <p className="eyebrow">Om oversigten</p>
          <p>En enkel vejviser til danske gårdbutikker og lokale varer direkte fra gården.</p>
        </section>
        <section className="founder-story" aria-labelledby="founder-heading">
          <div className="founder-profile">
            <h2 id="founder-heading">Mere end bare<br />en gårdbutiksliste.</h2>
            <p className="founder-name">Sebastian Behnke</p>
            <p className="founder-role">Personlig træner og coach</p>
            <a className="founder-link" href="https://www.instagram.com/sebastianbehnke/" target="_blank" rel="noreferrer">Mød Sebastian <span aria-hidden="true">↗</span></a>
            <Image
              className="founder-portrait"
              src="/sebastian-behnke-gaard.jpg"
              alt="Sebastian Behnke med en bakke æg ved et skilt til gårdsalg"
              width={1320}
              height={1713}
              sizes="(max-width: 800px) 90vw, 32vw"
            />
          </div>
          <div className="founder-letter">
            <p className="founder-lead">Din Gårdbutik er skabt for at gøre det nemmere for dig at finde og støtte de små lokale producenter og gårdbutikker rundt omkring i Danmark.</p>
            <p>For mig handler det om meget mere end bare at købe æg, kød og grøntsager direkte fra kilden.</p>
            <p>Det handler om at vælge, hvem vi lægger vores penge hos. At støtte mennesker, der har valgt en anden vej end masseproduktion. Mennesker, der brænder for deres fag, deres dyr, deres jord og kvaliteten af de råvarer, de producerer.</p>
            <p>Jeg tror på, at vi som borgere har langt mere indflydelse, end vi nogle gange går og tror.</p>
            <p>For hver gang vi handler, stemmer vi med vores penge. Vi er med til at bestemme, hvad der skal vokse, og hvad der skal forsvinde.</p>
            <p>Jeg tror på værdien i at vide, hvor maden kommer fra. At møde mennesket bag. At give dem hånden og sige tak. At støtte en lokal familie frem for endnu en stor kæde.</p>
            <p>Og at få mere rigtig mad af god kvalitet ind i hverdagen.</p>
            <p>Derfor er Din Gårdbutik skabt.</p>
            <p>Mit håb er, at vi sammen kan være med til at flytte noget. At flere får øjnene op for værdien af at handle lokalt, støtte de små og tage mere ansvar for, hvor vores mad kommer fra.</p>
            <p>For hvis vi vil have dem om 10, 20 og 30 år, skal vi også bruge dem i dag.</p>
            <p>Det her er et valg. Et valg om at lægge vores penge hos dem, vi gerne vil se mere af i fremtiden.</p>
            <p>En stille revolution, der giver os mere kontrol over vores egen forsyning.</p>
            <p className="founder-emphasis">Det er den fremtid, jeg ønsker for mine børn. Frihed til at vælge.</p>
            <p>Tak, fordi du er med.</p>
            <p className="founder-signoff">Mojn.<span>Sebastian</span></p>
          </div>
        </section>
        <nav className="region-links" aria-label="Find gårdbutikker efter region">
          {regions.map((region) => <Link key={region.id} href={`/gaardbutikker/${region.id}`}>Gårdbutikker i {region.name}</Link>)}
        </nav>
        <SiteFooter />
      </div>
    </>
  );
}
