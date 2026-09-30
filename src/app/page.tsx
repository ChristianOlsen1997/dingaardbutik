"use client";

import { useState } from "react";
import Link from "next/link";
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
            <p className="eyebrow">Mennesket bag initiativet</p>
            <h2 id="founder-heading">Mere end bare<br />en gårdbutiksliste.</h2>
            <p className="founder-name">Sebastian Behnke</p>
            <p className="founder-role">Personlig træner</p>
            <a className="founder-link" href="https://www.sebastianb.dk/behnke-coaching" target="_blank" rel="noreferrer">Mød Sebastian <span aria-hidden="true">↗</span></a>
          </div>
          <div className="founder-letter">
            <p className="founder-lead">Jeg ønsker at gøre det nemmere for dig at finde og støtte de små lokale og online producenter og gårdbutikker rundt omkring i hele Danmark.</p>
            <p>For mig handler det om mere end bare at købe æg, oksekød og nogle grøntsager direkte fra kilden. Det handler om selv at vælge, hvem vi lægger vores penge hos. Om at støtte mennesker, der har valgt at gå en anden vej end masseproduktion. Mennesker, der brænder for deres fag, for kvalitet, for deres dyr, deres jord og de råvarer, de producerer.</p>
            <p>Jeg tror på, at vi som borgere har mere indflydelse, end vi nogle gange går og tror. Hver gang vi handler, træffer vi et valg om, hvad vi gerne vil støtte, og hvad vi gerne vil se mere af i fremtiden.</p>
            <p>Jeg tror på værdien i at vide, hvor maden kommer fra. At møde mennesket bag håndværket. Give dem hånden og sige “TAK”. At støtte en lokal familie frem for endnu en stor kæde. Og at få mere rigtig mad af god kvalitet ind i hverdagen.</p>
            <p>Derfor lavede jeg denne Gårdbutiksliste.</p>
            <p>Mit håb er, at listen med tiden kan blive en platform, der hjælper endnu flere med at opdage de små steder, der allerede findes lige i nærheden af, hvor de bor.</p>
            <p>For jo flere vi er, der bruger og støtter dem, jo større mulighed er der for, at de også findes om 10, 20 og 30 år. Og flere gårdbutikker vil forhåbentligt dukke op.</p>
            <p className="founder-emphasis">Det er en fremtid, jeg ønsker for mine børn. Frihed til at vælge.</p>
            <p>Det synes jeg er værd at støtte, og det stopper jeg aldrig med at tale højt om.</p>
            <p>Tak fordi du læser med her, og tak for din støtte.</p>
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
