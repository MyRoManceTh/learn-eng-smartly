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

  switch (hatId) {
    case "hat_baseball":
      return (
        <>
          {/* Cap dome */}
          <CSSBox3D width={52} height={14} depth={52} color={hatColor} x={0} y={headTop - 8} z={0} />
          {/* Brim */}
          <CSSBox3D width={52} height={4} depth={22} color={shade(hatColor, -10)} x={0} y={headTop} z={30} />
        </>
      );

    case "hat_beanie":
      return (
        <>
          {/* Main beanie */}
          <CSSBox3D width={52} height={18} depth={52} color={hatColor} x={0} y={headTop - 10} z={0} />
          {/* Folded brim */}
          <CSSBox3D width={54} height={8} depth={54} color={shade(hatColor, -10)} x={0} y={headTop} z={0} />
          {/* Pom pom */}
          <CSSBox3D width={10} height={10} depth={10} color={shade(hatColor, 20)} x={0} y={headTop - 20} z={0} />
        </>
      );

    case "hat_crown":
      return (
        <>
          {/* Crown base */}
          <CSSBox3D width={50} height={8} depth={50} color={hatColor} x={0} y={headTop - 6} z={0} />
          {/* Crown points */}
          <CSSBox3D width={8} height={14} depth={8} color={hatColor} x={-18} y={headTop - 18} z={0} />
          <CSSBox3D width={8} height={18} depth={8} color={hatColor} x={0} y={headTop - 20} z={0} />
          <CSSBox3D width={8} height={14} depth={8} color={hatColor} x={18} y={headTop - 18} z={0} />
          {/* Jewels on front */}
          <CSSBox3D width={4} height={4} depth={2} color="#E53935" x={0} y={headTop - 4} z={26} />
          <CSSBox3D width={3} height={3} depth={2} color="#2196F3" x={-12} y={headTop - 4} z={26} />
          <CSSBox3D width={3} height={3} depth={2} color="#4CAF50" x={12} y={headTop - 4} z={26} />
        </>
      );

    case "hat_wizard":
      return (
        <>
          {/* Wide brim */}
          <CSSBox3D width={60} height={4} depth={60} color={hatColor} x={0} y={headTop - 2} z={0} />
          {/* Cone layers (pyramid of boxes) */}
          <CSSBox3D width={40} height={14} depth={40} color={hatColor} x={0} y={headTop - 14} z={0} />
          <CSSBox3D width={28} height={12} depth={28} color={shade(hatColor, 5)} x={0} y={headTop - 26} z={0} />
          <CSSBox3D width={16} height={10} depth={16} color={shade(hatColor, 10)} x={0} y={headTop - 36} z={0} />
          {/* Star decoration */}
          <CSSBox3D width={6} height={6} depth={2} color="#FFD700" x={0} y={headTop - 8} z={20} />
        </>
      );

    case "hat_santa":
      return (
        <>
          {/* Main red part */}
          <CSSBox3D width={52} height={20} depth={52} color={hatColor} x={0} y={headTop - 12} z={0} />
          {/* White trim */}
          <CSSBox3D width={54} height={6} depth={54} color="#FFFFFF" x={0} y={headTop} z={0} />
          {/* Droopy tip */}
          <CSSBox3D width={12} height={14} depth={12} color={hatColor} x={18} y={headTop - 16} z={10} rotateZ={30} />
          {/* Pom pom */}
          <CSSBox3D width={10} height={10} depth={10} color="#FFFFFF" x={24} y={headTop - 20} z={14} />
        </>
      );

    case "hat_headphones":
      return (
        <>
          {/* Headband */}
          <CSSBox3D width={54} height={6} depth={8} color={hatColor} x={0} y={headTop - 6} z={0} />
          {/* Left ear cup */}
          <CSSBox3D width={8} height={16} depth={16} color={hatColor} x={-30} y={headTop + 8} z={0} />
          <CSSBox3D width={4} height={10} depth={10} color={shade(hatColor, 15)} x={-32} y={headTop + 8} z={0} />
          {/* Right ear cup */}
          <CSSBox3D width={8} height={16} depth={16} color={hatColor} x={30} y={headTop + 8} z={0} />
          <CSSBox3D width={4} height={10} depth={10} color={shade(hatColor, 15)} x={32} y={headTop + 8} z={0} />
        </>
      );

    // === GACHA HATS ===
    case "gacha_hat_halo":
      return (
        <>
          {/* Golden ring floating above head */}
          <CSSBox3D width={46} height={4} depth={46} color={hatColor} x={0} y={headTop - 14} z={0} />
          {/* Hollow center */}
          <CSSBox3D width={30} height={5} depth={30} color="transparent" x={0} y={headTop - 14} z={0}
            faceOverrides={{
              front: "rgba(255,215,0,0.3)",
              back: "rgba(255,215,0,0.3)",
              left: "rgba(255,215,0,0.3)",
              right: "rgba(255,215,0,0.3)",
              top: "rgba(255,215,0,0.5)",
              bottom: "rgba(255,215,0,0.2)",
            }}
          />
        </>
      );

    case "gacha_hat_devil":
      return (
        <>
          {/* Left horn */}
          <CSSBox3D width={8} height={20} depth={8} color={hatColor} x={-18} y={headTop - 18} z={4} rotateZ={-15} />
          <CSSBox3D width={5} height={10} depth={5} color={shade(hatColor, -20)} x={-22} y={headTop - 28} z={4} rotateZ={-15} />
          {/* Right horn */}
          <CSSBox3D width={8} height={20} depth={8} color={hatColor} x={18} y={headTop - 18} z={4} rotateZ={15} />
          <CSSBox3D width={5} height={10} depth={5} color={shade(hatColor, -20)} x={22} y={headTop - 28} z={4} rotateZ={15} />
        </>
      );

    case "gacha_hat_astronaut":
      return (
        <>
          {/* Helmet dome */}
          <CSSBox3D width={58} height={56} depth={56} color={hatColor} x={0} y={headY - 2} z={0} />
          {/* Visor (dark front) */}
          <CSSBox3D width={44} height={32} depth={4} color="#263238" x={0} y={headY} z={30}
            faceOverrides={{
              front: "linear-gradient(180deg, #455A64 0%, #1A237E 60%, #263238 100%)",
            }}
          />
        </>
      );

    default:
      return null;
  }
};

export default Hat3D;
