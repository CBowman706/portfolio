"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";

const roles = [
  "AI Engineer",
  "RAG Architect",
  "Edge AI Builder",
  "Security-First Developer",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-24 md:pt-44 md:pb-36"
    >
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial-fade" />
        <div className="absolute inset-0 bg-grid-fine opacity-40 mask-radial-fade" />

        <div className="aurora">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[60rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(94,234,212,0.18),transparent_55%)]" />
          <div className="absolute top-20 right-0 size-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.10),transparent_60%)]" />
          <div className="absolute -bottom-32 left-0 size-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.10),transparent_60%)]" />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-4xl">
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/50 backdrop-blur px-3.5 py-1.5 text-xs font-mono text-muted"
          >
            <span className="relative inline-flex size-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(94,234,212,0.7)] pulse-dot" />
            <span className="text-foreground">Available</span>
            <span className="text-subtle">·</span>
            <span>Charlotte Metro · Remote</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tighter"
          >
            <span className="block text-foreground">{profile.firstName}</span>
            <span className="block bg-gradient-to-br from-foreground via-foreground to-accent bg-clip-text text-transparent">
              {profile.lastName}.
            </span>
          </motion.h1>

          {/* Role rotator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-muted"
          >
            <span className="text-subtle">~/</span>
            <span className="text-accent">{roles[0]}</span>
            {roles.slice(1).map((r) => (
              <span key={r} className="flex items-center gap-3">
                <span className="text-subtle">·</span>
                <span>{r}</span>
              </span>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed"
          >
            {profile.tagline}{" "}
            <span className="text-foreground">
              U.S. Air Force veteran turned engineer
            </span>
            , currently a Security & Awareness Analyst at{" "}
            <span className="text-foreground">Centene</span>.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-bright transition-colors"
            >
              See the work
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-card/30 backdrop-blur px-5 py-2.5 text-sm font-medium text-foreground hover:border-accent/50 hover:text-accent transition-all"
            >
              Get in touch
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              LinkedIn ↗
            </a>
          </motion.div>
        </div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border bg-border"
        >
          {profile.stats.map((s) => (
            <div
              key={s.label}
              className="bg-card px-5 py-6 sm:px-6 sm:py-7 hover:bg-card-elevated transition-colors"
            >
              <div className="font-display text-3xl sm:text-4xl text-foreground tracking-tight">
                {s.value}
              </div>
              <div className="mt-1.5 text-[11px] uppercase tracking-[0.18em] font-mono text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-subtle font-mono"
      >
        Scroll
      </motion.div>
    </section>
  );
}
