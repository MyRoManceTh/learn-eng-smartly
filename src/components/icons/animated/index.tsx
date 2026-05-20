import { motion, type SVGMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Hand-crafted animated SVG icons (Framer Motion).
 * All icons share a common API: { size, className } and animate on mount + loop.
 * Designed to be drop-in replacements for emoji visuals.
 */

interface IconProps {
  size?: number;
  className?: string;
}

const baseSvg = (size: number, className?: string): SVGMotionProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: cn("inline-block shrink-0", className),
});

/* ------------------------------ COIN 🪙 ------------------------------ */
export const CoinIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="coin-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <motion.g
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
    >
      <circle cx="12" cy="12" r="10" fill="url(#coin-grad)" stroke="#92400E" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="7" fill="none" stroke="#FCD34D" strokeWidth="0.8" opacity="0.7" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="900" fill="#78350F">
        $
      </text>
    </motion.g>
  </motion.svg>
);

/* ------------------------------ FLAME 🔥 ------------------------------ */
export const FlameIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    </defs>
    <motion.path
      d="M12 2c1 3 4 5 4 9a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3-1-3 0-6 2-8z"
      fill="url(#flame-grad)"
      animate={{ scaleY: [1, 1.08, 0.96, 1], scaleX: [1, 0.96, 1.04, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 22px", transformBox: "fill-box" }}
    />
    <motion.path
      d="M12 10c.5 1.5 2 2.5 2 4.5a2 2 0 1 1-4 0c0-1 .5-1.5 1-2 0 1 .5 1.5 1 1.5-.5-1.5 0-3 0-4z"
      fill="#FEF3C7"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

/* ------------------------------ ZAP / LIGHTNING ⚡ ------------------------------ */
export const ZapIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="zap-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <motion.path
      d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
      fill="url(#zap-grad)"
      stroke="#B45309"
      strokeWidth="0.8"
      strokeLinejoin="round"
      animate={{ scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 0 #fde047)", "drop-shadow(0 0 6px #fde047)", "drop-shadow(0 0 0 #fde047)"] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
    />
  </motion.svg>
);

/* ------------------------------ SPARKLES ✨ ------------------------------ */
export const SparklesIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    {[
      { cx: 12, cy: 12, r: 4, delay: 0 },
      { cx: 5, cy: 5, r: 1.5, delay: 0.2 },
      { cx: 19, cy: 6, r: 1.2, delay: 0.4 },
      { cx: 18, cy: 18, r: 1.5, delay: 0.6 },
      { cx: 5, cy: 18, r: 1, delay: 0.8 },
    ].map((s, i) => (
      <motion.path
        key={i}
        d={`M${s.cx} ${s.cy - s.r} L${s.cx + s.r * 0.4} ${s.cy - s.r * 0.4} L${s.cx + s.r} ${s.cy} L${s.cx + s.r * 0.4} ${s.cy + s.r * 0.4} L${s.cx} ${s.cy + s.r} L${s.cx - s.r * 0.4} ${s.cy + s.r * 0.4} L${s.cx - s.r} ${s.cy} L${s.cx - s.r * 0.4} ${s.cy - s.r * 0.4} Z`}
        fill="#FBBF24"
        animate={{ scale: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3], rotate: [0, 90] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        style={{ transformOrigin: `${s.cx}px ${s.cy}px`, transformBox: "fill-box" }}
      />
    ))}
  </motion.svg>
);

/* ------------------------------ STAR ⭐ ------------------------------ */
export const StarIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="star-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <motion.path
      d="M12 2l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.3 6 20.4l1.3-6.7-5-4.7 6.8-.8z"
      fill="url(#star-grad)"
      stroke="#B45309"
      strokeWidth="0.8"
      strokeLinejoin="round"
      animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
    />
  </motion.svg>
);

/* ------------------------------ HEART ❤️ ------------------------------ */
export const HeartIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="heart-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
    </defs>
    <motion.path
      d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 4 2 1.5-1.5 3-2 4-2 3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z"
      fill="url(#heart-grad)"
      animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
      transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
      style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
    />
  </motion.svg>
);

/* ------------------------------ TROPHY 🏆 ------------------------------ */
export const TrophyIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="trophy-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <motion.g
      animate={{ y: [0, -1.5, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 18px", transformBox: "fill-box" }}
    >
      <path d="M6 4h12v4a6 6 0 0 1-12 0V4z" fill="url(#trophy-grad)" stroke="#92400E" strokeWidth="0.8" />
      <path d="M4 5h2v3a2 2 0 0 1-2-2V5zM18 5h2v1a2 2 0 0 1-2 2V5z" fill="#FCD34D" stroke="#92400E" strokeWidth="0.6" />
      <rect x="10" y="14" width="4" height="3" fill="#D97706" />
      <rect x="7" y="17" width="10" height="2.5" rx="0.5" fill="#92400E" />
    </motion.g>
    <motion.circle cx="20" cy="3" r="1" fill="#FEF3C7" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity }} />
  </motion.svg>
);

/* ------------------------------ GIFT 🎁 ------------------------------ */
export const GiftIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <motion.g
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 14px", transformBox: "fill-box" }}
    >
      <rect x="3" y="10" width="18" height="11" rx="1" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
      <rect x="2" y="7" width="20" height="4" rx="0.8" fill="#F87171" stroke="#991B1B" strokeWidth="0.8" />
      <rect x="10.5" y="7" width="3" height="14" fill="#FCD34D" />
      <path d="M12 7c-2-3-6-3-6 0 0 1.5 2 2 6 2 4 0 6-.5 6-2 0-3-4-3-6 0z" fill="#FBBF24" stroke="#92400E" strokeWidth="0.6" />
    </motion.g>
  </motion.svg>
);

/* ------------------------------ GEM 💎 ------------------------------ */
export const GemIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="gem-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A5F3FC" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
    </defs>
    <motion.g
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
    >
      <path d="M6 4h12l4 5-10 12L2 9z" fill="url(#gem-grad)" stroke="#0E7490" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M6 4l6 5 6-5M2 9h20M12 9l-4 12M12 9l4 12" stroke="#0E7490" strokeWidth="0.6" fill="none" />
    </motion.g>
    <motion.path
      d="M9 5l1 2"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      animate={{ opacity: [0, 1, 0], x: [0, 2] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

/* ------------------------------ PARTY 🎉 ------------------------------ */
export const PartyIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <motion.path
      d="M3 21L9 7l8 8-14 6z"
      fill="#F59E0B"
      stroke="#92400E"
      strokeWidth="0.8"
      strokeLinejoin="round"
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "3px 21px", transformBox: "fill-box" }}
    />
    {[
      { cx: 16, cy: 4, c: "#EC4899" },
      { cx: 20, cy: 8, c: "#3B82F6" },
      { cx: 14, cy: 8, c: "#10B981" },
      { cx: 19, cy: 14, c: "#F59E0B" },
    ].map((d, i) => (
      <motion.circle
        key={i}
        cx={d.cx}
        cy={d.cy}
        r="1.2"
        fill={d.c}
        animate={{ scale: [0, 1.4, 0], y: [0, -4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15, ease: "easeOut" }}
        style={{ transformOrigin: `${d.cx}px ${d.cy}px`, transformBox: "fill-box" }}
      />
    ))}
  </motion.svg>
);

/* ------------------------------ CROWN 👑 ------------------------------ */
export const CrownIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="crown-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <motion.g
      animate={{ y: [0, -1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 14px", transformBox: "fill-box" }}
    >
      <path d="M3 8l3 8h12l3-8-5 3-4-6-4 6-5-3z" fill="url(#crown-grad)" stroke="#92400E" strokeWidth="0.8" strokeLinejoin="round" />
      <circle cx="3" cy="8" r="1.2" fill="#EF4444" stroke="#92400E" strokeWidth="0.6" />
      <circle cx="21" cy="8" r="1.2" fill="#EF4444" stroke="#92400E" strokeWidth="0.6" />
      <circle cx="12" cy="6" r="1.4" fill="#10B981" stroke="#065F46" strokeWidth="0.6" />
      <rect x="5" y="16" width="14" height="2.5" rx="0.5" fill="#B45309" />
    </motion.g>
  </motion.svg>
);

/* ------------------------------ CHECK ✓ ------------------------------ */
export const CheckIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <motion.circle
      cx="12"
      cy="12"
      r="10"
      fill="#10B981"
      stroke="#065F46"
      strokeWidth="0.8"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, ease: "backOut" }}
    />
    <motion.path
      d="M7 12l3.5 3.5L17 9"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
    />
  </motion.svg>
);

/* ------------------------------ TARGET 🎯 ------------------------------ */
export const TargetIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <motion.g
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
    >
      <circle cx="12" cy="12" r="10" fill="#FEE2E2" stroke="#991B1B" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="7" fill="#EF4444" />
      <circle cx="12" cy="12" r="4" fill="#FEE2E2" />
      <circle cx="12" cy="12" r="1.5" fill="#991B1B" />
    </motion.g>
  </motion.svg>
);

/* ------------------------------ LIGHTBULB 💡 ------------------------------ */
export const LightbulbIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <motion.path
      d="M12 2a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 2z"
      fill="#FDE047"
      stroke="#A16207"
      strokeWidth="0.8"
      animate={{ filter: ["drop-shadow(0 0 0 #fde047)", "drop-shadow(0 0 6px #fde047)", "drop-shadow(0 0 0 #fde047)"] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    />
    <rect x="9" y="17" width="6" height="2" rx="0.5" fill="#A16207" />
    <rect x="10" y="20" width="4" height="1.5" rx="0.5" fill="#A16207" />
  </motion.svg>
);

/* ------------------------------ ROCKET 🚀 ------------------------------ */
export const RocketIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
    >
      <path d="M12 2c3 2 5 6 5 10v4l-2 2H9l-2-2v-4c0-4 2-8 5-10z" fill="#E5E7EB" stroke="#374151" strokeWidth="0.8" />
      <circle cx="12" cy="10" r="2" fill="#3B82F6" stroke="#1E40AF" strokeWidth="0.6" />
      <path d="M7 14l-3 3 1 3 3-2M17 14l3 3-1 3-3-2" fill="#EF4444" stroke="#991B1B" strokeWidth="0.6" />
    </motion.g>
    <motion.path
      d="M10 18l2 4 2-4"
      fill="#F97316"
      animate={{ scaleY: [0.8, 1.4, 0.8], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 18px", transformBox: "fill-box" }}
    />
  </motion.svg>
);

/* ------------------------------ BOOK 📚 ------------------------------ */
export const BookIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <motion.g
      animate={{ rotateY: [0, 10, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
    >
      <path d="M3 5c3-1 6-1 9 1v15c-3-2-6-2-9-1V5z" fill="#3B82F6" stroke="#1E40AF" strokeWidth="0.8" />
      <path d="M21 5c-3-1-6-1-9 1v15c3-2 6-2 9-1V5z" fill="#60A5FA" stroke="#1E40AF" strokeWidth="0.8" />
      <path d="M5 8h5M5 11h5M5 14h4M14 8h5M14 11h5M14 14h4" stroke="white" strokeWidth="0.6" opacity="0.8" />
    </motion.g>
  </motion.svg>
);

/* ------------------------------ BELL 🔔 ------------------------------ */
export const BellIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <motion.g
      animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 4px", transformBox: "fill-box" }}
    >
      <path d="M12 3a5 5 0 0 0-5 5v4l-2 4h14l-2-4V8a5 5 0 0 0-5-5z" fill="#F59E0B" stroke="#92400E" strokeWidth="0.8" strokeLinejoin="round" />
      <circle cx="12" cy="3" r="1" fill="#92400E" />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="#92400E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);

/* ------------------------------ MEDAL 🏅 ------------------------------ */
export const MedalIcon = ({ size = 20, className }: IconProps) => (
  <motion.svg {...baseSvg(size, className)}>
    <defs>
      <linearGradient id="medal-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path d="M8 2l2 8h4l2-8h-2l-1 5h-2l-1-5z" fill="#3B82F6" />
    <motion.circle
      cx="12"
      cy="15"
      r="6"
      fill="url(#medal-grad)"
      stroke="#92400E"
      strokeWidth="0.8"
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "12px 15px", transformBox: "fill-box" }}
    />
    <text x="12" y="18" textAnchor="middle" fontSize="6" fontWeight="900" fill="#78350F">
      1
    </text>
  </motion.svg>
);

/* ------------------------------ MAP REGISTRY ------------------------------ */
export const ANIMATED_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  // Coin
  "🪙": CoinIcon, coin: CoinIcon, coins: CoinIcon, "💰": CoinIcon, money: CoinIcon,
  // Flame
  "🔥": FlameIcon, flame: FlameIcon, fire: FlameIcon,
  // Zap
  "⚡": ZapIcon, zap: ZapIcon, lightning: ZapIcon, energy: ZapIcon,
  // Sparkles
  "✨": SparklesIcon, sparkles: SparklesIcon, "💫": SparklesIcon, sparkle: SparklesIcon, "🌌": SparklesIcon,
  // Star
  "⭐": StarIcon, "🌟": StarIcon, star: StarIcon, "✦": StarIcon, "✧": StarIcon,
  // Heart
  "❤️": HeartIcon, "❤": HeartIcon, "💕": HeartIcon, "💖": HeartIcon, "💗": HeartIcon, "💜": HeartIcon, heart: HeartIcon, love: HeartIcon,
  // Trophy
  "🏆": TrophyIcon, trophy: TrophyIcon,
  // Gift
  "🎁": GiftIcon, gift: GiftIcon, "🧸": GiftIcon,
  // Gem
  "💎": GemIcon, gem: GemIcon,
  // Party
  "🎉": PartyIcon, "🎊": PartyIcon, party: PartyIcon, celebrate: PartyIcon,
  // Crown
  "👑": CrownIcon, crown: CrownIcon, king: CrownIcon, queen: CrownIcon,
  // Check
  "✅": CheckIcon, check: CheckIcon, "✓": CheckIcon, tick: CheckIcon,
  // Target
  "🎯": TargetIcon, target: TargetIcon, goal: TargetIcon,
  // Lightbulb
  "💡": LightbulbIcon, idea: LightbulbIcon, tip: LightbulbIcon,
  // Rocket
  "🚀": RocketIcon, rocket: RocketIcon, launch: RocketIcon,
  // Book
  "📚": BookIcon, "📖": BookIcon, book: BookIcon, books: BookIcon, library: BookIcon, reading: BookIcon,
  // Bell
  "🔔": BellIcon, bell: BellIcon, notification: BellIcon,
  // Medal
  "🏅": MedalIcon, "🥇": MedalIcon, "🥈": MedalIcon, "🥉": MedalIcon, medal: MedalIcon, gold: MedalIcon, silver: MedalIcon, bronze: MedalIcon,
};
