"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

const storageKey = "dingaardbutik-statistics-v1";
const changedEvent = "dingaardbutik-consent-changed";
const settingsEvent = "dingaardbutik-consent-settings";
const lifetime = 180 * 24 * 60 * 60 * 1000;
let sessionChoice: "accepted" | "rejected" | null = null;

function getChoice(): "accepted" | "rejected" | null {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (value && (value.choice === "accepted" || value.choice === "rejected") && typeof value.at === "number" && Date.now() - value.at < lifetime) return value.choice;
  } catch { /* With blocked storage, remember the choice only for this visit. */ }
  return sessionChoice;
}

function subscribe(callback: () => void) {
  const notify = () => callback();
  window.addEventListener("storage", notify);
  window.addEventListener(changedEvent, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(changedEvent, notify);
  };
}

export function StatisticsSettingsButton() {
  return <button className="text-button" type="button" onClick={() => window.dispatchEvent(new Event(settingsEvent))}>Cookie- og statistikvalg</button>;
}

export function PrivacyControls() {
  const choice = useSyncExternalStore(subscribe, getChoice, () => null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(settingsEvent, open);
    return () => window.removeEventListener(settingsEvent, open);
  }, []);

  function choose(next: "accepted" | "rejected") {
    const previous = getChoice();
    sessionChoice = next;
    try { localStorage.setItem(storageKey, JSON.stringify({ choice: next, at: Date.now() })); } catch { /* Statistics remain optional even if storage is unavailable. */ }
    setSettingsOpen(false);
    window.dispatchEvent(new Event(changedEvent));
    // Reload after withdrawal so the already loaded analytics script is removed.
    if (previous === "accepted" && next === "rejected") window.location.reload();
  }

  return <>
    {choice === "accepted" && <Analytics beforeSend={(event) => {
      if (getChoice() !== "accepted") return null;
      const url = new URL(event.url);
      url.search = "";
      url.hash = "";
      return { ...event, url: url.toString() };
    }} />}
    {(choice === null || settingsOpen) && <section className="consent-banner" aria-labelledby="consent-heading">
      <div><h2 id="consent-heading">Må vi måle besøg?</h2><p>Vi bruger valgfri Vercel Web Analytics til besøgsstatistik. Den måler blandt andet sidevisninger, enhedstype og omtrentligt område uden statistikcookies. Statistik indlæses først, hvis du accepterer. Siden fungerer også uden.</p><p>Dit valg gemmes i din browser i 180 dage. Du kan ændre det via “Cookie- og statistikvalg” nederst på siden. <Link href="/privatliv#statistik">Læs om privatliv og statistik</Link>.</p></div>
      <div className="consent-actions"><button type="button" onClick={() => choose("rejected")}>Afvis statistik</button><button type="button" onClick={() => choose("accepted")}>Acceptér statistik</button>{choice !== null && <button className="text-button" type="button" onClick={() => setSettingsOpen(false)}>Luk uden ændringer</button>}</div>
    </section>}
  </>;
}
