import { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/twinPrompt";
import {
  checkAll,
  clientIp,
  defaultChatLimits,
  type RateLimitDecision,
} from "@/lib/rateLimit";
import { inspectUserMessage, SOFT_REFUSAL } from "@/lib/promptGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Role = "user" | "assistant";
type IncomingMessage = { role: Role; content: string };

const MODEL = "openai/gpt-oss-120b";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MAX_HISTORY = 16;
const MAX_USER_CHARS = 4000;
const MAX_INCOMING_MESSAGES = 256; // hard cap before sanitize work
const UPSTREAM_TIMEOUT_MS = 30_000;

function jsonResponse(
  body: Record<string, unknown>,
  init: ResponseInit = {}
): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function streamRefusal(text: string): Response {
  // Simulate the same text-delta stream shape clients already consume,
  // so refusals look identical to a real (very fast) generation.
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

function rateLimitHeaders(d: RateLimitDecision): HeadersInit {
  return {
    "X-RateLimit-Limit": String(d.limit),
    "X-RateLimit-Remaining": String(Math.max(0, d.limit - d.used)),
    "X-RateLimit-Reset": String(d.resetSeconds),
  };
}

export async function POST(req: NextRequest) {
  // ── 1. Rate limit (cheapest gate, runs first) ──────────────────────────
  const ip = clientIp(req);
  const rl = checkAll(ip, defaultChatLimits());
  if (!rl.ok) {
    return jsonResponse(
      {
        error: "Too many requests. Please slow down.",
        window: rl.label,
        retryAfterSeconds: rl.resetSeconds,
      },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(rl),
          "Retry-After": String(rl.resetSeconds),
        },
      }
    );
  }

  // ── 2. Auth / config ───────────────────────────────────────────────────
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return jsonResponse(
      { error: "Server is missing OPENROUTER_API_KEY." },
      { status: 500 }
    );
  }

  // ── 3. Parse + structurally validate ───────────────────────────────────
  let body: { messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  if (incoming.length > MAX_INCOMING_MESSAGES) {
    return jsonResponse(
      { error: `Too many messages. Max ${MAX_INCOMING_MESSAGES}.` },
      { status: 413 }
    );
  }

  const sanitized = incoming
    .filter(
      (m): m is IncomingMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_USER_CHARS),
    }));

  if (
    sanitized.length === 0 ||
    sanitized[sanitized.length - 1].role !== "user"
  ) {
    return jsonResponse(
      { error: "Last message must be from the user." },
      { status: 400 }
    );
  }

  // ── 4. Prompt-injection screen on the latest user turn ─────────────────
  const latestUser = sanitized[sanitized.length - 1].content;
  const verdict = inspectUserMessage(latestUser);
  if (!verdict.ok) {
    // Don't tell the attacker what we matched. Stream a soft refusal in the
    // exact shape clients already render so the UX is seamless.
    return streamRefusal(SOFT_REFUSAL);
  }

  // ── 5. Build payload ───────────────────────────────────────────────────
  const payload = {
    model: MODEL,
    stream: true,
    temperature: 0.3,
    messages: [
      { role: "system" as const, content: buildSystemPrompt() },
      ...sanitized,
    ],
  };

  // ── 6. Upstream call with combined client + timeout signal ─────────────
  // Fall back gracefully when AbortSignal.any isn't available (older Node).
  const timeoutSignal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
  const upstreamSignal =
    typeof (AbortSignal as unknown as { any?: unknown }).any === "function"
      ? (
          AbortSignal as unknown as {
            any: (signals: AbortSignal[]) => AbortSignal;
          }
        ).any([req.signal, timeoutSignal])
      : timeoutSignal;

  let upstream: Response;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": req.nextUrl.origin,
        "X-Title": "Cortney Bowman - Digital Twin",
      },
      body: JSON.stringify(payload),
      signal: upstreamSignal,
    });
  } catch (err) {
    const name = (err as Error).name;
    if (name === "AbortError" || name === "TimeoutError") {
      return jsonResponse(
        { error: "Upstream timeout or client disconnect." },
        { status: 504 }
      );
    }
    return jsonResponse(
      { error: "Upstream connection failed.", detail: String(err) },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return jsonResponse(
      {
        error: `Upstream error (${upstream.status}).`,
        detail: errText.slice(0, 800),
      },
      { status: 502 }
    );
  }

  // ── 7. Transform OpenRouter SSE into a plain text-delta stream ─────────
  const upstreamReader = upstream.body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const transform = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await upstreamReader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = buffer.indexOf("\n\n")) !== -1) {
            const rawEvent = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);

            for (const line of rawEvent.split("\n")) {
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (!data || data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) controller.enqueue(encoder.encode(delta));
              } catch {
                // Ignore malformed chunks (keep-alive comments, partial frames).
              }
            }
          }
        }
        controller.close();
      } catch (err) {
        // Don't crash the stream — close cleanly so the client sees what we
        // already sent and finalizes.
        try {
          controller.close();
        } catch {
          controller.error(err);
        }
      }
    },
    async cancel(reason) {
      // Client (or middleware) aborted; release the upstream socket
      // immediately so we stop being billed for tokens nobody is reading.
      try {
        await upstreamReader.cancel(reason);
      } catch {
        // Already closed; ignore.
      }
    },
  });

  return new Response(transform, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      ...rateLimitHeaders(rl),
    },
  });
}
