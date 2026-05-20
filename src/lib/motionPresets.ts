import type { Transition, Variants } from "framer-motion";

/**
 * "Jitter-style" motion presets.
 * Inspired by jitter.video — snappy springs, slight overshoot,
 * staggered children, playful but never sluggish.
 *
 * Use everywhere we want UI to feel alive without going noisy.
 */

/* ---------- Spring tunings ---------- */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 22,
  mass: 0.6,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 14,
  mass: 0.8,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 1,
};

/* ---------- Enter variants ---------- */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springBouncy },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: springSnappy },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: springSnappy },
};

/* ---------- Staggered container ---------- */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/* ---------- Hover / tap reactions ---------- */
export const hoverPop = {
  whileHover: { scale: 1.06, y: -2, transition: springBouncy },
  whileTap: { scale: 0.94, transition: springSnappy },
};

export const hoverWiggle = {
  whileHover: { rotate: [0, -4, 4, -2, 0], transition: { duration: 0.5 } },
  whileTap: { scale: 0.95, transition: springSnappy },
};

/* ---------- Number / counter bump ---------- */
export const numberBump: Variants = {
  initial: { scale: 1 },
  bump: {
    scale: [1, 1.25, 1],
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
};
