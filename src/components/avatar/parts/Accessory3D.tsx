import React from "react";
import CSSBox3D from "../CSSBox3D";
import { shade } from "../colorUtils";

interface Accessory3DProps {
  accId: string | null;
  accColor: string;
  headY: number;
  torsoY: number;
}

const Accessory3D: React.FC<Accessory3DProps> = ({ accId, accColor, headY, torsoY }) => {
  if (!accId) return null;

  const c = accColor;
  const cDark = shade(c, -15);
  const cLight = shade(c, 15);

  switch (accId) {
    // ── Silk Bow — โบว์ผ้าไหมหลังหัว ──
    case "acc_bow":
      return (
        <>
          {/* Left ribbon wing */}
          <CSSBox3D width={14} height={10} depth={6} color={c} x={-10} y={headY - 18} z={-22} rotateZ={-15} />
          {/* Right ribbon wing */}
          <CSSBox3D width={14} height={10} depth={6} color={c} x={10} y={headY - 18} z={-22} rotateZ={15} />
          {/* Center knot */}
          <CSSBox3D width={6} height={6} depth={6} color={cDark} x={0} y={headY - 18} z={-22} />
          {/* Trailing ribbon tails */}
          <CSSBox3D width={4} height={14} depth={4} color={cLight} x={-6} y={headY - 8} z={-24} rotateZ={-10} />
          <CSSBox3D width={4} height={14} depth={4} color={cLight} x={6} y={headY - 8} z={-24} rotateZ={10} />
        </>
      );

    // ── Heart Pendant — จี้หัวใจ ──
    case "acc_necklace":
      return (
        <>
          {/* Chain around neck */}
          <CSSBox3D width={22} height={2} depth={2} color={c} x={0} y={torsoY - 24} z={14} />
          {/* Heart pendant */}
          <CSSBox3D width={6} height={6} depth={3} color="#FF4081" x={0} y={torsoY - 20} z={15} />
          <CSSBox3D width={4} height={4} depth={3} color="#FF1744" x={0} y={torsoY - 22} z={15} />
          {/* Sparkle */}
          <CSSBox3D width={2} height={2} depth={1} color="#FFF" x={2} y={torsoY - 22} z={17} />
        </>
      );

    // ── Tiny Teddy — ตุ๊กตาหมีจิ๋ว ──
    case "acc_teddy":
      return (
        <>
          {/* Teddy body (held at side) */}
          <CSSBox3D width={12} height={14} depth={10} color={c} x={32} y={torsoY + 16} z={10} />
          {/* Teddy head */}
          <CSSBox3D width={10} height={10} depth={10} color={c} x={32} y={torsoY + 6} z={12} />
          {/* Ears */}
          <CSSBox3D width={4} height={4} depth={4} color={cDark} x={27} y={torsoY + 2} z={12} />
          <CSSBox3D width={4} height={4} depth={4} color={cDark} x={37} y={torsoY + 2} z={12} />
          {/* Snout */}
          <CSSBox3D width={6} height={4} depth={4} color={cLight} x={32} y={torsoY + 8} z={18} />
          {/* Nose */}
          <CSSBox3D width={2} height={2} depth={2} color="#5D4037" x={32} y={torsoY + 7} z={20} />
          {/* Eyes */}
          <CSSBox3D width={2} height={2} depth={1} color="#1A1A1A" x={29} y={torsoY + 4} z={18} />
          <CSSBox3D width={2} height={2} depth={1} color="#1A1A1A" x={35} y={torsoY + 4} z={18} />
          {/* Bow tie */}
          <CSSBox3D width={6} height={3} depth={3} color="#FF4081" x={32} y={torsoY + 12} z={16} />
        </>
      );

    // ── Fluffy Scarf — ผ้าพันคอฟู ──
    case "acc_scarf":
      return (
        <>
          {/* Scarf wrap around neck */}
          <CSSBox3D width={44} height={10} depth={32} color={c} x={0} y={torsoY - 26} z={0} />
          {/* Front drape left */}
          <CSSBox3D width={10} height={20} depth={8} color={c} x={-10} y={torsoY - 18} z={14} />
          {/* Front drape right (shorter) */}
          <CSSBox3D width={10} height={14} depth={8} color={cLight} x={10} y={torsoY - 18} z={14} />
          {/* Fringe at ends */}
          <CSSBox3D width={10} height={4} depth={8} color={cDark} x={-10} y={torsoY - 2} z={14} />
        </>
      );

    // ── Star Bag — กระเป๋าดาว ──
    case "acc_bag":
      return (
        <>
          {/* Strap across body */}
          <CSSBox3D width={3} height={40} depth={4} color={cDark} x={-8} y={torsoY - 18} z={8} rotateZ={-20} />
          {/* Bag body at hip */}
          <CSSBox3D width={18} height={16} depth={8} color={c} x={18} y={torsoY + 16} z={10} />
          {/* Star decoration on bag */}
          <CSSBox3D width={8} height={8} depth={2} color="#FFD700" x={18} y={torsoY + 14} z={15} />
          {/* Flap */}
          <CSSBox3D width={18} height={6} depth={9} color={cDark} x={18} y={torsoY + 8} z={10} />
          {/* Clasp */}
          <CSSBox3D width={4} height={3} depth={2} color="#FFD700" x={18} y={torsoY + 12} z={15} />
        </>
      );

    // ── Fairy Wings — ปีกนางฟ้าใส ──
    case "acc_fairy_wings":
      return (
        <>
          {/* Left upper wing */}
          <CSSBox3D width={28} height={30} depth={3} color={c} x={-34} y={torsoY - 14} z={-8}
            rotateY={20} rotateZ={-5}
            faceOverrides={{
              front: `linear-gradient(135deg, rgba(178,235,242,0.7), rgba(225,190,231,0.5))`,
              back: `linear-gradient(135deg, rgba(178,235,242,0.5), rgba(225,190,231,0.3))`,
            }}
          />
          {/* Left lower wing */}
          <CSSBox3D width={18} height={20} depth={3} color={shade(c, -10)} x={-38} y={torsoY + 10} z={-10}
            rotateY={25} rotateZ={-10}
            faceOverrides={{
              front: `linear-gradient(135deg, rgba(225,190,231,0.6), rgba(178,235,242,0.4))`,
            }}
          />
          {/* Right upper wing */}
          <CSSBox3D width={28} height={30} depth={3} color={c} x={34} y={torsoY - 14} z={-8}
            rotateY={-20} rotateZ={5}
            faceOverrides={{
              front: `linear-gradient(225deg, rgba(178,235,242,0.7), rgba(225,190,231,0.5))`,
              back: `linear-gradient(225deg, rgba(178,235,242,0.5), rgba(225,190,231,0.3))`,
            }}
          />
          {/* Right lower wing */}
          <CSSBox3D width={18} height={20} depth={3} color={shade(c, -10)} x={38} y={torsoY + 10} z={-10}
            rotateY={-25} rotateZ={10}
            faceOverrides={{
              front: `linear-gradient(225deg, rgba(225,190,231,0.6), rgba(178,235,242,0.4))`,
            }}
          />
          {/* Wing sparkle center */}
          <CSSBox3D width={4} height={4} depth={3} color="#FFF9C4" x={0} y={torsoY - 8} z={-10} />
        </>
      );

    // ── Magic Wand — ไม้กายสิทธิ์ ──
    case "acc_wand":
      return (
        <>
          {/* Wand shaft */}
          <CSSBox3D width={3} height={36} depth={3} color="#F8BBD0" x={-36} y={torsoY - 10} z={8} rotateZ={15} />
          {/* Wand grip */}
          <CSSBox3D width={4} height={10} depth={4} color="#CE93D8" x={-36} y={torsoY + 16} z={8} rotateZ={15} />
          {/* Star topper */}
          <CSSBox3D width={10} height={10} depth={4} color={c} x={-32} y={torsoY - 28} z={8} />
          <CSSBox3D width={6} height={6} depth={4} color="#FFF9C4" x={-32} y={torsoY - 28} z={10} />
          {/* Sparkle particles around star */}
          <CSSBox3D width={3} height={3} depth={2} color="#FFF176" x={-26} y={torsoY - 32} z={10} />
          <CSSBox3D width={2} height={2} depth={2} color="#FFF176" x={-38} y={torsoY - 24} z={10} />
          <CSSBox3D width={2} height={2} depth={2} color="#FFD54F" x={-30} y={torsoY - 20} z={10} />
        </>
      );

    // ── Star Halo — วงแหวนดาวลอย ──
    case "acc_halo_stars":
      return (
        <>
          {/* Halo ring */}
          <CSSBox3D width={44} height={3} depth={44} color={c} x={0} y={headY - 38} z={0}
            faceOverrides={{
              top: "linear-gradient(135deg, #FFD700, #FFF9C4, #FFD700)",
            }}
          />
          {/* Orbiting stars */}
          <CSSBox3D width={6} height={6} depth={3} color="#FFF176" x={22} y={headY - 40} z={0} />
          <CSSBox3D width={5} height={5} depth={3} color="#FFF9C4" x={-22} y={headY - 40} z={0} />
          <CSSBox3D width={5} height={5} depth={3} color="#FFD54F" x={0} y={headY - 40} z={22} />
          <CSSBox3D width={4} height={4} depth={3} color="#FFF176" x={0} y={headY - 40} z={-22} />
          {/* Tiny twinkle above */}
          <CSSBox3D width={3} height={3} depth={2} color="#FFFFFF" x={14} y={headY - 44} z={14} />
          <CSSBox3D width={2} height={2} depth={2} color="#FFFFFF" x={-14} y={headY - 44} z={-14} />
        </>
      );

    // ═══════════════════════════════
    // GACHA ACCESSORIES
    // ═══════════════════════════════

    // ── Spirit Cat — แมววิญญาณเรืองแสง ──
    case "gacha_acc_spirit_cat":
      return (
        <>
          {/* Cat body (translucent spirit) */}
          <CSSBox3D width={14} height={10} depth={10} color={c} x={30} y={torsoY + 22} z={6} />
          {/* Cat head */}
          <CSSBox3D width={12} height={12} depth={10} color={c} x={30} y={torsoY + 12} z={8} />
          {/* Pointed ears */}
          <CSSBox3D width={4} height={6} depth={3} color={cLight} x={25} y={torsoY + 6} z={8} />
          <CSSBox3D width={4} height={6} depth={3} color={cLight} x={35} y={torsoY + 6} z={8} />
          {/* Inner ears */}
          <CSSBox3D width={2} height={3} depth={2} color="#F8BBD0" x={25} y={torsoY + 7} z={9} />
          <CSSBox3D width={2} height={3} depth={2} color="#F8BBD0" x={35} y={torsoY + 7} z={9} />
          {/* Eyes (glowing) */}
          <CSSBox3D width={3} height={2} depth={2} color="#FFF176" x={27} y={torsoY + 12} z={14} />
          <CSSBox3D width={3} height={2} depth={2} color="#FFF176" x={33} y={torsoY + 12} z={14} />
          {/* Curly tail */}
          <CSSBox3D width={3} height={10} depth={3} color={cLight} x={22} y={torsoY + 18} z={2} rotateZ={-25} />
          <CSSBox3D width={3} height={6} depth={3} color={cLight} x={18} y={torsoY + 14} z={2} rotateZ={-50} />
        </>
      );

    // ── Spirit Dog — หมาวิญญาณ ──
    case "gacha_acc_spirit_dog":
      return (
        <>
          {/* Dog body */}
          <CSSBox3D width={16} height={12} depth={12} color={c} x={32} y={torsoY + 20} z={6} />
          {/* Dog head */}
          <CSSBox3D width={14} height={14} depth={12} color={c} x={32} y={torsoY + 10} z={10} />
          {/* Snout */}
          <CSSBox3D width={8} height={6} depth={6} color={cLight} x={32} y={torsoY + 14} z={18} />
          {/* Nose */}
          <CSSBox3D width={3} height={3} depth={2} color="#1A1A1A" x={32} y={torsoY + 12} z={20} />
          {/* Floppy ears */}
          <CSSBox3D width={6} height={10} depth={4} color={shade(c, -10)} x={25} y={torsoY + 10} z={10} />
          <CSSBox3D width={6} height={10} depth={4} color={shade(c, -10)} x={39} y={torsoY + 10} z={10} />
          {/* Eyes */}
          <CSSBox3D width={3} height={3} depth={2} color="#FFF176" x={28} y={torsoY + 10} z={16} />
          <CSSBox3D width={3} height={3} depth={2} color="#FFF176" x={36} y={torsoY + 10} z={16} />
          {/* Wagging tail */}
          <CSSBox3D width={3} height={12} depth={3} color={cLight} x={22} y={torsoY + 14} z={2} rotateZ={-35} />
        </>
      );

    // ── Moon Bunny — กระต่ายพระจันทร์ ──
    case "gacha_acc_moon_bunny":
      return (
        <>
          {/* Bunny body */}
          <CSSBox3D width={12} height={12} depth={10} color={c} x={-32} y={torsoY + 20} z={6} />
          {/* Bunny head */}
          <CSSBox3D width={10} height={10} depth={10} color={c} x={-32} y={torsoY + 10} z={8} />
          {/* Long ears */}
          <CSSBox3D width={4} height={14} depth={3} color={c} x={-36} y={torsoY - 2} z={8} />
          <CSSBox3D width={4} height={14} depth={3} color={c} x={-28} y={torsoY - 2} z={8} />
          {/* Inner ears */}
          <CSSBox3D width={2} height={10} depth={2} color="#FFB6C1" x={-36} y={torsoY} z={9} />
          <CSSBox3D width={2} height={10} depth={2} color="#FFB6C1" x={-28} y={torsoY} z={9} />
          {/* Eyes */}
          <CSSBox3D width={2} height={3} depth={2} color="#E91E63" x={-35} y={torsoY + 10} z={14} />
          <CSSBox3D width={2} height={3} depth={2} color="#E91E63" x={-29} y={torsoY + 10} z={14} />
          {/* Fluffy tail */}
          <CSSBox3D width={6} height={6} depth={6} color="#FFFFFF" x={-32} y={torsoY + 24} z={0} />
          {/* Moon crescent nearby */}
          <CSSBox3D width={8} height={8} depth={3} color="#FFF9C4" x={-40} y={torsoY + 4} z={12} />
        </>
      );

    // ── Crystal Blade — ดาบคริสตัล ──
    case "gacha_acc_crystal_blade":
      return (
        <>
          {/* Crystal blade */}
          <CSSBox3D width={4} height={40} depth={2} color={c} x={-36} y={torsoY - 14} z={4}
            faceOverrides={{
              front: `linear-gradient(180deg, #E1F5FE 0%, ${c} 40%, #B3E5FC 80%, #E0F7FA 100%)`,
              left: `linear-gradient(180deg, rgba(179,229,252,0.8), rgba(128,222,234,0.6))`,
              right: `linear-gradient(180deg, rgba(179,229,252,0.8), rgba(128,222,234,0.6))`,
            }}
          />
          {/* Blade tip */}
          <CSSBox3D width={3} height={8} depth={2} color="#E1F5FE" x={-36} y={torsoY - 36} z={4} />
          {/* Crystal guard */}
          <CSSBox3D width={16} height={4} depth={6} color="#CE93D8" x={-36} y={torsoY + 8} z={4} />
          {/* Handle */}
          <CSSBox3D width={4} height={12} depth={4} color="#7B1FA2" x={-36} y={torsoY + 18} z={4} />
          {/* Pommel gem */}
          <CSSBox3D width={6} height={5} depth={6} color="#E040FB" x={-36} y={torsoY + 26} z={4} />
          {/* Glow particles */}
          <CSSBox3D width={2} height={2} depth={2} color="#E1F5FE" x={-32} y={torsoY - 20} z={8} />
          <CSSBox3D width={2} height={2} depth={2} color="#B3E5FC" x={-40} y={torsoY - 10} z={8} />
        </>
      );

    // ── Starlight Shield — โล่แสงดาว ──
    case "gacha_acc_star_shield":
      return (
        <>
          {/* Shield body */}
          <CSSBox3D width={24} height={28} depth={4} color={c} x={36} y={torsoY - 4} z={6}
            faceOverrides={{
              front: `radial-gradient(circle at 50% 40%, ${cLight} 20%, ${c} 60%, ${shade(c, -20)} 100%)`,
            }}
          />
          {/* Shield border */}
          <CSSBox3D width={26} height={30} depth={3} color={shade(c, -20)} x={36} y={torsoY - 4} z={5} />
          {/* Star center emblem */}
          <CSSBox3D width={10} height={10} depth={2} color="#FFD700" x={36} y={torsoY - 6} z={9} />
          <CSSBox3D width={6} height={6} depth={2} color="#FFF9C4" x={36} y={torsoY - 6} z={10} />
          {/* Corner gems */}
          <CSSBox3D width={3} height={3} depth={2} color="#E040FB" x={28} y={torsoY - 14} z={9} />
          <CSSBox3D width={3} height={3} depth={2} color="#4FC3F7" x={44} y={torsoY - 14} z={9} />
        </>
      );

    default:
      return null;
  }
};

export default Accessory3D;
