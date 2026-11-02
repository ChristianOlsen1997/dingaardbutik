import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { appPrivacyDate, appPrivacyNotice, appPrivacySections, appPrivacyLinks } from "../../../../shared/app-privacy";
export const metadata: Metadata = { title: "Privatliv i appen | Din Gårdbutik", alternates: { canonical: "/privatliv/app" }, robots: { index: false, follow: true } };
export default function AppPrivacyPage() {
  return <div className="page-frame">
    <header className="site-header"><Link className="wordmark" href="/">dingårdbutik</Link></header>
    <main className="legal-page">
      <Link href="/privatliv">← Hjemmesidens privatlivspolitik</Link>
      <h1>Privatliv i appen</h1><p>Senest opdateret {appPrivacyDate}.</p><p>{appPrivacyNotice}</p>
      {appPrivacySections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <p><a href="mailto:christian@olsenvideo.dk">Kontakt os om privatliv</a></p>
      <h2>Læs mere</h2><ul>{appPrivacyLinks.map(link => <li key={link.url}><a href={link.url}>{link.label} ↗</a></li>)}</ul>
    </main><SiteFooter />
  </div>;
}
