/**
 * Lightweight prompt-injection screen.
 *
 * This is the first layer of a defense-in-depth strategy. It is INTENTIONALLY
 * narrow: we only catch obvious, well-known injection markers — the goal is
 * to reject drive-by attacks before they reach the model, not to defeat a
 * determined adversary. The other layers are:
 *
 *   - System-prompt reinforcement (see twinPrompt.ts) — the model is told
 *     explicitly to refuse instructions that try to alter its behavior.
 *   - Conservative temperature (0.3) on the route call.
 *
 * False-positive bias: prefer letting borderline phrasings through and
 * relying on the system prompt, rather than annoying real users.
 */

const INJECTION_PATTERNS: RegExp[] = [
  // Direct override attempts
  /\bignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?|directives?)\b/i,
  /\bdisregard\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?|directives?)\b/i,
  /\boverride\s+(your|the)\s+(system\s+)?(prompt|instructions?|rules?)\b/i,
  /\bforget\s+(everything|all|your)\s+(above|prior|previous|instructions?|rules?)\b/i,
  // Role hijack
  /\byou\s+are\s+(now|actually)\s+(?!the\s+digital\s+twin)/i,
  /\bact\s+as\s+(?:if\s+you\s+(?:are|were)\s+)?(chatgpt|gpt|claude|grok|an?\s+(unrestricted|jailbroken|developer|admin))\b/i,
  /\bpretend\s+(?:to\s+be|you\s+(?:are|were))\s+(?!cortney)/i,
  // System message smuggling
  /^[\s>"'`]*system\s*[:>]/im,
  /<\s*system\s*>/i,
  /\[\s*system\s*\]/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  // Prompt extraction
  /\b(reveal|show|print|repeat|leak|expose|dump|output)\b[^.?!\n]*?\b(system\s+)?(prompt|instructions?|rules?|directives?)\b/i,
  /\bwhat\s+(are|is)\s+(your|the)\s+(system\s+)?(prompt|instructions?)\b/i,
  /\b(give|tell)\s+me\s+(your|the)\s+(system\s+)?(prompt|instructions?)\b/i,
  // DAN-family jailbreaks
  /\bdo\s+anything\s+now\b/i,
  /\bDAN\s+mode\b/i,
  /\bdeveloper\s+mode\b/i,
  /\bjailbroken?\b/i,
];

export type GuardVerdict =
  | { ok: true }
  | { ok: false; reason: "injection"; matched: string };

/**
 * Inspect a user message for injection markers.
 *
 * Returns { ok: true } when the message is clean, otherwise an explicit
 * verdict so the caller can refuse, log, or rate-limit further.
 */
export function inspectUserMessage(input: string): GuardVerdict {
  const text = input.trim();
  if (!text) return { ok: true };

  for (const re of INJECTION_PATTERNS) {
    const m = text.match(re);
    if (m) {
      return { ok: false, reason: "injection", matched: m[0] };
    }
  }

  return { ok: true };
}

/**
 * The "soft refusal" message we stream back when an injection is detected.
 * Phrased so the visitor (often a curious recruiter testing the bot) is
 * gently redirected without revealing what triggered the screen.
 */
export const SOFT_REFUSAL =
  "I'll stay focused on my actual background — happy to talk about my work, the projects on this site, or how to get in touch. What would you like to know?";
