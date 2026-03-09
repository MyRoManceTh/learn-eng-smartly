import React from "react";
import CSSBox3D from "../CSSBox3D";

interface Arm3DProps {
  side: "left" | "right";
  skinColor: string;
  shirtColor: string;
  torsoY: number;
  animated?: boolean;
}

const Arm3D: React.FC<Arm3DProps> = ({ side, skinColor, shirtColor, torsoY, animated }) => {
  const xOffset = side === "left" ? -32 : 32;
  const armTop = torsoY - 18;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
        transform: "translate(-50%, -50%)",
        animation: animated
          ? `avatar-arm-swing-${side} 3s ease-in-out infinite`
          : undefined,
        transformOrigin: `${xOffset > 0 ? "left" : "right"} top`,
      }}
    >
      {/* Sleeve (shirt color) */}
      <CSSBox3D
        width={12}
        height={18}
        depth={12}
        color={shirtColor}
        x={xOffset}
        y={armTop}
        z={0}
      />
      {/* Lower arm (skin) */}
      <CSSBox3D
        width={12}
        height={22}
        depth={12}
        color={skinColor}
        x={xOffset}
        y={armTop + 20}
        z={0}
      />
      {/* Hand (skin cube) */}
      <CSSBox3D
        width={10}
        height={10}
        depth={10}
        color={skinColor}
        x={xOffset}
        y={armTop + 36}
        z={0}
      />
    </div>
  );
};

export default Arm3D;
