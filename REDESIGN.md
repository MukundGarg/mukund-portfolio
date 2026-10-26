# TASK: Complete Responsive Redesign of My Personal Portfolio — Artificial Neural Network Theme

You are acting as a senior frontend engineer, creative developer, UI/UX designer, and responsive-design specialist.

Your task is to **inspect, redesign, implement, test, and refine my existing portfolio website**.

This is an implementation task, not a request for suggestions, mockups, or a design plan alone. Make the necessary code changes in the actual repository.

## 1. Repository and existing architecture

GitHub repository:
https://github.com/MukundGarg/mukund-portfolio

First inspect the complete repository and understand the current implementation before making changes.

The existing project uses:

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- A custom animated neural-network canvas

Important existing files include:

- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `components/native-portfolio.tsx`
- `components/hero-neural-canvas.tsx`
- `components/portfolio.tsx`
- `lib/portfolio-data.ts`

Read `AGENTS.md` and follow any project-specific instructions, including the relevant Next.js documentation.

Do not unnecessarily replace the existing technology stack. Reuse appropriate components and refactor those that need improvement.

Before making major changes, preserve the working implementation in Git so it can be restored if necessary.

## 2. Main problems that MUST be fixed

My current website has several issues:

**Problem A — Mobile responsiveness**

The mobile layout does not fit the viewport correctly.

Text, sections, navigation, and other elements need to fit naturally within the screen width.

Audit and eliminate:

- Horizontal scrolling and overflowing elements.
- Oversized headings that extend beyond the viewport.
- Broken or cramped navigation.
- Inconsistent padding and section spacing.
- Project diagrams and content grids that do not scale down.
- Content clipping caused by fixed widths, oversized elements, or incorrect positioning.
- Animation canvases that render incorrectly on mobile.
- Touch targets that are too small.
- Layout shifts and unnecessary empty space.

Do not simply hide horizontal overflow to disguise broken layout. Fix the actual underlying sizing and positioning problems.

**Problem B — Desktop and laptop design**

Audit the experience at normal laptop and desktop screen sizes.

Improve:

- Typography and heading proportions.
- Overall layout balance.
- Content hierarchy.
- Navigation positioning.
- Alignment and spacing.
- Project section composition.
- Use of negative space.
- Animation placement and visual focus.
- Readability and visual consistency.

The website should feel intentionally designed at both 1366px laptop width and larger desktop resolutions.

**Problem C — Generic, static appearance**

The current design feels too static and resembles a generic AI-generated portfolio.

Eliminate the appearance of repetitive template sections, generic cards, arbitrary glowing effects, and predictable layouts.

Develop a distinctive visual identity connected to my specialization in artificial intelligence, machine learning, and neural networks.

The result should feel like a carefully crafted portfolio for an AI/ML engineer.

## 3. Primary design direction

**Design concept: The Neural Network / Intelligence Interface**

The entire website should visually communicate the idea of an artificial neural network.

Think of the website as an intelligent system where data flows through interconnected neurons and layers.

Visual inspiration:

- Artificial neural networks.
- Neurons and weighted connections.
- Input, hidden, and output layers.
- Forward propagation.
- Flowing data and inference.
- Signal transmission.
- Scientific visualizations.
- Minimal futuristic computing interfaces.
- High-end creative developer portfolios.

The design should be sophisticated, minimal, technical, and experimental without sacrificing usability.

### Design language

Use a predominantly dark theme:

- Near-black background.
- Soft white typography.
- Restrained gray secondary text.
- Subtle silver connections.
- Controlled cool cyan and muted violet accents for active neural signals.

Avoid excessive neon colors, saturated gradients, large generic glass cards, and decorative effects that do not serve a purpose.

Favor precise typography, thin lines, subtle borders, elegant motion, restrained accent colors, and thoughtful whitespace.

## 4. Attached design reference

I am providing a design reference containing the `GatewayFlow` React component and its source implementation.

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
gateway-flow.tsx
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type NeuformMode = "dark" | "light";
type NeuformModePreference = NeuformMode | "auto";

type FocusTarget = {
  selector: string;
  role: "background" | "ui";
  width?: string;
};

type BakeKnobs = {
  size: number;
  gap: number;
  length: number;
  density: number;
  strokeWidth: number;
  mode: NeuformMode;
};

type EffectDefinition = {
  title: string;
  source: string;
  background: string | ((mode: NeuformMode) => string);
  defaultMode?: NeuformModePreference;
  supportsMode?: boolean;
  targets: readonly FocusTarget[];
  focusCss?: string;
  patch?: (source: string, knobs: BakeKnobs) => string;
};

export type GatewayFlowProps = {
  mode?: NeuformModePreference;
  speed?: number;
  size?: number;
  gap?: number;
  length?: number;
  density?: number;
  strokeWidth?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

const GATEWAY_FLOW_DEFAULTS = {
  mode: "dark" as NeuformMode,
  speed: 1,
  size: 1,
  gap: 2,
  length: 1,
  density: 1,
  strokeWidth: 1,
  opacity: 1,
  hue: 0,
  saturation: 1,
  brightness: 1,
} as const;

const LIGHT_PAPER = "#eef1f6";

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function scaleCount(base: number, density: number, minimum = 1) {
  return Math.max(minimum, Math.round(base * density));
}

function resolveMode(
  mode: NeuformMode | number | string | undefined,
  fallback: NeuformMode = "dark",
): NeuformMode {
  if (mode === undefined || mode === null) return fallback;
  if (mode === "light" || mode === 1 || mode === "1") return "light";
  return "dark";
}

function readAutomaticMode(): NeuformMode {
  if (typeof document === "undefined" || typeof window === "undefined")
    return "dark";
  const root = document.documentElement;
  const declared = root.dataset.scheme ?? root.dataset.theme;
  if (declared === "light" || declared === "dark") return declared;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function useAutomaticMode(enabled: boolean) {
  const [mode, setMode] = useState<NeuformMode>(readAutomaticMode);

  useEffect(() => {
    if (
      !enabled ||
      typeof document === "undefined" ||
      typeof window === "undefined"
    )
      return undefined;
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setMode(readAutomaticMode());
    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-scheme", "data-theme"],
    });
    media.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, [enabled]);

  return mode;
}

function resolveBackground(
  background: EffectDefinition["background"],
  mode: NeuformMode,
) {
  return typeof background === "function" ? background(mode) : background;
}

const gatewayFlowSource = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus Gateway</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300&display=swap" rel="stylesheet">
</head>
<body class="bg-black text-slate-300 antialiased min-h-screen flex flex-col selection:bg-slate-700 selection:text-white relative" style="font-family: 'Inter', sans-serif;">

    <!-- Global Dither Overlay -->
    <div class="fixed inset-0 z-50 pointer-events-none opacity-[0.15]" style="background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%202%202%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23ffffff%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23ffffff%22%2F%3E%3C%2Fsvg%3E'); background-size: 2px 2px;"></div>

    <!-- Visualization Background -->
    <div class="fixed inset-0 z-0 overflow-hidden bg-black">
        <div class="absolute inset-0 z-0 opacity-10" style="background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.01) 0%, rgba(0, 0, 0, 0) 80%);"></div>
        <canvas id="flow-canvas" class="absolute inset-0 w-full h-full z-10"></canvas>
    </div>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center justify-center relative z-30 px-6 py-12 min-h-screen w-full">
        
        <!-- Premium Login Card with Hover Border Gradient -->
        <div class="max-w-md w-full bg-black/95 backdrop-blur-xl rounded-2xl p-7 md:p-8 shadow-2xl flex flex-col relative group">
            
            <!-- Base Border -->
            <div class="absolute inset-0 border border-white/[0.04] rounded-2xl pointer-events-none transition-colors duration-500 group-hover:border-transparent"></div>
            
            <!-- Hover Gradient Border -->
            <div class="absolute inset-0 p-[1px] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.15),transparent)] [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor] pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

            <!-- Header Text -->
            <div class="text-center mb-8 w-full relative z-20">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/50 border border-slate-700/50 mb-6 shadow-inner">
                    <iconify-icon icon="solar:cpu-bolt-linear" width="24" height="24" stroke-width="1.5" class="text-slate-200"></iconify-icon>
                </div>
                <h1 id="reveal-title" class="text-3xl md:text-4xl font-thin tracking-tight text-white leading-tight mb-3 uppercase flex flex-wrap justify-center gap-x-2">
                    <span class="overflow-hidden inline-block pt-1"><span class="reveal-word inline-block translate-y-[120%]">Nexus</span></span>
                    <span class="overflow-hidden inline-block pt-1"><span class="reveal-word inline-block translate-y-[120%]">Gateway</span></span>
                </h1>
                <p class="text-sm text-slate-500 font-extralight leading-relaxed">
                    Verify identity to initialize secure connection with the primary framework. Oversee active protocols and routing.
                </p>
            </div>

            <!-- Form -->
            <form class="space-y-5 relative z-20">
                <div>
                    <label for="identifier" class="text-xs font-light text-slate-400 mb-1.5 block uppercase tracking-widest">Operative ID</label>
                    <div class="relative rounded-lg bg-black/80 group/input">
                        <div class="absolute inset-0 border border-slate-800/80 rounded-lg pointer-events-none transition-colors duration-300 group-hover/input:border-transparent focus-within:border-transparent"></div>
                        <div class="absolute inset-0 p-[1px] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor] pointer-events-none rounded-lg opacity-0 group-hover/input:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-10"></div>
                        <input type="text" id="identifier" class="relative w-full bg-transparent px-3 py-2 text-sm text-slate-200 focus:outline-none z-20 placeholder-slate-700 font-extralight" placeholder="operative@nexus.net">
                    </div>
                </div>
                <div>
                    <div class="flex justify-between items-center mb-1.5">
                        <label for="key" class="text-xs font-light text-slate-400 block uppercase tracking-widest">Security Key</label>
                        <a href="#" class="text-xs font-extralight text-slate-400 hover:text-white transition-colors underline decoration-slate-700 underline-offset-2">Recover access</a>
                    </div>
                    <div class="relative rounded-lg bg-black/80 group/input">
                        <div class="absolute inset-0 border border-slate-800/80 rounded-lg pointer-events-none transition-colors duration-300 group-hover/input:border-transparent focus-within:border-transparent"></div>
                        <div class="absolute inset-0 p-[1px] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor] pointer-events-none rounded-lg opacity-0 group-hover/input:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-10"></div>
                        <input type="password" id="key" class="relative w-full bg-transparent pl-3 pr-10 py-2 text-sm text-slate-200 focus:outline-none z-20 placeholder-slate-700 font-extralight" placeholder="••••••••">
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors z-30" aria-label="Toggle visibility">
                            <iconify-icon icon="solar:eye-linear" width="16" height="16" stroke-width="1.5"></iconify-icon>
                        </button>
                    </div>
                </div>
                <div class="flex items-center gap-2 pt-1">
                    <div class="relative flex items-center justify-center w-4 h-4">
                        <input type="checkbox" id="session" class="peer appearance-none w-4 h-4 border border-slate-700 rounded bg-black/50 checked:bg-slate-300 checked:border-slate-300 cursor-pointer transition-colors">
                        <iconify-icon icon="solar:check-linear" width="12" height="12" stroke-width="1.5" class="absolute text-black opacity-0 peer-checked:opacity-100 pointer-events-none"></iconify-icon>
                    </div>
                    <label for="session" class="text-xs font-extralight text-slate-400 cursor-pointer select-none uppercase tracking-wider">Maintain persistent uplink</label>
                </div>
                
                <!-- Primary Button -->
                <button type="submit" class="w-full bg-[#0a0a0a] hover:bg-[#111] text-white text-sm font-light py-2.5 rounded-lg transition-all mt-2 uppercase tracking-widest relative group/btn shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]">
                    <div class="absolute inset-0 border border-white/10 rounded-lg pointer-events-none transition-colors duration-300 group-hover/btn:border-transparent"></div>
                    <div class="absolute inset-0 p-[1px] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.4),transparent)] [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor] pointer-events-none rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-10"></div>
                    <span class="relative z-20">Initialize Uplink</span>
                </button>
            </form>

            <!-- Divider -->
            <div class="relative flex items-center py-6 z-20">
                <div class="flex-grow border-t border-slate-800/60"></div>
                <span class="flex-shrink-0 px-4 text-xs font-extralight text-slate-600 uppercase tracking-widest">Alternative Auth</span>
                <div class="flex-grow border-t border-slate-800/60"></div>
            </div>

            <!-- Alternative Options -->
            <div class="grid grid-cols-2 gap-3 z-20">
                <button type="button" class="relative flex items-center justify-center gap-2 w-full bg-black/40 hover:bg-slate-900 rounded-lg py-2.5 text-sm text-slate-400 hover:text-slate-200 transition-colors font-extralight group/alt">
                    <div class="absolute inset-0 border border-slate-800/80 rounded-lg pointer-events-none transition-colors duration-300 group-hover/alt:border-transparent"></div>
                    <div class="absolute inset-0 p-[1px] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor] pointer-events-none rounded-lg opacity-0 group-hover/alt:opacity-100 transition-opacity duration-300 z-10"></div>
                    <span class="relative z-20 flex items-center gap-2"><iconify-icon icon="solar:buildings-linear" width="18" height="18" stroke-width="1.5"></iconify-icon> Corporate SSO</span>
                </button>
                <button type="button" class="relative flex items-center justify-center gap-2 w-full bg-black/40 hover:bg-slate-900 rounded-lg py-2.5 text-sm text-slate-400 hover:text-slate-200 transition-colors font-extralight group/alt">
                    <div class="absolute inset-0 border border-slate-800/80 rounded-lg pointer-events-none transition-colors duration-300 group-hover/alt:border-transparent"></div>
                    <div class="absolute inset-0 p-[1px] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor] pointer-events-none rounded-lg opacity-0 group-hover/alt:opacity-100 transition-opacity duration-300 z-10"></div>
                    <span class="relative z-20 flex items-center gap-2"><iconify-icon icon="solar:code-circle-linear" width="18" height="18" stroke-width="1.5"></iconify-icon> Git Auth</span>
                </button>
            </div>
        </div>

        <!-- Social Proof -->
        <div class="mt-8 flex flex-col items-center gap-4 relative z-20">
            <div class="flex -space-x-2">
                <img src="https://cdn.21st.dev/assets/localized/bba3220f058938fca64a658ed7bc7e88e92151754b572a90a2a3634979517541.jpg" alt="Active Node" class="w-10 h-10 rounded-full border border-slate-800 bg-black object-cover shadow-lg">
                <img src="https://cdn.21st.dev/assets/localized/2739f91b816b2962674544bbf18e60661b4447bd222366cc57c8bf8c1ff3db5d.jpg" alt="Active Node" class="w-10 h-10 rounded-full border border-slate-800 bg-black object-cover shadow-lg">
                <img src="https://cdn.21st.dev/assets/localized/380665b3fe4d47990da36c79a8c8ac09779534d1d9687430bb2a8a750843bada.jpg" alt="Active Node" class="w-10 h-10 rounded-full border border-slate-800 bg-black object-cover shadow-lg">
                <div class="w-10 h-10 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-xs text-slate-300 font-extralight shadow-lg">+</div>
            </div>
            <p class="text-xs text-slate-600 font-extralight uppercase tracking-widest">Validated by distributed consensus nodes</p>
        </div>

    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // GSAP Masked Reveal for Heading
            gsap.registerPlugin(ScrollTrigger);
            gsap.to(".reveal-word", {
                y: "0%",
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: "#reveal-title",
                    start: "top 95%",
                }
            });

            // Flow Canvas Animation
            const canvas = document.getElementById('flow-canvas');
            const ctx = canvas.getContext('2d');
            
            let width, height;
            let explosions = [];

            function resize() {
                const dpr = window.devicePixelRatio || 1;
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                ctx.scale(dpr, dpr);
            }
            window.addEventListener('resize', resize);
            resize();

            window.addEventListener('click', (e) => {
                explosions.push({ x: e.clientX, y: e.clientY, radius: 0, life: 1 });
            });

            const paths = [];
            const numPaths = 80;
            
            for(let i = 0; i < numPaths; i++) {
                paths.push({
                    isLeft: i % 2 === 0,
                    startY: (i / numPaths) * height * 1.4 - height * 0.2,
                    particles: [{
                        t: Math.random(),
                        speed: 0.0015 + Math.random() * 0.002
                    }]
                });
            }

            function getBezierPoint(t, p0, p1, p2, p3) {
                const u = 1 - t;
                return {
                    x: u**3 * p0.x + 3 * u**2 * t * p1.x + 3 * u * t**2 * p2.x + t**3 * p3.x,
                    y: u**3 * p0.y + 3 * u**2 * t * p1.y + 3 * u * t**2 * p2.y + t**3 * p3.y
                };
            }

            function render() {
                ctx.clearRect(0, 0, width, height);
                const centerX = width / 2;
                const centerY = height / 2;

                explosions.forEach(exp => {
                    exp.radius += 15;
                    exp.life -= 0.015;
                });
                explosions = explosions.filter(exp => exp.life > 0);

                paths.forEach(path => {
                    const p0 = { x: path.isLeft ? 0 : width, y: path.startY };
                    const p1 = { x: path.isLeft ? centerX * 0.5 : width - centerX * 0.5, y: path.startY };
                    const p2 = { x: path.isLeft ? centerX * 0.8 : width - centerX * 0.8, y: centerY };
                    const p3 = { x: centerX, y: centerY };

                    ctx.beginPath();
                    ctx.moveTo(p0.x, p0.y);
                    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
                    ctx.lineWidth = 1.2;
                    ctx.setLineDash([1, 4]);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    path.particles.forEach(p => {
                        p.t += p.speed;
                        if (p.t > 1) {
                            p.t = 0;
                            path.startY += (Math.random() - 0.5) * 10;
                        }

                        let pos = getBezierPoint(p.t, p0, p1, p2, p3);

                        let dxTotal = 0, dyTotal = 0;
                        explosions.forEach(exp => {
                            let dx = pos.x - exp.x;
                            let dy = pos.y - exp.y;
                            let dist = Math.hypot(dx, dy);
                            if (dist < exp.radius + 120 && dist > exp.radius - 120) {
                                let force = (1 - Math.abs(dist - exp.radius) / 120) * exp.life;
                                dxTotal += (dx / dist) * force * 80;
                                dyTotal += (dy / dist) * force * 80;
                            }
                        });
                        
                        pos.x += dxTotal;
                        pos.y += dyTotal;

                        ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;
                        ctx.fillRect(pos.x - 1.5, pos.y - 1.5, 3, 3);
                    });
                });
                
                requestAnimationFrame(render);
            }
            
            render();
        });
    </script>
</body>
</html>`;

const GATEWAY_FLOW_DEFINITION: EffectDefinition = {
  title: "Gateway Flow",
  source: gatewayFlowSource,
  supportsMode: true,
  background: (mode) => (mode === "light" ? LIGHT_PAPER : "#000000"),
  targets: [{ selector: "#flow-canvas", role: "background" }],
  patch(source, { size, density, mode }) {
    let next = source
      .replace(
        "const numPaths = 80;",
        `const numPaths = ${scaleCount(80, density, 12)};`,
      )
      .replace(
        "p.t += p.speed;",
        "p.t += p.speed * ((window.__SF_CONTROLS&&window.__SF_CONTROLS.speed)||1);",
      )
      .replace(
        "ctx.lineWidth = 1.2;",
        `ctx.lineWidth = ${Number((1.2 * size).toFixed(2))};`,
      );
    if (mode === "light") {
      next = next
        .replace(
          "ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';",
          "ctx.strokeStyle = 'rgba(26, 31, 42, 0.4)';",
        )
        .replace(
          "ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;",
          "ctx.fillStyle = `rgba(26, 31, 42, 0.75)`;",
        );
    }
    return next;
  },
};

function buildFocusedDocument(
  definition: EffectDefinition,
  knobs: BakeKnobs & { speed: number; opacity: number },
) {
  const mode = knobs.mode;
  const background = resolveBackground(definition.background, mode);
  const targetJson = JSON.stringify(definition.targets).replace(
    /</g,
    "\\u003c",
  );
  const controlsJson = JSON.stringify({
    mode,
    speed: knobs.speed,
    size: knobs.size,
    gap: knobs.gap,
    length: knobs.length,
    density: knobs.density,
    strokeWidth: knobs.strokeWidth,
    opacity: knobs.opacity,
  }).replace(/</g, "\\u003c");
  const patchedSource = definition.patch
    ? definition.patch(definition.source, {
        size: knobs.size,
        gap: knobs.gap,
        length: knobs.length,
        density: knobs.density,
        strokeWidth: knobs.strokeWidth,
        mode,
      })
    : definition.source;
  const focusStyle = `<style data-threeui-focus>
html, body { width: 100% !important; height: 100% !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: ${background} !important; }
body { position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; }
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-role="background"] { position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; z-index: 0 !important; opacity: 1 !important; pointer-events: none !important; }
[data-threeui-role="ui"] { position: relative !important; z-index: 1 !important; width: min(calc(100% - 32px), var(--threeui-target-width, 1040px)) !important; max-width: none !important; max-height: calc(100% - 32px) !important; margin: auto !important; overflow: auto !important; opacity: 1 !important; transform: none !important; filter: none !important; flex: none !important; box-sizing: border-box !important; }
${definition.focusCss ?? ""}
</style>`;
  const controlScript = `<script data-threeui-controls>
(function () {
  var controls = ${controlsJson};
  window.__SF_CONTROLS = controls;
  var origin = performance.now();
  var virtual = 0;
  var last = origin;
  var performanceNow = performance.now.bind(performance);
  var dateNow = Date.now.bind(Date);
  var dateOrigin = dateNow();
  performance.now = function () {
    var real = performanceNow();
    virtual += (real - last) * (controls.speed || 1);
    last = real;
    return origin + virtual;
  };
  Date.now = function () {
    return dateOrigin + (performance.now() - origin);
  };
  var raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (callback) {
    return raf(function () {
      callback(performance.now());
    });
  };
  function applyVisual() {
    var opacity = controls.opacity == null ? 1 : controls.opacity;
    var size = controls.size == null ? 1 : controls.size;
    Array.prototype.forEach.call(document.querySelectorAll('[data-threeui-role]'), function (element) {
      element.style.opacity = String(opacity);
      if (element.getAttribute('data-threeui-role') === 'ui') {
        element.style.transform = 'scale(' + size + ')';
        element.style.transformOrigin = 'center center';
      }
    });
  }
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'threeui-controls') return;
    var next = event.data.controls || {};
    Object.keys(next).forEach(function (key) { controls[key] = next[key]; });
    applyVisual();
  });
  window.__SF_APPLY_CONTROLS = applyVisual;
})();
</script>`;
  const focusScript = `<script data-threeui-focus>
(function () {
  var isolated = false;
  function isolate() {
    if (isolated) return;
    var specs = ${targetJson};
    var roots = [];
    specs.forEach(function (spec) {
      var element = document.querySelector(spec.selector);
      if (!element) return;
      element.setAttribute('data-threeui-role', spec.role);
      if (spec.width) element.style.setProperty('--threeui-target-width', spec.width);
      if (!roots.some(function (root) { return root.contains(element); })) roots.push(element);
    });
    if (!roots.length) return;
    isolated = true;
    roots.forEach(function (root) { document.body.appendChild(root); });
    Array.from(document.body.children).forEach(function (element) {
      if (roots.indexOf(element) !== -1) return;
      element.setAttribute('data-threeui-residual', '');
      element.setAttribute('aria-hidden', 'true');
      if ('inert' in element) element.inert = true;
    });
    document.body.setAttribute('data-threeui-ready', '');
    if (window.__SF_APPLY_CONTROLS) window.__SF_APPLY_CONTROLS();
    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
  }
  function scheduleIsolation() { setTimeout(isolate, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleIsolation, { once: true });
  else scheduleIsolation();
  window.addEventListener('load', isolate, { once: true });
})();
</script>`;
  return patchedSource
    .replace(/<head([^>]*)>/i, `<head$1>${controlScript}${focusStyle}`)
    .replace(/<\/body>/i, `${focusScript}</body>`);
}

function GatewayFlowFrame({
  definition,
  mode,
  speed = GATEWAY_FLOW_DEFAULTS.speed,
  size = GATEWAY_FLOW_DEFAULTS.size,
  gap = GATEWAY_FLOW_DEFAULTS.gap,
  length = GATEWAY_FLOW_DEFAULTS.length,
  density = GATEWAY_FLOW_DEFAULTS.density,
  strokeWidth = GATEWAY_FLOW_DEFAULTS.strokeWidth,
  opacity = GATEWAY_FLOW_DEFAULTS.opacity,
  hue = GATEWAY_FLOW_DEFAULTS.hue,
  saturation = GATEWAY_FLOW_DEFAULTS.saturation,
  brightness = GATEWAY_FLOW_DEFAULTS.brightness,
  className,
  style,
}: GatewayFlowProps & { definition: EffectDefinition }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const requestedMode =
    mode ?? definition.defaultMode ?? GATEWAY_FLOW_DEFAULTS.mode;
  const automaticMode = useAutomaticMode(requestedMode === "auto");
  const resolvedMode =
    requestedMode === "auto"
      ? automaticMode
      : resolveMode(requestedMode, GATEWAY_FLOW_DEFAULTS.mode);
  const background = resolveBackground(definition.background, resolvedMode);
  const safeSpeed = clamp(speed, 0, 3);
  const safeSize = clamp(size, 0.05, 200);
  const safeGap = clamp(gap, 0, 64);
  const safeLength = clamp(length, 0.35, 2.5);
  const safeDensity = clamp(density, 0.25, 2.5);
  const safeStrokeWidth = clamp(strokeWidth, 0.25, 8);
  const safeOpacity = clamp(opacity, 0.05, 1);
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);

  // Rebuild when baked geometry/mode knobs change. Speed/opacity stay live via postMessage + time wrap.
  const source = useMemo(
    () =>
      buildFocusedDocument(definition, {
        mode: resolvedMode,
        speed: GATEWAY_FLOW_DEFAULTS.speed,
        size: safeSize,
        gap: safeGap,
        length: safeLength,
        density: safeDensity,
        strokeWidth: safeStrokeWidth,
        opacity: GATEWAY_FLOW_DEFAULTS.opacity,
      }),
    [
      definition,
      resolvedMode,
      safeDensity,
      safeGap,
      safeLength,
      safeSize,
      safeStrokeWidth,
    ],
  );

  useEffect(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage(
      {
        type: "threeui-controls",
        controls: {
          mode: resolvedMode,
          speed: safeSpeed,
          size: safeSize,
          gap: safeGap,
          length: safeLength,
          density: safeDensity,
          strokeWidth: safeStrokeWidth,
          opacity: safeOpacity,
        },
      },
      "*",
    );
  }, [
    resolvedMode,
    safeDensity,
    safeGap,
    safeLength,
    safeOpacity,
    safeSize,
    safeSpeed,
    safeStrokeWidth,
    source,
  ]);

  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe
      ref={iframeRef}
      className={className}
      title={definition.title}
      srcDoc={source}
      sandbox="allow-scripts"
      loading="eager"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background,
        filter,
        ...style,
      }}
    />
  );
}

export default function GatewayFlow(props: GatewayFlowProps) {
  return <GatewayFlowFrame {...props} definition={GATEWAY_FLOW_DEFINITION} />;
}


demo.tsx
import GatewayFlow from "@/components/ui/gateway-flow";

export default function GatewayFlowDemo() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-xl border border-border bg-black">
      <GatewayFlow className="h-full w-full" />
    </div>
  );
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them

Study that reference carefully.

Its visual language includes:

- Black cinematic backgrounds.
- Animated Bezier connection paths.
- Moving particles.
- Delicate lines.
- Responsive canvas animation.
- Interactive click-driven particle reactions.
- Subtle gradient borders.
- Minimal monochrome UI.
- Smooth typography reveals.
- Sophisticated hover transitions.

**Use this as visual and animation inspiration, not as a literal page template.**

The supplied reference contains a Nexus Gateway authentication interface. I DO NOT want a login page.

Do not copy its login fields, authentication buttons, stock avatars, or unrelated gateway branding into my portfolio.

Instead, adapt the reference's visual effects to my existing portfolio content.

Specifically, transform the flowing-line effect into a recognizable artificial neural network.

Prefer implementing the animation directly as a native, reusable React/TypeScript component rather than embedding the reference's complete HTML document in an iframe.

Avoid runtime CDN scripts if equivalent functionality can be implemented with the existing stack.

## 5. Artificial neural network visualization

This is the most important visual requirement.

I want a recognizable, dynamic artificial neural network to be the defining feature of the website.

Implement a high-quality animated neural-network visualization with:

**Neural architecture**

- Clearly differentiated input, hidden, and output layers.
- Small, precisely positioned neuron nodes.
- Multiple interconnected layers.
- Thin, curved or straight weighted connections.
- Depth and visual hierarchy.
- Subtle neuron activation states.

**Forward propagation animation**

Create a visual sequence where a signal:

1. Activates an input neuron.
2. Travels across weighted connections.
3. Activates nodes within hidden layers.
4. Propagates through subsequent layers.
5. Reaches an output neuron.
6. Fades naturally before the next signal.

Use moving particles, subtle light pulses, and controlled node highlights.

Connections should feel like actual neural pathways, not random floating lines.

**Interactive behavior**

On desktop:

- Respond subtly to mouse movement.
- Highlight nearby nodes or connections.
- Allow clicks or selected interactions to trigger forward propagation.
- Animate signal paths when relevant interface elements are hovered.
- Avoid distracting or chaotic motion.

On mobile:

- Support tap interaction.
- Simplify neural geometry so it fits the screen.
- Reduce particle and connection density.
- Preserve smooth scrolling.
- Do not require hover to access functionality.

**Performance requirements**

- Use `requestAnimationFrame` appropriately.
- Handle device pixel ratio correctly.
- Resize canvas geometry on viewport changes.
- Cancel animation frames and event listeners on component cleanup.
- Pause or throttle offscreen animations.
- Respect `prefers-reduced-motion`.
- Ensure the animation does not block navigation, scrolling, clicking, or text selection.
- Minimize unnecessary React rerenders during animation.
- Avoid heavy animation libraries unless there is a justified benefit.

## 6. Hero section redesign

The hero section should make an immediate impression.

Create a compelling composition that combines:

- My name: **Mukund Garg**
- My specialization in AI/ML, backend systems, and computer vision
- A concise introduction
- A prominently integrated animated neural network
- Clear calls to action for viewing projects and downloading my resume

The artificial neural network should be visible and recognizable immediately, not hidden behind text or so faint that it looks like background noise.

### Desktop

Create an intentional editorial composition.

For example, large but controlled typography can occupy one side while an interactive neural network occupies the other.

Use balanced negative space and avoid clutter.

### Mobile

Recompose the hero rather than merely shrinking it.

- Ensure my complete name fits naturally.
- Use fluid typography with `clamp()` where appropriate.
- Reposition the network beneath, beside, or behind the content in a readable way.
- Keep important information and CTAs accessible.
- Prevent the hero from becoming excessively tall.
- Ensure no element extends beyond the viewport.

Do not sacrifice readable text just to accommodate the neural visualization.

## 7. Navigation redesign

Implement a responsive, polished navigation system.

Desktop:

- Minimal sticky or appropriately positioned navigation.
- Clearly organized section links.
- Subtle hover and active states.
- Smooth section navigation.
- Resume access.

Mobile:

- Clean compact header.
- Functional menu toggle.
- Accessible menu opening and closing.
- Appropriate touch targets.
- Correct stacking and z-index.
- No clipped or overlapping navigation.
- Close the menu when a section is selected.
- Support Escape to close when appropriate.
- Maintain usable keyboard focus behavior.

Ensure internal anchor links scroll correctly beneath a sticky header.

## 8. Redesign every existing section

Do not focus exclusively on the hero.

Redesign the complete portfolio so the neural-network theme remains consistent throughout.

### About

Present my background, interests, and engineering approach in a clear editorial layout.

Integrate subtle neural-network visual elements that connect skills and disciplines.

### Technical skills

Present my existing technical skills in a distinctive, organized layout.

Consider a connected capability graph with categories such as:

- Machine Learning
- Deep Learning
- NLP / Transformers
- Computer Vision
- Backend / Systems

The visualization should remain understandable without animation.

### Projects

Preserve the existing project information and actual project links.

Current portfolio projects include:

- MailPilot
- StockSense AI
- Offline ISL Translator

Do not fabricate new projects or performance metrics.

Redesign these sections with a stronger visual hierarchy.

Instead of generic cards, use an editorial case-study treatment that communicates:

- What problem the project solves.
- How the system works.
- What technologies were used.
- Meaningful existing metrics.
- Links to source code and live demos where available.

Where appropriate, create custom diagrams resembling neural or computational data pipelines.

Each project should feel distinct rather than repeating the same card design.

### Experience

Preserve my internship details and accomplishments.

Use a refined timeline or other appropriate visual structure.

### Education and leadership

Improve readability and composition while retaining the existing content.

### Contact

Create a memorable conclusion to the portfolio.

Use a subtle network convergence or output-node concept to connect the site's visual narrative.

Retain working email, GitHub, LinkedIn, and resume links.

## 9. Motion design

The website should feel dynamic without becoming overwhelming.

Implement meaningful motion such as:

- Carefully paced hero text reveals.
- Scroll-triggered section reveals.
- Subtle line-drawing effects.
- Neural signals propagating through connections.
- Interactive project hover states.
- Responsive button feedback.
- Smooth transitions between visual states.
- Subtle network activity related to navigation or section changes.

Avoid animating everything simultaneously.

Animations should reinforce content and convey the idea of data flowing through a neural network.

Do not use animation simply because it is available.

Respect reduced-motion preferences throughout.

## 10. Visual quality standards

The finished website must NOT look like a generic AI-generated template.

Avoid:

- Repetitive identical cards.
- Unnecessary glassmorphism.
- Excessive neon glows.
- Decorative blobs and floating geometric shapes without meaning.
- Generic gradient headlines.
- Oversized text that sacrifices usability.
- Arbitrary animated particles unrelated to the neural-network concept.
- Fake analytics dashboards.
- Placeholder text.
- Fabricated accomplishments or statistics.

Instead, focus on visual rhythm, thoughtful typography, custom interactions, precise spacing, carefully composed layouts, and a strong coherent design identity.

## 11. Responsive testing — mandatory

Do not assume that responsive Tailwind classes guarantee a correct design.

Actually test the implementation using browser rendering and screenshots if browser tooling is available.

At minimum, test these viewport widths:

| Device category | Width |
|---|---|
| Small mobile | 320px |
| Mobile | 360px |
| iPhone-sized mobile | 375px |
| Larger mobile | 390px and 430px |
| Tablet | 768px |
| Small laptop | 1024px |
| Standard laptop | 1366px |
| Desktop | 1440px |
| Large desktop | 1920px |

Inspect the hero, navigation, every project, skills, experience, education, and contact sections.

Verify:

- No horizontal overflow.
- No clipped text.
- No overlapping components.
- No unintended cutoffs.
- Responsive diagrams.
- Correct mobile navigation.
- Readable typography.
- Proper image/canvas scaling.
- Functional internal and external links.
- Correct scroll behavior.
- Consistent spacing.
- No animation-induced layout shifts.

Fix issues found during testing, rather than only documenting them.

## 12. Code quality and maintainability

Maintain a clean, production-quality React and Next.js architecture.

Requirements:

- Use reusable React components.
- Maintain strong TypeScript typing.
- Keep portfolio content separate from presentation where practical.
- Use client components only where required by interactivity.
- Avoid unnecessary dependencies.
- Avoid hydration errors.
- Avoid SSR access to browser APIs.
- Use semantic HTML.
- Maintain keyboard accessibility.
- Ensure sufficient contrast.
- Add accessible labels where required.
- Prevent memory leaks from animations and event listeners.
- Do not alter working project URLs or resume paths without justification.

The supplied design reference mentions shadcn. Since this repository already uses Next.js, Tailwind, and TypeScript, do not install shadcn unnecessarily. Use it only if a specific component genuinely benefits from it.

If you create custom reusable UI components, organize them in a clear location such as `components/ui/`.

## 13. Performance requirements

The site must remain fast and usable on an ordinary smartphone.

Optimize:

- JavaScript bundle size.
- Canvas drawing operations.
- Animation frame scheduling.
- Scroll performance.
- Mobile interaction latency.
- Initial rendering.
- Responsive layouts.

Use progressive enhancement where suitable: the content should still make sense if animation is disabled.

Avoid loading large 3D engines merely for decorative animation.

## 14. Implementation process

Follow this sequence:

**Phase 1 — Audit**

Inspect the existing repository, identify responsive problems and review existing components, styles, data, and animation behavior.

**Phase 2 — Design system**

Define the final visual direction: typography, spacing, colors, borders, interaction states, and responsive rules.

**Phase 3 — Neural network**

Implement or refactor the artificial neural network visualization with responsive geometry, propagation animation, pointer/touch interactions, and reduced-motion support.

**Phase 4 — Portfolio redesign**

Redesign the hero, navigation, about, skills, projects, experience, education, contact, and footer.

**Phase 5 — Responsive refinement**

Test actual layouts across mobile, tablet, laptop, and desktop viewports. Fix overflow and visual inconsistencies.

**Phase 6 — Production validation**

Run the project's available checks, including:

```bash
npm run lint
npm run build
```

Fix all errors introduced by the changes.

**Phase 7 — Final review**

Perform a complete visual and functional review. Refine the design until it feels intentional, cohesive, and genuinely polished.

## 15. Final deliverables

When implementation is complete, provide:

1. A summary of what was redesigned.
2. The files created or modified.
3. The specific mobile responsiveness problems fixed.
4. The new neural network interactions and animation behavior.
5. Desktop and mobile testing results.
6. Build and lint results.
7. Any outstanding limitations.
8. Instructions for previewing the redesigned portfolio locally.

If possible, include actual mobile and desktop screenshots.

If browser-based visual testing was unavailable, clearly identify what was not visually verified instead of claiming it passed.

## Non-negotiable constraints

- Preserve the integrity of my existing portfolio information.
- Keep all project, experience, education, leadership, and contact content accurate.
- Do not convert the site into the authentication interface from the supplied design reference.
- Artificial neural networks must be the dominant and recognizable visual theme.
- Prioritize mobile responsiveness just as strongly as desktop appearance.
- Make the website interactive, but not distracting.
- Do not stop after providing a plan: implement the changes.
- Do not consider the task finished until the code compiles and responsive issues have been tested.

**Final objective:** Transform my existing portfolio into a distinctive, premium, responsive, interactive AI/ML engineering portfolio that visually feels like an artificial neural network — not a generic website decorated with AI-themed graphics.