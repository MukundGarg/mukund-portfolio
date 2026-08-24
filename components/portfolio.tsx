"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  TerminalSquare,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  education,
  experience,
  leadership,
  projects,
  skillGroups,
  socials,
} from "@/lib/portfolio-data";

const navItems = [
  ["About", "#about"],
  ["Work", "#work"],
  ["Experience", "#experience"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className="mb-9 sm:mb-12"
    >
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{title}</h2>
      {copy ? <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">{copy}</p> : null}
    </motion.div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-5">
        <a href="#top" className="flex items-center gap-3" aria-label="Go to top">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs font-bold text-[var(--accent)]">MG</span>
          <span className="hidden text-sm font-semibold tracking-tight text-white/90 sm:inline">Mukund Garg</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="text-xs font-medium text-white/45 transition-colors hover:text-white">{label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={socials.resume}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" /> Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl border border-white/10 p-2 text-white/70 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white">{label}</a>
          ))}
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <div className="noise pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[12%] top-[24%] h-56 w-56 rounded-full bg-[var(--accent)]/10 blur-[95px]"
        animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-[20%] h-64 w-64 rounded-full bg-[var(--accent-2)]/10 blur-[110px]"
        animate={{ y: [0, 24, 0], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/[0.055] px-3 py-1.5 text-xs text-white/60"
          >
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Open to tech internships
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl text-[clamp(3.6rem,10vw,7.9rem)] font-black leading-[0.9] tracking-[-0.065em]"
          >
            <span className="block text-white/30">I build</span>
            <span className="block text-white">AI systems</span>
            <span className="block bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">that ship.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.65 }}
            className="mt-7 max-w-2xl text-base leading-7 text-white/45 sm:text-xl sm:leading-8"
          >
            I&apos;m Mukund Garg — a second-year ECE student focused on applied ML, backend systems, automation, computer vision, and turning technical ideas into working products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#work" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5">
              View my work <ArrowDown className="h-4 w-4" />
            </a>
            <a href={socials.email} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-5 py-3 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white">
              <Mail className="h-4 w-4" /> Contact me
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
        >
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">System profile</p>
              <p className="mt-1 text-sm text-white/70">Mukund Garg / 2026</p>
            </div>
            <TerminalSquare className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <div className="space-y-5">
            {[
              ["Focus", "AI/ML • Backend • Automation"],
              ["Location", "New Delhi, India"],
              ["Education", "MSIT • B.Tech ECE"],
              ["Current", "Building applied AI systems"],
            ].map(([key, value]) => (
              <div key={key} className="grid grid-cols-[90px_1fr] gap-4 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">{key}</span>
                <span className="text-sm text-white/70">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-2">
            {[
              [Github, socials.github, "GitHub"],
              [Linkedin, socials.linkedin, "LinkedIn"],
              [Mail, socials.email, "Email"],
            ].map(([Icon, href, label]) => {
              const SocialIcon = Icon as typeof Github;
              return (
                <a key={String(label)} href={String(href)} target="_blank" rel="noreferrer" aria-label={String(label)} className="rounded-xl border border-white/10 p-2.5 text-white/45 transition-colors hover:border-[var(--accent)]/25 hover:text-[var(--accent)]">
                  <SocialIcon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutBento() {
  const headlineSkills = ["FastAPI", "PyTorch", "OpenCV", "Scikit-learn", "Docker", "Pydantic", "Gemini", "Gmail API"];

  return (
    <section id="about" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="01 / About" title="Software, ML, and systems thinking in one profile." copy="My projects sit at the intersection of applied AI and useful software — from on-device vision to workflow automation and financial-analysis tools." />

        <div className="grid auto-rows-[minmax(150px,auto)] gap-4 md:grid-cols-4">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass card-hover relative overflow-hidden rounded-3xl p-6 md:col-span-2 md:row-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Field note</p>
            <h3 className="mt-5 max-w-lg text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">I like problems where code removes friction.</h3>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/45">
              MailPilot came directly from repetitive outreach work at Iqlipse. StockSense combines API design, LLMs, and OpenCV. My ISL app pushed me into real-time, offline inference on Android. I learn fastest by connecting theory to something that works end-to-end.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Applied AI", "Backend Systems", "Automation", "Computer Vision"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-white/50">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: .05 }} className="glass card-hover rounded-3xl p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Academic signal</p>
                <p className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white">8.82<span className="text-lg text-white/30">/10</span></p>
              </div>
              <GraduationCap className="h-7 w-7 text-[var(--accent)]" />
            </div>
            <p className="mt-3 text-sm text-white/45">First-year CGPA • B.Tech ECE • MSIT</p>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: .1 }} className="glass card-hover rounded-3xl p-6">
            <Cpu className="h-5 w-5 text-[var(--accent)]" />
            <p className="mt-5 text-sm font-semibold text-white">32 gesture outputs</p>
            <p className="mt-2 text-xs leading-5 text-white/35">Offline ISL recognition: 26 alphabet signs + 6 fixed words.</p>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: .15 }} className="glass card-hover rounded-3xl p-6">
            <BrainCircuit className="h-5 w-5 text-[var(--accent-2)]" />
            <p className="mt-5 text-sm font-semibold text-white">AI + systems</p>
            <p className="mt-2 text-xs leading-5 text-white/35">Model knowledge paired with APIs, validation, deployment, and automation.</p>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass card-hover rounded-3xl p-6 md:col-span-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">Core stack</p>
                <p className="mt-2 text-sm text-white/45">The tools I reach for most often.</p>
              </div>
              <div className="flex max-w-3xl flex-wrap gap-2">
                {headlineSkills.map((skill) => (
                  <span key={skill} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/65">{skill}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="work" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="02 / Selected work" title="Projects with a reason to exist." copy="I prefer projects that solve a concrete problem and force me to connect several layers of the stack." />
        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-70px" }}
              transition={{ delay: index * .08, duration: .5 }}
              className={`glass card-hover group flex min-h-[390px] flex-col rounded-3xl p-6 ${project.featured && index === 0 ? "lg:col-span-2" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">{project.kicker}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white">{project.title}</h3>
                </div>
                <Sparkles className="h-5 w-5 text-white/20 transition-colors group-hover:text-[var(--accent)]" />
              </div>
              <p className="mt-5 text-sm leading-7 text-white/45">{project.description}</p>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {project.metrics.map((metric) => (
                  <div key={metric} className="rounded-xl border border-white/[0.07] bg-black/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{metric}</div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-full bg-white/[0.045] px-2.5 py-1 text-[11px] text-white/40">{item}</span>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-3 pt-8">
                <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-white/55 transition-colors hover:text-white">
                  <Github className="h-4 w-4" /> Source
                </a>
                {project.live ? (
                  <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent)]/80 transition-colors hover:text-[var(--accent)]">
                    <ExternalLink className="h-4 w-4" /> Live
                  </a>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="03 / Experience" title="From operations friction to software automation." />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[var(--accent)]"><BriefcaseBusiness className="h-4 w-4" /><span className="font-mono text-[10px] uppercase tracking-[0.2em]">Iqlipse</span></div>
                <h3 className="mt-3 text-xl font-semibold text-white">{experience.role}</h3>
                <p className="mt-1 text-sm text-white/35">{experience.location}</p>
              </div>
              <span className="rounded-xl border border-white/10 px-3 py-2 font-mono text-[10px] text-white/40">{experience.period}</span>
            </div>
            <ul className="mt-6 space-y-4">
              {experience.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm leading-7 text-white/48"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]/70" />{bullet}</li>
              ))}
            </ul>
          </motion.div>

          <div className="grid gap-4">
            {education.map((item, index) => (
              <motion.div key={item.school} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: index * .08 }} className="glass card-hover rounded-3xl p-6">
                <div className="flex items-start justify-between gap-4"><GraduationCap className="h-5 w-5 text-white/35" /><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">{item.period}</span></div>
                <h3 className="mt-5 text-sm font-semibold text-white/85">{item.school}</h3>
                <p className="mt-1 text-xs text-white/40">{item.degree}</p>
                <p className="mt-4 text-xs text-[var(--accent)]/75">{item.meta}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="04 / Technical map" title="A broad toolkit, grouped by how I use it." copy="These categories fold together the ML, deep learning, NLP, OpenCV, and FastAPI material I have studied and applied." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <motion.div key={group.label} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: index * .05 }} className="glass card-hover rounded-3xl p-6">
              <div className="flex items-center gap-3"><Code2 className="h-4 w-4 text-[var(--accent)]" /><h3 className="text-sm font-semibold text-white">{group.label}</h3></div>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-white/45">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Leadership() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="05 / Leadership" title="Technical leadership and community work." />
        <div className="grid gap-4 md:grid-cols-2">
          {leadership.map((item, index) => (
            <motion.div key={item.org} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: index * .08 }} className="glass card-hover rounded-3xl p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-white">{item.role}</h3><p className="mt-1 text-sm text-white/45">{item.org}</p></div><span className="font-mono text-[10px] text-white/25">{item.period}</span></div>
              <p className="mt-6 border-t border-white/[0.07] pt-5 text-xs text-white/35">Previous tenure: {item.previous}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="px-4 pb-8 pt-20 sm:px-6 sm:pt-28">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-7 sm:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-[100px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">06 / Contact</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Have a technical problem worth building around?</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45">I&apos;m currently looking for tech internship opportunities across AI/ML, backend, automation, and software engineering.</p>
          </div>
          <a href={socials.email} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#05110d] transition-transform hover:-translate-y-0.5">Email me <ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-white/[0.06] pt-6 text-xs text-white/28 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Mukund Garg</span>
        <div className="flex items-center gap-4">
          <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
          <a href={socials.resume} target="_blank" rel="noreferrer" className="hover:text-white">Resume</a>
        </div>
      </div>
    </footer>
  );
}

export function Portfolio() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <AboutBento />
      <Projects />
      <Experience />
      <Skills />
      <Leadership />
      <Contact />
      <Footer />
    </main>
  );
}
