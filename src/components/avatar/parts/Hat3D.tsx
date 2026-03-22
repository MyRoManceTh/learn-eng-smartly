import React from "react";
import CSSBox3D from "../CSSBox3D";
import { shade } from "../colorUtils";

interface Hat3DProps {
  hatId: string | null;
  hatColor: string;
  headY: number;
}

const Hat3D: React.FC<Hat3DProps> = ({ hatId, hatColor, headY }) => {
  if (!hatId) return null;

  // headY = center of head (head height = 50px)
  // top edge of head = headY - 25
  // hats sit ON TOP of head: hat bottom aligns with headY - 25
  // CSSBox3D y = center of box, so for hat height H: y = (headY - 25) - H/2
  const ht = headY - 25; // shorthand: top edge of head
  const c = hatColor;
  const cDark = shade(c, -12);
  const cLight = shade(c, 15);

  switch (hatId) {
    // ── Cute Beret ──
    case "hat_beret":
      return (
        <>
          {/* Beret body sits on head, bottom at ht, height=10 → center at ht-5 */}
          <CSSBox3D width={50} height={10} depth={50} color={c} x={0} y={ht - 5} z={2} />
          {/* Puffed dome on top */}
          <CSSBox3D width={40} height={10} depth={40} color={cLight} x={-3} y={ht - 18} z={2} />
          {/* Tiny stem */}
          <CSSBox3D width={6} height={6} depth={6} color={cDark} x={-3} y={ht - 26} z={2} />
        </>
      );

    // ── Bucket Hat ──
    case "hat_bucket":
      return (
        <>
          {/* Brim sits at top of head */}
          <CSSBox3D width={62} height={5} depth={62} color={cDark} x={0} y={ht - 2} z={0} />
          {/* Crown above brim, height=22 → center at ht-5-11=ht-16 */}
          <CSSBox3D width={50} height={22} depth={50} color={c} x={0} y={ht - 16} z={0} />
          {/* Band detail */}
          <CSSBox3D width={52} height={4} depth={52} color={shade(c, -20)} x={0} y={ht - 6} z={0} />
        </>
      );

    // ── Cozy Beanie ──
    case "hat_beanie":
      return (
        <>
          {/* Cuff sits at top of head, height=8 → center at ht-4 */}
          <CSSBox3D width={54} height={8} depth={54} color={cDark} x={0} y={ht - 4} z={0} />
          {/* Main beanie above cuff, height=22 → center at ht-8-11=ht-19 */}
          <CSSBox3D width={52} height={22} depth={52} color={c} x={0} y={ht - 19} z={0} />
          {/* Pom pom on top */}
          <CSSBox3D width={14} height={14} depth={14} color={cLight} x={0} y={ht - 36} z={0} />
          <CSSBox3D width={9} height={9} depth={9} color={shade(c, 25)} x={2} y={ht - 38} z={2} />
        </>
      );

    // ── Cat Ears ──
    case "hat_catears":
      return (
        <>
          {/* Headband sits on top of head */}
          <CSSBox3D width={52} height={5} depth={8} color={shade(c, -30)} x={0} y={ht - 2} z={0} />
          {/* Left ear outer, bottom at ht-5, height=18 → center at ht-5-9=ht-14 */}
          <CSSBox3D width={14} height={18} depth={6} color={c} x={-18} y={ht - 14} z={4} rotateZ={-8} />
          <CSSBox3D width={8} height={12} depth={3} color="#FFB6C1" x={-18} y={ht - 13} z={6} rotateZ={-8} />
          {/* Right ear outer */}
          <CSSBox3D width={14} height={18} depth={6} color={c} x={18} y={ht - 14} z={4} rotateZ={8} />
          <CSSBox3D width={8} height={12} depth={3} color="#FFB6C1" x={18} y={ht - 13} z={6} rotateZ={8} />
        </>
      );

    // ── Bunny Ears ──
    case "hat_bunnyears":
      return (
        <>
          {/* Headband */}
          <CSSBox3D width={52} height={5} depth={8} color="#FFD1DC" x={0} y={ht - 2} z={0} />
          {/* Left ear straight up, height=36 → center at ht-5-18=ht-23 */}
          <CSSBox3D width={10} height={36} depth={6} color={c} x={-14} y={ht - 23} z={4} rotateZ={-6} />
          <CSSBox3D width={6} height={28} depth={3} color="#FFB6C1" x={-14} y={ht - 21} z={6} rotateZ={-6} />
          {/* Right ear (slightly floppy) */}
          <CSSBox3D width={10} height={30} depth={6} color={c} x={14} y={ht - 20} z={4} rotateZ={6} />
          <CSSBox3D width={10} height={14} depth={6} color={c} x={22} y={ht - 8} z={4} rotateZ={38} />
          <CSSBox3D width={6} height={24} depth={3} color="#FFB6C1" x={14} y={ht - 19} z={6} rotateZ={6} />
        </>
      );

    // ── Flower Crown ──
    case "hat_flowerband":
      return (
        <>
          {/* Vine band */}
          <CSSBox3D width={54} height={6} depth={54} color="#81C784" x={0} y={ht - 3} z={0} />
          {/* Flowers */}
          <CSSBox3D width={9} height={9} depth={6} color="#FF69B4" x={0} y={ht - 10} z={27} />
          <CSSBox3D width={8} height={8} depth={6} color="#FFD54F" x={-20} y={ht - 10} z={18} />
          <CSSBox3D width={9} height={9} depth={6} color="#E1BEE7" x={20} y={ht - 10} z={18} />
          <CSSBox3D width={8} height={8} depth={6} color="#FF8A65" x={-16} y={ht - 10} z={-16} />
          <CSSBox3D width={7} height={7} depth={6} color="#81D4FA" x={16} y={ht - 10} z={-16} />
          {/* Pistils */}
          <CSSBox3D width={3} height={3} depth={2} color="#FFF9C4" x={0} y={ht - 10} z={29} />
          <CSSBox3D width={3} height={3} depth={2} color="#FFF9C4" x={-20} y={ht - 10} z={20} />
        </>
      );

    // ── Neon Headphones ──
    case "hat_headphones":
      return (
        <>
          {/* Headband arc over head */}
          <CSSBox3D width={54} height={6} depth={8} color="#263238" x={0} y={ht - 10} z={0} />
          {/* Left ear cup, center at head mid-height */}
          <CSSBox3D width={8} height={20} depth={20} color="#37474F" x={-30} y={ht + 10} z={0} />
          <CSSBox3D width={5} height={14} depth={14} color={c} x={-33} y={ht + 10} z={0} />
          {/* Right ear cup */}
          <CSSBox3D width={8} height={20} depth={20} color="#37474F" x={30} y={ht + 10} z={0} />
          <CSSBox3D width={5} height={14} depth={14} color={c} x={33} y={ht + 10} z={0} />
          {/* Cushion pads */}
          <CSSBox3D width={4} height={16} depth={16} color="#546E7A" x={-27} y={ht + 10} z={0} />
          <CSSBox3D width={4} height={16} depth={16} color="#546E7A" x={27} y={ht + 10} z={0} />
        </>
      );

    // ── Star Witch Hat ──
    case "hat_witch":
      return (
        <>
          {/* Wide brim at top of head */}
          <CSSBox3D width={64} height={5} depth={64} color={c} x={0} y={ht - 2} z={0} />
          <CSSBox3D width={66} height={2} depth={66} color={shade(c, 15)} x={0} y={ht + 1} z={0} />
          {/* Band ribbon */}
          <CSSBox3D width={44} height={5} depth={44} color="#FFD700" x={0} y={ht - 7} z={0} />
          {/* Cone layers stacking up */}
          <CSSBox3D width={42} height={16} depth={42} color={c} x={0} y={ht - 17} z={0} />
          <CSSBox3D width={30} height={14} depth={30} color={shade(c, 5)} x={0} y={ht - 31} z={0} />
          <CSSBox3D width={18} height={12} depth={18} color={shade(c, 10)} x={0} y={ht - 43} z={0} />
          <CSSBox3D width={10} height={10} depth={10} color={shade(c, 15)} x={5} y={ht - 53} z={4} rotateZ={12} />
          {/* Star decoration */}
          <CSSBox3D width={8} height={8} depth={2} color="#FFD700" x={0} y={ht - 12} z={22} />
          <CSSBox3D width={5} height={5} depth={2} color="#FFF59D" x={12} y={ht - 20} z={21} />
        </>
      );

    // ── Crystal Tiara ──
    case "hat_tiara":
      return (
        <>
          {/* Base band on forehead */}
          <CSSBox3D width={52} height={5} depth={7} color={c} x={0} y={ht - 2} z={23} />
          {/* Center crystal */}
          <CSSBox3D width={7} height={18} depth={5} color="#E1F5FE" x={0} y={ht - 14} z={25} />
          {/* Side crystals */}
          <CSSBox3D width={6} height={14} depth={5} color="#F3E5F5" x={-11} y={ht - 11} z={25} />
          <CSSBox3D width={6} height={14} depth={5} color="#F3E5F5" x={11} y={ht - 11} z={25} />
          {/* Outer gems */}
          <CSSBox3D width={5} height={9} depth={4} color="#FCE4EC" x={-20} y={ht - 8} z={25} />
          <CSSBox3D width={5} height={9} depth={4} color="#FCE4EC" x={20} y={ht - 8} z={25} />
          {/* Gold filigree */}
          <CSSBox3D width={40} height={2} depth={2} color="#FFD700" x={0} y={ht - 4} z={24} />
        </>
      );

    // ── Royal Crown ──
    case "hat_crown":
      return (
        <>
          {/* Crown base ring */}
          <CSSBox3D width={52} height={10} depth={52} color={c} x={0} y={ht - 5} z={0} />
          {/* Red velvet inner */}
          <CSSBox3D width={46} height={7} depth={46} color="#C62828" x={0} y={ht - 4} z={0} />
          {/* Crown points */}
          <CSSBox3D width={9} height={18} depth={9} color={c} x={-18} y={ht - 19} z={0} />
          <CSSBox3D width={11} height={22} depth={11} color={c} x={0} y={ht - 21} z={0} />
          <CSSBox3D width={9} height={18} depth={9} color={c} x={18} y={ht - 19} z={0} />
          <CSSBox3D width={8} height={16} depth={9} color={c} x={0} y={ht - 18} z={20} />
          <CSSBox3D width={8} height={16} depth={9} color={c} x={0} y={ht - 18} z={-20} />
          {/* Jewels on base */}
          <CSSBox3D width={5} height={5} depth={2} color="#E53935" x={0} y={ht - 4} z={27} />
          <CSSBox3D width={4} height={4} depth={2} color="#2196F3" x={-14} y={ht - 4} z={27} />
          <CSSBox3D width={4} height={4} depth={2} color="#4CAF50" x={14} y={ht - 4} z={27} />
          {/* Pearl tips */}
          <CSSBox3D width={5} height={5} depth={5} color="#FFF8E1" x={-18} y={ht - 29} z={0} />
          <CSSBox3D width={6} height={6} depth={6} color="#FFF8E1" x={0} y={ht - 33} z={0} />
          <CSSBox3D width={5} height={5} depth={5} color="#FFF8E1" x={18} y={ht - 29} z={0} />
        </>
      );

    // ═══ GACHA HATS ═══

    case "gacha_hat_angel":
      return (
        <>
          <CSSBox3D width={52} height={5} depth={7} color="#FFD700" x={0} y={ht - 2} z={0} />
          <CSSBox3D width={14} height={16} depth={4} color={c} x={-22} y={ht - 13} z={0} rotateZ={-15} />
          <CSSBox3D width={8} height={10} depth={3} color={shade(c, 10)} x={-30} y={ht - 9} z={0} rotateZ={-25} />
          <CSSBox3D width={14} height={16} depth={4} color={c} x={22} y={ht - 13} z={0} rotateZ={15} />
          <CSSBox3D width={8} height={10} depth={3} color={shade(c, 10)} x={30} y={ht - 9} z={0} rotateZ={25} />
          <CSSBox3D width={28} height={3} depth={28} color="#FFD700" x={0} y={ht - 22} z={0} />
        </>
      );

    case "gacha_hat_devil":
      return (
        <>
          <CSSBox3D width={52} height={5} depth={7} color="#424242" x={0} y={ht - 2} z={0} />
          <CSSBox3D width={10} height={18} depth={10} color={c} x={-18} y={ht - 14} z={4} rotateZ={-10} />
          <CSSBox3D width={6} height={10} depth={6} color={shade(c, -15)} x={-20} y={ht - 27} z={4} rotateZ={-10} />
          <CSSBox3D width={10} height={18} depth={10} color={c} x={18} y={ht - 14} z={4} rotateZ={10} />
          <CSSBox3D width={6} height={10} depth={6} color={shade(c, -15)} x={20} y={ht - 27} z={4} rotateZ={10} />
          <CSSBox3D width={6} height={6} depth={3} color="#FF1744" x={0} y={ht - 6} z={25} />
        </>
      );

    case "gacha_hat_astronaut":
      return (
        <>
          {/* Helmet dome covers whole head */}
          <CSSBox3D width={62} height={60} depth={60} color={c} x={0} y={headY} z={0} />
          {/* Visor */}
          <CSSBox3D width={48} height={36} depth={4} color="#1A237E" x={0} y={headY + 2} z={32}
            faceOverrides={{
              front: "linear-gradient(135deg, #455A64 0%, #1A237E 40%, #311B92 70%, #263238 100%)",
            }}
          />
          {/* Antenna */}
          <CSSBox3D width={6} height={10} depth={6} color="#B0BEC5" x={28} y={ht - 10} z={0} />
          <CSSBox3D width={4} height={4} depth={4} color="#FF5252" x={28} y={ht - 17} z={0} />
        </>
      );

    case "gacha_hat_unicorn":
      return (
        <>
          <CSSBox3D width={52} height={5} depth={7} color={c} x={0} y={ht - 2} z={0} />
          {/* Horn stacking up from top of head */}
          <CSSBox3D width={11} height={14} depth={11} color="#FFD700" x={0} y={ht - 12} z={10} />
          <CSSBox3D width={8} height={12} depth={8} color="#FFF176" x={0} y={ht - 24} z={10} />
          <CSSBox3D width={5} height={10} depth={5} color="#FFEE58" x={0} y={ht - 34} z={10} />
          <CSSBox3D width={3} height={6} depth={3} color="#FFF9C4" x={0} y={ht - 42} z={10} />
          {/* Ear flowers */}
          <CSSBox3D width={10} height={10} depth={4} color="#F48FB1" x={-22} y={ht - 8} z={12} />
          <CSSBox3D width={6} height={6} depth={2} color="#FF80AB" x={-22} y={ht - 8} z={14} />
          <CSSBox3D width={8} height={8} depth={4} color="#CE93D8" x={22} y={ht - 7} z={12} />
        </>
      );

    default:
      return null;
  }
};

export default Hat3D;
