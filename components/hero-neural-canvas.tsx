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
  activationLevel: number;
};

type Edge = {
  id: number;
  from: number;
  to: number;
  active: number;
  weight: number;
};

type Pulse = {
  step: number;
  progress: number;
} | null;

const COLORS = {
  data: "#6FE3D7",       // Cyan - Input / Data layer
  neural: "#A58BE8",     // Violet - Hidden layers
  neuralHot: "#C6B0FF",  // Bright violet - Active connections
  output: "#FF806B",     // Coral - Output layer decisions
  dimEdge: "rgba(165, 139, 232, 0.08)",
  dimNode: "rgba(241, 239, 244, 0.28)",
};

// Input layer labels
const INPUTS = [
  { label: "DATA", desc: "Sensors & Datasets" },
  { label: "IMAGE", desc: "Computer Vision Frames" },
  { label: "TEXT", desc: "NLP & Prompts" },
  { label: "SIGNAL", desc: "Time-series & Telemetry" },
  { label: "API", desc: "Web & System Events" },
] as const;

// Output layer labels
const OUTPUTS = [
  { label: "AUTOMATION", desc: "Workflow Execution" },
  { label: "VISION", desc: "Landmarks & Gestures" },
  { label: "INFERENCE", desc: "Pattern Recognition" },
  { label: "SYSTEM", desc: "Production API" },
  { label: "DECISION", desc: "Classification / Action" },
] as const;

// Layer configuration: [Input, Hidden 1, Hidden 2, Hidden 3, Output]
const DESKTOP_LAYERS = [5, 9, 8, 6, 5] as const;
const MOBILE_LAYERS = [5, 5, 4, 3, 5] as const;

const seeded = (seed: number) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const damp = (value: number, target: number, lambda: number, dt: number) =>
  target + (value - target) * Math.exp(-lambda * dt);

export function HeroNeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".native-hero");
    const ctx = canvas?.getContext("2d");

    if (!canvas || !hero || !ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    let isMobile = window.innerWidth < 800;
    let counts: readonly number[] = isMobile ? MOBILE_LAYERS : DESKTOP_LAYERS;

    let width = 1;
    let height = 1;
    let raf = 0;
    let lastTime = 0;
    let visible = true;
    let destroyed = false;

    let autoElapsed = 0;
    let autoIndex = 0;

    let activeRoute: number[] = [];
    let activeOutputIndex = -1;
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

    const addEdge = (from: number, to: number, weight = 1) => {
      const found = edges.find((e) => e.from === from && e.to === to);
      if (found) return found.id;

      const edge: Edge = {
        id: edges.length,
        from,
        to,
        active: 0,
        weight,
      };
      edges.push(edge);
      return edge.id;
    };

    const build = () => {
      nodes.length = 0;
      edges.length = 0;
      routes.length = 0;
      activeRoute = [];
      activeOutputIndex = -1;
      pulse = null;

      const layerStarts = starts();

      // On desktop, position network in the right 50% (x: 0.50 -> 0.94) to avoid hero text
      // On mobile, distribute across 0.12 -> 0.88 with safe vertical padding
      const xs = isMobile
        ? [0.12, 0.30, 0.50, 0.68, 0.86]
        : [0.50, 0.61, 0.72, 0.83, 0.94];

      counts.forEach((count, layer) => {
        for (let i = 0; i < count; i += 1) {
          const id = layerStarts[layer] + i;
          const t = count === 1 ? 0.5 : i / (count - 1);

          // Subtle organic jitter on hidden nodes, aligned rows on input/output
          const isIO = layer === 0 || layer === counts.length - 1;
          const jitterX = isIO ? 0 : (seeded(id * 19 + 3) - 0.5) * (isMobile ? 0.025 : 0.035);
          const nx = xs[layer] + jitterX;

          // Vertical span: 22% to 82% of height
          const jitterY = isIO ? 0 : (seeded(id * 31 + 7) - 0.5) * (isMobile ? 0.035 : 0.045);
          const ny = 0.22 + t * 0.58 + jitterY;

          nodes.push({
            id,
            layer,
            index: i,
            baseX: nx * width,
            baseY: ny * height,
            x: nx * width,
            y: ny * height,
            phase: seeded(id + 101) * Math.PI * 2,
            active: 0,
            activationLevel: 0,
          });
        }
      });

      // Build layered ANN synapses
      for (let layer = 0; layer < counts.length - 1; layer += 1) {
        const fromStart = layerStarts[layer];
        const toStart = layerStarts[layer + 1];

        for (let i = 0; i < counts[layer]; i += 1) {
          const fromId = fromStart + i;

          // Find topologically nearest nodes in next layer
          const nextIds = Array.from(
            { length: counts[layer + 1] },
            (_, nextIdx) => toStart + nextIdx,
          ).sort(
            (a, b) =>
              Math.abs(nodes[a].baseY - nodes[fromId].baseY) -
              Math.abs(nodes[b].baseY - nodes[fromId].baseY),
          );

          // Connect 2-3 forward neighbors to create a readable feedforward mesh
          const connectionsPerNode = isMobile ? 2 : 3;
          for (let branch = 0; branch < connectionsPerNode; branch += 1) {
            const targetId = nextIds[branch % nextIds.length];
            const weight = 0.5 + seeded(fromId * 17 + branch * 23) * 0.5;
            addEdge(fromId, targetId, weight);
          }
        }
      }

      // Precalculate forward propagation paths from each input node to corresponding output
      for (let inputIdx = 0; inputIdx < INPUTS.length; inputIdx += 1) {
        const route: number[] = [];
        let curr = layerStarts[0] + inputIdx;
        const targetOutput = layerStarts[counts.length - 1] + inputIdx;
        const targetY = nodes[targetOutput].baseY;

        for (let layer = 0; layer < counts.length - 1; layer += 1) {
          const nextStart = layerStarts[layer + 1];
          const nextCount = counts[layer + 1];
          let chosen = targetOutput;

          if (layer < counts.length - 2) {
            // Pick next-layer node closest to target output Y
            chosen = Array.from({ length: nextCount }, (_, idx) => nextStart + idx).sort(
              (a, b) => Math.abs(nodes[a].baseY - targetY) - Math.abs(nodes[b].baseY - targetY),
            )[0];
          }

          route.push(addEdge(curr, chosen, 1));
          curr = chosen;
        }

        routes.push(route);
      }
    };

    const clearRoute = () => {
      activeRoute.forEach((id) => {
        if (edges[id]) edges[id].active = 0;
      });
      nodes.forEach((node) => {
        node.active = 0;
        node.activationLevel = 0;
      });
      activeRoute = [];
      activeOutputIndex = -1;
      pulse = null;
    };

    const startInference = (inputIdx: number, userInitiated: boolean) => {
      const idx = ((inputIdx % INPUTS.length) + INPUTS.length) % INPUTS.length;
      clearRoute();

      activeRoute = routes[idx] ?? [];
      activeOutputIndex = idx;
      autoElapsed = 0;

      const inputNode = nodes[idx];
      if (!inputNode) return;

      inputNode.active = 1;
      inputNode.activationLevel = 1;

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
          nodes[edge.to].activationLevel = 1;
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

      const nextMobile = window.innerWidth < 800;
      if (nextMobile !== isMobile) {
        isMobile = nextMobile;
        counts = isMobile ? MOBILE_LAYERS : DESKTOP_LAYERS;
      }

      build();
      draw(performance.now(), 0, true);
    };

    const edgePoint = (edge: Edge, t: number) => {
      const from = nodes[edge.from];
      const to = nodes[edge.to];
      const dx = to.x - from.x;
      const c1x = from.x + dx * 0.44;
      const c2x = to.x - dx * 0.44;
      const bend = (seeded(edge.id + 53) - 0.5) * (isMobile ? 18 : 28);
      const inv = 1 - t;

      return {
        x: inv ** 3 * from.x + 3 * inv ** 2 * t * c1x + 3 * inv * t ** 2 * c2x + t ** 3 * to.x,
        y: inv ** 3 * from.y + 3 * inv ** 2 * t * (from.y + bend) + 3 * inv * t ** 2 * (to.y - bend) + t ** 3 * to.y,
      };
    };

    const draw = (time: number, dt: number, snap = false) => {
      ctx.clearRect(0, 0, width, height);

      // Slow periodic idle forward propagation (every 6 seconds if idle)
      if (!reducedMotion && !snap) {
        autoElapsed += dt;
        if (autoElapsed >= 6.5 && pulse === null) {
          startInference(autoIndex % INPUTS.length, false);
          autoIndex += 1;
        }
      }

      // Update node positions with restrained organic floating and gentle cursor deflection
      nodes.forEach((node) => {
        let targetX = node.baseX;
        let targetY = node.baseY;

        if (!reducedMotion && !snap) {
          targetX += Math.sin(time * 0.0005 + node.phase) * (isMobile ? 1.5 : 2.5);
          targetY += Math.cos(time * 0.0006 + node.phase * 1.3) * (isMobile ? 2.0 : 3.5);

          if (pointer.active) {
            const dx = targetX - pointer.x;
            const dy = targetY - pointer.y;
            const dist = Math.hypot(dx, dy) || 1;
            const range = isMobile ? 80 : 140;
            if (dist < range) {
              const force = (1 - dist / range) * (isMobile ? 6 : 12);
              targetX += (dx / dist) * force;
              targetY += (dy / dist) * force;
            }
          }
        }

        if (snap || reducedMotion || dt === 0) {
          node.x = targetX;
          node.y = targetY;
        } else {
          node.x = damp(node.x, targetX, 10, dt);
          node.y = damp(node.y, targetY, 10, dt);
          node.active *= Math.exp(-0.75 * dt);
          node.activationLevel = damp(node.activationLevel, node.active, 8, dt);
        }
      });

      // Draw Synaptic Bezier Connections
      edges.forEach((edge) => {
        if (!reducedMotion && !snap) edge.active *= Math.exp(-2.2 * dt);

        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;

        const pDist = pointer.active ? Math.hypot(midX - pointer.x, midY - pointer.y) : 9999;
        const pBoost = pDist < 140 ? (1 - pDist / 140) * 0.08 : 0;
        const activity = Math.max(edge.active, from.active * 0.7, to.active * 0.7);

        const dx = to.x - from.x;
        const bend = (seeded(edge.id + 53) - 0.5) * (isMobile ? 18 : 28);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.bezierCurveTo(from.x + dx * 0.44, from.y + bend, to.x - dx * 0.44, to.y - bend, to.x, to.y);

        if (activity > 0.15) {
          ctx.strokeStyle = `rgba(198, 176, 255, ${0.12 + activity * 0.55 + pBoost})`;
          ctx.lineWidth = 0.8 + activity * 1.2;
        } else {
          ctx.strokeStyle = `rgba(165, 139, 232, ${0.05 + pBoost})`;
          ctx.lineWidth = 0.65;
        }
        ctx.stroke();
      });

      // Animate Forward Propagation Pulse across layers
      if (pulse && activeRoute.length > 0) {
        const edge = edges[activeRoute[pulse.step]];
        if (edge) {
          edge.active = 1;
          pulse.progress += dt * 1.8;

          if (pulse.progress >= 1) {
            nodes[edge.to].active = 1;
            nodes[edge.to].activationLevel = 1;

            if (pulse.step < activeRoute.length - 1) {
              pulse = { step: pulse.step + 1, progress: 0 };
            } else {
              pulse = null;
            }
          } else {
            // Glowing signal particle traveling along current Bezier synapse
            const head = edgePoint(edge, pulse.progress);
            const tail = edgePoint(edge, Math.max(0, pulse.progress - 0.14));

            const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
            grad.addColorStop(0, "rgba(111, 227, 215, 0)");
            grad.addColorStop(0.5, "rgba(165, 139, 232, 0.85)");
            grad.addColorStop(1, "rgba(241, 239, 244, 1)");

            ctx.beginPath();
            ctx.moveTo(tail.x, tail.y);
            ctx.lineTo(head.x, head.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2.4;
            ctx.stroke();

            // Particle energy head glow
            ctx.beginPath();
            ctx.arc(head.x, head.y, 2.8, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(head.x, head.y, 6.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(111, 227, 215, 0.45)";
            ctx.fill();
          }
        }
      }

      // Draw Neurons (Nodes)
      nodes.forEach((node) => {
        const isInput = node.layer === 0;
        const isOutput = node.layer === counts.length - 1;

        const baseRadius = isInput || isOutput ? (isMobile ? 3.0 : 3.5) : (isMobile ? 2.0 : 2.4);
        const radius = baseRadius + node.active * 1.8;

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

        if (isInput) {
          ctx.fillStyle = node.active > 0.2 ? "#FFFFFF" : COLORS.data;
        } else if (isOutput) {
          ctx.fillStyle = node.active > 0.2 ? "#FFFFFF" : COLORS.output;
        } else {
          ctx.fillStyle = node.active > 0.2 ? COLORS.neuralHot : COLORS.dimNode;
        }
        ctx.fill();

        // Activation Halo Ring
        if (node.activationLevel > 0.1) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 4 + node.activationLevel * 4, 0, Math.PI * 2);
          ctx.strokeStyle = isOutput
            ? `rgba(255, 128, 107, ${0.15 + node.activationLevel * 0.35})`
            : isInput
            ? `rgba(111, 227, 215, ${0.15 + node.activationLevel * 0.35})`
            : `rgba(165, 139, 232, ${0.12 + node.activationLevel * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Tap/click area hint for input nodes on mobile/desktop
        if (isInput && !interacted) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(111, 227, 215, 0.25)";
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      });

      // Draw Input & Output Layer Labels
      ctx.font = isMobile ? "500 8.5px monospace" : "500 9.5px monospace";
      ctx.textBaseline = "middle";

      // Input labels
      INPUTS.forEach((item, idx) => {
        const node = nodes[idx];
        if (!node) return;
        const isSelected = activeRoute.length > 0 && activeRoute[0] === routes[idx]?.[0];
        ctx.fillStyle = isSelected ? "#FFFFFF" : "rgba(111, 227, 215, 0.75)";
        ctx.fillText(item.label, node.x + (isMobile ? 9 : 12), node.y);
      });

      // Output labels (show active or when inference reached output)
      if (activeOutputIndex >= 0) {
        const layerStarts = starts();
        const outNode = nodes[layerStarts[counts.length - 1] + activeOutputIndex];
        if (outNode && outNode.active > 0.2) {
          const item = OUTPUTS[activeOutputIndex];
          const text = item.label;
          ctx.fillStyle = COLORS.output;
          ctx.fillText(text, outNode.x - ctx.measureText(text).width - (isMobile ? 9 : 12), outNode.y);
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
      if (!destroyed && !reducedMotion && visible && document.visibilityState === "visible" && raf === 0) {
        raf = requestAnimationFrame(loop);
      }
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

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      const point = pointFromEvent(event);
      let hit = -1;
      // Generous 44px+ touch hitbox on mobile
      let radius = isMobile ? 44 : 32;

      for (let i = 0; i < INPUTS.length; i += 1) {
        const node = nodes[i];
        if (!node) continue;
        const dist = Math.hypot(node.x - point.x, node.y - point.y);
        if (dist < radius) {
          radius = dist;
          hit = i;
        }
      }

      if (hit >= 0) {
        startInference(hit, true);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible" && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastTime = 0;
      } else {
        ensureFrame();
      }
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      lastTime = 0;
      clearRoute();
      draw(performance.now(), 0, true);
      ensureFrame();
    };

    const onCta = (event: Event) => {
      const anchor = event.currentTarget as HTMLAnchorElement;
      startInference(Number(anchor.dataset.networkRoute ?? 0), true);
    };

    // Attach listeners
    const ctas = Array.from(hero.querySelectorAll<HTMLAnchorElement>("[data-network-route]"));
    ctas.forEach((cta) => {
      cta.addEventListener("pointerenter", onCta);
      cta.addEventListener("focus", onCta);
    });

    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
          lastTime = 0;
        }
        if (visible) ensureFrame();
      },
      { threshold: 0.02 },
    );
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
      ctas.forEach((cta) => {
        cta.removeEventListener("pointerenter", onCta);
        cta.removeEventListener("focus", onCta);
      });
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="hero-neural-canvas"
        aria-label="Interactive Artificial Neural Network visualization showing forward propagation"
        role="img"
      />
      <span className="network-hint mono" aria-hidden="true">
        <span className="network-hint-desktop">CLICK ANY INPUT NODE TO TRIGGER INFERENCE</span>
        <span className="network-hint-touch">TAP ANY INPUT NODE</span>
      </span>
    </>
  );
}
