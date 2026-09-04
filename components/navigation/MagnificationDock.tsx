"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState, type MouseEvent } from "react";

type DockItemData = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  active?: boolean;
  separator?: boolean;
  className?: string;
};

type MagnificationDockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  spring?: { mass: number; stiffness: number; damping: number };
};

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return coarse;
}

function DockItem({
  item,
  mouseX,
  distance,
  baseItemSize,
  magnification,
  spring,
}: {
  item: DockItemData;
  mouseX: MotionValue<number>;
  distance: number;
  baseItemSize: number;
  magnification: number;
  spring: { mass: number; stiffness: number; damping: number };
}) {
  if (item.separator) {
    return <span className="portfolio-dock__separator" aria-hidden="true" />;
  }

  const [focused, setFocused] = useState(false);
  const size = useTransform(mouseX, (x) => {
    if (!Number.isFinite(x)) return baseItemSize;
    const element = document.querySelector(`[data-dock-label="${CSS.escape(item.label)}"]`);
    const rect = element?.getBoundingClientRect();
    if (!rect) return baseItemSize;
    const delta = Math.abs(x - (rect.left + rect.width / 2));
    if (delta >= distance) return baseItemSize;
    const influence = 1 - delta / distance;
    return baseItemSize + (magnification - baseItemSize) * influence;
  });

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (item.onClick) {
      event.preventDefault();
      item.onClick();
    }
  };

  const content = (
    <motion.span
      className="portfolio-dock__icon"
      style={{ width: size, height: size }}
      transition={spring}
    >
      {item.icon}
      <AnimatePresence>
        {focused && (
          <motion.span
            className="portfolio-dock__tooltip"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.16 }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {item.active && <span className="portfolio-dock__active-mark" aria-hidden="true" />}
    </motion.span>
  );

  const commonProps = {
    className: `portfolio-dock__item ${item.active ? "is-active" : ""} ${item.className ?? ""}`,
    "aria-label": item.label,
    "data-dock-label": item.label,
    "aria-current": item.active ? ("page" as const) : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onMouseEnter: () => setFocused(true),
    onMouseLeave: () => setFocused(false),
    onClick: handleClick,
  };

  if (item.href) {
    return (
      <a
        {...commonProps}
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps} type="button">
      {content}
    </button>
  );
}

export function MagnificationDock({
  items,
  className = "",
  distance = 150,
  panelHeight = 60,
  baseItemSize = 42,
  magnification = 62,
  spring = { mass: 0.12, stiffness: 180, damping: 16 },
}: MagnificationDockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const coarsePointer = useCoarsePointer();

  return (
    <nav
      className={`portfolio-dock ${className}`}
      style={{ minHeight: panelHeight }}
      aria-label="Portfolio navigation"
      onMouseMove={(event) => {
        if (!coarsePointer) mouseX.set(event.clientX);
      }}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
    >
      {items.map((item) => (
        <DockItem
          key={item.label}
          item={item}
          mouseX={mouseX}
          distance={distance}
          baseItemSize={baseItemSize}
          magnification={magnification}
          spring={spring}
        />
      ))}
    </nav>
  );
}
