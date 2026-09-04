"use client";

import React, { useRef } from "react";
import { NeuralCanvas } from "./neural-canvas";
import { PortfolioCard } from "./portfolio-card";

export function ScrollyTrack() {
  const trackRef = useRef<HTMLElement>(null);

  return (
    <section className="track" id="track" ref={trackRef}>
      <div className="pin">
        <NeuralCanvas trackRef={trackRef} />
        
        <div className="overlay-layer">
          <PortfolioCard
            id="card1"
            className="card-1"
            num="01"
            kicker="Stage 01 — Input Embeddings"
            title="Tokens become vectors"
            description="&quot;The cat sat on the mat&quot; is split into tokens, each mapped to a point in a high-dimensional embedding space before entering the network."
            metrics={[
              { label: "tokens", value: "9", id: "m-tokens" },
              { label: "embedding dim", value: "512" },
              { label: "vector[0]", value: "[0.12, -0.44, 0.91]", id: "m-vec" },
            ]}
          />

          <PortfolioCard
            id="card2"
            className="card-2"
            num="02"
            kicker="Stage 02 — About Me"
            title="Profile & Focus"
            description="I enjoy building end-to-end systems that combine models, APIs, automation and real-world applications — from a working pipeline to a deployed endpoint."
            metrics={[
              { label: "operation", value: "W·x + b" },
              { label: "active synapses", value: "0", id: "m-synapses" },
              { label: "pulse velocity", value: "0.0×", id: "m-velocity" },
            ]}
          />

          <PortfolioCard
            id="card3"
            className="card-3"
            num="03"
            kicker="Stage 03 — Skills & Tech Stack"
            title="AI / ML · Backend · CV · NLP"
            description="Each neuron's accumulated charge passes through a non-linearity. Similarly, I integrate various tools to build robust architectures."
            metrics={[
              { label: "activation", value: "GELU" },
              { label: "firing rate", value: "0%", id: "m-firing" },
              { label: "threshold crossings", value: "0", id: "m-cross" },
            ]}
          />

          <PortfolioCard
            id="card4"
            className="card-4"
            num="04"
            kicker="Stage 04 — Selected Systems"
            title="Projects Showcase"
            description="Thousands of activations collapse into a small latent core. Here are some of my top projects: MailPilot, StockSense AI, and Offline ISL Translator."
            metrics={[
              { label: "latent dim", value: "5" },
              { label: "compression", value: "0×", id: "m-compress" },
              { label: "core intensity", value: "0%", id: "m-intensity" },
            ]}
          />

          <PortfolioCard
            id="card5"
            className="card-5"
            num="05"
            kicker="Stage 05 — Let's Connect"
            title="Contact Me"
            description="The latent core fans out into logits. Have an interesting problem? Let's build something that works beyond the prototype."
          />

          <div className="softmax" id="softmax">
            {/* The softmax bars are generated dynamically by the hook, but we can put the HTML structure here so React renders it */}
            {[
              { label: "Email", target: 0.72, top: true },
              { label: "LinkedIn", target: 0.11, top: false },
              { label: "GitHub", target: 0.08, top: false },
              { label: "Resume", target: 0.05, top: false },
              { label: "Other", target: 0.04, top: false },
            ].map((tok, i) => (
              <div key={i} className={`col ${tok.top ? "top" : ""}`}>
                <div className="pct mono">0%</div>
                <div className="track-bar">
                  <div className="fill"></div>
                </div>
                <div className="lbl">{tok.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
