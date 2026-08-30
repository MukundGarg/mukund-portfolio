import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mukund / Build Feed",
  description: "Mukund Garg — applied AI, backend systems, automation, and computer vision.",
  metadataBase: new URL("https://mukundgarg.dev"),
  openGraph: {
    title: "Mukund / Build Feed",
    description: "Notes, systems and things Mukund Garg ships.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body>{children}</body></html>;
}
