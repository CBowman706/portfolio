"use client";

import { motion } from "framer-motion";
import { projects, type ProjectItem } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProjectItem["status"], string> = {
  Live: "border-accent/40 bg-accent/10 text-accent",
  "In Progress": "border-amber/40 bg-amber/10 text-amber",
  "Coming Soon": "border-border bg-card text-muted",
};

export function Projects() {
  return (
    <section id="work" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <SectionHeader
            eyebrow="03 / Selected work"
            title={
              <>
                Things I&apos;m{" "}
                <span className="text-accent">actually shipping.</span>
              </>
            }
            description="A live look at what's running on my own hardware right now — production-grade edge AI, distributed inference, and the AI/security research backing it. A polished portfolio site goes here next."
          />

          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 self-start text-sm text-muted hover:text-accent transition-colors font-mono"
          >
            <span>portfolio coming soon</span>
            <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              className="surface surface-hover glow-border rounded-2xl p-6 flex flex-col h-full group relative overflow-hidden"
            >
              {/* corner glyph */}
              <div
                aria-hidden
                className="absolute -top-12 -right-12 size-32 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.18),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider",
                    statusStyles[p.status]
                  )}
                >
                  <span className="size-1 rounded-full bg-current" />
                  {p.status}
                </span>
                {p.metric && (
                  <span className="font-mono text-[11px] text-subtle">
                    {p.metric}
                  </span>
                )}
              </div>

              <h3 className="mt-5 font-display text-xl text-foreground tracking-tight leading-snug">
                {p.title}
              </h3>

              <p className="mt-3 text-sm text-muted leading-relaxed flex-1">
                {p.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[10px] font-mono text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}

          {/* Future portfolio placeholder card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-dashed border-border-strong/60 bg-gradient-to-br from-card/30 to-transparent p-6 flex flex-col items-start justify-between min-h-[260px] hover:border-accent/40 transition-colors"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted">
                <span className="size-1 rounded-full bg-muted" />
                Reserved
              </span>
              <h3 className="mt-5 font-display text-xl text-foreground">
                Full portfolio incoming.
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Detailed case studies — architecture diagrams, evaluation
                results, and the stories behind the systems — are landing here.
              </p>
            </div>
            <div className="mt-5 font-mono text-[11px] text-subtle">
              <span className="text-accent">→</span> /portfolio · soon
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
