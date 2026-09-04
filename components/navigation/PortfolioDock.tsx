"use client";

import {
  BriefcaseBusiness,
  Boxes,
  FileText,
  Github,
  Linkedin,
  Mail,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { socials } from "@/lib/portfolio-data";
import { MagnificationDock } from "./MagnificationDock";

type PortfolioDockProps = {
  frameRef: RefObject<HTMLIFrameElement | null>;
};

const sections = [
  { id: "about", label: "Profile", icon: <UserRound aria-hidden="true" /> },
  { id: "projects", label: "Projects", icon: <Boxes aria-hidden="true" /> },
  { id: "experience", label: "Experience", icon: <BriefcaseBusiness aria-hidden="true" /> },
  { id: "contact", label: "Contact", icon: <Mail aria-hidden="true" /> },
];

export function PortfolioDock({ frameRef }: PortfolioDockProps) {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const handleSectionChange = (event: MessageEvent<{ type?: string; id?: string }>) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === "portfolio-section" && event.data.id) {
        setActiveSection(event.data.id);
      }
    };

    window.addEventListener("message", handleSectionChange);
    return () => window.removeEventListener("message", handleSectionChange);
  }, [frameRef]);

  const goToSection = (id: string) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "portfolio-scroll", id },
      window.location.origin,
    );
  };

  return (
    <MagnificationDock
      className="portfolio-dock--portfolio"
      items={[
        ...sections.map((section) => ({
          ...section,
          onClick: () => goToSection(section.id),
          active: activeSection === section.id,
        })),
        {
          label: "separator",
          icon: null,
          separator: true,
        },
        { label: "GitHub", icon: <Github aria-hidden="true" />, href: socials.github, external: true, className: "external-secondary" },
        { label: "LinkedIn", icon: <Linkedin aria-hidden="true" />, href: socials.linkedin, external: true, className: "external-secondary" },
        { label: "Resume", icon: <FileText aria-hidden="true" />, href: socials.resume, external: false, className: "resume-action" },
      ]}
    />
  );
}
