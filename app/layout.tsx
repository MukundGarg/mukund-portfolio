import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Mukund Garg — AI / ML · Backend · Computer Vision",
  description:
    "Mukund Garg — Electronics & Communication Engineering student building systems across machine learning, backend, and computer vision.",
  metadataBase: new URL("https://mukundgarg.dev"),
  openGraph: {
    title: "Mukund Garg — AI / ML · Backend · Computer Vision",
    description: "Building intelligent systems from data, models and code.",
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
