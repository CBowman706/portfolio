"use client";

import { motion } from "framer-motion";
import { skills, education, certifications, honors } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Stack() {
  return (
    <section id="stack" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow="04 / Stack & credentials"
          title={
            <>
              The tools, the training,{" "}
              <span className="text-accent">the receipts.</span>
            </>
          }
        />

        {/* Skills grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="surface surface-hover rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono text-accent">
                <span className="size-1 rounded-full bg-accent" />
                {group.category}
              </div>
              <ul className="mt-5 space-y-2.5">
                {group.items.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <span className="font-mono text-subtle text-xs">›</span>
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Education + Certs row */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="surface rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono text-accent">
              <span className="size-1 rounded-full bg-accent" />
              Education
            </div>
            <ul className="mt-6 space-y-5">
              {education.map((e) => (
                <li
                  key={e.school}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-border last:border-0 pb-5 last:pb-0"
                >
                  <div>
                    <div className="font-display text-base text-foreground">
                      {e.degree}
                    </div>
                    <div className="mt-1 text-sm text-muted">{e.school}</div>
                    <div className="mt-1 text-xs text-subtle">{e.focus}</div>
                  </div>
                  <div className="font-mono text-xs text-accent whitespace-nowrap">
                    {e.period}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid grid-rows-2 gap-5"
          >
            <div className="surface rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono text-accent">
                <span className="size-1 rounded-full bg-accent" />
                Certifications
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {certifications.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-mono text-muted hover:border-accent/40 hover:text-foreground transition-colors"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono text-accent">
                <span className="size-1 rounded-full bg-accent" />
                Honors
              </div>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {honors.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
                    <span className="text-accent text-xs font-mono">★</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
