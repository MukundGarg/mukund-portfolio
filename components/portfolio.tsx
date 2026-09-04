"use client";

import { useRef } from "react";
import { PortfolioDock } from "./navigation/PortfolioDock";

export function Portfolio() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  return (
    <main className="portfolio-shell">
      <iframe
        ref={frameRef}
        src="/claude-portfolio.html"
        title="Mukund Garg Portfolio"
        className="portfolio-frame"
      />
      <PortfolioDock frameRef={frameRef} />
    </main>
  );
}