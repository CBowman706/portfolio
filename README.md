# Cortney Bowman — Portfolio

Personal site + **AI Digital Twin** for [Cortney Bowman](https://www.linkedin.com/in/cortneybowman) — AI Engineer (Emerging) and Security & Awareness Analyst.

Built with Next.js 16 (App Router) + React 19 + Tailwind v4 + Framer Motion. The Digital Twin streams answers from `openai/gpt-oss-120b` via [OpenRouter](https://openrouter.ai/), hardened with IP-based rate limiting and prompt-injection screening server-side.

## Stack

- **Framework**: Next.js 16.2 (App Router, Server Components, streaming responses)
- **UI**: React 19, Tailwind CSS v4, Framer Motion (with `prefers-reduced-motion` support)
- **AI**: OpenRouter → `openai/gpt-oss-120b`, server-side proxy in `src/app/api/chat/route.ts`
- **Runtime**: Node.js 22 (see `.nvmrc`)
- **Hosting**: Netlify with the OpenNext Next.js adapter (zero-config)

## Local development

```bash
npm install
echo "OPENROUTER_API_KEY=sk-or-v1-…" > .env.local
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

| Name | Required | Where |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | Server-only. **Never** commit. Set in Netlify → Site settings → Environment variables for production. |
| `NEXT_PUBLIC_SITE_URL` | No | Sets `metadataBase` for absolute Open Graph URLs (e.g. `https://cortneybowman.dev`). Falls back to `VERCEL_URL` then unset. |

## Deploy on Netlify

Push to GitHub, connect the repo on Netlify, set `OPENROUTER_API_KEY`, deploy. Next.js 16 is supported by Netlify's OpenNext adapter with zero configuration — no `netlify.toml` needed.

## Project layout

```
src/
  app/
    api/chat/route.ts      # streaming chat proxy with rate limit + prompt-injection screen
    layout.tsx, page.tsx   # global layout + composed homepage
    globals.css            # Tailwind v4 theme tokens, reduced-motion media query
  components/              # Hero, Timeline, Projects, Stack, Contact, DigitalTwin, …
  lib/
    data.ts                # single source of truth for profile, experience, projects, etc.
    twinPrompt.ts          # builds the system prompt the Twin runs against
    rateLimit.ts           # in-memory token-bucket per IP (per-minute + per-hour windows)
    promptGuard.ts         # regex-based prompt-injection screen
```

## Notes on the AI proxy

- The OpenRouter API key only ever lives server-side; the browser talks exclusively to `/api/chat`.
- Server-Sent Events from OpenRouter are normalized into a plain `text/plain` stream the client can read with `ReadableStream`.
- Rate limits (`src/lib/rateLimit.ts`) use an in-memory store. On Netlify Functions this resets per cold-start instance — for higher-traffic production, swap in Upstash Redis and keep the same `RateLimitStore` interface.
