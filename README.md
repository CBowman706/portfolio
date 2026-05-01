# cortneybowman.dev

Personal portfolio with an AI twin you can actually talk to. Production-deployed, security-hardened, accessibility-audited.

🌐 **Live:** [cortneybowman.dev](https://cortneybowman.dev)

---

## What this is

A Next.js portfolio site with a built-in conversational AI that streams responses about my work, background, and projects in real time. It's not a chat-bubble gimmick bolted onto a static site — the AI twin is the centerpiece, and every architectural decision (streaming, rate limiting, prompt isolation, accessibility) was made with it in mind.

Built as a deliberate exercise in shipping something **production-grade**, not a demo.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Hosting | Netlify with the OpenNext Next.js adapter |
| Inference | `openai/gpt-oss-120b` via OpenRouter (streaming) |
| Domain | Cloudflare-registered, Netlify-managed DNS |
| TLS | Let's Encrypt, auto-renewing |
| Styling | Tailwind v4 |
| Type system | TypeScript, strict mode |
| Source control | GitHub, OAuth-authenticated remote (no PATs) |

**Performance:** ~108ms TTLB on edge-cached HTML.

---

## Architecture decisions worth calling out

### Streaming inference

The AI twin streams tokens to the browser as the model generates them. OpenRouter speaks Server-Sent Events upstream; the API route at `/api/chat` parses that stream and re-emits a plain `text/plain` chunked response that the client reads with `ReadableStream`. Time-to-first-token feels closer to a typing indicator than a request/response.

That decision forced real engineering on cancellation, accessibility, and how the rate limiter signals back mid-stream — solving any one of those without the others would have been hollow.

### Server-only API key

The OpenRouter key is read inside a server-side route handler from a Netlify environment variable. It never reaches the client bundle.

Verified by grep-scanning all client-shipped JavaScript in the production build (`.next/static/`) against three independent patterns: the literal key, any `sk-or-v1-…` token shape, and the identifier `OPENROUTER_API_KEY` itself. Zero hits. The same scan against `.next/server/` correctly finds the env-var reference (where it should be) but never the literal value — confirming the key is read at runtime, not inlined into the artifact.

### IP-based rate limiting

Per-IP token bucket on the API route, with a per-minute and per-hour window. Anonymous users get a bounded budget per window; abuse returns `429` with `Retry-After`. Fully in-memory — fine for a portfolio site, but the implementation is deliberately structured behind a `RateLimitStore` interface so swapping in Upstash Redis is a one-class change.

This is the difference between a portfolio site and a $4,000 surprise bill.

### Prompt-injection screening

Every user message is checked against a set of regex patterns matching known injection shapes (`ignore previous instructions`, role-override attempts, system-prompt extraction, etc.) before it reaches the model. Matches return a generic refusal stream — the model never sees the prompt.

### Persona-grounded system prompt

The system prompt is built from `src/lib/data.ts` and includes a `RULES OF ENGAGEMENT` block plus a `SECURITY DIRECTIVES` block that explicitly subordinates user input. Role separation in the messages array is part of the defense in depth, not a hard barrier — the regex screen, the structured prompt, and the persona reinforcement all stack against jailbreaks.

### Single source of truth in `data.ts`

Bio, projects, links, skills, and metadata all live in one typed module. The site, the AI twin's system prompt, the JSON-LD `Person` schema, and the OG card all read from it. Update once, propagates everywhere.

---

## Accessibility

- **WCAG 2.0/2.1 AA verified.** Last scan: `axe-core` 4.11 against the production build, headless Chrome, scanning `wcag2a / wcag2aa / wcag21a / wcag21aa` tag sets. **0 violations across 22 rules.**
- Focus-trapped modal dialog for the AI twin, with focus restoration on close
- `aria-live="polite"` region for streaming token announcements (polite, not assertive — doesn't spam screen readers)
- `prefers-reduced-motion` honored throughout: animations short-circuited, `MotionConfig reducedMotion="user"` from Framer Motion, plus a global CSS fallback
- Keyboard navigation: Tab, Shift-Tab, and Esc all do what you expect; the dialog `inert`s the rest of the page on open
- Semantic HTML; no `div`-as-button anti-patterns

---

## SEO & social

- **1200×630 Open Graph card** rendered at build time with the site's exact palette (`#050608` background, `#5EEAD4` accent) and Inter typography (`next/og` + Google Fonts)
- Full **Open Graph** + **Twitter Card** metadata (`summary_large_image`), with explicit width / height / MIME so LinkedIn renders correctly
- **Canonical link** tag pointing at the apex URL
- **JSON-LD `Person` schema** in `<body>`, populated from `data.ts` (job title, employer, education, skills, location)
- **`sitemap.xml`** and **`robots.txt`** generated via Next.js's native conventions (`src/app/sitemap.ts`, `src/app/robots.ts`)

---

## Local development

```bash
git clone https://github.com/CBowman706/portfolio.git
cd portfolio
npm install
cp .env.example .env.local
# add your OPENROUTER_API_KEY to .env.local
npm run dev
```

Visit `http://localhost:3000`.

### Environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `OPENROUTER_API_KEY` | Required | Server-side key for OpenRouter. Never bundled to the client. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Sets `metadataBase` for absolute Open Graph URLs. Set this in production. |
| `CHAT_RATE_PER_MINUTE` | Optional | Per-IP rate-limit cap, per minute. Defaults to 10. |
| `CHAT_RATE_PER_HOUR` | Optional | Per-IP rate-limit cap, per hour. Defaults to 60. |

`.env.local` is gitignored. Never commit secrets. Never paste a token into a remote URL.

---

## Deployment

Auto-deploys on `git push origin main` via Netlify's GitHub integration. The local git remote is OAuth-authenticated via the GitHub CLI — no Personal Access Tokens in the URL:

```bash
gh auth login
gh auth setup-git
```

Netlify build settings (auto-detected for Next.js):

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** pinned in `.nvmrc` (currently 22)

The OpenNext adapter handles SSR and the streaming `/api/chat` route handler as Netlify Functions automatically. No `netlify.toml` needed.

---

## Security posture

This is a public-facing LLM endpoint, which means it has a real threat model. The defenses in place:

| Threat | Mitigation |
|---|---|
| API key exfiltration | Server-only env var; build-artifact scan confirms no client-bundle leakage |
| Cost abuse / scraping | Per-IP token bucket, per-minute and per-hour windows, `Retry-After` on 429 |
| Prompt injection | Regex screen on every user message before it reaches the model |
| Jailbreak / role-override | `RULES OF ENGAGEMENT` + `SECURITY DIRECTIVES` blocks with hardcoded refusal phrasing |
| Persona drift / fabrication | System prompt grounded in the typed `data.ts` source of truth |
| Credential leak in repo | `.env*` gitignored; OAuth git remote (no PATs in URLs) |
| MITM / cert spoofing | Auto-renewing Let's Encrypt TLS via Netlify; the `.dev` TLD enforces HTTPS via the browser HSTS preload list |
| Client disconnect billing waste | `AbortSignal` propagated upstream so cancelled requests don't keep paying for tokens |

Most LLM tutorials skip every row of this table. That's the gap.

---

## About the build

I'm Cortney Bowman — AI Engineer (emerging) and Security & Awareness Analyst at Centene, with adversarial thinking as the differentiator. This site is the artifact of that bridge: every line of it had to defend itself against the same kinds of attacks I spend my day job thinking about.

If you're hiring for AI engineering roles where security matters — and it should always matter — let's talk.

🔗 [LinkedIn](https://www.linkedin.com/in/cortneybowman) · 🌐 [cortneybowman.dev](https://cortneybowman.dev)

---

## License

[MIT](./LICENSE) — code and architecture are free to learn from and adapt. Bio content, project descriptions, the AI twin's persona, and personal branding (the OG card and color palette) are excluded.
