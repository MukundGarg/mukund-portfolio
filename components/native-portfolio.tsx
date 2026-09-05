import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail, Download } from "lucide-react";
import type { ReactNode } from "react";
import { HeroNeuralCanvas } from "./hero-neural-canvas";
import { education, experience, leadership, nav, projects, skillGroups, socials } from "@/lib/portfolio-data";

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

function CapabilityMap() {
  const visibleGroups = skillGroups.filter((group) => group.label !== "Web");

  return (
    <div className="capability-map" role="group" aria-label="Technical capability map">
      <div className="capability-spine" aria-hidden="true" />
      {visibleGroups.map((group, index) => (
        <article className="capability-group" key={group.label}>
          <span className="capability-index mono">0{index + 1}</span>
          <h3>{group.label}</h3>
          <p>{group.items.join(" · ")}</p>
        </article>
      ))}
    </div>
  );
}

function FlowSequence({ items }: { items: readonly string[] }) {
  return <div className="flow-sequence">{items.map((item, index) => <div className="flow-step" key={item}><span className="flow-number mono">{String(index + 1).padStart(2, "0")}</span><span>{item}</span></div>)}</div>;
}

function ProjectDiagram({ title, workflow }: { title: string; workflow: readonly string[] }) {
  if (title === "StockSense AI") {
    return <div className="project-diagram" role="group" aria-label="StockSense AI analysis workflows"><div className="diagram-head"><span>signal paths</span><span>INPUTS → ANALYSIS</span></div><div className="stock-branches"><div className="flow-branch"><span className="branch-label mono">DOCUMENT</span><FlowSequence items={["PDF / 10-K", "LLM analysis", "Summary · risks · outlook"]} /></div><div className="flow-branch"><span className="branch-label mono">CHART</span><FlowSequence items={["Chart image", "OpenCV patterns", "Bullish · bearish · neutral"]} /></div></div></div>;
  }

  return (
    <div className="project-diagram" role="group" aria-label={`${title} workflow`}><div className="diagram-head"><span>signal path</span><span>{title === "MailPilot" ? "DATA → AUTOMATION" : "CAMERA → TEXT"}</span></div><FlowSequence items={workflow} />{title === "Offline ISL Translator" && <svg className="landmark-mark" viewBox="0 0 180 100" role="img" aria-label="Abstract hand landmark connection"><path d="M22 78 L55 34 L81 58 L112 25 M55 34 L77 18 M81 58 L126 54 M81 58 L96 88" />{["22,78", "55,34", "81,58", "112,25", "77,18", "126,54", "96,88"].map((point) => { const [cx, cy] = point.split(","); return <circle key={point} cx={cx} cy={cy} r="3" />; })}</svg>}</div>
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
