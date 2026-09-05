"use client";

import { useEffect, useRef } from "react";

type NodePoint = { x: number; y: number; layer: number; index: number; active: number; route: number; phase: number; color: string };
type Edge = { from: number; to: number; branch: number; active: number };
type Pulse = { edge: Edge; progress: number; strength: number; routeIndex: number; inferenceId: number };
type Launch = { edge: Edge; at: number; strength: number; routeIndex: number; inferenceId: number };

const COLORS = { data: "#6FE3D7", neural: "#A58BE8", hot: "#C6B0FF", output: "#FF806B" };
const DESKTOP_LAYERS = [9, 16, 12, 5, 5];
const MOBILE_LAYERS = [5, 7, 5, 3, 2];
const INPUTS = ["DATA", "IMAGE", "TEXT", "SIGNAL", "API"];
const OUTPUTS = ["SYSTEM", "GESTURE", "INSIGHT", "AUTOMATION", "TEXT"];
const OUTPUT_FOR_INPUT = [0, 1, 2, 3, 4];

function seeded(index: number) {
  return (Math.sin(index * 91.17 + 12.4) + 1) / 2;
}

export function HeroNeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 700;
    const layers = mobile ? MOBILE_LAYERS : DESKTOP_LAYERS;
    const nodes: NodePoint[] = [];
    const edges: Edge[] = [];
    const pulses: Pulse[] = [];
    const launches: Launch[] = [];
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let visible = true;
    let cycleTime = 5.3;
    let cycle = 0;
    let inferenceId = 0;
    let routeEdges: Edge[] = [];
    let routeOutput = 0;
    let interactionCount = 0;

    const markInteracted = () => {
      interactionCount += 1;
      if (interactionCount === 1) hero.classList.add("hero-network-interacted");
    };

    const buildNetwork = () => {
      nodes.length = 0;
      edges.length = 0;
      let nodeId = 0;
      layers.forEach((count, layer) => {
        for (let index = 0; index < count; index += 1) {
          nodes.push({
            x: 0,
            y: 0,
            layer,
            index,
            active: 0,
            route: 0,
            phase: seeded(nodeId) * Math.PI * 2,
            color: layer === 0 ? COLORS.data : layer === layers.length - 1 ? COLORS.output : layer === layers.length - 2 ? COLORS.hot : COLORS.neural,
          });
          nodeId += 1;
        }
      });
      let layerStart = 0;
      for (let layer = 0; layer < layers.length - 1; layer += 1) {
        const nextStart = layerStart + layers[layer];
        for (let index = 0; index < layers[layer]; index += 1) {
          const from = layerStart + index;
          const targets = [index % layers[layer + 1], (index * 2 + layer + 1) % layers[layer + 1], (index + 3) % layers[layer + 1]];
          targets.forEach((target, branch) => {
            const to = nextStart + target;
            if (!edges.some((edge) => edge.from === from && edge.to === to)) edges.push({ from, to, branch, active: 0 });
          });
        }
        layerStart = nextStart;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNetwork();
    };

    const positionFor = (node: NodePoint, time: number) => {
      const span = Math.min(width * 0.74, 960);
      const x = width * 0.5 - span / 2 + (span * node.layer) / (layers.length - 1);
      const stage = node.layer === 0 ? 0.17 : node.layer === 1 ? 0.34 : node.layer === 2 ? 0.51 : node.layer === 3 ? 0.57 : 0.73;
      const spread = node.layer === layers.length - 2 ? 0.34 : node.layer === layers.length - 1 ? 0.58 : 1;
      const count = layers[node.layer];
      const y = height * stage + (count > 1 ? (node.index / (count - 1) - 0.5) * height * 0.48 * spread : 0);
      return { x, y: y + (reducedMotion ? 0 : Math.sin(time * 0.0007 + node.phase) * 5) };
    };

    const curvePoint = (from: NodePoint, to: NodePoint, progress: number) => {
      const deltaX = to.x - from.x;
      const controlOne = { x: from.x + deltaX * 0.42, y: from.y };
      const controlTwo = { x: to.x - deltaX * 0.42, y: to.y };
      const inverse = 1 - progress;
      return {
        x: inverse ** 3 * from.x + 3 * inverse ** 2 * progress * controlOne.x + 3 * inverse * progress ** 2 * controlTwo.x + progress ** 3 * to.x,
        y: inverse ** 3 * from.y + 3 * inverse ** 2 * progress * controlOne.y + 3 * inverse * progress ** 2 * controlTwo.y + progress ** 3 * to.y,
      };
    };

    const edgeFor = (from: number, layer: number, desiredIndex: number) => {
      const candidates = edges.filter((edge) => edge.from === from && nodes[edge.to].layer === layer + 1);
      return candidates.sort((first, second) => Math.abs(nodes[first.to].index - desiredIndex) - Math.abs(nodes[second.to].index - desiredIndex))[0];
    };

    const buildRoute = (inputIndex: number) => {
      const desiredOutput = OUTPUT_FOR_INPUT[inputIndex % OUTPUT_FOR_INPUT.length];
      const route: Edge[] = [];
      let current = inputIndex;
      for (let layer = 0; layer < layers.length - 1; layer += 1) {
        const desiredIndex = layer === layers.length - 2 ? desiredOutput % layers[layer + 1] : (desiredOutput + inputIndex + layer) % layers[layer + 1];
        const edge = edgeFor(current, layer, desiredIndex);
        if (!edge) break;
        route.push(edge);
        current = edge.to;
      }
      return { route, desiredOutput };
    };

    const resetInference = () => {
      inferenceId += 1;
      pulses.length = 0;
      launches.length = 0;
      routeEdges.forEach((edge) => { edge.active = 0; });
      nodes.forEach((node) => { node.route = 0; });
      return inferenceId;
    };

    const startInference = (inputIndex: number, immediate = false) => {
      const currentInference = resetInference();
      const route = buildRoute(inputIndex);
      routeEdges = route.route;
      routeOutput = route.desiredOutput;
      markInteracted();
      const input = nodes[inputIndex];
      if (!input || routeEdges.length === 0) return;
      input.route = 1;
      if (reducedMotion || immediate) {
        routeEdges.forEach((edge) => { edge.active = 1; nodes[edge.to].route = 1; });
        draw(performance.now(), 0);
        return;
      }
      pulses.push({ edge: routeEdges[0], progress: 0, strength: 1, routeIndex: 0, inferenceId: currentInference });
      ensureFrame();
    };

    const scheduleNext = (routeIndex: number, now: number, currentInference: number) => {
      const next = routeEdges[routeIndex + 1];
      if (next) launches.push({ edge: next, at: now + 80, strength: 1, routeIndex: routeIndex + 1, inferenceId: currentInference });
    };

    const draw = (time: number, delta: number) => {
      context.clearRect(0, 0, width, height);
      cycleTime += delta;
      if (!reducedMotion && cycleTime > 7) {
        cycleTime = 0;
        startInference(cycle % INPUTS.length);
        cycle += 1;
      }
      nodes.forEach((node) => {
        const position = positionFor(node, time);
        let targetX = position.x;
        let targetY = position.y;
        if (!reducedMotion && pointer.active && node.layer < layers.length - 1) {
          const distanceX = node.x - pointer.x;
          const distanceY = node.y - pointer.y;
          const distance = Math.hypot(distanceX, distanceY) || 1;
          if (distance < 155) {
            const force = (1 - distance / 155) * 10;
            targetX += (distanceX / distance) * force;
            targetY += (distanceY / distance) * force;
          }
        }
        node.x += (targetX - node.x) * Math.min(1, delta * 6 || 0.08);
        node.y += (targetY - node.y) * Math.min(1, delta * 6 || 0.08);
        node.route *= reducedMotion ? 1 : 0.985;
        node.active *= reducedMotion ? 1 : 0.94;
      });

      const now = performance.now();
      for (let index = launches.length - 1; index >= 0; index -= 1) {
        const launch = launches[index];
        if (launch.inferenceId !== inferenceId) { launches.splice(index, 1); continue; }
        if (launch.at <= now) {
          pulses.push({ edge: launch.edge, progress: 0, strength: launch.strength, routeIndex: launch.routeIndex, inferenceId: launch.inferenceId });
          launch.edge.active = 1;
          launches.splice(index, 1);
        }
      }

      edges.forEach((edge) => {
        edge.active *= reducedMotion ? 1 : 0.94;
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const pointerDistance = pointer.active ? Math.min(Math.hypot((from.x + to.x) / 2 - pointer.x, (from.y + to.y) / 2 - pointer.y), 220) : 220;
        const localBoost = pointer.active ? (1 - pointerDistance / 220) * 0.035 : 0;
        const activity = Math.max(from.route, to.route, edge.active);
        const controlOneX = from.x + (to.x - from.x) * 0.42;
        const controlTwoX = to.x - (to.x - from.x) * 0.42;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.bezierCurveTo(controlOneX, from.y, controlTwoX, to.y, to.x, to.y);
        context.strokeStyle = `rgba(165,139,232,${0.025 + localBoost + activity * 0.34})`;
        context.lineWidth = 0.65 + activity * 0.75;
        context.stroke();
      });

      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        if (pulse.inferenceId !== inferenceId) { pulses.splice(index, 1); continue; }
        pulse.progress += delta * 0.62;
        if (pulse.progress >= 1) {
          nodes[pulse.edge.to].route = 1;
          nodes[pulse.edge.to].active = 1;
          pulse.edge.active = 1;
          scheduleNext(pulse.routeIndex, now, pulse.inferenceId);
          pulses.splice(index, 1);
          continue;
        }
        const from = nodes[pulse.edge.from];
        const to = nodes[pulse.edge.to];
        const point = curvePoint(from, to, pulse.progress);
        const tail = curvePoint(from, to, Math.max(0, pulse.progress - 0.08));
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.lineTo(point.x, point.y);
        context.strokeStyle = `rgba(241,239,244,${pulse.strength * 0.84})`;
        context.lineWidth = 1.7;
        context.stroke();
      }

      nodes.forEach((node) => {
        const isInput = node.layer === 0;
        const radius = 1.8 + node.route * 1.7 + node.active * 1.2;
        context.beginPath();
        context.arc(node.x, node.y, radius, 0, Math.PI * 2);
        context.fillStyle = node.route > 0.1 || node.active > 0.2 ? node.color : isInput ? COLORS.data : "rgba(241,239,244,0.16)";
        context.fill();
        if (node.route > 0.5 || node.active > 0.5) {
          context.beginPath();
          context.arc(node.x, node.y, 7 + node.route * 4, 0, Math.PI * 2);
          context.strokeStyle = `rgba(165,139,232,${Math.min(.45, node.route * .35 + node.active * .2)})`;
          context.stroke();
        }
      });
      if (routeOutput >= 0 && routeEdges.length && nodes[routeEdges[routeEdges.length - 1].to].route > 0.8) {
        const output = nodes[routeEdges[routeEdges.length - 1].to];
        context.font = "10px var(--font-mono), monospace";
        context.fillStyle = COLORS.output;
        context.fillText(OUTPUTS[routeOutput], output.x + 14, output.y + 3);
      }
    };

    const ensureFrame = () => {
      if (!reducedMotion && visible && document.visibilityState === "visible" && !frame) frame = requestAnimationFrame(loop);
    };

    const loop = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      if (visible && document.visibilityState === "visible") draw(time, delta);
      if (!reducedMotion && visible && document.visibilityState === "visible") frame = requestAnimationFrame(loop);
      else frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      ensureFrame();
    };
    const onPointerLeave = () => { pointer.active = false; };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && frame) { cancelAnimationFrame(frame); frame = 0; }
      if (document.visibilityState === "visible") ensureFrame();
    };
    const onResize = () => { resize(); ensureFrame(); };
    const onInput = (event: Event) => {
      const target = event.currentTarget as HTMLButtonElement;
      startInference(Number(target.dataset.input || 0));
    };
    const onCtaEnter = (event: Event) => {
      const target = event.currentTarget as HTMLAnchorElement;
      startInference(Number(target.dataset.route || 0));
    };
    const onCtaFocus = onCtaEnter;

    const inputButtons = Array.from(hero.querySelectorAll<HTMLButtonElement>("[data-network-input]"));
    inputButtons.forEach((button) => { button.addEventListener("click", onInput); });
    const ctas = Array.from(hero.querySelectorAll<HTMLAnchorElement>("[data-network-route]"));
    ctas.forEach((cta) => { cta.addEventListener("pointerenter", onCtaEnter); cta.addEventListener("focus", onCtaFocus); });
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
      if (visible) ensureFrame();
    }, { threshold: 0.01 });
    observer.observe(hero);
    resize();
    if (reducedMotion) draw(performance.now(), 0);
    else ensureFrame();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      inputButtons.forEach((button) => { button.removeEventListener("click", onInput); });
      ctas.forEach((cta) => { cta.removeEventListener("pointerenter", onCtaEnter); cta.removeEventListener("focus", onCtaFocus); });
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="hero-neural-canvas" aria-hidden="true" />
      <div className="network-controls" aria-label="Interactive neural network inputs">
        {INPUTS.map((input, index) => <button key={input} type="button" data-network-input data-input={index} aria-label={`Activate ${input} route`}>{input}</button>)}
      </div>
      <span className="network-hint mono"><span className="network-hint-desktop">INTERACT WITH THE NETWORK</span><span className="network-hint-touch">TAP A NODE</span></span>
    </>
  );
}
