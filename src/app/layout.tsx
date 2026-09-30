import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/data/site";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: "Find gårdbutikker i Danmark | Din Gårdbutik",
  description: "Find gårdbutikker i hele Danmark. Se lokale varer, adresser og kontaktoplysninger, og find din næste gårdbutik på kortet eller efter region.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da">
      <body className={`${sans.variable} ${display.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
