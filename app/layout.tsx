import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  preload: false,
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  preload: false,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Mukund Garg — Applied AI & Systems Portfolio",
  description:
    "An interactive notebook portfolio by Mukund Garg, showcasing applied AI, backend systems, computer vision, and selected projects.",
  openGraph: {
    title: "Mukund Garg — Applied AI & Systems Portfolio",
    description: "Building intelligent systems from data, models, and code.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
