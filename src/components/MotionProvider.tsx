"use client";

import { MotionConfig } from "framer-motion";

/**
 * Wraps the app in a global MotionConfig so every Framer Motion component
 * automatically respects the user's `prefers-reduced-motion` setting.
 *
 * `reducedMotion="user"` tells Motion to read the OS preference and skip
 * non-essential animation when the user has asked for reduced motion.
 *
 * Lives in its own client file so the root layout can stay a server
 * component.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
