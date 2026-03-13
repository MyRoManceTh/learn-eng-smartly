import { memo, useMemo } from "react";
import type { AvatarItem } from "@/types/avatar";
import { generateItemPreview, PREVIEW_PX } from "@/lib/pixi/itemPreviewSprite";

interface PixelItemPreviewProps {
  item: AvatarItem;
  size?: "sm" | "lg";
}

const SIZE_MAP = { sm: 56, lg: 80 };

const PixelItemPreview = memo(({ item, size = "sm" }: PixelItemPreviewProps) => {
  const src = useMemo(() => generateItemPreview(item), [item.id]);
  const display = SIZE_MAP[size];

  return (
    <img
      src={src}
      alt={item.nameThai}
      width={display}
      height={display}
      style={{ imageRendering: "pixelated" }}
      draggable={false}
    />
  );
});

PixelItemPreview.displayName = "PixelItemPreview";

export default PixelItemPreview;
