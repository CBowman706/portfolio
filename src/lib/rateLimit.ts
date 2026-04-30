/**
 * In-memory IP rate limiter using a fixed-window counter strategy.
 *
 * Two windows are enforced simultaneously:
 *   - short window (default: 60s / 10 req)
 *   - long window  (default: 60min / 60 req)
 *
 * IMPORTANT — operational caveats:
 *   1. State is per-process. Behind multiple instances (Vercel serverless,
 *      autoscaled containers, etc.) each replica has independent counters,
 *      so the *effective* limit is multiplied by replica count. For real
 *      production deployments swap the in-memory `storage` for Upstash
 *      Redis or @vercel/kv via the same `RateLimitStore` interface.
 *   2. Counters reset on cold start. Burst attacks across deploys are not
 *      caught.
 *   3. We don't ship a token-bucket; fixed-window is simpler and adequate
 *      for the realistic threat model (drive-by abuse, accidental loops).
 *
 * The module is also unit-testable: pass a custom `now` to {@link check}
 * to deterministically advance time.
 */

export type RateLimitConfig = {
  /** Number of requests allowed in {@link windowMs}. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Human-readable label used in error messages. */
  label?: string;
};

export type RateLimitDecision = {
  ok: boolean;
  /** Number of requests already used in the current window. */
  used: number;
  /** Total budget for the current window. */
  limit: number;
  /** Seconds until the window resets. */
  resetSeconds: number;
  /** Which window was hit (for diagnostics). */
  label?: string;
};

type Bucket = { count: number; resetAt: number };

export interface RateLimitStore {
  read(key: string): Bucket | undefined;
  write(key: string, bucket: Bucket): void;
}

class MemoryStore implements RateLimitStore {
  private map = new Map<string, Bucket>();
  private lastSweep = 0;

  read(key: string): Bucket | undefined {
    return this.map.get(key);
  }

  write(key: string, bucket: Bucket): void {
    this.map.set(key, bucket);
    // Opportunistic sweep so we don't grow unbounded across many IPs.
    const now = Date.now();
    if (now - this.lastSweep > 60_000) {
      this.lastSweep = now;
      for (const [k, b] of this.map) {
        if (b.resetAt < now) this.map.delete(k);
      }
    }
  }
}

const defaultStore: RateLimitStore = new MemoryStore();

/**
 * Check a single rate-limit window.
 */
export function check(
  key: string,
  config: RateLimitConfig,
  store: RateLimitStore = defaultStore,
  now: number = Date.now()
): RateLimitDecision {
  const existing = store.read(key);
  const inWindow = existing && existing.resetAt > now;
  const bucket: Bucket = inWindow
    ? { count: existing!.count, resetAt: existing!.resetAt }
    : { count: 0, resetAt: now + config.windowMs };

  bucket.count += 1;
  store.write(key, bucket);

  const used = bucket.count;
  const ok = used <= config.max;
  return {
    ok,
    used,
    limit: config.max,
    resetSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    label: config.label,
  };
}

/**
 * Convenience helper that runs both the short and long windows in order.
 * Returns the first failure, or the long-window decision on success.
 */
export function checkAll(
  key: string,
  configs: RateLimitConfig[],
  store: RateLimitStore = defaultStore,
  now: number = Date.now()
): RateLimitDecision {
  let last: RateLimitDecision | undefined;
  for (const cfg of configs) {
    const d = check(`${cfg.label ?? "default"}:${key}`, cfg, store, now);
    if (!d.ok) return d;
    last = d;
  }
  return last ?? { ok: true, used: 0, limit: 0, resetSeconds: 0 };
}

/**
 * Default policy used by /api/chat.
 *
 * Tunable via env vars (set at deploy time):
 *   CHAT_RATE_PER_MINUTE   default 10
 *   CHAT_RATE_PER_HOUR     default 60
 */
export function defaultChatLimits(): RateLimitConfig[] {
  const perMinute = Number(process.env.CHAT_RATE_PER_MINUTE) || 10;
  const perHour = Number(process.env.CHAT_RATE_PER_HOUR) || 60;
  return [
    { max: perMinute, windowMs: 60_000, label: "1m" },
    { max: perHour, windowMs: 60 * 60_000, label: "1h" },
  ];
}

/**
 * Best-effort client IP. In dev / direct connections falls back to a
 * stable string so all unproxied requests share a bucket (better than
 * "unknown" leaking through unbounded).
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "local";
}
