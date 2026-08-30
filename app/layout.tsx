import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Mukund Garg — Applied AI / Systems",
  description: "Mukund Garg builds intelligent systems from data, models and code.",
  metadataBase: new URL("https://mukundgarg.dev"),
  openGraph: { title: "Mukund Garg — Applied AI / Systems", description: "Applied AI, backend engineering, computer vision and automation.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`bg-background ${geist.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}
