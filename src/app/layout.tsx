import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Find Rå Mælk — direkte fra gården",
  description: "Find gårde og producenter, der sælger rå mælk direkte til forbrugere i Danmark.",
  icons: {
    icon: "/isolated-milk-bottle-with-copy-space.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="da"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>;
}
