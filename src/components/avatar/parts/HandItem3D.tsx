import React from "react";
import CSSBox3D from "../CSSBox3D";
import { shade } from "../colorUtils";

interface HandItem3DProps {
  itemId: string | null;
  itemColor: string;
  side: "left" | "right";
  torsoY: number;
}

/**
 * Renders items held in left or right hand.
 * Left hand: x negative side (avatar's left = viewer's right in 3D view)
 * Right hand: x positive side
 */
const HandItem3D: React.FC<HandItem3DProps> = ({ itemId, itemColor, side, torsoY }) => {
  if (!itemId) return null;

  const c = itemColor;
  // Hand position: arms extend from torso sides
  // torsoY = center of torso (height 44), arm bottom ≈ torsoY + 22
  const handY = torsoY + 20;
  const sx = side === "left" ? -1 : 1; // sign for x offset
  const hx = sx * 38; // hand x position

  switch (itemId) {
    // ── Round Shield (left hand) ──
    case "left_shield":
      return (
        <>
          {/* Shield body */}
          <CSSBox3D width={22} height={26} depth={5} color={c} x={hx} y={torsoY} z={8}
            faceOverrides={{
              front: `radial-gradient(circle at 50% 40%, ${shade(c, 20)} 20%, ${c} 60%, ${shade(c, -20)} 100%)`,
            }}
          />
          {/* Shield rim */}
          <CSSBox3D width={24} height={28} depth={4} color={shade(c, -25)} x={hx} y={torsoY} z={6} />
          {/* Boss (center knob) */}
          <CSSBox3D width={6} height={6} depth={4} color="#FFD700" x={hx} y={torsoY - 2} z={12} />
        </>
      );

    // ── Magic Lantern (left hand) ──
    case "left_lantern":
      return (
        <>
          {/* Handle */}
          <CSSBox3D width={3} height={8} depth={3} color="#5D4037" x={hx} y={torsoY + 14} z={10} />
          {/* Lantern body */}
          <CSSBox3D width={12} height={16} depth={12} color={shade(c, -10)} x={hx} y={torsoY + 2} z={10} />
          {/* Glass panels */}
          <CSSBox3D width={10} height={12} depth={2} color={c} x={hx} y={torsoY + 2} z={17}
            faceOverrides={{ front: `rgba(255,200,0,0.6)` }}
          />
          {/* Flame glow */}
          <CSSBox3D width={6} height={6} depth={6} color="#FF8F00" x={hx} y={torsoY - 2} z={10} />
          <CSSBox3D width={4} height={4} depth={4} color="#FFD600" x={hx} y={torsoY - 4} z={10} />
          {/* Top hook */}
          <CSSBox3D width={4} height={4} depth={4} color="#5D4037" x={hx} y={torsoY - 10} z={10} />
        </>
      );

    // ── Spell Book (left hand) ──
    case "left_book":
      return (
        <>
          {/* Book body */}
          <CSSBox3D width={16} height={20} depth={5} color={c} x={hx} y={torsoY + 2} z={10}
            faceOverrides={{
              front: `linear-gradient(180deg, ${shade(c, 15)} 0%, ${c} 40%, ${shade(c, -10)} 100%)`,
            }}
          />
          {/* Spine */}
          <CSSBox3D width={3} height={20} depth={5} color={shade(c, -20)} x={hx - 9} y={torsoY + 2} z={10} />
          {/* Gold clasp */}
          <CSSBox3D width={4} height={3} depth={3} color="#FFD700" x={hx + 6} y={torsoY + 2} z={13} />
          {/* Magic rune glow */}
          <CSSBox3D width={6} height={6} depth={1} color="#CE93D8" x={hx} y={torsoY - 2} z={13} />
          <CSSBox3D width={3} height={3} depth={1} color="#FFFFFF" x={hx} y={torsoY - 2} z={14} />
        </>
      );

    // ── Bouquet (left hand) ──
    case "left_flower":
      return (
        <>
          {/* Stems */}
          <CSSBox3D width={3} height={16} depth={3} color="#4CAF50" x={hx} y={torsoY + 10} z={10} />
          {/* Flowers */}
          <CSSBox3D width={10} height={10} depth={6} color={c} x={hx} y={torsoY - 2} z={12} />
          <CSSBox3D width={8} height={8} depth={6} color={shade(c, 20)} x={hx - 6} y={torsoY + 2} z={10} />
          <CSSBox3D width={8} height={8} depth={6} color="#FFD700" x={hx + 5} y={torsoY + 4} z={10} />
          {/* Centers */}
          <CSSBox3D width={4} height={4} depth={3} color="#FFF9C4" x={hx} y={torsoY - 2} z={15} />
          <CSSBox3D width={3} height={3} depth={3} color="#FFF9C4" x={hx - 6} y={torsoY + 2} z={13} />
          {/* Ribbon wrap */}
          <CSSBox3D width={6} height={4} depth={4} color="#FF80AB" x={hx} y={torsoY + 14} z={12} />
        </>
      );

    // ── Crystal Shield (left hand) ──
    case "left_crystal_shield":
      return (
        <>
          <CSSBox3D width={24} height={28} depth={5} color={c} x={hx} y={torsoY} z={8}
            faceOverrides={{
              front: `linear-gradient(135deg, #E1F5FE 0%, ${c} 40%, #B3E5FC 80%, #E0F7FA 100%)`,
            }}
          />
          <CSSBox3D width={26} height={30} depth={4} color={shade(c, -20)} x={hx} y={torsoY} z={6} />
          {/* Crystal gem center */}
          <CSSBox3D width={8} height={8} depth={4} color="#E1F5FE" x={hx} y={torsoY - 2} z={13} />
          <CSSBox3D width={4} height={4} depth={3} color="#FFFFFF" x={hx} y={torsoY - 2} z={15} />
          {/* Corner gems */}
          <CSSBox3D width={3} height={3} depth={2} color="#CE93D8" x={hx - 8} y={torsoY - 10} z={12} />
          <CSSBox3D width={3} height={3} depth={2} color="#4FC3F7" x={hx + 8} y={torsoY - 10} z={12} />
        </>
      );

    // ── Starlight Shield (left hand) ──
    case "left_star_shield":
      return (
        <>
          <CSSBox3D width={26} height={30} depth={5} color={c} x={hx} y={torsoY} z={8}
            faceOverrides={{
              front: `radial-gradient(circle at 50% 40%, #FFF9C4 10%, ${c} 50%, ${shade(c, -20)} 100%)`,
            }}
          />
          <CSSBox3D width={28} height={32} depth={4} color={shade(c, -25)} x={hx} y={torsoY} z={6} />
          {/* Star emblem */}
          <CSSBox3D width={10} height={10} depth={3} color="#FFD700" x={hx} y={torsoY - 2} z={13} />
          <CSSBox3D width={6} height={6} depth={3} color="#FFF9C4" x={hx} y={torsoY - 2} z={15} />
          {/* Glow particles */}
          <CSSBox3D width={2} height={2} depth={2} color="#FFF176" x={hx - 10} y={torsoY - 12} z={12} />
          <CSSBox3D width={2} height={2} depth={2} color="#FFF176" x={hx + 10} y={torsoY - 12} z={12} />
        </>
      );

    // ── Magic Wand (right hand) ──
    case "right_wand":
      return (
        <>
          {/* Shaft */}
          <CSSBox3D width={3} height={34} depth={3} color="#F8BBD0" x={hx} y={torsoY - 4} z={10} rotateZ={sx * -12} />
          {/* Grip */}
          <CSSBox3D width={5} height={10} depth={5} color="#CE93D8" x={hx + sx * 2} y={torsoY + 16} z={10} rotateZ={sx * -12} />
          {/* Star topper */}
          <CSSBox3D width={11} height={11} depth={4} color={c} x={hx - sx * 2} y={torsoY - 24} z={10} />
          <CSSBox3D width={7} height={7} depth={4} color="#FFF9C4" x={hx - sx * 2} y={torsoY - 24} z={12} />
          {/* Sparkles */}
          <CSSBox3D width={3} height={3} depth={2} color="#FFF176" x={hx + sx * 4} y={torsoY - 28} z={12} />
          <CSSBox3D width={2} height={2} depth={2} color="#FFF176" x={hx - sx * 6} y={torsoY - 20} z={12} />
        </>
      );

    // ── Short Sword (right hand) ──
    case "right_sword":
      return (
        <>
          {/* Blade */}
          <CSSBox3D width={4} height={30} depth={3} color={c} x={hx} y={torsoY - 8} z={10} rotateZ={sx * -8}
            faceOverrides={{
              front: `linear-gradient(180deg, #ECEFF1 0%, ${c} 40%, ${shade(c, -20)} 100%)`,
            }}
          />
          {/* Guard */}
          <CSSBox3D width={16} height={4} depth={5} color={shade(c, -15)} x={hx} y={torsoY + 8} z={10} rotateZ={sx * -8} />
          {/* Handle */}
          <CSSBox3D width={5} height={12} depth={5} color="#5D4037" x={hx + sx * 1} y={torsoY + 18} z={10} rotateZ={sx * -8} />
          {/* Pommel */}
          <CSSBox3D width={7} height={6} depth={7} color={shade(c, -10)} x={hx + sx * 1} y={torsoY + 26} z={10} />
        </>
      );

    // ── Magic Staff (right hand) ──
    case "right_staff":
      return (
        <>
          {/* Staff pole */}
          <CSSBox3D width={5} height={50} depth={5} color={shade(c, -20)} x={hx} y={torsoY - 4} z={10} />
          {/* Orb holder */}
          <CSSBox3D width={8} height={8} depth={8} color="#5D4037" x={hx} y={torsoY - 30} z={10} />
          {/* Magic orb */}
          <CSSBox3D width={14} height={14} depth={14} color={c} x={hx} y={torsoY - 40} z={10}
            faceOverrides={{
              front: `radial-gradient(circle at 35% 35%, ${shade(c, 30)} 20%, ${c} 60%, ${shade(c, -20)} 100%)`,
            }}
          />
          {/* Orb glow */}
          <CSSBox3D width={8} height={8} depth={8} color={shade(c, 30)} x={hx - 2} y={torsoY - 42} z={14} />
          {/* Rune rings */}
          <CSSBox3D width={18} height={2} depth={18} color={shade(c, 10)} x={hx} y={torsoY - 38} z={10} />
        </>
      );

    // ── Flame Torch (right hand) ──
    case "right_torch":
      return (
        <>
          {/* Handle */}
          <CSSBox3D width={5} height={28} depth={5} color="#5D4037" x={hx} y={torsoY + 8} z={10} />
          {/* Torch head */}
          <CSSBox3D width={8} height={10} depth={8} color="#795548" x={hx} y={torsoY - 4} z={10} />
          {/* Flame layers */}
          <CSSBox3D width={10} height={12} depth={10} color="#FF6D00" x={hx} y={torsoY - 14} z={10} />
          <CSSBox3D width={8} height={10} depth={8} color="#FF8F00" x={hx} y={torsoY - 18} z={10} />
          <CSSBox3D width={5} height={8} depth={5} color="#FFD600" x={hx} y={torsoY - 22} z={10} />
          <CSSBox3D width={3} height={5} depth={3} color="#FFFFFF" x={hx} y={torsoY - 25} z={10} />
        </>
      );

    // ── Crystal Blade (right hand) ──
    case "right_crystal_blade":
      return (
        <>
          {/* Blade */}
          <CSSBox3D width={5} height={38} depth={3} color={c} x={hx} y={torsoY - 10} z={10} rotateZ={sx * -6}
            faceOverrides={{
              front: `linear-gradient(180deg, #E1F5FE 0%, ${c} 40%, #B3E5FC 80%, #E0F7FA 100%)`,
              left: `linear-gradient(180deg, rgba(179,229,252,0.8), rgba(128,222,234,0.6))`,
              right: `linear-gradient(180deg, rgba(179,229,252,0.8), rgba(128,222,234,0.6))`,
            }}
          />
          {/* Tip */}
          <CSSBox3D width={3} height={8} depth={2} color="#E1F5FE" x={hx} y={torsoY - 32} z={10} rotateZ={sx * -6} />
          {/* Guard */}
          <CSSBox3D width={18} height={5} depth={6} color="#CE93D8" x={hx} y={torsoY + 8} z={10} />
          {/* Handle */}
          <CSSBox3D width={5} height={12} depth={5} color="#7B1FA2" x={hx} y={torsoY + 18} z={10} />
          {/* Pommel gem */}
          <CSSBox3D width={7} height={6} depth={7} color="#E040FB" x={hx} y={torsoY + 26} z={10} />
          {/* Glow particles */}
          <CSSBox3D width={2} height={2} depth={2} color="#E1F5FE" x={hx + sx * 4} y={torsoY - 18} z={14} />
          <CSSBox3D width={2} height={2} depth={2} color="#B3E5FC" x={hx - sx * 4} y={torsoY - 8} z={14} />
        </>
      );

    // ── Thunder Blade (right hand) ──
    case "right_lightning_sword":
      return (
        <>
          {/* Blade with lightning pattern */}
          <CSSBox3D width={5} height={36} depth={4} color={c} x={hx} y={torsoY - 10} z={10} rotateZ={sx * -6}
            faceOverrides={{
              front: `linear-gradient(180deg, #FFFFFF 0%, ${c} 30%, #FF8F00 70%, #FF6D00 100%)`,
            }}
          />
          {/* Guard */}
          <CSSBox3D width={20} height={5} depth={6} color="#FF8F00" x={hx} y={torsoY + 8} z={10} />
          {/* Handle */}
          <CSSBox3D width={5} height={12} depth={5} color="#1A1A1A" x={hx} y={torsoY + 18} z={10} />
          {/* Pommel */}
          <CSSBox3D width={8} height={7} depth={8} color="#FF8F00" x={hx} y={torsoY + 26} z={10} />
          {/* Lightning sparks */}
          <CSSBox3D width={3} height={3} depth={2} color="#FFFFFF" x={hx + sx * 5} y={torsoY - 20} z={14} />
          <CSSBox3D width={2} height={2} depth={2} color={c} x={hx - sx * 4} y={torsoY - 10} z={14} />
          <CSSBox3D width={2} height={2} depth={2} color="#FF8F00" x={hx + sx * 3} y={torsoY} z={14} />
        </>
      );

    default:
      return null;
  }
};

export default HandItem3D;
