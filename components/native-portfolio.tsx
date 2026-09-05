import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail, Download } from "lucide-react";
import { HeroNeuralCanvas } from "./hero-neural-canvas";
import { education, experience, leadership, nav, projects, skillGroups, socials } from "@/lib/portfolio-data";

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

function CapabilityMap() {
  const primary = ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Backend"];
  const secondary = ["Regression", "Random Forest", "XGBoost", "CNN", "OpenCV", "LSTM / GRU", "Transformers", "FastAPI", "Google APIs"];
  const connections = [[0, 1], [1, 2], [1, 3], [0, 4], [2, 5], [3, 6], [4, 7], [4, 8]];
  const primaryPositions = [[20, 42], [43, 23], [72, 35], [58, 72], [19, 76]];
  const secondaryPositions = [[5, 16], [23, 10], [43, 8], [89, 28], [88, 57], [70, 88], [45, 94], [3, 60], [28, 91]];

  return (
    <div className="capability-map" aria-label="Capability map connecting machine learning, deep learning, computer vision, NLP, and backend skills">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {connections.map(([from, to]) => <line key={`${from}-${to}`} x1={primaryPositions[from][0]} y1={primaryPositions[from][1]} x2={secondaryPositions[to][0]} y2={secondaryPositions[to][1]} />)}
        <line x1="20" y1="42" x2="43" y2="23" /><line x1="43" y1="23" x2="72" y2="35" /><line x1="43" y1="23" x2="58" y2="72" /><line x1="20" y1="42" x2="19" y2="76" />
      </svg>
      {primary.map((label, index) => <span key={label} className="capability-node primary" style={{ left: `${primaryPositions[index][0]}%`, top: `${primaryPositions[index][1]}%` }}><i />{label}</span>)}
      {secondary.map((label, index) => <span key={label} className="capability-node secondary" style={{ left: `${secondaryPositions[index][0]}%`, top: `${secondaryPositions[index][1]}%` }}><i />{label}</span>)}
    </div>
  );
}

function ProjectDiagram({ title, workflow }: { title: string; workflow: readonly string[] }) {
  const isMail = title === "MailPilot";
  const isStock = title === "StockSense AI";
  return (
    <div className={`project-diagram diagram-${isMail ? "mail" : isStock ? "stock" : "isl"}`}>
      <div className="diagram-head"><span>signal path</span><span>{isMail ? "DATA → AUTOMATION" : isStock ? "INPUTS → ANALYSIS" : "CAMERA → TEXT"}</span></div>
      {isMail && <svg viewBox="0 0 760 160" preserveAspectRatio="xMidYMid meet" aria-label="MailPilot workflow diagram">
        <path d="M86 80 H168 M250 80 H332 M414 80 H496 M578 80 H660" />
        {workflow.map((label, index) => <g key={label} transform={`translate(${index * 82}, 0)`}><rect x="4" y="52" width="76" height="56" /><text x="42" y="78" textAnchor="middle">{label.split(" / ")[0]}</text><text x="42" y="94" textAnchor="middle" className="diagram-muted">{label.includes(" / ") ? label.split(" / ")[1] : index === 6 ? "future sends" : ""}</text></g>)}
      </svg>}
      {isStock && <svg viewBox="0 0 760 250" preserveAspectRatio="xMidYMid meet" aria-label="StockSense AI two workflow diagram">
        <path d="M170 60 H286 M474 60 H590 M170 188 H286 M474 188 H590" />
        <g><rect x="24" y="28" width="146" height="64" /><text x="97" y="56" textAnchor="middle">PDF / 10-K</text><text x="97" y="75" textAnchor="middle" className="diagram-muted">document</text></g>
        <g><rect x="286" y="28" width="188" height="64" className="violet-box" /><text x="380" y="56" textAnchor="middle">LLM ANALYSIS</text><text x="380" y="75" textAnchor="middle" className="diagram-muted">summary · risks · outlook</text></g>
        <g><rect x="590" y="28" width="146" height="64" className="coral-box" /><text x="663" y="56" textAnchor="middle">SUMMARY</text><text x="663" y="75" textAnchor="middle" className="diagram-muted">result</text></g>
        <g><rect x="24" y="156" width="146" height="64" /><text x="97" y="184" textAnchor="middle">CHART IMAGE</text><text x="97" y="203" textAnchor="middle" className="diagram-muted">visual input</text></g>
        <g><rect x="286" y="156" width="188" height="64" className="teal-box" /><text x="380" y="184" textAnchor="middle">OPENCV PATTERNS</text><text x="380" y="203" textAnchor="middle" className="diagram-muted">nine patterns</text></g>
        <g><rect x="590" y="156" width="146" height="64" className="coral-box" /><text x="663" y="184" textAnchor="middle">BULL / BEAR / NEUTRAL</text></g>
      </svg>}
      {!isMail && !isStock && <svg viewBox="0 0 760 220" preserveAspectRatio="xMidYMid meet" aria-label="ISL Translator workflow diagram">
        <path d="M128 110 H204 M322 110 H398 M516 110 H592" />
        {workflow.map((label, index) => <g key={label} transform={`translate(${index * 118}, 0)`}><rect x="12" y="80" width="108" height="60" className={index === 4 ? "coral-box" : index === 1 ? "violet-box" : ""} /><text x="66" y="115" textAnchor="middle">{label}</text></g>)}
        <g className="landmark-mini"><path d="M80 192 L112 154 L139 176 L126 210 M112 154 L136 150 M139 176 L166 159" /><circle cx="80" cy="192" r="3" /><circle cx="112" cy="154" r="3" /><circle cx="139" cy="176" r="3" /></g>
      </svg>}
    </div>
  );
}

function ProjectArticle({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <article className={`project-article project-article-${index + 1}`}>
      <div className="project-copy">
        <div className="project-kicker"><span>0{index + 1}</span>{project.kicker}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.code && <pre><code>{project.code}</code></pre>}
        <div className="metric-line">{project.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div>
        <div className="stack-line">{project.stack.join(" · ")}</div>
        <div className="project-links"><a href={project.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live Demo <ArrowUpRight size={15} /></a>}</div>
      </div>
      <ProjectDiagram title={project.title} workflow={project.workflow} />
    </article>
  );
}

export function NativePortfolio() {
  return (
    <div className="portfolio-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <Link className="site-wordmark" href="#hero">MUKUND GARG</Link>
        <nav aria-label="Primary navigation"><div className="nav-links">{nav.map((item) => <Link key={item.id} href={item.href}>{item.label}</Link>)}</div><a className="resume-link" href={socials.resume}>Resume <Download size={14} /></a></nav>
      </header>
      <main id="main-content">
        <section id="hero" className="native-hero" aria-labelledby="hero-title"><HeroNeuralCanvas /><div className="hero-inner"><div className="hero-index mono">01 / APPLIED SYSTEMS</div><h1 id="hero-title">MUKUND<br /><em>GARG</em></h1><div className="hero-bottom"><p className="hero-role">Applied AI · Backend Systems · Computer Vision</p><p className="hero-intro">Most of my work starts with a concrete workflow and ends with a working system — Gmail automation, financial-document analysis, or offline sign-language recognition.</p><div className="hero-actions"><Link className="button button-solid" href="#projects" data-network-route="0">Selected work <ArrowUpRight size={16} /></Link><a className="button" href={socials.resume} data-network-route="3">Resume <Download size={15} /></a></div></div></div><div className="hero-note mono">DATA / MODEL / CODE / SYSTEM / OUTPUT</div></section>
        <section id="about" className="section about-section"><div className="section-heading"><SectionLabel index="02">About / capability map</SectionLabel><h2>Systems thinking,<br /><span>grounded in the work.</span></h2></div><div className="about-layout"><div className="about-copy"><p>An Electronics & Communication Engineering student focused on machine learning, deep learning, computer vision, NLP, and backend development.</p><p>The interesting part is the connection between a model and the workflow around it: inputs, APIs, state, decisions, and the result a person can actually use.</p><div className="about-facts"><span>MSIT · Delhi</span><span>B.Tech ECE · 2025–2029</span><span>First-year CGPA · 8.82 / 10</span></div><div className="toolchain-line">{skillGroups.flatMap((group) => group.items).slice(0, 18).join(" · ")}</div></div><CapabilityMap /></div></section>
        <section id="projects" className="section work-section"><div className="section-heading work-heading"><SectionLabel index="03">Selected work</SectionLabel><h2>Three systems,<br /><span>three kinds of friction.</span></h2></div><div className="project-list">{projects.map((project, index) => <ProjectArticle key={project.title} project={project} index={index} />)}</div></section>
        <section id="experience" className="section experience-section"><div className="section-heading"><SectionLabel index="04">Experience</SectionLabel><h2>Operations became<br /><span>a software problem.</span></h2></div><div className="experience-layout"><div className="experience-meta"><strong>{experience.company}</strong><span>{experience.period}</span><span>{experience.location}</span></div><div className="timeline-entry"><h3>{experience.role}</h3><ul>{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></div></section>
        <section id="education" className="section education-section"><div className="section-heading"><SectionLabel index="05">Education / leadership</SectionLabel><h2>Learning in public,<br /><span>building with others.</span></h2></div><div className="education-layout"><div>{education.map((item) => <article className="record" key={item.school}><span className="record-period mono">{item.period}</span><h3>{item.school}</h3><p>{item.degree}</p><strong>{item.meta}</strong></article>)}</div><div>{leadership.map((item) => <article className="record" key={item.org}><span className="record-period mono">{item.period}</span><h3>{item.org}</h3><p>{item.role}</p><strong>{item.previous}</strong></article>)}</div></div></section>
        <section id="contact" className="section contact-section"><div className="contact-signal" aria-hidden="true"><span /><span /><span /></div><SectionLabel index="06">Contact</SectionLabel><div className="contact-layout"><div><h2>LET’S<br /><em>CONNECT.</em></h2><p>For a thoughtful problem, a useful collaboration, or a conversation about systems that need to work beyond the prototype.</p></div><div className="contact-links"><a href={socials.email}><Mail size={17} /> Email <ArrowUpRight size={15} /></a><a href={socials.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={15} /></a><a href={socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={15} /></a><a href={socials.resume}><Download size={17} /> Resume <ArrowUpRight size={15} /></a></div></div></section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Mukund Garg</span><span className="mono">APPLIED AI / BACKEND / COMPUTER VISION</span></footer>
    </div>
  );
}
