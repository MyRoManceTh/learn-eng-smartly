import React from "react";
import { shade, rainbowGradient, FACE_BORDER } from "./colorUtils";

interface CSSBox3DProps {
  width: number;
  height: number;
  depth: number;
  color: string;
  x?: number;
  y?: number;
  z?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  frontContent?: React.ReactNode;
  topContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Override individual face backgrounds */
  faceOverrides?: {
    front?: string;
    back?: string;
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
}

const CSSBox3D: React.FC<CSSBox3DProps> = ({
  width,
  height,
  depth,
  color,
  x = 0,
  y = 0,
  z = 0,
  rotateX: rx = 0,
  rotateY: ry = 0,
  rotateZ: rz = 0,
  frontContent,
  topContent,
  className,
  style,
  faceOverrides,
}) => {
  const isRainbow = color === "rainbow";
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

  const bg = (face: string, shadePercent: number): React.CSSProperties => {
    const override = faceOverrides?.[face as keyof typeof faceOverrides];
    if (override) return { background: override };
    if (isRainbow) {
      const dir = face === "top" || face === "bottom" ? "to right" : "to bottom";
      return { background: rainbowGradient(dir) };
    }
    return { backgroundColor: shadePercent === 0 ? color : shade(color, shadePercent) };
  };

  const faceBase: React.CSSProperties = {
    position: "absolute",
    boxShadow: FACE_BORDER,
    backfaceVisibility: "hidden",
  };

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width,
        height,
        transformStyle: "preserve-3d",
        transform: `translate3d(${x - hw}px, ${y - hh}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        ...style,
      }}
    >
      {/* Front */}
      <div
        style={{
          ...faceBase,
          width,
          height,
          transform: `translateZ(${hd}px)`,
          ...bg("front", 0),
        }}
      >
        {frontContent}
      </div>
      {/* Back */}
      <div
        style={{
          ...faceBase,
          width,
          height,
          transform: `translateZ(${-hd}px) rotateY(180deg)`,
          ...bg("back", -15),
        }}
      />
      {/* Left */}
      <div
        style={{
          ...faceBase,
          width: depth,
          height,
          transform: `translateX(${-hd}px) rotateY(-90deg)`,
          transformOrigin: "left center",
          ...bg("left", -10),
        }}
      />
      {/* Right */}
      <div
        style={{
          ...faceBase,
          width: depth,
          height,
          transform: `translateX(${width - hd}px) rotateY(90deg)`,
          transformOrigin: "left center",
          ...bg("right", -5),
        }}
      />
      {/* Top */}
      <div
        style={{
          ...faceBase,
          width,
          height: depth,
          transform: `translateY(${-hd}px) rotateX(90deg)`,
          transformOrigin: "center top",
          ...bg("top", 15),
        }}
      >
        {topContent}
      </div>
      {/* Bottom */}
      <div
        style={{
          ...faceBase,
          width,
          height: depth,
          transform: `translateY(${height - hd}px) rotateX(-90deg)`,
          transformOrigin: "center top",
          ...bg("bottom", -20),
        }}
      />
    </div>
  );
};

export default CSSBox3D;
