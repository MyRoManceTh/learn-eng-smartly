import React from "react";
import CSSBox3D from "../CSSBox3D";

interface Hair3DProps {
  hairStyle: string; // path from svgProps: short, long, ponytail, bun, curly, spike, afro, mohawk
  hairColor: string;
  headY: number; // y of head top
}

const Hair3D: React.FC<Hair3DProps> = ({ hairStyle, hairColor, headY }) => {
  const headTop = headY - 25; // head center minus half head height

  switch (hairStyle) {
    case "short":
      return (
        <>
          {/* Flat cap on top */}
          <CSSBox3D width={52} height={10} depth={52} color={hairColor} x={0} y={headTop - 3} z={0} />
          {/* Side burns */}
          <CSSBox3D width={52} height={12} depth={4} color={hairColor} x={0} y={headTop + 10} z={26} />
        </>
      );

    case "long":
      return (
        <>
          {/* Top layer */}
          <CSSBox3D width={54} height={10} depth={54} color={hairColor} x={0} y={headTop - 3} z={0} />
          {/* Left side hang */}
          <CSSBox3D width={6} height={40} depth={10} color={hairColor} x={-28} y={headTop + 15} z={10} />
          {/* Right side hang */}
          <CSSBox3D width={6} height={40} depth={10} color={hairColor} x={28} y={headTop + 15} z={10} />
          {/* Back hang */}
          <CSSBox3D width={50} height={35} depth={6} color={hairColor} x={0} y={headTop + 12} z={-28} />
        </>
      );

    case "ponytail":
      return (
        <>
          {/* Top layer */}
          <CSSBox3D width={52} height={10} depth={52} color={hairColor} x={0} y={headTop - 3} z={0} />
          {/* Ponytail hanging back */}
          <CSSBox3D width={14} height={36} depth={10} color={hairColor} x={0} y={headTop + 18} z={-28} />
          {/* Ribbon/bow */}
          <CSSBox3D width={18} height={6} depth={6} color="#FF4081" x={0} y={headTop + 4} z={-26} />
        </>
      );

    case "bun":
      return (
        <>
          {/* Top layer */}
          <CSSBox3D width={52} height={10} depth={52} color={hairColor} x={0} y={headTop - 3} z={0} />
          {/* Bun ball on top */}
          <CSSBox3D width={20} height={20} depth={20} color={hairColor} x={0} y={headTop - 16} z={0} />
        </>
      );

    case "curly":
      return (
        <>
          {/* Multiple small blocks for curly effect */}
          <CSSBox3D width={54} height={12} depth={54} color={hairColor} x={0} y={headTop - 4} z={0} />
          {/* Curly bumps */}
          {[-16, 0, 16].map((xPos) => (
            <CSSBox3D key={`curl-top-${xPos}`} width={12} height={8} depth={12} color={hairColor} x={xPos} y={headTop - 12} z={0} />
          ))}
          {/* Side curls */}
          <CSSBox3D width={8} height={20} depth={14} color={hairColor} x={-28} y={headTop + 8} z={8} />
          <CSSBox3D width={8} height={20} depth={14} color={hairColor} x={28} y={headTop + 8} z={8} />
        </>
      );

    case "spike":
      return (
        <>
          {/* Base */}
          <CSSBox3D width={52} height={8} depth={52} color={hairColor} x={0} y={headTop - 2} z={0} />
          {/* Spikes pointing up */}
          <CSSBox3D width={8} height={18} depth={8} color={hairColor} x={-12} y={headTop - 16} z={6} rotateZ={-8} />
          <CSSBox3D width={8} height={22} depth={8} color={hairColor} x={0} y={headTop - 18} z={0} />
          <CSSBox3D width={8} height={18} depth={8} color={hairColor} x={12} y={headTop - 16} z={6} rotateZ={8} />
          <CSSBox3D width={8} height={14} depth={8} color={hairColor} x={0} y={headTop - 12} z={-12} rotateX={10} />
        </>
      );

    case "afro":
      return (
        <CSSBox3D width={64} height={44} depth={62} color={hairColor} x={0} y={headTop - 10} z={0} />
      );

    case "mohawk":
      return (
        <>
          {/* Thin tall strip center */}
          <CSSBox3D width={10} height={24} depth={50} color={hairColor} x={0} y={headTop - 16} z={0} />
          {/* Base */}
          <CSSBox3D width={52} height={6} depth={52} color={hairColor} x={0} y={headTop - 1} z={0} />
        </>
      );

    default:
      return (
        <CSSBox3D width={52} height={10} depth={52} color={hairColor} x={0} y={headTop - 3} z={0} />
      );
  }
};

export default Hair3D;
