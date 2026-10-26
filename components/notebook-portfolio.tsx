"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleDot,
  Code2,
  FileCode2,
  Github,
  Linkedin,
  Mail,
  PanelRightClose,
  PanelRightOpen,
  Play,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { education, experience, leadership, projects, skillGroups, socials } from "@/lib/portfolio-data";

const sections = [
  { id: "overview", label: "Overview", number: "01" },
  { id: "skills", label: "Skills", number: "02" },
  { id: "projects", label: "Projects", number: "03" },
  { id: "experience", label: "Experience", number: "04" },
  { id: "education", label: "Education", number: "05" },
  { id: "contact", label: "Contact", number: "06" },
] as const;

const variableRows = [
  { name: "name", type: "str", value: '"Mukund Garg"', detail: "Electronics & Communication Engineering student" },
  { name: "focus", type: "list[str]", value: "3 areas", detail: "Applied AI, backend systems, computer vision" },
  { name: "projects", type: "list[Project]", value: "3 items", detail: "MailPilot, StockSense AI, Offline ISL Translator" },
  { name: "experience", type: "dict", value: "Iqlipse", detail: "Operations & Workflow Automation Intern" },
  { name: "cgpa", type: "float", value: "8.82", detail: "First-year CGPA out of 10" },
] as const;

function NotebookCell({
  number,
  label,
  children,
  onRun,
  ran,
  output,
}: {
  number: string;
  label: string;
  children: ReactNode;
  onRun?: () => void;
  ran?: boolean;
  output?: ReactNode;
}) {
  return (
    <article className="nb-cell">
      <div className="nb-cell-gutter">
        <span>{number}</span>
        <span className="nb-cell-connector" aria-hidden="true" />
      </div>
      <div className="nb-cell-body">
        <div className="nb-cell-toolbar">
          <span className="nb-cell-label">
            <Code2 size={13} aria-hidden="true" />
            {label}
          </span>
          {onRun && (
            <button className="nb-run-cell" type="button" onClick={onRun} aria-label={`Refresh ${label} preview`}>
              {ran ? <Check size={13} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
              {ran ? "Updated" : "Run"}
            </button>
          )}
        </div>
        <div className="nb-cell-content">{children}</div>
        {output && <div className="nb-cell-output">{output}</div>}
      </div>
    </article>
  );
}

export function NotebookPortfolio() {
  const [variablesOpen, setVariablesOpen] = useState(true);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [variableQuery, setVariableQuery] = useState("");
  const [ranCells, setRanCells] = useState<Set<string>>(() => new Set());
  const [newCell, setNewCell] = useState(false);
  const [note, setNote] = useState("A note to future collaborators...");
  const [notice, setNotice] = useState("");

  const filteredVariables = useMemo(
    () => variableRows.filter((row) => row.name.toLowerCase().includes(variableQuery.toLowerCase())),
    [variableQuery],
  );

  const refreshCell = (cell: string) => {
    setRanCells((previous) => new Set(previous).add(cell));
    setNotice(`${cell} preview refreshed`);
  };

  const runAll = useCallback(() => {
    setRanCells(new Set(["Profile", "Skills"]));
    setNotice("All notebook previews are up to date");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        runAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runAll]);

  const addCell = () => {
    setNewCell(true);
    setNotice("Markdown cell added");
    window.setTimeout(() => document.getElementById("new-note-cell")?.focus(), 0);
  };

  return (
    <div className={`nb-workspace${variablesOpen ? " nb-inspector-open" : ""}`}>
      <a className="nb-skip-link" href="#notebook-content">Skip to content</a>
      <aside className="nb-sidebar" aria-label="Notebook navigation">
        <a className="nb-brand" href="#overview" aria-label="Mukund Garg portfolio home">
          <span className="nb-brand-mark">m</span>
          <span>mukund<span className="nb-brand-dot">.</span></span>
        </a>

        <div className="nb-sidebar-section">
          <div className="nb-sidebar-heading">
            <span>WORKSPACE</span>
            <ChevronDown size={13} aria-hidden="true" />
          </div>
          <div className="nb-workspace-name">
            <span className="nb-workspace-icon">M</span>
            <span>Mukund Garg</span>
            <ChevronDown size={13} aria-hidden="true" />
          </div>
        </div>

        <div className="nb-sidebar-section nb-files-section">
          <div className="nb-sidebar-heading">
            <span>NOTEBOOK</span>
            <button type="button" className="nb-icon-button" aria-label="Add a notebook cell" onClick={addCell}>
              <Plus size={14} />
            </button>
          </div>
          <a className="nb-file-link nb-file-active" href="#overview">
            <FileCode2 size={15} aria-hidden="true" />
            <span>portfolio.py</span>
            <span className="nb-unsaved-dot" />
          </a>
          <span className="nb-file-caption">Python notebook · 6 sections</span>
        </div>

        <nav className="nb-sidebar-section nb-sections" aria-label="Notebook sections">
          <div className="nb-sidebar-heading"><span>ON THIS PAGE</span></div>
          {sections.map((section) => (
            <a className="nb-section-link" href={`#${section.id}`} key={section.id}>
              <span className="nb-section-number">{section.number}</span>
              <span>{section.label}</span>
            </a>
          ))}
        </nav>

        <div className="nb-sidebar-footer">
          <div className="nb-kernel-status"><span className="nb-live-dot" /> Portfolio preview</div>
          <span className="nb-kernel-caption">Interactive · Updated Oct 2026</span>
        </div>
      </aside>

      <main className="nb-main" id="overview">
        <header className="nb-topbar">
          <div className="nb-breadcrumb">
            <span>mukund</span><span className="nb-breadcrumb-slash">/</span>
            <FileCode2 size={14} aria-hidden="true" /><strong>portfolio.py</strong>
            <span className="nb-save-state"><Check size={12} /> Saved</span>
          </div>
          <div className="nb-toolbar-actions">
            <button
              className="nb-variable-toggle"
              type="button"
              onClick={() => setVariablesOpen((open) => !open)}
              aria-expanded={variablesOpen}
              aria-controls="nb-inspector"
            >
              {variablesOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
              <span>Variables</span>
            </button>
            <button className="nb-run-all" type="button" onClick={runAll}>
              <Play size={13} fill="currentColor" aria-hidden="true" />
              <span>Run all</span>
              <kbd>⌘ ↵</kbd>
            </button>
          </div>
        </header>

        <div className="nb-notebook" id="notebook-content" tabIndex={-1}>
          <div className="nb-document-meta">
            <span><CircleDot size={12} /> PUBLIC NOTEBOOK</span>
            <span>3 CELLS <i /> PYTHON</span>
          </div>

          <NotebookCell number="01" label="Markdown">
            <div className="nb-intro">
              <div className="nb-eyebrow"><Sparkles size={13} /> Applied AI · Systems · Vision</div>
              <h1>Mukund Garg<span>.</span></h1>
              <p className="nb-lede">
                I build intelligent systems that connect models to the real world — from reliable backend workflows to on-device computer vision.
              </p>
              <div className="nb-intro-links">
                <a href="#projects">Explore my work <ArrowRight size={14} /></a>
                <a href={socials.resume} target="_blank" rel="noreferrer">Resume <ArrowUpRight size={13} /></a>
              </div>
              <div className="nb-inline-stats">
                <span><b>03</b> shipped projects</span>
                <span><b>08.82</b> first-year CGPA</span>
                <span><b>2029</b> B.Tech ECE</span>
              </div>
            </div>
          </NotebookCell>

          <NotebookCell
            number="02"
            label="Python · profile"
            onRun={() => refreshCell("Profile")}
            ran={ranCells.has("Profile")}
            output={
              <div className="nb-output-line">
                <span className="nb-output-prompt">Out[1]:</span>
                <span className="nb-output-pill"><Activity size={14} /> Building at the intersection of AI and useful software</span>
              </div>
            }
          >
            <pre className="nb-code"><code>
              <span className="nb-code-line"><span className="nb-line-no">1</span><span><i>from</i> portfolio <i>import</i> Mukund</span></span>
              <span className="nb-code-line"><span className="nb-line-no">2</span></span>
              <span className="nb-code-line"><span className="nb-line-no">3</span><span>builder = Mukund(</span></span>
              <span className="nb-code-line"><span className="nb-line-no">4</span><span>    focus=[<b>&quot;applied AI&quot;</b>, <b>&quot;backend systems&quot;</b>, <b>&quot;computer vision&quot;</b>],</span></span>
              <span className="nb-code-line"><span className="nb-line-no">5</span><span>    approach=<b>&quot;models + APIs + real-time pipelines&quot;</b>,</span></span>
              <span className="nb-code-line"><span className="nb-line-no">6</span><span>)</span></span>
            </code></pre>
          </NotebookCell>

          <section className="nb-section-block" id="skills">
            <div className="nb-section-heading">
              <div>
                <span className="nb-section-kicker">02 / CAPABILITY MAP</span>
                <h2>What I work with</h2>
              </div>
              <span className="nb-section-aside">Skills by domain</span>
            </div>
            <NotebookCell
              number="03"
              label="Python · skill_distribution"
              onRun={() => refreshCell("Skills")}
              ran={ranCells.has("Skills")}
              output={
                <div className="nb-chart-output">
                  <div className="nb-chart-title">
                    <div><strong>Tools & techniques</strong><span>Number of skills in each domain</span></div>
                    <span className="nb-chart-tag">6 DOMAINS</span>
                  </div>
                  <div className="nb-bars" role="img" aria-label="Bar chart of six technical skill domains">
                    {skillGroups.map((group, index) => (
                      <div className="nb-bar-row" key={group.label}>
                        <span className="nb-bar-label">{group.label}</span>
                        <div className="nb-bar-track"><span className={`nb-bar-fill nb-bar-${index}`} style={{ width: `${(group.items.length / 7) * 100}%` }} /></div>
                        <span className="nb-bar-value">{group.items.length}</span>
                      </div>
                    ))}
                  </div>
                  <div className="nb-chart-footnote"><span>Source: current toolkit</span><span>{skillGroups.reduce((total, group) => total + group.items.length, 0)} skills</span></div>
                </div>
              }
            >
              <pre className="nb-code nb-code-single"><code><span className="nb-code-line"><span className="nb-line-no">1</span><span>skill_distribution = {`{group.label: len(group.items) for group in skill_groups}`}</span></span></code></pre>
            </NotebookCell>
          </section>

          <section className="nb-section-block" id="projects">
            <div className="nb-section-heading">
              <div>
                <span className="nb-section-kicker">03 / SELECTED WORK</span>
                <h2>Projects built to be useful</h2>
              </div>
              <span className="nb-section-aside">Three systems, three kinds of friction</span>
            </div>
            <div className="nb-project-grid">
              {projects.map((project, index) => (
                <article className="nb-project-card" key={project.title}>
                  <div className="nb-project-topline">
                    <span>0{index + 1}</span><span>{project.kicker}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="nb-project-metrics">{project.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div>
                  <div className="nb-project-tech">{project.stack.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <div className="nb-project-actions">
                    <a href={project.github} target="_blank" rel="noreferrer" className="nb-project-link">
                      View source <ArrowUpRight size={14} />
                    </a>
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer" className="nb-project-link">
                        Live demo <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {newCell && (
            <section className="nb-added-cell">
              <div className="nb-added-cell-head">
                <span><FileCode2 size={14} /> Markdown cell</span>
                <button type="button" onClick={() => setNewCell(false)} aria-label="Remove new cell"><X size={14} /></button>
              </div>
              <label className="nb-visually-hidden" htmlFor="new-note-cell">Edit your notebook note</label>
              <textarea id="new-note-cell" value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
              <div className="nb-note-preview">{note || "Your markdown preview will appear here."}</div>
            </section>
          )}

          <section className="nb-section-block" id="experience">
            <div className="nb-section-heading">
              <div>
                <span className="nb-section-kicker">04 / EXPERIENCE</span>
                <h2>Turning workflow friction into software</h2>
              </div>
            </div>
            <article className="nb-experience-card">
              <div className="nb-experience-meta"><span>{experience.period}</span><span>{experience.location}</span></div>
              <h3>{experience.role}</h3>
              <p className="nb-company">{experience.company}</p>
              <ul>{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </article>
          </section>

          <section className="nb-section-block" id="education">
            <div className="nb-section-heading">
              <div>
                <span className="nb-section-kicker">05 / EDUCATION & COMMUNITY</span>
                <h2>Learning in public</h2>
              </div>
            </div>
            <div className="nb-record-grid">
              <div className="nb-record-column">
                <h3>Education</h3>
                {education.map((item) => (
                  <article className="nb-record" key={item.school}>
                    <span>{item.period}</span><h4>{item.school}</h4><p>{item.degree}</p><small>{item.meta}</small>
                  </article>
                ))}
              </div>
              <div className="nb-record-column">
                <h3>Leadership</h3>
                {leadership.map((item) => (
                  <article className="nb-record" key={item.org}>
                    <span>{item.period}</span><h4>{item.org}</h4><p>{item.role}</p><small>{item.previous}</small>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="nb-contact" id="contact">
            <span className="nb-section-kicker">06 / GET IN TOUCH</span>
            <h2>Have a good problem?<br />Let’s work on it.</h2>
            <p>I’m always up for thoughtful problems, useful collaborations, and conversations about systems that work beyond the prototype.</p>
            <div className="nb-contact-links">
              <a href={socials.email}><Mail size={15} /> Email <ArrowUpRight size={13} /></a>
              <a href={socials.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ArrowUpRight size={13} /></a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={13} /></a>
              <a href={socials.resume} target="_blank" rel="noreferrer"><ArrowDownToLine size={15} /> Resume <ArrowUpRight size={13} /></a>
            </div>
          </section>

          <footer className="nb-footer">
            <span>© {new Date().getFullYear()} Mukund Garg</span>
            <span>Made with curiosity <span aria-hidden="true">♥</span> and Python</span>
          </footer>
        </div>
        <div className="nb-statusbar">
          <span><span className="nb-status-dot" /> Ready</span>
          <span aria-live="polite">{notice || "Notebook preview · No server required"}</span>
          <button type="button" onClick={addCell}><Plus size={13} /> Add cell</button>
        </div>
      </main>

      <aside className="nb-inspector" id="nb-inspector" aria-label="Notebook variables">
        <div className="nb-inspector-header">
          <div><span className="nb-inspector-title">Variables</span><span className="nb-inspector-count">5</span></div>
          <button type="button" className="nb-icon-button" onClick={() => setVariablesOpen(false)} aria-label="Close variables panel"><PanelRightClose size={16} /></button>
        </div>
        <div className="nb-inspector-tabs"><button className="nb-tab-active" type="button">Variables</button><button type="button" disabled title="No data tables in this notebook">Tables</button></div>
        <label className="nb-variable-search">
          <Search size={14} aria-hidden="true" />
          <input value={variableQuery} onChange={(event) => setVariableQuery(event.target.value)} placeholder="Filter variables..." />
        </label>
        <div className="nb-variable-list">
          {filteredVariables.length > 0 ? filteredVariables.map((row) => (
            <button
              type="button"
              className={`nb-variable-row${selectedVariable === row.name ? " nb-variable-selected" : ""}`}
              key={row.name}
              onClick={() => setSelectedVariable((selected) => selected === row.name ? null : row.name)}
              aria-expanded={selectedVariable === row.name}
            >
              <span className="nb-variable-icon">{row.name === "projects" ? "[]" : row.name === "cgpa" ? "#" : "a"}</span>
              <span className="nb-variable-info"><span><strong>{row.name}</strong><small>{row.type}</small></span><span className="nb-variable-value">{row.value}</span>
                {selectedVariable === row.name && <span className="nb-variable-detail">{row.detail}</span>}
              </span>
            </button>
          )) : <p className="nb-no-variables">No matching variables</p>}
        </div>
        <div className="nb-inspector-footer"><span><span className="nb-live-dot" /> Live preview</span><span>Browser</span></div>
      </aside>
      {variablesOpen && <button className="nb-mobile-scrim" type="button" onClick={() => setVariablesOpen(false)} aria-label="Close variables panel" />}
    </div>
  );
}
