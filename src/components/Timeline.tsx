"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Timeline() {
  return (
    <section id="journey" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-fine opacity-30 mask-bottom-fade" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow="02 / Journey"
          title={
            <>
              From the flight line to{" "}
              <span className="text-accent">the frontier.</span>
            </>
          }
          description="Air Force veteran with five years in cybersecurity — now building AI with an adversary in mind. Every role compounds — military discipline, large-scale data systems, enterprise security, and now applied AI."
        />

        <div className="mt-20 relative">
          {/* Vertical rail */}
          <div
            aria-hidden
            className="hidden md:block absolute left-[180px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-border to-transparent"
          />

          <ol className="space-y-12 md:space-y-16">
            {experience.map((item, i) => (
              <motion.li
                key={`${item.company}-${i}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                className="relative grid md:grid-cols-[180px_1fr] gap-y-3 md:gap-x-12"
              >
                {/* Period column */}
                <div className="md:pt-1">
                  <div className="font-mono text-xs text-accent">
                    {item.period}
                  </div>
                  {item.location && (
                    <div className="mt-1 text-xs text-subtle">
                      {item.location}
                    </div>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted">
                    {item.tag}
                  </div>
                </div>

                {/* Dot on the rail */}
                <div
                  aria-hidden
                  className="hidden md:block absolute left-[176px] top-2 size-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(5,6,8,1),0_0_18px_2px_rgba(94,234,212,0.5)]"
                />

                {/* Content */}
                <div className="surface surface-hover rounded-2xl p-6 md:p-7 glow-border">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl md:text-2xl text-foreground">
                        {item.role}
                      </h3>
                      <div className="mt-1 text-sm text-muted">
                        <span className="text-foreground">{item.company}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {item.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="relative pl-5 text-sm md:text-[15px] text-muted leading-relaxed"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-2.5 size-1 rounded-full bg-accent/70"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
