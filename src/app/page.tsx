"use client";

import { useState } from "react";
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
