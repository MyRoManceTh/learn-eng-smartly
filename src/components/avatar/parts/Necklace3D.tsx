import React from "react";
import CSSBox3D from "../CSSBox3D";
import { shade } from "../colorUtils";

interface Necklace3DProps {
  necklaceId: string | null;
  necklaceColor: string;
  torsoY: number;
}

const Necklace3D: React.FC<Necklace3DProps> = ({ necklaceId, necklaceColor, torsoY }) => {
  if (!necklaceId) return null;

  const c = necklaceColor;
  // neckY = top of torso area (torsoY - 22 is neck center)
  const neckY = torsoY - 22;

  switch (necklaceId) {
    // ── Heart Pendant ──
    case "neck_heart":
      return (
        <>
          {/* Chain */}
          <CSSBox3D width={24} height={2} depth={2} color="#FFD700" x={0} y={neckY} z={15} />
          {/* Heart */}
          <CSSBox3D width={7} height={7} depth={3} color={c} x={0} y={neckY + 6} z={16} />
          <CSSBox3D width={5} height={5} depth={3} color={shade(c, 20)} x={0} y={neckY + 4} z={17} />
          {/* Sparkle */}
          <CSSBox3D width={2} height={2} depth={1} color="#FFFFFF" x={2} y={neckY + 4} z={18} />
        </>
      );

    // ── Star Pendant ──
    case "neck_star":
      return (
        <>
          <CSSBox3D width={24} height={2} depth={2} color="#B0BEC5" x={0} y={neckY} z={15} />
          {/* Star body */}
          <CSSBox3D width={8} height={8} depth={3} color={c} x={0} y={neckY + 6} z={16} />
          <CSSBox3D width={5} height={5} depth={3} color={shade(c, 25)} x={0} y={neckY + 6} z={18} />
          <CSSBox3D width={2} height={2} depth={1} color="#FFFFFF" x={1} y={neckY + 5} z={19} />
        </>
      );

    // ── Pearl Necklace ──
    case "neck_pearl":
      return (
        <>
          {/* Pearl beads */}
          {[-10, -5, 0, 5, 10].map((x, i) => (
            <CSSBox3D key={i} width={5} height={5} depth={5} color={c} x={x} y={neckY + i % 2 * 2} z={15} />
          ))}
          {/* Center larger pearl */}
          <CSSBox3D width={7} height={7} depth={7} color={shade(c, 10)} x={0} y={neckY + 6} z={16} />
        </>
      );

    // ── Crystal Drop ──
    case "neck_crystal":
      return (
        <>
          <CSSBox3D width={22} height={2} depth={2} color="#90CAF9" x={0} y={neckY} z={15} />
          {/* Crystal facets */}
          <CSSBox3D width={5} height={12} depth={4} color={c} x={0} y={neckY + 8} z={16}
            faceOverrides={{
              front: `linear-gradient(180deg, #E1F5FE 0%, ${c} 50%, #B3E5FC 100%)`,
            }}
          />
          <CSSBox3D width={3} height={6} depth={3} color={shade(c, 20)} x={0} y={neckY + 4} z={17} />
          <CSSBox3D width={2} height={2} depth={1} color="#FFFFFF" x={1} y={neckY + 4} z={18} />
        </>
      );

    // ── Moon Crescent ──
    case "neck_moon":
      return (
        <>
          <CSSBox3D width={22} height={2} depth={2} color="#B0BEC5" x={0} y={neckY} z={15} />
          {/* Moon body */}
          <CSSBox3D width={9} height={9} depth={3} color={c} x={0} y={neckY + 6} z={16} />
          {/* Bite out to make crescent */}
          <CSSBox3D width={7} height={7} depth={4} color={shade(c, -40)} x={3} y={neckY + 5} z={17} />
          {/* Stars around */}
          <CSSBox3D width={2} height={2} depth={1} color="#FFF9C4" x={-6} y={neckY + 4} z={17} />
          <CSSBox3D width={2} height={2} depth={1} color="#FFF9C4" x={6} y={neckY + 9} z={17} />
        </>
      );

    // ── Dragon Fang ──
    case "neck_dragon":
      return (
        <>
          {/* Leather cord */}
          <CSSBox3D width={24} height={3} depth={3} color="#5D4037" x={0} y={neckY} z={15} />
          {/* Fang shape */}
          <CSSBox3D width={6} height={14} depth={4} color={c} x={0} y={neckY + 9} z={16}
            faceOverrides={{
              front: `linear-gradient(180deg, ${c} 0%, ${shade(c, -20)} 60%, #FFF9C4 100%)`,
            }}
          />
          <CSSBox3D width={4} height={8} depth={3} color={shade(c, 15)} x={0} y={neckY + 5} z={17} />
          {/* Glow */}
          <CSSBox3D width={2} height={2} depth={1} color="#FF6F00" x={0} y={neckY + 14} z={18} />
        </>
      );

    // ═══ GACHA NECKLACE ═══

    // ── Dragon Soul (gacha) ──
    case "gacha_neck_dragon_soul":
      return (
        <>
          {/* Enchanted chain */}
          <CSSBox3D width={26} height={3} depth={3} color="#FF6F00" x={0} y={neckY} z={15} />
          {/* Dragon soul orb */}
          <CSSBox3D width={12} height={12} depth={8} color={c} x={0} y={neckY + 8} z={16}
            faceOverrides={{
              front: `radial-gradient(circle at 35% 35%, #FFCA28 10%, ${c} 50%, #BF360C 100%)`,
            }}
          />
          {/* Inner flame */}
          <CSSBox3D width={6} height={6} depth={4} color="#FF8F00" x={0} y={neckY + 6} z={20} />
          <CSSBox3D width={3} height={3} depth={3} color="#FFD600" x={0} y={neckY + 5} z={22} />
          {/* Dragon wing accents */}
          <CSSBox3D width={6} height={4} depth={2} color={shade(c, -20)} x={-8} y={neckY + 6} z={17} rotateZ={-20} />
          <CSSBox3D width={6} height={4} depth={2} color={shade(c, -20)} x={8} y={neckY + 6} z={17} rotateZ={20} />
          {/* Ember particles */}
          <CSSBox3D width={2} height={2} depth={1} color="#FF6F00" x={-4} y={neckY + 2} z={18} />
          <CSSBox3D width={2} height={2} depth={1} color="#FFCA28" x={4} y={neckY + 14} z={18} />
        </>
      );

    default:
      return null;
  }
};

export default Necklace3D;
