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

  const headTop = headY - 25;
  const c = hatColor;
  const cDark = shade(c, -12);
  const cLight = shade(c, 15);

  switch (hatId) {
    // ── Cute Beret — เบเรต์กลมน่ารัก ──
    case "hat_beret":
      return (
        <>
          {/* Flat round beret body */}
          <CSSBox3D width={50} height={10} depth={50} color={c} x={0} y={headTop - 6} z={2} />
          {/* Puffed top */}
          <CSSBox3D width={40} height={8} depth={40} color={cLight} x={-4} y={headTop - 12} z={2} />
          {/* Tiny stem on top */}
          <CSSBox3D width={6} height={6} depth={6} color={cDark} x={-4} y={headTop - 18} z={2} />
        </>
      );

    // ── Bucket Hat — หมวกบักเก็ตเท่ ──
    case "hat_bucket":
      return (
        <>
          {/* Crown */}
          <CSSBox3D width={50} height={20} depth={50} color={c} x={0} y={headTop - 12} z={0} />
          {/* Wide brim all around */}
          <CSSBox3D width={60} height={4} depth={60} color={cDark} x={0} y={headTop} z={0} />
          {/* Band detail */}
          <CSSBox3D width={52} height={4} depth={52} color={shade(c, -20)} x={0} y={headTop - 4} z={0} />
        </>
      );

    // ── Cozy Beanie — บีนนี่อุ่นๆ ──
    case "hat_beanie":
      return (
        <>
          {/* Main beanie */}
          <CSSBox3D width={52} height={20} depth={52} color={c} x={0} y={headTop - 12} z={0} />
          {/* Folded cuff */}
          <CSSBox3D width={54} height={8} depth={54} color={cDark} x={0} y={headTop} z={0} />
          {/* Ribbing texture line */}
          <CSSBox3D width={54} height={2} depth={54} color={shade(c, -8)} x={0} y={headTop - 2} z={0} />
          {/* Fluffy pom pom */}
          <CSSBox3D width={12} height={12} depth={12} color={cLight} x={0} y={headTop - 22} z={0} />
          <CSSBox3D width={8} height={8} depth={8} color={shade(c, 25)} x={2} y={headTop - 24} z={2} />
        </>
      );

    // ── Cat Ears — หูแมวคาวาอิ ──
    case "hat_catears":
      return (
        <>
          {/* Headband */}
          <CSSBox3D width={52} height={4} depth={6} color={shade(c, -30)} x={0} y={headTop - 2} z={0} />
          {/* Left ear outer */}
          <CSSBox3D width={14} height={18} depth={6} color={c} x={-18} y={headTop - 16} z={4} rotateZ={-10} />
          {/* Left ear inner (pink) */}
          <CSSBox3D width={8} height={12} depth={3} color="#FFB6C1" x={-18} y={headTop - 14} z={6} rotateZ={-10} />
          {/* Right ear outer */}
          <CSSBox3D width={14} height={18} depth={6} color={c} x={18} y={headTop - 16} z={4} rotateZ={10} />
          {/* Right ear inner (pink) */}
          <CSSBox3D width={8} height={12} depth={3} color="#FFB6C1" x={18} y={headTop - 14} z={6} rotateZ={10} />
        </>
      );

    // ── Bunny Ears — หูกระต่ายยาว ──
    case "hat_bunnyears":
      return (
        <>
          {/* Headband */}
          <CSSBox3D width={52} height={4} depth={6} color="#FFD1DC" x={0} y={headTop - 2} z={0} />
          {/* Left ear */}
          <CSSBox3D width={10} height={34} depth={6} color={c} x={-14} y={headTop - 28} z={4} rotateZ={-8} />
          <CSSBox3D width={6} height={26} depth={3} color="#FFB6C1" x={-14} y={headTop - 24} z={6} rotateZ={-8} />
          {/* Right ear (floppy) */}
          <CSSBox3D width={10} height={28} depth={6} color={c} x={14} y={headTop - 24} z={4} rotateZ={8} />
          <CSSBox3D width={10} height={16} depth={6} color={c} x={22} y={headTop - 10} z={4} rotateZ={40} />
          <CSSBox3D width={6} height={22} depth={3} color="#FFB6C1" x={14} y={headTop - 22} z={6} rotateZ={8} />
        </>
      );

    // ── Flower Crown — มงกุฎดอกไม้ ──
    case "hat_flowerband":
      return (
        <>
          {/* Green vine band */}
          <CSSBox3D width={54} height={6} depth={54} color="#81C784" x={0} y={headTop - 4} z={0} />
          {/* Flowers around */}
          <CSSBox3D width={8} height={8} depth={6} color="#FF69B4" x={0} y={headTop - 10} z={26} />
          <CSSBox3D width={7} height={7} depth={6} color="#FFD54F" x={-20} y={headTop - 10} z={18} />
          <CSSBox3D width={8} height={8} depth={6} color="#E1BEE7" x={20} y={headTop - 10} z={18} />
          <CSSBox3D width={7} height={7} depth={6} color="#FF8A65" x={-16} y={headTop - 10} z={-16} />
          <CSSBox3D width={6} height={6} depth={6} color="#81D4FA" x={16} y={headTop - 10} z={-16} />
          {/* Center dots (pistils) */}
          <CSSBox3D width={3} height={3} depth={2} color="#FFF9C4" x={0} y={headTop - 10} z={28} />
          <CSSBox3D width={3} height={3} depth={2} color="#FFF9C4" x={-20} y={headTop - 10} z={20} />
        </>
      );

    // ── Neon Headphones — หูฟังเรืองแสง ──
    case "hat_headphones":
      return (
        <>
          {/* Headband */}
          <CSSBox3D width={54} height={6} depth={8} color="#263238" x={0} y={headTop - 8} z={0} />
          {/* Left ear cup */}
          <CSSBox3D width={8} height={18} depth={18} color="#37474F" x={-30} y={headTop + 6} z={0} />
          <CSSBox3D width={4} height={12} depth={12} color={c} x={-33} y={headTop + 6} z={0} />
          {/* Left neon glow ring */}
          <CSSBox3D width={2} height={14} depth={14} color={shade(c, 30)} x={-34} y={headTop + 6} z={0}
            faceOverrides={{ left: `0 0 8px ${c}, 0 0 16px ${c}` }}
          />
          {/* Right ear cup */}
          <CSSBox3D width={8} height={18} depth={18} color="#37474F" x={30} y={headTop + 6} z={0} />
          <CSSBox3D width={4} height={12} depth={12} color={c} x={33} y={headTop + 6} z={0} />
          <CSSBox3D width={2} height={14} depth={14} color={shade(c, 30)} x={34} y={headTop + 6} z={0} />
          {/* Cushion pads */}
          <CSSBox3D width={4} height={14} depth={14} color="#546E7A" x={-27} y={headTop + 6} z={0} />
          <CSSBox3D width={4} height={14} depth={14} color="#546E7A" x={27} y={headTop + 6} z={0} />
        </>
      );

    // ── Star Witch Hat — หมวกแม่มดดาว ──
    case "hat_witch":
      return (
        <>
          {/* Wide brim */}
          <CSSBox3D width={62} height={4} depth={62} color={c} x={0} y={headTop - 2} z={0} />
          {/* Brim edge glow */}
          <CSSBox3D width={64} height={2} depth={64} color={shade(c, 15)} x={0} y={headTop} z={0} />
          {/* Cone layers */}
          <CSSBox3D width={40} height={16} depth={40} color={c} x={0} y={headTop - 16} z={0} />
          <CSSBox3D width={28} height={14} depth={28} color={shade(c, 5)} x={0} y={headTop - 28} z={0} />
          <CSSBox3D width={16} height={12} depth={16} color={shade(c, 10)} x={0} y={headTop - 38} z={0} />
          {/* Tip bends */}
          <CSSBox3D width={10} height={10} depth={10} color={shade(c, 15)} x={6} y={headTop - 46} z={4} rotateZ={15} />
          {/* Star decoration */}
          <CSSBox3D width={8} height={8} depth={2} color="#FFD700" x={0} y={headTop - 10} z={21} />
          {/* Moon accent */}
          <CSSBox3D width={5} height={5} depth={2} color="#FFF59D" x={12} y={headTop - 18} z={20} />
          {/* Band ribbon */}
          <CSSBox3D width={42} height={4} depth={42} color="#FFD700" x={0} y={headTop - 4} z={0} />
        </>
      );

    // ── Crystal Tiara — มงกุฎคริสตัลวิบวับ ──
    case "hat_tiara":
      return (
        <>
          {/* Base band */}
          <CSSBox3D width={50} height={4} depth={6} color={c} x={0} y={headTop - 2} z={22} />
          {/* Center crystal (tall) */}
          <CSSBox3D width={6} height={16} depth={4} color="#E1F5FE" x={0} y={headTop - 14} z={24} />
          {/* Side crystals */}
          <CSSBox3D width={5} height={12} depth={4} color="#F3E5F5" x={-10} y={headTop - 10} z={24} />
          <CSSBox3D width={5} height={12} depth={4} color="#F3E5F5" x={10} y={headTop - 10} z={24} />
          {/* Outer small gems */}
          <CSSBox3D width={4} height={8} depth={3} color="#FCE4EC" x={-18} y={headTop - 8} z={24} />
          <CSSBox3D width={4} height={8} depth={3} color="#FCE4EC" x={18} y={headTop - 8} z={24} />
          {/* Gold filigree connecting */}
          <CSSBox3D width={38} height={2} depth={2} color="#FFD700" x={0} y={headTop - 4} z={23} />
        </>
      );

    // ── Royal Crown — มงกุฎราชาสุดหรู ──
    case "hat_crown":
      return (
        <>
          {/* Crown base */}
          <CSSBox3D width={50} height={10} depth={50} color={c} x={0} y={headTop - 8} z={0} />
          {/* Red velvet inner */}
          <CSSBox3D width={44} height={6} depth={44} color="#C62828" x={0} y={headTop - 6} z={0} />
          {/* Crown points */}
          <CSSBox3D width={8} height={16} depth={8} color={c} x={-18} y={headTop - 22} z={0} />
          <CSSBox3D width={10} height={20} depth={10} color={c} x={0} y={headTop - 24} z={0} />
          <CSSBox3D width={8} height={16} depth={8} color={c} x={18} y={headTop - 22} z={0} />
          <CSSBox3D width={7} height={14} depth={8} color={c} x={0} y={headTop - 20} z={18} />
          <CSSBox3D width={7} height={14} depth={8} color={c} x={0} y={headTop - 20} z={-18} />
          {/* Jewels */}
          <CSSBox3D width={5} height={5} depth={2} color="#E53935" x={0} y={headTop - 6} z={26} />
          <CSSBox3D width={4} height={4} depth={2} color="#2196F3" x={-14} y={headTop - 6} z={26} />
          <CSSBox3D width={4} height={4} depth={2} color="#4CAF50" x={14} y={headTop - 6} z={26} />
          {/* Pearl tips */}
          <CSSBox3D width={4} height={4} depth={4} color="#FFF8E1" x={-18} y={headTop - 30} z={0} />
          <CSSBox3D width={5} height={5} depth={5} color="#FFF8E1" x={0} y={headTop - 34} z={0} />
          <CSSBox3D width={4} height={4} depth={4} color="#FFF8E1" x={18} y={headTop - 30} z={0} />
        </>
      );

    // ═══ GACHA HATS ═══

    // ── Angel Wing Band — คาดผมปีกเทวดา ──
    case "gacha_hat_angel":
      return (
        <>
          {/* Golden headband */}
          <CSSBox3D width={52} height={4} depth={6} color="#FFD700" x={0} y={headTop - 2} z={0} />
          {/* Left mini wing */}
          <CSSBox3D width={14} height={16} depth={4} color={c} x={-22} y={headTop - 14} z={0} rotateZ={-15} />
          <CSSBox3D width={8} height={10} depth={3} color={shade(c, 10)} x={-30} y={headTop - 10} z={0} rotateZ={-25} />
          {/* Right mini wing */}
          <CSSBox3D width={14} height={16} depth={4} color={c} x={22} y={headTop - 14} z={0} rotateZ={15} />
          <CSSBox3D width={8} height={10} depth={3} color={shade(c, 10)} x={30} y={headTop - 10} z={0} rotateZ={25} />
          {/* Tiny halo floating above */}
          <CSSBox3D width={28} height={3} depth={28} color="#FFD700" x={0} y={headTop - 22} z={0} />
        </>
      );

    // ── Cute Devil Horns — เขาปีศาจน่ารัก ──
    case "gacha_hat_devil":
      return (
        <>
          {/* Headband */}
          <CSSBox3D width={52} height={4} depth={6} color="#424242" x={0} y={headTop - 2} z={0} />
          {/* Left horn (cute rounded) */}
          <CSSBox3D width={10} height={16} depth={10} color={c} x={-18} y={headTop - 16} z={4} rotateZ={-10} />
          <CSSBox3D width={6} height={10} depth={6} color={shade(c, -15)} x={-20} y={headTop - 26} z={4} rotateZ={-10} />
          {/* Right horn */}
          <CSSBox3D width={10} height={16} depth={10} color={c} x={18} y={headTop - 16} z={4} rotateZ={10} />
          <CSSBox3D width={6} height={10} depth={6} color={shade(c, -15)} x={20} y={headTop - 26} z={4} rotateZ={10} />
          {/* Heart accent between horns */}
          <CSSBox3D width={6} height={6} depth={3} color="#FF1744" x={0} y={headTop - 8} z={24} />
        </>
      );

    // ── Space Helmet — หมวกอวกาศ ──
    case "gacha_hat_astronaut":
      return (
        <>
          {/* Helmet dome */}
          <CSSBox3D width={60} height={58} depth={58} color={c} x={0} y={headY - 2} z={0} />
          {/* Visor (dark reflective front) */}
          <CSSBox3D width={46} height={34} depth={4} color="#1A237E" x={0} y={headY} z={30}
            faceOverrides={{
              front: "linear-gradient(135deg, #455A64 0%, #1A237E 40%, #311B92 70%, #263238 100%)",
            }}
          />
          {/* Side antenna nub */}
          <CSSBox3D width={6} height={10} depth={6} color="#B0BEC5" x={28} y={headY - 28} z={0} />
          <CSSBox3D width={4} height={4} depth={4} color="#FF5252" x={28} y={headY - 34} z={0} />
        </>
      );

    // ── Unicorn Horn — เขายูนิคอร์น ──
    case "gacha_hat_unicorn":
      return (
        <>
          {/* Headband with flower */}
          <CSSBox3D width={52} height={4} depth={6} color={c} x={0} y={headTop - 2} z={0} />
          {/* Horn (spiraling layers) */}
          <CSSBox3D width={10} height={14} depth={10} color="#FFD700" x={0} y={headTop - 14} z={10} />
          <CSSBox3D width={8} height={12} depth={8} color="#FFF176" x={0} y={headTop - 24} z={10} />
          <CSSBox3D width={5} height={10} depth={5} color="#FFEE58" x={0} y={headTop - 34} z={10} />
          <CSSBox3D width={3} height={6} depth={3} color="#FFF9C4" x={0} y={headTop - 40} z={10} />
          {/* Left ear flower */}
          <CSSBox3D width={10} height={10} depth={4} color="#F48FB1" x={-22} y={headTop - 10} z={12} />
          <CSSBox3D width={6} height={6} depth={2} color="#FF80AB" x={-22} y={headTop - 10} z={14} />
          {/* Right ear flower */}
          <CSSBox3D width={8} height={8} depth={4} color="#CE93D8" x={22} y={headTop - 8} z={12} />
        </>
      );

    default:
      return null;
  }
};

export default Hat3D;
