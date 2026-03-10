import { useMemo } from "react";
import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";

interface PixelCharacterProps {
  equipped: EquippedItems;
  evolutionStage?: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

/**
 * 8-bit Pixel Art character rendered with CSS grid.
 * Each cell = 1 pixel in the sprite.
 * Character is 12 wide x 16 tall.
 */
const PixelCharacter = ({
  equipped,
  evolutionStage = 1,
  size = "md",
  animated = true,
}: PixelCharacterProps) => {
  // Resolve colors from equipped items
  const colors = useMemo(() => {
    const skinItem = getItemById(equipped.skin);
    const hairColorItem = getItemById(equipped.hairColor);
    const shirtItem = getItemById(equipped.shirt);
    const pantsItem = getItemById(equipped.pants);
    const shoesItem = getItemById(equipped.shoes);
    const hatItem = equipped.hat ? getItemById(equipped.hat) : null;

    const skin = skinItem?.svgProps?.color || "#F5D5C0";
    const skinShadow = darken(skin, 20);
    const hair = hairColorItem?.svgProps?.color === "rainbow" ? "#FF6B6B" : (hairColorItem?.svgProps?.color || "#2C2C2C");
    const hairHighlight = lighten(hair, 15);
    const shirt = shirtItem?.svgProps?.color || "#4DB6AC";
    const shirtShadow = darken(shirt, 15);
    const pants = pantsItem?.svgProps?.color || "#4A90E2";
    const pantsShadow = darken(pants, 15);
    const shoes = shoesItem?.svgProps?.color || "#F0F0F0";
    const shoesShadow = darken(shoes, 20);
    const hat = hatItem?.svgProps?.color || null;
    const outline = "#1a1a2e";
    const eye = "#1a1a2e";
    const white = "#FFFFFF";
    const blush = "#FFB4B4";

    return { skin, skinShadow, hair, hairHighlight, shirt, shirtShadow, pants, pantsShadow, shoes, shoesShadow, hat, outline, eye, white, blush };
  }, [equipped]);

  const hairStyle = useMemo(() => {
    const hairItem = getItemById(equipped.hair);
    return hairItem?.svgProps?.path || "short";
  }, [equipped.hair]);

  const hasHat = !!equipped.hat;
  const hasAccessory = !!equipped.accessory;
  const accItem = equipped.accessory ? getItemById(equipped.accessory) : null;
  const accColor = accItem?.svgProps?.color || "#80DEEA";

  // _ = transparent, O = outline, S = skin, s = skinShadow, H = hair, h = hairHighlight
  // T = shirt, t = shirtShadow, P = pants, p = pantsShadow, F = shoes (foot), f = shoesShadow
  // E = eye, W = white, B = blush, C = hat, A = accessory
  const C = colors;
  const colorMap: Record<string, string> = {
    _: "transparent",
    O: C.outline,
    S: C.skin,
    s: C.skinShadow,
    H: C.hair,
    h: C.hairHighlight,
    T: C.shirt,
    t: C.shirtShadow,
    P: C.pants,
    p: C.pantsShadow,
    F: C.shoes,
    f: C.shoesShadow,
    E: C.eye,
    W: C.white,
    B: C.blush,
    C: C.hat || C.hair,
    A: accColor,
  };

  // Build the sprite based on hair style and hat
  const sprite = useMemo(() => {
    // Row 0-1: Hair/Hat top
    // Row 2-3: Hair sides + face top
    // Row 4-5: Face (eyes, mouth)
    // Row 6: Neck
    // Row 7-9: Shirt/body
    // Row 10-11: Pants
    // Row 12-13: Shoes

    const rows: string[][] = [];

    // === ROW 0-1: TOP OF HEAD (Hair or Hat) ===
    if (hasHat) {
      rows.push(
        ["_","_","_","O","C","C","C","C","C","O","_","_"],
        ["_","_","O","C","C","C","C","C","C","C","O","_"],
      );
    } else if (hairStyle === "spike" || hairStyle === "mohawk") {
      rows.push(
        ["_","_","_","_","H","H","H","H","_","_","_","_"],
        ["_","_","O","H","h","H","H","h","H","O","_","_"],
      );
    } else if (hairStyle === "afro") {
      rows.push(
        ["_","_","O","H","H","H","H","H","H","O","_","_"],
        ["_","O","H","h","H","H","H","H","h","H","O","_"],
      );
    } else if (hairStyle === "long" || hairStyle === "ponytail") {
      rows.push(
        ["_","_","_","O","H","H","H","H","O","_","_","_"],
        ["_","_","O","H","h","H","H","h","H","O","_","_"],
      );
    } else {
      // short, bun, curly, default
      rows.push(
        ["_","_","_","O","H","H","H","H","O","_","_","_"],
        ["_","_","O","H","h","H","H","H","O","_","_","_"],
      );
    }

    // === ROW 2-3: HAIR SIDES + TOP FACE ===
    if (hairStyle === "afro") {
      rows.push(
        ["_","O","H","H","O","S","S","O","H","H","O","_"],
        ["_","O","H","O","S","S","S","S","O","H","O","_"],
      );
    } else if (hairStyle === "long" || hairStyle === "ponytail") {
      rows.push(
        ["_","_","O","H","O","S","S","O","H","O","_","_"],
        ["_","_","O","H","O","S","S","S","O","H","O","_"],
      );
    } else {
      rows.push(
        ["_","_","O","H","O","S","S","O","H","O","_","_"],
        ["_","_","O","O","S","S","S","S","O","O","_","_"],
      );
    }

    // === ROW 4: EYES ===
    if (hasAccessory && equipped.accessory === "acc_glasses") {
      rows.push(["_","_","O","S","E","A","A","E","S","O","_","_"]);
    } else {
      rows.push(["_","_","O","S","E","W","W","E","S","O","_","_"]);
    }

    // === ROW 5: MOUTH + CHEEKS ===
    rows.push(["_","_","O","S","B","s","s","B","S","O","_","_"]);

    // === ROW 6: NECK ===
    rows.push(["_","_","_","O","S","S","S","S","O","_","_","_"]);

    // === ROW 7-9: SHIRT/BODY ===
    rows.push(
      ["_","_","O","T","T","T","T","T","T","O","_","_"],
      ["_","O","S","O","T","t","t","T","O","S","O","_"],
      ["_","_","O","O","T","T","T","T","O","O","_","_"],
    );

    // === ROW 10-11: PANTS ===
    rows.push(
      ["_","_","_","O","P","P","P","P","O","_","_","_"],
      ["_","_","_","O","P","O","O","P","O","_","_","_"],
    );

    // === ROW 12-13: SHOES ===
    rows.push(
      ["_","_","O","F","F","O","O","F","F","O","_","_"],
      ["_","_","O","F","f","O","O","f","F","O","_","_"],
    );

    // Ponytail or bun extras (append hair pixel on side)
    if (hairStyle === "ponytail" && !hasHat) {
      // Add ponytail hanging on right side at rows 2-4
      rows[2][10] = "H";
      rows[3][10] = "H";
      rows[4][10] = "H";
      rows[5][10] = "H";
    }
    if (hairStyle === "bun" && !hasHat) {
      rows[0][9] = "H";
      rows[0][10] = "H";
      rows[1][10] = "H";
    }

    // Cape accessory
    if (hasAccessory && equipped.accessory === "acc_cape") {
      rows[7][1] = "A";
      rows[8][0] = "A";
      rows[8][1] = "A";
      rows[9][0] = "A";
      rows[9][1] = "A";
      rows[10][0] = "A";
      rows[10][1] = "A";
      rows[11][0] = "A";
    }

    // Wings accessory
    if (hasAccessory && equipped.accessory === "acc_wings") {
      rows[7][0] = "A"; rows[7][1] = "A";
      rows[7][10] = "A"; rows[7][11] = "A";
      rows[8][0] = "A";
      rows[8][11] = "A";
    }

    return rows;
  }, [equipped, hairStyle, hasHat, hasAccessory, accColor]);

  const pixelSize = size === "lg" ? 6 : size === "md" ? 4 : 3;
  const cols = 12;

  // Evolution glow
  const glowColor =
    evolutionStage >= 5 ? "rgba(255,215,0,0.6)"
    : evolutionStage >= 4 ? "rgba(147,51,234,0.5)"
    : evolutionStage >= 3 ? "rgba(59,130,246,0.4)"
    : evolutionStage >= 2 ? "rgba(74,222,128,0.3)"
    : "none";

  return (
    <div
      className={`relative inline-block ${animated ? "animate-pixel-idle" : ""}`}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Glow effect */}
      {evolutionStage >= 2 && (
        <div
          className="absolute -inset-2 rounded-full blur-md animate-pulse"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {/* Pixel grid */}
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
          gap: 0,
        }}
      >
        {sprite.flat().map((code, i) => (
          <div
            key={i}
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: colorMap[code] || "transparent",
            }}
          />
        ))}
      </div>

      {/* Rainbow shimmer for rainbow hair */}
      {equipped.hairColor === "haircolor_rainbow" && (
        <div
          className="absolute top-0 left-0 right-0 h-[30%] pointer-events-none animate-rainbow-shimmer"
          style={{
            mixBlendMode: "color",
            background: "linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0000)",
            backgroundSize: "200% 100%",
            opacity: 0.6,
          }}
        />
      )}

      {/* Legendary particles */}
      {evolutionStage >= 5 && (
        <>
          <div className="absolute -top-1 left-1/4 w-1 h-1 bg-yellow-400 animate-ping" style={{ animationDuration: "1.5s" }} />
          <div className="absolute -top-2 right-1/3 w-1 h-1 bg-yellow-300 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
          <div className="absolute top-0 right-1/4 w-1 h-1 bg-amber-400 animate-ping" style={{ animationDuration: "1.8s", animationDelay: "1s" }} />
        </>
      )}
    </div>
  );
};

// === Color utility helpers ===
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}

function darken(hex: string, amount: number): string {
  try {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r - amount, g - amount, b - amount);
  } catch {
    return hex;
  }
}

function lighten(hex: string, amount: number): string {
  try {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r + amount, g + amount, b + amount);
  } catch {
    return hex;
  }
}

export default PixelCharacter;
