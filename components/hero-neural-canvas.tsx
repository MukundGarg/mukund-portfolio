"use client";

import { useEffect, useRef } from "react";

type Node = {
  id: number;
  layer: number;
  index: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  phase: number;
  active: number;
};

type Edge = {
  id: number;
  from: number;
  to: number;
  active: number;
};

type Pulse = {
  step: number;
  progress: number;
} | null;

const COLORS = {
  data: "#6FE3D7",
  neural: "#A58BE8",
  output: "#FF806B",
};

const INPUTS = ["DATA", "IMAGE", "TEXT", "SIGNAL", "API"] as const;

const OUTPUTS = [
  "SYSTEM",
  "GESTURE",
  "INSIGHT",
  "AUTOMATION",
  "TEXT",
] as const;

const DESKTOP = [5, 11, 9, 5, 5] as const;
const MOBILE = [5, 7, 6, 4, 5] as const;

const seeded = (seed: number) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const damp = (
  value: number,
  target: number,
  lambda: number,
  dt: number,
) => target + (value - target) * Math.exp(-lambda * dt);

export function HeroNeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".native-hero");
    const ctx = canvas?.getContext("2d");

    if (!canvas || !hero || !ctx) return;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let reducedMotion = motionQuery.matches;
    let mobile = window.innerWidth < 700;
    let counts: readonly number[] = mobile ? MOBILE : DESKTOP;

    let width = 1;
    let height = 1;
    let raf = 0;
    let lastTime = 0;
    let visible = true;
    let destroyed = false;

    let autoElapsed = 0;
    let autoIndex = 0;

    let activeRoute: number[] = [];
    let activeOutput = -1;
    let pulse: Pulse = null;
    let interacted = false;

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const routes: number[][] = [];

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const starts = () => {
      const result: number[] = [];
      let total = 0;

      counts.forEach((count) => {
        result.push(total);
        total += count;
      });

      return result;
    };

    const addEdge = (from: number, to: number) => {
      const found = edges.find(
        (edge) => edge.from === from && edge.to === to,
      );

      if (found) return found.id;

      const edge = {
        id: edges.length,
        from,
        to,
        active: 0,
      };

      edges.push(edge);

      return edge.id;
    };

    const build = () => {
      nodes.length = 0;
      edges.length = 0;
      routes.length = 0;

      activeRoute = [];
      activeOutput = -1;
      pulse = null;

      const layerStarts = starts();

      const xs = mobile
        ? [0.16, 0.36, 0.56, 0.74, 0.9]
        : [0.52, 0.64, 0.75, 0.84, 0.93];

      counts.forEach((count, layer) => {
        for (let index = 0; index < count; index += 1) {
          const id = layerStarts[layer] + index;

          const t = count === 1 ? 0.5 : index / (count - 1);

          const nx =
            xs[layer] +
            (seeded(id * 19 + 2) - 0.5) *
              (mobile ? 0.045 : 0.035);

          const ny =
            0.17 +
            t * 0.65 +
            (seeded(id * 29 + 7) - 0.5) * 0.055;

          nodes.push({
            id,
            layer,
            index,
            baseX: nx * width,
            baseY: ny * height,
            x: nx * width,
            y: ny * height,
            phase: seeded(id + 90) * Math.PI * 2,
            active: 0,
          });
        }
      });

      for (let layer = 0; layer < counts.length - 1; layer += 1) {
        const fromStart = layerStarts[layer];
        const toStart = layerStarts[layer + 1];

        for (let index = 0; index < counts[layer]; index += 1) {
          const fromId = fromStart + index;

          const nextIds = Array.from(
            { length: counts[layer + 1] },
            (_, nextIndex) => toStart + nextIndex,
          ).sort(
            (a, b) =>
              Math.abs(nodes[a].baseY - nodes[fromId].baseY) -
              Math.abs(nodes[b].baseY - nodes[fromId].baseY),
          );

          const fanOut = mobile ? 2 : 3;

          for (let branch = 0; branch < fanOut; branch += 1) {
            const offset = Math.floor(
              seeded(fromId * 31 + branch * 11) *
                Math.min(4, nextIds.length),
            );

            addEdge(
              fromId,
              nextIds[(branch + offset) % nextIds.length],
            );
          }
        }
      }

      for (let input = 0; input < INPUTS.length; input += 1) {
        const route: number[] = [];
        let current = layerStarts[0] + input;
        const output = layerStarts[counts.length - 1] + input;
        const outputY = nodes[output].baseY;

        for (let layer = 0; layer < counts.length - 1; layer += 1) {
          const nextStart = layerStarts[layer + 1];
          const nextCount = counts[layer + 1];
          let target = output;

          if (layer < counts.length - 2) {
            target = Array.from(
              { length: nextCount },
              (_, index) => nextStart + index,
            ).sort(
              (a, b) =>
                Math.abs(nodes[a].baseY - outputY) -
                Math.abs(nodes[b].baseY - outputY),
            )[0];
          }

          route.push(addEdge(current, target));
          current = target;
        }

        routes.push(route);
      }
    };

    const clearRoute = () => {
      activeRoute.forEach((id) => {
        if (edges[id]) edges[id].active = 0;
      });

      nodes.forEach((node) => { node.active = 0; });
      activeRoute = [];
      activeOutput = -1;
      pulse = null;
    };

    const startInference = (input: number, userInitiated: boolean) => {
      const index = ((input % INPUTS.length) + INPUTS.length) % INPUTS.length;
      clearRoute();
      activeRoute = routes[index] ?? [];
      activeOutput = index;
      autoElapsed = 0;
      const inputNode = nodes[index];
      if (!inputNode) return;

      inputNode.active = 1;

      if (userInitiated && !interacted) {
        interacted = true;
        hero.classList.add("hero-network-interacted");
      }

      if (reducedMotion) {
        activeRoute.forEach((edgeId) => {
          const edge = edges[edgeId];
          if (!edge) return;
          edge.active = 1;
          nodes[edge.to].active = 1;
        });
        draw(performance.now(), 0, true);
        return;
      }

      pulse = { step: 0, progress: 0 };
      ensureFrame();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextMobile = window.innerWidth < 700;
      if (nextMobile !== mobile) {
        mobile = nextMobile;
        counts = mobile ? MOBILE : DESKTOP;
      }

      build();
      draw(performance.now(), 0, true);
    };

    const edgePoint = (edge: Edge, t: number) => {
      const from = nodes[edge.from];
      const to = nodes[edge.to];
      const dx = to.x - from.x;
      const c1x = from.x + dx * 0.42;
      const c2x = to.x - dx * 0.42;
      const bend = (seeded(edge.id + 55) - 0.5) * 34;
      const inverse = 1 - t;

      return {
        x: inverse ** 3 * from.x + 3 * inverse ** 2 * t * c1x + 3 * inverse * t ** 2 * c2x + t ** 3 * to.x,
        y: inverse ** 3 * from.y + 3 * inverse ** 2 * t * (from.y + bend) + 3 * inverse * t ** 2 * (to.y - bend) + t ** 3 * to.y,
      };
    };

    const draw = (time: number, dt: number, snap = false) => {
      ctx.clearRect(0, 0, width, height);

      if (!reducedMotion && !snap) {
        autoElapsed += dt;
        if (autoElapsed >= 8 && pulse === null) {
          startInference(autoIndex % INPUTS.length, false);
          autoIndex += 1;
        }
      }

      nodes.forEach((node) => {
        let targetX = node.baseX;
        let targetY = node.baseY;

        if (!reducedMotion && !snap) {
          targetX += Math.sin(time * 0.00045 + node.phase) * 3.5;
          targetY += Math.cos(time * 0.0005 + node.phase * 1.2) * 4.5;

          if (pointer.active) {
            const dx = targetX - pointer.x;
            const dy = targetY - pointer.y;
            const distance = Math.hypot(dx, dy) || 1;
            if (distance < 150) {
              const force = (1 - distance / 150) * 12;
              targetX += (dx / distance) * force;
              targetY += (dy / distance) * force;
            }
          }
        }

        if (snap || reducedMotion || dt === 0) {
          node.x = targetX;
          node.y = targetY;
        } else {
          node.x = damp(node.x, targetX, 10, dt);
          node.y = damp(node.y, targetY, 10, dt);
          node.active *= Math.exp(-0.6 * dt);
        }
      });

      edges.forEach((edge) => {
        if (!reducedMotion && !snap) edge.active *= Math.exp(-2.4 * dt);
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const midpointX = (from.x + to.x) / 2;
        const midpointY = (from.y + to.y) / 2;
        const pointerDistance = pointer.active ? Math.hypot(midpointX - pointer.x, midpointY - pointer.y) : 9999;
        const pointerBoost = pointerDistance < 190 ? (1 - pointerDistance / 190) * 0.04 : 0;
        const activity = Math.max(edge.active, from.active, to.active);
        const dx = to.x - from.x;
        const bend = (seeded(edge.id + 55) - 0.5) * 34;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.bezierCurveTo(from.x + dx * 0.42, from.y + bend, to.x - dx * 0.42, to.y - bend, to.x, to.y);
        ctx.strokeStyle = `rgba(165,139,232,${0.035 + pointerBoost + activity * 0.27})`;
        ctx.lineWidth = 0.65 + activity * 0.75;
        ctx.stroke();
      });

      if (pulse && activeRoute.length) {
        const edge = edges[activeRoute[pulse.step]];
        if (edge) {
          edge.active = 1;
          pulse.progress += dt * 1.6;

          if (pulse.progress >= 1) {
            nodes[edge.to].active = 1;
            if (pulse.step < activeRoute.length - 1) pulse = { step: pulse.step + 1, progress: 0 };
            else pulse = null;
          } else {
            const head = edgePoint(edge, pulse.progress);
            const tail = edgePoint(edge, Math.max(0, pulse.progress - 0.09));
            const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
            gradient.addColorStop(0, "rgba(111,227,215,0)");
            gradient.addColorStop(0.55, "rgba(165,139,232,.74)");
            gradient.addColorStop(1, "rgba(241,239,244,.96)");
            ctx.beginPath();
            ctx.moveTo(tail.x, tail.y);
            ctx.lineTo(head.x, head.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const isInput = node.layer === 0;
        const isOutput = node.layer === counts.length - 1;
        const radius = (isInput || isOutput ? 2.6 : 1.8) + node.active * 1.6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isInput ? COLORS.data : isOutput ? node.active > 0.2 ? COLORS.output : "rgba(255,128,107,.45)" : node.active > 0.2 ? COLORS.neural : "rgba(241,239,244,.2)";
        ctx.fill();

        if (node.active > 0.45) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 7 + node.active * 4, 0, Math.PI * 2);
          ctx.strokeStyle = isOutput ? `rgba(255,128,107,${0.12 + node.active * 0.2})` : `rgba(165,139,232,${0.1 + node.active * 0.2})`;
          ctx.stroke();
        }
      });

      ctx.font = "500 9px monospace";
      ctx.textBaseline = "middle";
      INPUTS.forEach((label, index) => {
        const node = nodes[index];
        if (!node) return;
        ctx.fillStyle = "rgba(111,227,215,.72)";
        ctx.fillText(label, node.x + 11, node.y);
      });

      if (activeOutput >= 0) {
        const layerStarts = starts();
        const output = nodes[layerStarts[counts.length - 1] + activeOutput];
        if (output && output.active > 0.25) {
          const label = OUTPUTS[activeOutput];
          ctx.fillStyle = COLORS.output;
          ctx.fillText(label, output.x - ctx.measureText(label).width - 12, output.y);
        }
      }
    };

    const loop = (time: number) => {
      raf = 0;
      if (destroyed || reducedMotion || !visible || document.visibilityState !== "visible") return;
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      draw(time, dt);
      ensureFrame();
    };

    const ensureFrame = () => {
      if (!destroyed && !reducedMotion && visible && document.visibilityState === "visible" && raf === 0) raf = requestAnimationFrame(loop);
    };

    const pointFromEvent = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onPointerMove = (event: PointerEvent) => {
      const point = pointFromEvent(event);
      pointer.x = point.x;
      pointer.y = point.y;
      pointer.active = event.pointerType !== "touch";
    };

    const onPointerLeave = () => { pointer.active = false; };

    const onPointerDown = (event: PointerEvent) => {
      const point = pointFromEvent(event);
      let hit = -1;
      let radius = mobile ? 36 : 28;

      for (let index = 0; index < INPUTS.length; index += 1) {
        const node = nodes[index];
        if (!node) continue;
        const distance = Math.hypot(node.x - point.x, node.y - point.y);
        if (distance < radius) { radius = distance; hit = index; }
      }

      if (hit >= 0) startInference(hit, true);
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible" && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastTime = 0;
      } else ensureFrame();
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      lastTime = 0;
      clearRoute();
      draw(performance.now(), 0, true);
      ensureFrame();
    };

    const onCta = (event: Event) => {
      const anchor = event.currentTarget as HTMLAnchorElement;
      startInference(Number(anchor.dataset.networkRoute ?? 0), true);
    };

    const ctas = Array.from(hero.querySelectorAll<HTMLAnchorElement>("[data-network-route]"));
    ctas.forEach((cta) => { cta.addEventListener("pointerenter", onCta); cta.addEventListener("focus", onCta); });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; lastTime = 0; }
      if (visible) ensureFrame();
    }, { threshold: 0.02 });
    intersectionObserver.observe(hero);

    resize();
    ensureFrame();

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      ctas.forEach((cta) => { cta.removeEventListener("pointerenter", onCta); cta.removeEventListener("focus", onCta); });
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="hero-neural-canvas" aria-hidden="true" />
      <span className="network-hint mono" aria-hidden="true">
        <span className="network-hint-desktop">MOVE · CLICK AN INPUT</span>
        <span className="network-hint-touch">TAP AN INPUT NODE</span>
      </span>
    </>
  );
}
