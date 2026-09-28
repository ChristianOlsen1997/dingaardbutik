"use client";

import { useState } from "react";

const links = [
  { label: "Find gårdbutik", href: "#find-gaardbutik" },
  { label: "Om", href: "#om" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="dingårdbutik, gå til toppen">dingårdbutik</a>
      <a className="advertising-slot" href="#annoncering" aria-label="Kontakt om ledig annonceplads">
        <strong>Støt lokale gårdbutikker</strong>
        <span>Annoncér her og hjælp flere med at finde dem.</span>
      </a>
      <button className="menu-button" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((value) => !value)}>
        {open ? "Luk" : "Menu"}
      </button>
      <nav id="site-nav" className={open ? "site-nav is-open" : "site-nav"} aria-label="Primær navigation">
        {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
      </nav>
    </header>
  );
}
