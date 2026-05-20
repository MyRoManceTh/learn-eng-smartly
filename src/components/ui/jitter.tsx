import { motion, type HTMLMotionProps, useInView } from "framer-motion";
import { forwardRef, useRef, type ReactNode } from "react";
import {
  hoverPop,
  popIn,
  slideUp,
  springBouncy,
  springSnappy,
  staggerContainer,
} from "@/lib/motionPresets";
import { cn } from "@/lib/utils";

/**
 * Jitter-style motion primitives.
 * Drop these in anywhere you want UI to feel snappy + playful.
 */

/* ---------- JitterCard ---------- */
type JitterCardProps = HTMLMotionProps<"div"> & {
  interactive?: boolean;
  children: ReactNode;
};

export const JitterCard = forwardRef<HTMLDivElement, JitterCardProps>(
  ({ children, className, interactive = true, ...rest }, ref) => (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      variants={popIn}
      initial="hidden"
      animate="visible"
      {...(interactive
        ? { whileHover: { y: -4, scale: 1.02, transition: springBouncy }, whileTap: { scale: 0.97, transition: springSnappy } }
        : {})}
      {...rest}
    >
      {children}
    </motion.div>
  )
);
JitterCard.displayName = "JitterCard";

/* ---------- JitterButton ---------- */
type JitterButtonProps = HTMLMotionProps<"button"> & { children: ReactNode };

export const JitterButton = forwardRef<HTMLButtonElement, JitterButtonProps>(
  ({ children, className, ...rest }, ref) => (
    <motion.button
      ref={ref}
      className={cn("will-change-transform", className)}
      {...hoverPop}
      {...rest}
    >
      {children}
    </motion.button>
  )
);
JitterButton.displayName = "JitterButton";

/* ---------- JitterReveal: fade+spring as it enters viewport ---------- */
interface JitterRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "up" | "right" | "pop" */
  variant?: "up" | "pop";
  /** Trigger only once. */
  once?: boolean;
}

export const JitterReveal = ({
  children,
  className,
  delay = 0,
  variant = "up",
  once = true,
}: JitterRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.2 });
  const variants = variant === "pop" ? popIn : slideUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ ...springBouncy, delay }}
    >
      {children}
    </motion.div>
  );
};

/* ---------- JitterStagger: parent + children orchestrator ---------- */
interface JitterStaggerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
}

export const JitterStagger = ({ children, className, once = true }: JitterStaggerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

/** Child of <JitterStagger> — uses popIn variant. */
export const JitterStaggerItem = ({
  children,
  className,
  ...rest
}: HTMLMotionProps<"div"> & { children: ReactNode }) => (
  <motion.div variants={popIn} className={className} {...rest}>
    {children}
  </motion.div>
);
