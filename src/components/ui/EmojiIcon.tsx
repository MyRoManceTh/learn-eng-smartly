import { EMOJI_ICON_MAP } from "@/lib/emojiIconMap";
import { cn } from "@/lib/utils";

interface EmojiIconProps {
  /** Emoji character (e.g. "🔥") or semantic key (e.g. "flame"). */
  emoji: string;
  /** Pixel size — passes to lucide `size` prop. Defaults to 20. */
  size?: number;
  /** Tailwind class for color, stroke, etc. */
  className?: string;
  /** Optional explicit color, otherwise uses currentColor. */
  color?: string;
  /** Accessible label. If omitted the icon is treated as decorative. */
  label?: string;
  /** Stroke width passthrough. */
  strokeWidth?: number;
  /** Optional fill (useful for "filled" looks). */
  fill?: string;
}

/**
 * Renders an SVG icon in place of an emoji using a centralized mapping.
 * Falls back to rendering the emoji character itself when no mapping exists,
 * so the UI is never broken by a missing entry.
 */
export const EmojiIcon = ({
  emoji,
  size = 20,
  className,
  color,
  label,
  strokeWidth,
  fill,
}: EmojiIconProps) => {
  const Icon = EMOJI_ICON_MAP[emoji];
  const ariaProps = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true };

  if (!Icon) {
    return (
      <span className={cn("inline-block leading-none", className)} {...ariaProps}>
        {emoji}
      </span>
    );
  }

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
};

export default EmojiIcon;
