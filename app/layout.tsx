import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mukund Garg | AI/ML & Backend Engineer",
  description:
    "Portfolio of Mukund Garg — AI/ML, backend, automation, computer vision, and applied software projects.",
  metadataBase: new URL("https://mukundgarg.dev"),
  openGraph: {
    title: "Mukund Garg | Portfolio",
    description: "AI/ML • Backend • Automation • Computer Vision",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[var(--bg)]">
      <body className="font-sans">{children}</body>
    </html>
  );
}
