"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

const traits = [
  {
    label: "Demo → Production",
    body: "Latency budgets, observability, graceful degradation. AI systems that survive contact with real users.",
  },
  {
    label: "Security-Native",
    body: "Threat-modeling, prompt injection, adversarial ML, zero-trust thinking baked in from day one.",
  },
  {
    label: "Edge-First Instinct",
    body: "On-device inference. Zero cloud dependency when the workload doesn't need it. Your data stays with you.",
  },
  {
    label: "Military Discipline",
    body: "Five years in Air Force Security Forces — mission-critical execution under pressure. It carried over.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow="01 / About"
          title={
            <>
              I bridge worlds:{" "}
              <span className="text-accent">security, systems, and AI.</span>
            </>
          }
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-lg text-muted leading-relaxed"
          >
            <p>{profile.summary}</p>
            <p>{profile.summarySecondary}</p>

            <div className="pt-4 flex flex-wrap gap-2">
              {[
                "OpenAI API",
                "Anthropic API",
                "RAG",
                "Edge AI",
                "MLOps",
                "AWS",
                "Python",
                "React",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-mono text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {traits.map((t) => (
                <div
                  key={t.label}
                  className="bg-card p-5 sm:p-6 hover:bg-card-elevated transition-colors group"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono text-accent">
                    <span className="size-1 rounded-full bg-accent" />
                    {t.label}
                  </div>
                  <p className="mt-3 text-sm text-muted leading-relaxed group-hover:text-foreground transition-colors">
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
