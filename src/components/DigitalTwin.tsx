"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";
type ChatMessage = { id: string; role: Role; content: string };

const SUGGESTIONS = [
  "Tell me about your edge AI security platform.",
  "What did you do in the Air Force?",
  "How do you bridge security and AI engineering?",
  "What are you building right now?",
];

/** Distance from the bottom (px) within which we still consider the user
 * "stuck to the latest message" and auto-scroll on new content. */
const STICK_TO_BOTTOM_THRESHOLD = 80;

/** Generate a stable unique ID. crypto.randomUUID is available in every
 * supported browser (Chrome 92+, Firefox 95+, Safari 15.4+) and Node 14.17+;
 * the previous Math.random fallback was removed (H1) because it could
 * produce React-key collisions. */
const newId = (): string => crypto.randomUUID();

export function DigitalTwin() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  /** Whether the user is currently anchored to the bottom of the scroll
   * container. We only auto-scroll when this is true, so user-initiated
   * scroll-up to read history isn't fought by streaming. (H2) */
  const stickToBottomRef = useRef(true);
  /** Element that had focus when the panel opened, so we can restore it
   * on close. (H4) */
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  /** Synchronous concurrency guard for send(). React state updates are
   * scheduled, so two near-simultaneous clicks could both pass an
   * `if (streaming) return` check before either re-rendered. A ref
   * lets us flip the flag immediately, in the same tick. */
  const streamingRef = useRef(false);

  const dialogTitleId = useId();
  const dialogDescId = useId();

  // ── H2: track whether the user is at the bottom ─────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !open) return;
    const onScroll = () => {
      stickToBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight <
        STICK_TO_BOTTOM_THRESHOLD;
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [open]);

  // ── H2: auto-scroll only when the user is anchored to the bottom ───
  // useLayoutEffect avoids flicker between paint frames; instant scroll
  // (no smooth) prevents queued animations during streaming.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // ── H4: focus management + Esc-to-close + body inert ────────────────
  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Mark the rest of the page inert so screen readers and keyboard
    // navigation can't escape the dialog.
    const body = document.body;
    const siblings: Element[] = [];
    for (const el of Array.from(body.children)) {
      if (el !== panelRef.current?.parentElement?.parentElement) {
        // Only top-level siblings of <body> get inert; the panel and its
        // backdrop live inside the same React tree though, so we use a
        // simpler rule: mark every direct child of <body> EXCEPT one
        // marked data-twin-root.
      }
      if (el.getAttribute("data-twin-root") === null) {
        if (!el.hasAttribute("inert")) {
          el.setAttribute("inert", "");
          siblings.push(el);
        }
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);

    const focusTimer = window.setTimeout(
      () => inputRef.current?.focus(),
      200
    );

    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      for (const el of siblings) el.removeAttribute("inert");
      // Restore focus to the element that had it before the dialog opened.
      const prev = previouslyFocusedRef.current;
      if (prev && document.contains(prev)) {
        prev.focus({ preventScroll: true });
      } else {
        launcherRef.current?.focus({ preventScroll: true });
      }
    };
  }, [open]);

  // ── H4: focus trap inside the dialog ────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute("inert") && el.offsetParent !== null
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // ── Cancel any in-flight stream on unmount ──────────────────────────
  useEffect(() => () => abortRef.current?.abort(), []);
  // Cancel when the panel closes mid-stream.
  useEffect(() => {
    if (!open) abortRef.current?.abort();
  }, [open]);

  // send() reads `messages` directly from closure (synchronous, latest
  // committed render) and uses streamingRef as a synchronous concurrency
  // guard. The previous attempt to capture the snapshot inside a
  // setMessages updater was racy: React schedules updaters and may run
  // them after the surrounding code, so the snapshot was empty by the
  // time fetch() ran — producing the server-side
  // "Last message must be from the user." 400.
  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (streamingRef.current) return;

    streamingRef.current = true;
    setError(null);

    const assistantId = newId();
    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      content: trimmed,
    };
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    // Snapshot synchronously from the latest rendered state.
    const history = [...messages, userMsg];

    setMessages([...history, assistantMsg]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        let detail = `Request failed (${res.status}).`;
        try {
          const j = await res.json();
          if (j?.error) detail = j.error;
        } catch {}
        throw new Error(detail);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const msg = (err as Error).message ?? "Something went wrong.";
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      streamingRef.current = false;
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const stop = useCallback(() => abortRef.current?.abort(), []);

  // The most recent assistant message — what we want screen readers to
  // hear while streaming. (H5)
  const latestAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  return (
    <div data-twin-root>
      {/* Launcher */}
      <motion.button
        ref={launcherRef}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={() => setOpen(true)}
        aria-label="Open Digital Twin chat"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "fixed bottom-5 right-5 z-40 group inline-flex items-center gap-3 rounded-full border border-border-strong bg-card/80 backdrop-blur-md px-4 py-3 text-sm shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
          "hover:border-accent/50 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          open && "pointer-events-none opacity-0"
        )}
      >
        <span className="relative flex size-2.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent/60 opacity-75 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(94,234,212,0.7)]" />
        </span>
        <span className="hidden sm:inline font-mono text-foreground">
          Chat with my Digital Twin
        </span>
        <span className="sm:hidden font-mono text-foreground">Twin</span>
        <span className="text-subtle group-hover:text-accent transition-colors">
          ↗
        </span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              aria-hidden
            />

            <motion.div
              key="panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              aria-describedby={dialogDescId}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border-strong bg-card-elevated/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)]",
                "inset-x-3 bottom-3 top-3",
                "sm:left-auto sm:top-auto sm:bottom-5 sm:right-5 sm:w-[420px] sm:h-[640px] sm:max-h-[85vh]"
              )}
            >
              {/* Header */}
              <header className="flex items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex size-2.5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent/50 opacity-75 animate-ping" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(94,234,212,0.7)]" />
                  </span>
                  <div className="leading-tight">
                    <div
                      id={dialogTitleId}
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent"
                    >
                      Digital Twin · Live
                    </div>
                    <div className="text-sm text-foreground">
                      Cortney Bowman
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button
                      onClick={() => {
                        stop();
                        setMessages([]);
                        setError(null);
                      }}
                      className="rounded-md px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-muted hover:text-foreground hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                      aria-label="Clear conversation"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                    aria-label="Close chat"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M2 2l10 10M12 2L2 12" />
                    </svg>
                  </button>
                </div>
              </header>

              {/* Hidden description for screen readers */}
              <span id={dialogDescId} className="sr-only">
                Chat with an AI representation of Cortney Bowman. Ask about
                his career, projects, and skills.
              </span>

              {/* Body */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-atomic="false"
                className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
              >
                {messages.length === 0 && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-border bg-background/40 p-4">
                      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">
                        System
                      </div>
                      <p className="mt-2 text-sm text-muted leading-relaxed">
                        You&apos;re talking to my Digital Twin — an AI that
                        speaks for me. Ask about my background, projects, the
                        edge AI work, or how to get in touch.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-subtle px-1">
                        Try asking
                      </div>
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => void send(s)}
                          disabled={streaming}
                          className="w-full text-left rounded-lg border border-border bg-card/50 px-3 py-2.5 text-sm text-muted hover:text-foreground hover:border-accent/40 hover:bg-card transition-all group disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                        >
                          <span className="font-mono text-xs text-accent mr-2 group-hover:text-accent-bright">
                            ›
                          </span>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m) => (
                  <Message
                    key={m.id}
                    message={m}
                    streaming={streaming}
                    isLatestAssistant={m.id === latestAssistant?.id}
                  />
                ))}

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-rose/40 bg-rose/10 px-3 py-2.5 text-sm text-rose"
                  >
                    {error}
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-border bg-background/60 p-3"
              >
                <div className="flex items-end gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 focus-within:border-accent/60 transition-colors">
                  <label htmlFor="twin-input" className="sr-only">
                    Message the Digital Twin
                  </label>
                  <textarea
                    id="twin-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    rows={1}
                    placeholder="Ask about my work, my projects, anything…"
                    className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-subtle outline-none max-h-32 leading-6"
                  />
                  {streaming ? (
                    <button
                      type="button"
                      onClick={stop}
                      className="rounded-md border border-border-strong bg-card px-2.5 py-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className={cn(
                        "rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-background transition-colors",
                        "hover:bg-accent-bright disabled:opacity-40 disabled:cursor-not-allowed",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                      )}
                    >
                      Send ↵
                    </button>
                  )}
                </div>
                <div className="mt-1.5 px-1 text-[10px] font-mono uppercase tracking-wider text-subtle">
                  Powered by openai/gpt-oss-120b · streamed via OpenRouter
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Message({
  message,
  streaming,
  isLatestAssistant,
}: {
  message: ChatMessage;
  streaming: boolean;
  isLatestAssistant: boolean;
}) {
  const isUser = message.role === "user";
  const isStreaming =
    !isUser && streaming && isLatestAssistant && message.content.length === 0;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-accent/15 border border-accent/30 text-foreground rounded-br-sm"
            : "bg-card border border-border text-foreground rounded-bl-sm"
        )}
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
            <span className="size-1 rounded-full bg-accent" aria-hidden />
            Twin
          </div>
        )}
        {isStreaming ? (
          <TypingIndicator />
        ) : (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
            {!isUser &&
              streaming &&
              isLatestAssistant &&
              message.content.length > 0 && (
                <span
                  aria-hidden
                  className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-accent/80 animate-pulse"
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Twin is typing">
      <span className="size-1.5 rounded-full bg-accent/70 animate-bounce [animation-delay:-0.3s]" />
      <span className="size-1.5 rounded-full bg-accent/70 animate-bounce [animation-delay:-0.15s]" />
      <span className="size-1.5 rounded-full bg-accent/70 animate-bounce" />
    </div>
  );
}
