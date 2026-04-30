import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2.5 font-mono text-sm">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(94,234,212,0.7)]" />
          <span className="text-foreground">cortney bowman</span>
          <span className="text-subtle">/</span>
          <span className="text-muted">ai engineer</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <a
            href={`mailto:${profile.email}`}
            className="hover:text-accent transition-colors"
          >
            {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <span className="font-mono text-xs text-subtle">
            © {new Date().getFullYear()} — Built with Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
