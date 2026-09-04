"use client";

import { useEffect, useRef } from "react";

// Types for layer definitions
type LayerDef = {
  count: number;
  color: [string, string];
  kf: number[][]; // [t, y, op, scale, spread]
};

const reduceMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

export function useCanvasAnimation(trackRef: React.RefObject<HTMLElement | null>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!canvas || !track) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0,
      DPR = 1;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * DPR;
      canvas!.height = H * DPR;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    window.addEventListener("resize", resize);
    resize(); // Initial sizing

    const mouse = { x: -9999, y: -9999, active: false };
    
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = e.clientY >= rect.top && e.clientY <= rect.bottom;
    };
    
    const handlePointerLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    const LAYERS: Record<string, LayerDef> = {
      L0: {
        count: 9,
        color: ["#00FFFF", "#8A2BE2"],
        kf: [
          [0, 0.18, 0, 0.6, 1],
          [0.2, 0.18, 1, 1, 1],
          [0.45, 0.16, 0.85, 0.9, 1],
          [0.7, 0.12, 0.35, 0.55, 0.55],
          [0.85, 0.08, 0.12, 0.4, 0.4],
          [1, 0.06, 0.06, 0.3, 0.3],
        ],
      },
      L1: {
        count: 16,
        color: ["#00FFFF", "#8A2BE2"],
        kf: [
          [0, 0.34, 0, 0.5, 1],
          [0.2, 0.34, 0.35, 0.7, 1],
          [0.45, 0.34, 1, 1, 1],
          [0.7, 0.28, 0.55, 0.7, 0.6],
          [0.85, 0.22, 0.18, 0.4, 0.32],
          [1, 0.18, 0.08, 0.28, 0.22],
        ],
      },
      L2: {
        count: 12,
        color: ["#FF00FF", "#8A2BE2"],
        kf: [
          [0, 0.5, 0, 0.5, 1],
          [0.2, 0.5, 0, 0.5, 1],
          [0.45, 0.52, 0.4, 0.75, 1],
          [0.7, 0.5, 1, 1.05, 1],
          [0.85, 0.4, 0.42, 0.55, 0.4],
          [1, 0.32, 0.12, 0.3, 0.24],
        ],
      },
      BN: {
        count: 5,
        color: ["#F4F4FF", "#FF00FF"],
        kf: [
          [0, 0.62, 0, 0.6, 0.5],
          [0.45, 0.62, 0, 0.6, 0.5],
          [0.7, 0.62, 0.65, 0.85, 0.5],
          [0.85, 0.55, 1, 1.35, 0.22],
          [1, 0.45, 0.45, 0.9, 0.3],
        ],
      },
      OUT: {
        count: 5,
        color: ["#FF00FF", "#00FFFF"],
        kf: [
          [0, 0.8, 0, 0.6, 1],
          [0.7, 0.8, 0, 0.6, 1],
          [0.85, 0.8, 0.35, 0.65, 1],
          [1, 0.78, 1, 1, 1],
        ],
      },
    };
    
    const LAYER_ORDER = ["L0", "L1", "L2", "BN", "OUT"];
    
    const EDGE_DEFS = [
      { a: "L0", b: "L1", fan: 3, activeWindow: [0.15, 0.55] },
      { a: "L1", b: "L2", fan: 3, activeWindow: [0.4, 0.78] },
      { a: "L2", b: "BN", fan: 2, activeWindow: [0.62, 0.92] },
      { a: "BN", b: "OUT", fan: 5, activeWindow: [0.8, 1.0] },
    ];

    function interp(kf: number[][], t: number) {
      if (t <= kf[0][0]) return kf[0].slice(1);
      if (t >= kf[kf.length - 1][0]) return kf[kf.length - 1].slice(1);
      for (let i = 0; i < kf.length - 1; i++) {
        const a = kf[i],
          b = kf[i + 1];
        if (t >= a[0] && t <= b[0]) {
          let f = (t - a[0]) / (b[0] - a[0] + 1e-9);
          f = f * f * (3 - 2 * f);
          const out = [];
          for (let k = 1; k < a.length; k++) out.push(a[k] + (b[k] - a[k]) * f);
          return out;
        }
      }
      return kf[kf.length - 1].slice(1);
    }

    let nodes: any[] = [];
    let edges: any[] = [];

    function buildNetwork() {
      nodes = [];
      let idCounter = 0;
      LAYER_ORDER.forEach((key) => {
        const def = LAYERS[key];
        for (let i = 0; i < def.count; i++) {
          nodes.push({
            id: idCounter++,
            layer: key,
            idx: i,
            n: def.count,
            x: Math.random() * W,
            y: Math.random() * H,
            scatterX: Math.random() * W,
            scatterY: Math.random() * H,
            vx: 0,
            vy: 0,
            wanderPhase: Math.random() * Math.PI * 2,
            wanderSpeed: 0.4 + Math.random() * 0.5,
            charge: Math.random(),
            fireT: -10,
            baseColor: def.color[0],
            altColor: def.color[1],
            size: 3 + Math.random() * 1.5,
          });
        }
      });
      edges = [];
      EDGE_DEFS.forEach((ed) => {
        const A = nodes.filter((n) => n.layer === ed.a);
        const B = nodes.filter((n) => n.layer === ed.b);
        A.forEach((na) => {
          for (let k = 0; k < ed.fan; k++) {
            const nb =
              B[(na.idx * ed.fan + k + Math.floor(Math.random() * 2)) % B.length];
            edges.push({
              a: na,
              b: nb,
              type: ed.a + "-" + ed.b,
              activeWindow: ed.activeWindow,
              pulse: Math.random(),
            });
          }
        });
      });
    }

    function nodeHome(node: any, t: number) {
      const def = LAYERS[node.layer];
      const [yFrac, op, scale, spread] = interp(def.kf, t);
      const n = node.n;
      const midW = W * 0.5;
      const totalSpan = Math.min(W * 0.72, 900) * spread;
      const startX = midW - totalSpan / 2;
      const stepX = n > 1 ? totalSpan / (n - 1) : 0;
      const jitterY = (node.idx % 2 === 0 ? -1 : 1) * 10 * (1 - scale);
      return {
        x: n > 1 ? startX + stepX * node.idx : midW,
        y: H * yFrac + jitterY,
        op: Math.max(0, Math.min(1, op)),
        scale: Math.max(0.02, scale),
      };
    }

    let scrollProgress = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    function computeProgress() {
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const trackHeight = track.offsetHeight - window.innerHeight;
      let p = (window.scrollY - trackTop) / Math.max(1, trackHeight);
      p = Math.max(0, Math.min(1, p));
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollVelocity = scrollVelocity * 0.85 + Math.min(4, Math.abs(dy)) * 0.15;
      scrollProgress = p;
    }
    window.addEventListener("scroll", computeProgress, { passive: true });

    let pulses: any[] = [];
    function spawnPulses(dt: number) {
      const p = scrollProgress;
      EDGE_DEFS.forEach((ed) => {
        const [w0, w1] = ed.activeWindow;
        if (p < w0 - 0.05 || p > w1 + 0.08) return;
        const activity = Math.max(
          0,
          Math.min(1, (p - w0) / (w1 - w0 || 0.001))
        );
        const rate =
          (0.15 + scrollVelocity * 0.35 + activity * 0.5) * dt * 60;
        if (Math.random() < rate * 0.06) {
          const candidates = edges.filter((e) => e.type === ed.a + "-" + ed.b);
          if (!candidates.length) return;
          const e =
            candidates[Math.floor(Math.random() * candidates.length)];
          pulses.push({
            edge: e,
            t: 0,
            speed: 0.008 + scrollVelocity * 0.01 + Math.random() * 0.006,
          });
        }
      });
      if (pulses.length > 260) pulses.splice(0, pulses.length - 260);
    }

    function distToSeg(
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) {
      const dx = x2 - x1,
        dy = y2 - y1;
      const len2 = dx * dx + dy * dy || 1e-6;
      let t = ((px - x1) * dx + (py - y1) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const cx = x1 + dx * t,
        cy = y1 + dy * t;
      return Math.hypot(px - cx, py - cy);
    }

    let lastT = performance.now();
    let activeSynapseCount = 0;
    
    // Setup for softmax logic in animation loop
    const OUTPUT_TOKENS = [
      { label: "mat", target: 0.72 },
      { label: "rug", target: 0.11 },
      { label: "floor", target: 0.08 },
      { label: "chair", target: 0.05 },
      { label: "sofa", target: 0.04 },
    ];
    let softmaxFilled = false;

    function step(now: number) {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      scrollVelocity *= 0.94;

      ctx!.clearRect(0, 0, W, H);

      const t = scrollProgress;
      const time = now / 1000;

      nodes.forEach((node) => {
        const home = nodeHome(node, t);
        node.op = home.op;
        node.scale = home.scale;
        const wanderAmt = reduceMotion ? 2 : 10 * home.scale;
        const wx =
          Math.sin(time * node.wanderSpeed + node.wanderPhase) * wanderAmt;
        const wy =
          Math.cos(time * node.wanderSpeed * 0.8 + node.wanderPhase * 1.3) *
          wanderAmt;
        let tx = home.x + wx,
          ty = home.y + wy;

        if (mouse.active && home.op > 0.05) {
          const dx = node.x - mouse.x,
            dy = node.y - mouse.y;
          const dist = Math.hypot(dx, dy) || 1;
          const radius = 140;
          if (dist < radius) {
            const f = 1 - dist / radius;
            if (dist < 40) {
              tx = tx * (1 - f * 0.6) + mouse.x * (f * 0.6);
              ty = ty * (1 - f * 0.6) + mouse.y * (f * 0.6);
            } else {
              tx += (dx / dist) * f * 34;
              ty += (dy / dist) * f * 34;
            }
          }
        }

        node.x += (tx - node.x) * Math.min(1, dt * 4.2);
        node.y += (ty - node.y) * Math.min(1, dt * 4.2);

        node.charge += (Math.random() - 0.5) * 0.06;
        node.charge = Math.max(0, Math.min(1, node.charge));
        const stage3Boost = t > 0.42 && t < 0.8 ? 1 : 0.15;
        if (
          node.charge > 0.86 &&
          Math.random() < 0.02 * stage3Boost * (1 + scrollVelocity)
        ) {
          node.fireT = time;
          node.charge = 0.15;
        }
      });

      activeSynapseCount = 0;
      edges.forEach((e) => {
        const opA = e.a.op,
          opB = e.b.op;
        const baseOp = Math.min(opA, opB);
        if (baseOp < 0.02) return;

        const [w0, w1] = e.activeWindow;
        let activity = 0;
        if (t >= w0 - 0.06 && t <= w1 + 0.1) {
          activity = 1 - Math.abs((t - (w0 + w1) / 2) / ((w1 - w0) / 2 + 0.12));
          activity = Math.max(0, Math.min(1, activity));
        }
        let alpha = baseOp * (0.05 + activity * 0.35);

        let mouseGlow = 0;
        if (mouse.active) {
          const d = distToSeg(
            mouse.x,
            mouse.y,
            e.a.x,
            e.a.y,
            e.b.x,
            e.b.y
          );
          mouseGlow = Math.max(0, 1 - d / 120);
        }
        alpha = Math.min(1, alpha + mouseGlow * 0.55 * baseOp);
        if (alpha <= 0.01) return;
        if (mouseGlow > 0.15) activeSynapseCount++;

        const grad = ctx!.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
        const c1 = mouseGlow > 0.25 ? "#00FFFF" : e.a.baseColor;
        const c2 = mouseGlow > 0.25 ? "#FF00FF" : e.b.baseColor;
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);

        ctx!.strokeStyle = grad;
        ctx!.globalAlpha = alpha;
        ctx!.lineWidth = 0.6 + mouseGlow * 1.6 + activity * 0.8;
        ctx!.beginPath();
        const cx1 = e.a.x + (e.b.x - e.a.x) * 0.5;
        const cy1 = e.a.y;
        const cy2 = e.b.y;
        ctx!.moveTo(e.a.x, e.a.y);
        ctx!.bezierCurveTo(cx1, cy1, cx1, cy2, e.b.x, e.b.y);
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      });

      spawnPulses(dt);
      pulses = pulses.filter((p) => p.t < 1);
      pulses.forEach((p) => {
        p.t += p.speed;
        const e = p.edge;
        const bt = Math.max(0, Math.min(1, p.t));
        const cx1 = e.a.x + (e.b.x - e.a.x) * 0.5,
          cy1 = e.a.y,
          cy2 = e.b.y;
        const x =
          Math.pow(1 - bt, 3) * e.a.x +
          3 * Math.pow(1 - bt, 2) * bt * cx1 +
          3 * (1 - bt) * bt * bt * cx1 +
          Math.pow(bt, 3) * e.b.x;
        const y =
          Math.pow(1 - bt, 3) * e.a.y +
          3 * Math.pow(1 - bt, 2) * bt * cy1 +
          3 * (1 - bt) * bt * bt * cy2 +
          Math.pow(bt, 3) * e.b.y;
        const op = Math.min(e.a.op, e.b.op) * (1 - Math.abs(bt - 0.5) * 0.6);
        ctx!.beginPath();
        ctx!.fillStyle = "#00FFFF";
        ctx!.shadowColor = "#FF00FF";
        ctx!.shadowBlur = 8;
        ctx!.globalAlpha = Math.max(0, op);
        ctx!.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;
        ctx!.globalAlpha = 1;
      });

      let visibleCount = 0;
      nodes.forEach((node) => {
        if (node.op < 0.02) return;
        visibleCount++;
        const firing = time - node.fireT < 0.35;
        const fireAmt = firing ? 1 - (time - node.fireT) / 0.35 : 0;
        const r = node.size * node.scale * (1 + fireAmt * 1.8);

        let dToMouse = 9999;
        if (mouse.active) {
          dToMouse = Math.hypot(node.x - mouse.x, node.y - mouse.y);
        }
        const mouseBoost = mouse.active ? Math.max(0, 1 - dToMouse / 110) : 0;

        const glowColor = firing
          ? "#FF00FF"
          : mouseBoost > 0.3
          ? "#00FFFF"
          : node.baseColor;
        ctx!.save();
        ctx!.globalAlpha = node.op;
        ctx!.shadowColor = glowColor;
        ctx!.shadowBlur =
          6 + fireAmt * 22 + mouseBoost * 14 + (node.layer === "BN" ? 14 * node.scale : 0);
        ctx!.fillStyle = glowColor;
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, Math.max(0.6, r), 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      });

      // Update UI elements dynamically using IDs
      updateUIElements(t, visibleCount, activeSynapseCount, scrollVelocity, time);
      updateSoftmaxUI(t);

      animationRef.current = requestAnimationFrame(step);
    }
    
    function updateUIElements(t: number, visibleCount: number, activeSynapseCount: number, scrollVelocity: number, time: number) {
      const el = (id: string) => document.getElementById(id);
      
      const scrollReadout = el("scrollReadout");
      if (scrollReadout) scrollReadout.textContent = Math.round(t * 100) + "%";
      
      const stepNum = t < 0.2 ? 1 : t < 0.45 ? 2 : t < 0.7 ? 3 : t < 0.85 ? 4 : 5;
      const stepReadout = el("stepReadout");
      if (stepReadout) stepReadout.textContent = "0" + stepNum + " / 05";
      
      const nodeReadout = el("nodeReadout");
      if (nodeReadout) nodeReadout.textContent = visibleCount.toString();
      
      const progressFill = el("progressFill");
      if (progressFill) progressFill.style.width = t * 100 + "%";

      const mSynapses = el("m-synapses");
      if (mSynapses) mSynapses.textContent = activeSynapseCount.toString();
      
      const mVelocity = el("m-velocity");
      if (mVelocity) mVelocity.textContent = scrollVelocity.toFixed(1) + "×";
      
      const firingRate = Math.round(
        20 + Math.sin(time * 1.7) * 8 + Math.min(60, scrollVelocity * 30)
      );
      const mFiring = el("m-firing");
      if (mFiring) mFiring.textContent = Math.max(0, firingRate) + "%";
      
      const mCross = el("m-cross");
      if (mCross) mCross.textContent = Math.floor((time * 3) % 400 + 120).toString();
      
      const mCompress = el("m-compress");
      if (mCompress) {
        mCompress.textContent = Math.round(
          80 * Math.max(0, Math.min(1, (t - 0.6) / 0.3))
        ) + "×".replace("0×", "—");
      }
      
      const mIntensity = el("m-intensity");
      if (mIntensity) {
        mIntensity.textContent = Math.round(
          Math.max(0, Math.min(1, (t - 0.68) / 0.2)) * 100
        ) + "%";
      }

      if (Math.random() < 0.05) {
        const v = () => (Math.random() * 2 - 1).toFixed(2);
        const mVec = el("m-vec");
        if (mVec) mVec.textContent = `[${v()}, ${v()}, ${v()}]`;
      }

      // Card visibility
      const setCardVisible = (id: string, cond: boolean) => {
        const card = el(id);
        if (card) {
          if (cond) card.classList.add("visible");
          else card.classList.remove("visible");
        }
      };
      
      setCardVisible("card1", t >= -0.001 && t < 0.24);
      setCardVisible("card2", t >= 0.16 && t < 0.49);
      setCardVisible("card3", t >= 0.41 && t < 0.74);
      setCardVisible("card4", t >= 0.66 && t < 0.89);
      setCardVisible("card5", t >= 0.83);
    }
    
    function updateSoftmaxUI(t: number) {
      const visible = t > 0.86;
      const softmaxEl = document.getElementById("softmax");
      if (!softmaxEl) return;
      
      if (visible) {
        softmaxEl.classList.add("visible");
      } else {
        softmaxEl.classList.remove("visible");
      }

      if (visible && !softmaxFilled) {
        softmaxFilled = true;
        const cols = softmaxEl.querySelectorAll(".col");
        cols.forEach((col, i) => {
          const tok = OUTPUT_TOKENS[i];
          const fill = col.querySelector(".fill") as HTMLElement;
          const pct = col.querySelector(".pct") as HTMLElement;
          if (!fill || !pct) return;
          
          requestAnimationFrame(() => {
            fill.style.height = tok.target * 100 + "%";
          });
          const dur = 1100,
            start = performance.now();
          function anim(now: number) {
            const f = Math.min(1, (now - start) / dur);
            pct.textContent = Math.round(tok.target * 100 * f) + "%";
            if (f < 1) requestAnimationFrame(anim);
          }
          requestAnimationFrame(anim);
        });
      } else if (!visible && softmaxFilled) {
        softmaxFilled = false;
        softmaxEl.querySelectorAll(".fill").forEach((f) => {
          (f as HTMLElement).style.height = "0%";
        });
        softmaxEl.querySelectorAll(".pct").forEach((p) => {
          (p as HTMLElement).textContent = "0%";
        });
      }
    }

    buildNetwork();
    computeProgress();
    animationRef.current = requestAnimationFrame(step);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", computeProgress);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trackRef]);

  return canvasRef;
}

export function NeuralCanvas({ trackRef }: { trackRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useCanvasAnimation(trackRef);

  return (
    <canvas
      ref={canvasRef}
      id="net"
      className="absolute inset-0 w-full h-full block"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
