import Link from "next/link";
import { StatisticsSettingsButton } from "@/components/PrivacyControls";

export function SiteFooter() {
  return <footer id="tilfoej" className="footer">
    <div><span className="wordmark">dingårdbutik</span><p>En uafhængig oversigt over gårdbutikker i Danmark. Listen er ikke udtømmende.</p><p>Bekræft altid oplysningerne direkte med gårdbutikken, før du tager afsted.</p><nav className="legal-links" aria-label="Privatliv og oplysninger"><Link href="/privatliv">Privatlivspolitik</Link><Link href="/kontakt">Firma og kontakt</Link><StatisticsSettingsButton /></nav></div>
    <div id="annoncering" className="advertising-contact"><p className="eyebrow">Kontakt, rettelser og annonceplads</p><strong>Olsen Video</strong><span>CVR: 40057846</span><address>Jens Bangs Vej 7, 1. tv.<br />9400 Nørresundby</address><span>Christian Olsen</span><a href="tel:+4560492050">60 49 20 50</a><a href="mailto:christian@olsenvideo.dk">christian@olsenvideo.dk</a><Link href="/kontakt#rettelser">Ret oplysninger eller få en butik fjernet</Link></div>
    <p>© {new Date().getFullYear()}</p>
  </footer>;
}
