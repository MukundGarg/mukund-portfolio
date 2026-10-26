"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download, Menu, X, ArrowUpRight } from "lucide-react";
import { nav, socials } from "@/lib/portfolio-data";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key & manage focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent body scroll when menu is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first link or close button inside drawer
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
    toggleBtnRef.current?.focus();
  };

  return (
    <div className="mobile-nav-container">
      <button
        ref={toggleBtnRef}
        type="button"
        className="mobile-nav-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      {/* Backdrop */}
      <div
        className={`mobile-nav-backdrop ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-navigation-drawer"
        ref={drawerRef}
        className={`mobile-nav-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-nav-header">
          <span className="mobile-nav-title mono">INDEX / NAVIGATION</span>
          <button
            type="button"
            className="mobile-nav-close"
            onClick={() => {
              setIsOpen(false);
              toggleBtnRef.current?.focus();
            }}
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-nav-links" aria-label="Mobile section navigation">
          {nav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="mobile-nav-link"
              onClick={handleLinkClick}
            >
              <span className="mobile-nav-item-num mono">{item.n}</span>
              <span className="mobile-nav-item-label">{item.label}</span>
              <ArrowUpRight size={16} className="mobile-nav-arrow" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <div className="mobile-nav-footer">
          <a
            href={socials.resume}
            className="button button-solid mobile-resume-btn"
            onClick={handleLinkClick}
          >
            Download Resume <Download size={15} aria-hidden="true" />
          </a>
          <div className="mobile-nav-socials mono">
            <a href={socials.email} target="_blank" rel="noreferrer">Email</a>
            <span>·</span>
            <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>
            <span>·</span>
            <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}
