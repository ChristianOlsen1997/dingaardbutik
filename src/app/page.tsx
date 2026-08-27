"use client";

import { useState } from "react";
import { DenmarkMap } from "@/components/DenmarkMap";
import { Header } from "@/components/Header";
import { RegionDirectory } from "@/components/RegionDirectory";
import type { MapPosition } from "@/types/locations";
import type { RegionId } from "@/types/regions";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);
  const [markerPosition, setMarkerPosition] = useState<MapPosition | null>(null);

  return (
    <>
      <div id="top" className="page-frame">
        <Header />
        <main id="find-maelk" className="finder" data-selected={selectedRegion !== null}>
          <div className="content-column" aria-live="polite">
            {selectedRegion ? <RegionDirectory
                regionId={selectedRegion}
                onReset={() => {
                  setSelectedRegion(null);
                  setMarkerPosition(null);
                }}
                onLocationSelect={setMarkerPosition}
              /> : (
              <section className="introduction" aria-labelledby="intro-heading">
                <p className="eyebrow">Direkte fra gården</p>
                <h1 id="intro-heading"><span>Find r&aring;</span><span>M&aelig;lk<span className="heading-i">i</span></span><span>Danmark.</span></h1>
                <p>Find gårde og producenter, der sælger rå mælk direkte til forbrugere.</p>
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
                setMarkerPosition(null);
              }}
            />
          </div>
        </main>
        <section id="om" className="about-strip">
          <p className="eyebrow">Om oversigten</p>
          <p>En enkel vejviser til rå mælk, solgt direkte fra danske producenter.</p>
        </section>
        <footer id="tilfoej" className="footer">
          <div><span className="wordmark">Find Rå Mælk</span><p>En uafhængig oversigt over steder, der sælger rå mælk.</p></div>
          <p>Bekræft altid oplysningerne direkte med producenten, før du tager afsted.</p>
          <p>© {new Date().getFullYear()}</p>
        </footer>
      </div>
    </>
  );
}
