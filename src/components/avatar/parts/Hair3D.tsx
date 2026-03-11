import React from "react";
import CSSBox3D from "../CSSBox3D";
import { shade } from "../colorUtils";

interface Hair3DProps {
  hairStyle: string;
  hairColor: string;
  headY: number;
}

const Hair3D: React.FC<Hair3DProps> = ({ hairStyle, hairColor, headY }) => {
  const headTop = headY - 25;
  const hc = hairColor;
  const hcDark = shade(hc, -12);
  const hcLight = shade(hc, 12);

  switch (hairStyle) {
    // ── Soft Bob — บ๊อบนุ่มโค้งมน ──
    case "softbob":
      return (
        <>
          {/* Rounded top cap */}
          <CSSBox3D width={54} height={12} depth={54} color={hc} x={0} y={headTop - 4} z={0} />
          {/* Left side bob */}
          <CSSBox3D width={8} height={24} depth={16} color={hc} x={-28} y={headTop + 8} z={6} />
          {/* Right side bob */}
          <CSSBox3D width={8} height={24} depth={16} color={hc} x={28} y={headTop + 8} z={6} />
          {/* Back volume */}
          <CSSBox3D width={50} height={16} depth={6} color={hcDark} x={0} y={headTop + 6} z={-26} />
          {/* Fringe / bangs */}
          <CSSBox3D width={46} height={8} depth={6} color={hcLight} x={0} y={headTop + 2} z={26} />
        </>
      );

    // ── Silky Long — ผมยาวเรียบสลวย ──
    case "silkylong":
      return (
        <>
          <CSSBox3D width={54} height={12} depth={54} color={hc} x={0} y={headTop - 4} z={0} />
          {/* Long left drape */}
          <CSSBox3D width={8} height={48} depth={14} color={hc} x={-28} y={headTop + 18} z={8} />
          <CSSBox3D width={6} height={36} depth={10} color={hcDark} x={-28} y={headTop + 30} z={8} />
          {/* Long right drape */}
          <CSSBox3D width={8} height={48} depth={14} color={hc} x={28} y={headTop + 18} z={8} />
          <CSSBox3D width={6} height={36} depth={10} color={hcDark} x={28} y={headTop + 30} z={8} />
          {/* Flowing back */}
          <CSSBox3D width={50} height={44} depth={6} color={hc} x={0} y={headTop + 16} z={-28} />
          <CSSBox3D width={44} height={34} depth={4} color={hcDark} x={0} y={headTop + 26} z={-30} />
          {/* Side-swept bangs */}
          <CSSBox3D width={30} height={10} depth={6} color={hcLight} x={-8} y={headTop + 2} z={26} />
        </>
      );

    // ── Twin Tails — ผมสองหาง kawaii ──
    case "twintails":
      return (
        <>
          <CSSBox3D width={54} height={12} depth={54} color={hc} x={0} y={headTop - 4} z={0} />
          {/* Left pigtail */}
          <CSSBox3D width={10} height={42} depth={12} color={hc} x={-28} y={headTop + 14} z={0} />
          <CSSBox3D width={8} height={30} depth={10} color={hcDark} x={-28} y={headTop + 28} z={0} />
          {/* Right pigtail */}
          <CSSBox3D width={10} height={42} depth={12} color={hc} x={28} y={headTop + 14} z={0} />
          <CSSBox3D width={8} height={30} depth={10} color={hcDark} x={28} y={headTop + 28} z={0} />
          {/* Ribbons */}
          <CSSBox3D width={14} height={6} depth={6} color="#FF4081" x={-28} y={headTop + 2} z={0} />
          <CSSBox3D width={14} height={6} depth={6} color="#FF4081" x={28} y={headTop + 2} z={0} />
          {/* Cute bangs */}
          <CSSBox3D width={44} height={10} depth={6} color={hcLight} x={0} y={headTop + 2} z={26} />
        </>
      );

    // ── Beach Waves — ผมลอนเป็นคลื่น ──
    case "wavy":
      return (
        <>
          <CSSBox3D width={56} height={14} depth={56} color={hc} x={0} y={headTop - 5} z={0} />
          {/* Wavy left */}
          <CSSBox3D width={10} height={14} depth={14} color={hc} x={-28} y={headTop + 8} z={8} />
          <CSSBox3D width={12} height={12} depth={14} color={hcLight} x={-30} y={headTop + 20} z={6} />
          <CSSBox3D width={10} height={14} depth={12} color={hc} x={-28} y={headTop + 32} z={8} />
          {/* Wavy right */}
          <CSSBox3D width={10} height={14} depth={14} color={hc} x={28} y={headTop + 8} z={8} />
          <CSSBox3D width={12} height={12} depth={14} color={hcLight} x={30} y={headTop + 20} z={6} />
          <CSSBox3D width={10} height={14} depth={12} color={hc} x={28} y={headTop + 32} z={8} />
          {/* Wavy back */}
          <CSSBox3D width={52} height={36} depth={8} color={hcDark} x={0} y={headTop + 12} z={-26} />
          {/* Soft bangs */}
          <CSSBox3D width={48} height={12} depth={6} color={hcLight} x={0} y={headTop + 2} z={26} />
        </>
      );

    // ── Messy Cute — ผมยุ่งน่ารัก ──
    case "messy":
      return (
        <>
          <CSSBox3D width={56} height={14} depth={56} color={hc} x={0} y={headTop - 5} z={0} />
          {/* Messy tufts sticking up */}
          <CSSBox3D width={10} height={12} depth={8} color={hcLight} x={-14} y={headTop - 14} z={6} rotateZ={-12} />
          <CSSBox3D width={8} height={14} depth={8} color={hc} x={6} y={headTop - 16} z={2} rotateZ={5} />
          <CSSBox3D width={10} height={10} depth={8} color={hcLight} x={18} y={headTop - 12} z={-4} rotateZ={10} />
          {/* Fluffy sides */}
          <CSSBox3D width={10} height={20} depth={16} color={hc} x={-28} y={headTop + 6} z={6} />
          <CSSBox3D width={10} height={20} depth={16} color={hc} x={28} y={headTop + 6} z={6} />
          {/* Messy bangs */}
          <CSSBox3D width={22} height={12} depth={6} color={hcLight} x={-10} y={headTop + 2} z={26} />
          <CSSBox3D width={18} height={10} depth={6} color={hc} x={12} y={headTop + 4} z={26} />
          {/* Back fluff */}
          <CSSBox3D width={50} height={18} depth={8} color={hcDark} x={0} y={headTop + 6} z={-26} />
        </>
      );

    // ── High Ponytail — หางม้าสูงเก๋ ──
    case "highpony":
      return (
        <>
          <CSSBox3D width={54} height={12} depth={54} color={hc} x={0} y={headTop - 4} z={0} />
          {/* Ponytail base (high) */}
          <CSSBox3D width={14} height={10} depth={14} color={hc} x={0} y={headTop - 14} z={-6} />
          {/* Flowing ponytail down */}
          <CSSBox3D width={12} height={36} depth={10} color={hc} x={0} y={headTop + 4} z={-28} />
          <CSSBox3D width={10} height={26} depth={8} color={hcDark} x={0} y={headTop + 14} z={-30} />
          {/* Scrunchie */}
          <CSSBox3D width={16} height={6} depth={16} color="#FF80AB" x={0} y={headTop - 12} z={-6} />
          {/* Side-swept bangs */}
          <CSSBox3D width={36} height={10} depth={6} color={hcLight} x={-6} y={headTop + 2} z={26} />
        </>
      );

    // ── Space Buns — สองบันบนหัว ──
    case "spacebuns":
      return (
        <>
          <CSSBox3D width={54} height={12} depth={54} color={hc} x={0} y={headTop - 4} z={0} />
          {/* Left bun */}
          <CSSBox3D width={18} height={18} depth={18} color={hc} x={-20} y={headTop - 18} z={0} />
          <CSSBox3D width={12} height={12} depth={12} color={hcLight} x={-20} y={headTop - 20} z={0} />
          {/* Right bun */}
          <CSSBox3D width={18} height={18} depth={18} color={hc} x={20} y={headTop - 18} z={0} />
          <CSSBox3D width={12} height={12} depth={12} color={hcLight} x={20} y={headTop - 20} z={0} />
          {/* Short side wisps */}
          <CSSBox3D width={6} height={14} depth={10} color={hc} x={-28} y={headTop + 6} z={8} />
          <CSSBox3D width={6} height={14} depth={10} color={hc} x={28} y={headTop + 6} z={8} />
          {/* Cute bangs */}
          <CSSBox3D width={44} height={10} depth={6} color={hcLight} x={0} y={headTop + 2} z={26} />
        </>
      );

    // ── Cloud Fluffy — ผมฟูเหมือนเมฆ ──
    case "fluffy":
      return (
        <>
          {/* Big fluffy mass */}
          <CSSBox3D width={62} height={42} depth={60} color={hc} x={0} y={headTop - 10} z={0} />
          {/* Inner lighter layer */}
          <CSSBox3D width={56} height={36} depth={54} color={hcLight} x={0} y={headTop - 8} z={0} />
          {/* Fluffy bumps on top */}
          <CSSBox3D width={16} height={10} depth={16} color={hcLight} x={-14} y={headTop - 28} z={0} />
          <CSSBox3D width={14} height={12} depth={14} color={hc} x={8} y={headTop - 30} z={4} />
          <CSSBox3D width={12} height={8} depth={12} color={hcLight} x={20} y={headTop - 24} z={-6} />
          {/* Front poof bangs */}
          <CSSBox3D width={50} height={14} depth={8} color={hcLight} x={0} y={headTop + 2} z={28} />
        </>
      );

    // ── Princess Curls — ผมเจ้าหญิงม้วนยาว ──
    case "princess":
      return (
        <>
          <CSSBox3D width={54} height={12} depth={54} color={hc} x={0} y={headTop - 4} z={0} />
          {/* Left drill curl */}
          {[0, 14, 28, 42].map((offset) => (
            <CSSBox3D
              key={`drill-l-${offset}`}
              width={12 - offset * 0.06}
              height={10}
              depth={12 - offset * 0.06}
              color={offset % 2 === 0 ? hc : hcLight}
              x={-28}
              y={headTop + 8 + offset}
              z={8}
            />
          ))}
          {/* Right drill curl */}
          {[0, 14, 28, 42].map((offset) => (
            <CSSBox3D
              key={`drill-r-${offset}`}
              width={12 - offset * 0.06}
              height={10}
              depth={12 - offset * 0.06}
              color={offset % 2 === 0 ? hc : hcLight}
              x={28}
              y={headTop + 8 + offset}
              z={8}
            />
          ))}
          {/* Crown-like bangs */}
          <CSSBox3D width={44} height={12} depth={6} color={hcLight} x={0} y={headTop + 2} z={26} />
          {/* Back cascade */}
          <CSSBox3D width={48} height={44} depth={8} color={hcDark} x={0} y={headTop + 14} z={-26} />
          {/* Tiara accent */}
          <CSSBox3D width={20} height={4} depth={4} color="#FFD700" x={0} y={headTop - 6} z={24} />
        </>
      );

    // ── Electric Hawk — ม็อกฮอว์คสุดเท่ ──
    case "electrichawk":
      return (
        <>
          {/* Base shaved sides */}
          <CSSBox3D width={52} height={6} depth={52} color={hcDark} x={0} y={headTop - 1} z={0} />
          {/* Tall center hawk */}
          <CSSBox3D width={12} height={30} depth={48} color={hc} x={0} y={headTop - 20} z={0} />
          <CSSBox3D width={8} height={24} depth={40} color={hcLight} x={0} y={headTop - 18} z={0} />
          {/* Electric tips */}
          <CSSBox3D width={6} height={8} depth={10} color={hcLight} x={0} y={headTop - 34} z={14} rotateX={-10} />
          <CSSBox3D width={6} height={8} depth={10} color={hcLight} x={0} y={headTop - 34} z={-14} rotateX={10} />
          {/* Neon glow strip */}
          <CSSBox3D width={4} height={26} depth={44} color="#00E5FF" x={0} y={headTop - 18} z={0} />
        </>
      );

    default:
      return (
        <CSSBox3D width={52} height={10} depth={52} color={hc} x={0} y={headTop - 3} z={0} />
      );
  }
};

export default Hair3D;
