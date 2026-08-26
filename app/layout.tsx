import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mukund Garg | Signal → Intelligence",
  description: "Mukund Garg — applied AI, backend systems, automation, and computer vision.",
  metadataBase: new URL("https://mukundgarg.dev"),
  openGraph: { title: "Mukund Garg | Signal → Intelligence", description: "Applied AI, backend systems, automation, and computer vision.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-[#070a0c]"><body>{children}</body></html>;
}
