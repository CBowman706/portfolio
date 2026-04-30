"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";

export function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial-fade opacity-40" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(94,234,212,0.10),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-mono text-accent"
        >
          <span className="size-1 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(94,234,212,0.6)]" />
          05 / Contact
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[1.05]"
        >
          If you&apos;re building <span className="text-accent">applied AI</span>
          <br className="hidden sm:block" /> or agentic systems —{" "}
          <span className="bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent">
            let&apos;s talk.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-6 max-w-2xl mx-auto text-muted text-lg leading-relaxed"
        >
          Open to AI engineering roles, contract work, and serious
          collaborations on RAG, edge inference, and secure LLM systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-bright transition-colors"
          >
            {profile.email}
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-card/50 backdrop-blur px-6 py-3 text-sm font-medium text-foreground hover:border-accent/50 hover:text-accent transition-all"
          >
            LinkedIn ↗
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] font-mono text-subtle"
        >
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(94,234,212,0.7)] pulse-dot" />
          Currently in {profile.location}
        </motion.div>
      </div>
    </section>
  );
}
