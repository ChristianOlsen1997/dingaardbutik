import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "dingårdbutik — direkte fra gården",
  description: "Find gårdbutikker og lokale varer direkte fra gården i Danmark.",
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
