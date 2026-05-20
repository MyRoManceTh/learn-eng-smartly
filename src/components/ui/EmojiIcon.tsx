import { EMOJI_ICON_MAP } from "@/lib/emojiIconMap";
import { ANIMATED_ICON_MAP } from "@/components/icons/animated";
import { cn } from "@/lib/utils";

interface EmojiIconProps {
  /** Emoji character (e.g. "🔥") or semantic key (e.g. "flame"). */
  emoji: string;
  /** Pixel size. Defaults to 20. */
  size?: number;
  /** Tailwind class for color, stroke, etc. */
  className?: string;
  /** Optional explicit color, otherwise uses currentColor. */
  color?: string;
  /** Accessible label. If omitted the icon is treated as decorative. */
  label?: string;
  /** Stroke width passthrough (Lucide only). */
  strokeWidth?: number;
  /** Optional fill (Lucide only). */
  fill?: string;
  /** Force-disable the animated set even when a match exists. */
  static?: boolean;
}

/**
 * Renders an icon in place of an emoji.
 * Priority:
 *   1. Custom Framer-Motion animated SVG (icons/animated)
 *   2. Lucide static icon mapping
 *   3. Fallback to the raw emoji character
 */
export const EmojiIcon = ({
  emoji,
  size = 20,
  className,
  color,
  label,
  strokeWidth,
  fill,
  static: isStatic,
}: EmojiIconProps) => {
  const ariaProps = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true };

  // 1) Custom animated icons
  if (!isStatic) {
    const Animated = ANIMATED_ICON_MAP[emoji];
    if (Animated) {
      return (
        <span className={cn("inline-flex items-center justify-center leading-none", className)} {...ariaProps}>
          <Animated size={size} />
        </span>
      );
    }
  }

  // 2) Lucide fallback
  const Icon = EMOJI_ICON_MAP[emoji];
  if (Icon) {
    return (
      <Icon
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        fill={fill}
        className={cn("inline-block shrink-0", className)}
        {...ariaProps}
      />
    );
  }

  // 3) Raw emoji fallback
  return (
    <span className={cn("inline-block leading-none", className)} {...ariaProps}>
      {emoji}
    </span>
  );
};

export default EmojiIcon;
