import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail, Download } from "lucide-react";
import type { ReactNode } from "react";
import { HeroNeuralCanvas } from "./hero-neural-canvas";
import GatewayFlow from "./ui/gateway-flow";
import { MobileNav } from "./ui/mobile-nav";
import { education, experience, leadership, nav, projects, skillGroups, socials } from "@/lib/portfolio-data";

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

function CapabilityGraph() {
  return (
    <div className="capability-graph" role="region" aria-label="Connected Technical Capability Graph">
      <div className="capability-graph-header">
        <span className="mono">TOPOLOGY / TECHNICAL DISCIPLINES</span>
        <span className="mono">6 DOMAINS · 37 SKILLS</span>
      </div>
      <div className="capability-nodes">
        {skillGroups.map((group, idx) => (
          <div className="capability-node-group" key={group.label}>
            <div className="capability-node-header">
              <span className="capability-node-layer mono">LAYER 0{idx + 1}</span>
              <h3 className="capability-node-title">{group.label}</h3>
            </div>
            <div className="capability-tokens">
              {group.items.map((item) => (
                <span className="capability-token mono" key={item}>
                  <span className="token-dot" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MailPilotPipeline() {
  const steps = [
    { num: "01", stage: "INGESTION", detail: "CSV / Sheets / Manual" },
    { num: "02", stage: "PROCESSING", detail: "Dynamic Personalization" },
    { num: "03", stage: "SCHEDULING", detail: "FastAPI Queue & Timers" },
    { num: "04", stage: "DISPATCH", detail: "Gmail API & OAuth" },
    { num: "05", stage: "INFERENCE", detail: "Threaded Reply Detection" },
    { num: "06", stage: "FEEDBACK", detail: "Stop Follow-up · Sheets Sync" },
  ];

  return (
    <div className="project-pipeline-panel" role="region" aria-label="MailPilot Automation Pipeline">
      <div className="pipeline-panel-header mono">
        <span>DATA PIPELINE / EXECUTION GRAPH</span>
        <span>6 SYNAPSE STAGES</span>
      </div>
      <div className="pipeline-stages mailpilot-stages">
        {steps.map((step, idx) => (
          <div className="pipeline-stage-item" key={step.stage}>
            <div className="stage-indicator">
              <span className="stage-num mono">{step.num}</span>
              {idx < steps.length - 1 && <span className="stage-synapse-line" aria-hidden="true" />}
            </div>
            <div className="stage-info">
              <span className="stage-name mono">{step.stage}</span>
              <span className="stage-detail">{step.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StockSensePipeline() {
  return (
    <div className="project-pipeline-panel" role="region" aria-label="StockSense AI Inference Pipelines">
      <div className="pipeline-panel-header mono">
        <span>DUAL INFERENCE ENGINES</span>
        <span>LLM + COMPUTER VISION</span>
      </div>
      <div className="stocksense-dual-grid">
        <div className="stocksense-path">
          <div className="path-header mono">
            <span className="path-tag tag-llm">PATH A</span>
            <span>DOCUMENT INTELLIGENCE</span>
          </div>
          <div className="path-steps">
            <div className="path-step">
              <span className="step-badge mono">IN</span>
              <span>10-K Reports / PDFs</span>
            </div>
            <div className="path-connector mono">↓ LLM Analysis (Gemini / Groq)</div>
            <div className="path-step">
              <span className="step-badge badge-out mono">OUT</span>
              <span>Summary · Financial Risks · Outlook</span>
            </div>
          </div>
        </div>

        <div className="stocksense-path">
          <div className="path-header mono">
            <span className="path-tag tag-cv">PATH B</span>
            <span>COMPUTER VISION PATTERNS</span>
          </div>
          <div className="path-steps">
            <div className="path-step">
              <span className="step-badge mono">IN</span>
              <span>Stock Chart Image</span>
            </div>
            <div className="path-connector mono">↓ OpenCV Pattern Matcher</div>
            <div className="path-step">
              <span className="step-badge badge-out mono">OUT</span>
              <span>Bullish · Bearish · 9 Technical Patterns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IslPipeline() {
  const nodes = [
    { id: "01", name: "CAMERA", note: "Live Frame Ingestion" },
    { id: "02", name: "LANDMARKS", note: "21 Hand Keypoints" },
    { id: "03", name: "ON-DEVICE AI", note: "CPU/GPU Delegate" },
    { id: "04", name: "GESTURE", note: "32 Classes & Alphabet" },
    { id: "05", name: "TEXT OUTPUT", note: "Real-time Stabilization" },
  ];

  return (
    <div className="project-pipeline-panel" role="region" aria-label="Offline ISL Translator Inference Flow">
      <div className="pipeline-panel-header mono">
        <span>ON-DEVICE EMBEDDED PIPELINE</span>
        <span>ZERO-LATENCY OFFLINE</span>
      </div>
      <div className="isl-pipeline-wrap">
        <div className="isl-nodes-grid">
          {nodes.map((node, idx) => (
            <div className="isl-node-card" key={node.name}>
              <span className="isl-node-idx mono">{node.id}</span>
              <span className="isl-node-name mono">{node.name}</span>
              <span className="isl-node-note">{node.note}</span>
              {idx < nodes.length - 1 && <span className="isl-edge-arrow" aria-hidden="true">→</span>}
            </div>
          ))}
        </div>
        <div className="isl-landmark-visual" aria-hidden="true">
          <svg viewBox="0 0 200 80" className="isl-landmark-svg">
            <path d="M20 65 L45 35 L75 48 L105 20 L135 45 L170 30 M45 35 L70 18 M75 48 L115 50 M105 20 L140 15" stroke="var(--violet)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
            {[[20,65], [45,35], [70,18], [75,48], [105,20], [115,50], [135,45], [140,15], [170,30]].map(([x,y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="var(--teal)" />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

function ProjectCaseStudy({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <article className="project-case-study">
      <div className="project-meta-col">
        <div className="project-kicker mono">
          <span className="project-num">SYSTEM 0{index + 1}</span>
          <span>·</span>
          <span>{project.kicker}</span>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        {project.code && (
          <div className="project-code-box">
            <div className="code-box-header mono">AUTOMATION LOGIC</div>
            <pre><code>{project.code}</code></pre>
          </div>
        )}

        <div className="project-metrics-grid">
          {project.metrics.map((metric) => (
            <div className="metric-chip mono" key={metric}>
              <span className="metric-dot" aria-hidden="true" />
              {metric}
            </div>
          ))}
        </div>

        <div className="project-stack-wrap">
          <span className="stack-label mono">TECH STACK:</span>
          <div className="stack-tokens">
            {project.stack.map((tech) => (
              <span className="stack-token mono" key={tech}>{tech}</span>
            ))}
          </div>
        </div>

        <div className="project-cta-links">
          <a href={project.github} target="_blank" rel="noreferrer" className="project-cta-link">
            GitHub Repository <ArrowUpRight size={15} />
          </a>
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="project-cta-link link-live">
              Live Application <ArrowUpRight size={15} />
            </a>
          )}
        </div>
      </div>

      <div className="project-pipeline-col">
        {project.title === "MailPilot" && <MailPilotPipeline />}
        {project.title === "StockSense AI" && <StockSensePipeline />}
        {project.title === "Offline ISL Translator" && <IslPipeline />}
      </div>
    </article>
  );
}

export function NativePortfolio() {
  return (
    <div className="portfolio-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <Link className="site-wordmark" href="#hero">MUKUND GARG</Link>
        <nav className="desktop-nav" aria-label="Primary navigation"><div className="nav-links">{nav.map((item) => <Link key={item.id} href={item.href}>{item.label}</Link>)}</div><a className="resume-link" href={socials.resume}>Resume <Download size={14} /></a></nav>
        <MobileNav />
      </header>
      <main id="main-content">
        <section id="hero" className="native-hero" aria-labelledby="hero-title">
          <div className="hero-gateway-ambient" aria-hidden="true">
            <GatewayFlow
              mode="dark"
              speed={0.4}
              density={0.5}
              size={0.8}
              strokeWidth={0.8}
              opacity={0.35}
              hue={-15}
              saturation={0.7}
              brightness={0.85}
              className="gateway-ambient-frame"
            />
            <div className="gateway-ambient-mask" />
          </div>
          <div className="hero-split-container">
            <div className="hero-editorial-col">
              <div className="hero-index mono">01 / APPLIED SYSTEMS & INTELLIGENCE</div>
              <h1 id="hero-title">MUKUND<br /><em>GARG</em></h1>
              <p className="hero-role mono">Applied AI · Backend Systems · Computer Vision</p>
              <p className="hero-intro">
                Engineering student building intelligent systems across machine learning, backend pipelines, and computer vision. From data ingestion to model inference and production software.
              </p>
              <div className="hero-actions">
                <Link className="button button-solid" href="#projects" data-network-route="0">
                  Selected work <ArrowUpRight size={16} />
                </Link>
                <a className="button" href={socials.resume} data-network-route="3">
                  Resume <Download size={15} />
                </a>
              </div>
            </div>
            <div className="hero-ann-col" aria-label="Neural Network Interactive Panel">
              <div className="hero-ann-header mono">
                <span>FORWARD PROPAGATION ENGINE</span>
                <span>5 INPUTS → 5 OUTPUTS</span>
              </div>
              <div className="hero-ann-frame">
                <HeroNeuralCanvas />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="section-heading">
            <SectionLabel index="02">About / capability map</SectionLabel>
            <h2>Systems thinking,<br /><span>grounded in the work.</span></h2>
          </div>
          <div className="about-editorial-grid">
            <div className="about-narrative">
              <p className="lead-paragraph">
                An Electronics & Communication Engineering student focused on machine learning, deep learning, computer vision, NLP, and backend systems.
              </p>
              <p>
                The interesting part is the connection between a model and the workflow around it: data pipelines, APIs, system state, inference decisions, and the result a person can actually use.
              </p>
              <div className="about-specs-grid">
                <div className="spec-item">
                  <span className="spec-label mono">AFFILIATION</span>
                  <span className="spec-value">Maharaja Surajmal Institute of Technology</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label mono">DISCIPLINE</span>
                  <span className="spec-value">B.Tech ECE (2025–2029)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label mono">FIRST-YEAR CGPA</span>
                  <span className="spec-value mono">8.82 / 10</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label mono">CORE FOCUS</span>
                  <span className="spec-value">Models + APIs + Real-time Pipelines</span>
                </div>
              </div>
            </div>
            <CapabilityGraph />
          </div>
        </section>

        <section id="projects" className="section work-section">
          <div className="section-heading work-heading">
            <SectionLabel index="03">Selected work</SectionLabel>
            <h2>Three systems,<br /><span>three kinds of friction.</span></h2>
          </div>
          <div className="project-case-studies-list">
            {projects.map((project, index) => (
              <ProjectCaseStudy key={project.title} project={project} index={index} />
            ))}
          </div>
        </section>

        <section id="experience" className="section experience-section">
          <div className="section-heading">
            <SectionLabel index="04">Experience</SectionLabel>
            <h2>Operations became<br /><span>a software problem.</span></h2>
          </div>
          <div className="experience-timeline-container">
            <div className="timeline-spine" aria-hidden="true" />
            <div className="experience-timeline-card">
              <div className="timeline-node-pin" aria-hidden="true" />
              <div className="experience-header-meta">
                <div className="company-info">
                  <span className="company-tag mono">{experience.period}</span>
                  <h3 className="company-name">{experience.company}</h3>
                </div>
                <div className="role-meta">
                  <span className="role-title mono">{experience.role}</span>
                  <span className="location-tag mono">{experience.location}</span>
                </div>
              </div>
              <ul className="timeline-bullet-list">
                {experience.bullets.map((bullet) => (
                  <li key={bullet}>
                    <span className="bullet-connector" aria-hidden="true">↳</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="education" className="section education-section">
          <div className="section-heading">
            <SectionLabel index="05">Education / leadership</SectionLabel>
            <h2>Learning in public,<br /><span>building with others.</span></h2>
          </div>
          <div className="education-leadership-grid">
            <div className="academic-column">
              <div className="column-header mono">
                <span className="column-dot" aria-hidden="true" />
                ACADEMIC FORMATION
              </div>
              <div className="records-stack">
                {education.map((item) => (
                  <article className="editorial-record" key={item.school}>
                    <span className="record-period mono">{item.period}</span>
                    <h3 className="record-title">{item.school}</h3>
                    <p className="record-degree">{item.degree}</p>
                    <span className="record-metric mono">{item.meta}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="leadership-column">
              <div className="column-header mono">
                <span className="column-dot dot-violet" aria-hidden="true" />
                COMMUNITY & LEADERSHIP
              </div>
              <div className="records-stack">
                {leadership.map((item) => (
                  <article className="editorial-record" key={item.org}>
                    <span className="record-period mono">{item.period}</span>
                    <h3 className="record-title">{item.org}</h3>
                    <p className="record-role">{item.role}</p>
                    <span className="record-sub mono">{item.previous}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <SectionLabel index="06">Contact</SectionLabel>
          <div className="contact-convergence-panel">
            <div className="contact-copy-col">
              <span className="mono convergence-tag">SYNAPSE TERMINAL / OUTPUT NODE</span>
              <h2 className="contact-headline">
                LET’S<br /><em>CONNECT.</em>
              </h2>
              <p className="contact-text">
                For a thoughtful problem, a useful collaboration, or a conversation about systems that need to work beyond the prototype.
              </p>
            </div>

            <div className="contact-actions-col">
              <div className="contact-action-links">
                <a href={socials.email} className="contact-channel-card">
                  <div className="channel-icon-wrap"><Mail size={18} /></div>
                  <div className="channel-info">
                    <span className="channel-label mono">EMAIL</span>
                    <span className="channel-value">gargmukund774@gmail.com</span>
                  </div>
                  <ArrowUpRight size={16} className="channel-arrow" />
                </a>

                <a href={socials.github} target="_blank" rel="noreferrer" className="contact-channel-card">
                  <div className="channel-icon-wrap"><Github size={18} /></div>
                  <div className="channel-info">
                    <span className="channel-label mono">GITHUB</span>
                    <span className="channel-value">github.com/MukundGarg</span>
                  </div>
                  <ArrowUpRight size={16} className="channel-arrow" />
                </a>

                <a href={socials.linkedin} target="_blank" rel="noreferrer" className="contact-channel-card">
                  <div className="channel-icon-wrap"><Linkedin size={18} /></div>
                  <div className="channel-info">
                    <span className="channel-label mono">LINKEDIN</span>
                    <span className="channel-value">in/mukund-garg</span>
                  </div>
                  <ArrowUpRight size={16} className="channel-arrow" />
                </a>

                <a href={socials.resume} className="contact-channel-card card-resume">
                  <div className="channel-icon-wrap"><Download size={18} /></div>
                  <div className="channel-info">
                    <span className="channel-label mono">CURRICULUM VITAE</span>
                    <span className="channel-value">Mukund_Garg_Resume.pdf</span>
                  </div>
                  <ArrowUpRight size={16} className="channel-arrow" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-left">
          <span className="footer-brand">MUKUND GARG</span>
          <span className="footer-copyright">© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="footer-right mono">
          <span>APPLIED AI · BACKEND PIPELINES · COMPUTER VISION</span>
        </div>
      </footer>
    </div>
  );
}

