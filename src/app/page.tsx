"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { regions } from "@/data/regions";
import { DenmarkMap } from "@/components/DenmarkMap";
import { Header } from "@/components/Header";
import { RegionDirectory } from "@/components/RegionDirectory";
import { LocationSearch } from "@/components/LocationSearch";
import type { MapPosition } from "@/types/locations";
import type { RegionId } from "@/types/regions";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);
  const [markerPosition, setMarkerPosition] = useState<MapPosition | null>(null);
  const [searching, setSearching] = useState(false);

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
                  setMarkerPosition(null);
                  setSearching(false);
                }}
                onLocationSelect={setMarkerPosition}
              /> : (
              <section className="introduction" aria-labelledby="intro-heading">
                <p className="eyebrow">Direkte fra gården</p>
                <h1 id="intro-heading"><span>Find din</span><span>gårdbutik</span><span>i Danmark.</span></h1>
                <p>Find gårdbutikker, der sælger lokale varer direkte fra gården.</p>
                <LocationSearch onLocationSelect={setMarkerPosition} onSearchChange={setSearching} />
                <a className="intro-link" href="#kort">Vælg en region <span aria-hidden="true">↓</span></a>
              </section>
            )}
          </div>
          <div id="kort" className="map-column">
            <DenmarkMap
              selectedRegion={selectedRegion}
              markerPosition={markerPosition}
              onSelect={(region) => {
                setSelectedRegion(region);
                setSearching(false);
                setMarkerPosition(null);
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
        <footer id="tilfoej" className="footer">
          <div><span className="wordmark">dingårdbutik</span><p>En uafhængig oversigt over gårdbutikker i Danmark.</p><p>Bekræft altid oplysningerne direkte med gårdbutikken, før du tager afsted.</p></div>
          <div id="annoncering" className="advertising-contact">
            <p className="eyebrow">Kontakt for annonceplads og andre henvendelser</p>
            <strong>Christian Olsen</strong>
            <a href="tel:+4560492050">60 49 20 50</a>
            <a href="mailto:Christian@olsenvideo.dk">Christian@olsenvideo.dk</a>
          </div>
          <p>© {new Date().getFullYear()}</p>
        </footer>
      </div>
    </>
  );
}
