import React from "react";
import CSSBox3D from "../CSSBox3D";

interface Head3DProps {
  skinColor: string;
  y: number;
}

const Head3D: React.FC<Head3DProps> = ({ skinColor, y }) => {
  const size = 50;

  return (
    <CSSBox3D
      width={size}
      height={size}
      depth={size}
      color={skinColor}
      x={0}
      y={y}
      z={0}
      frontContent={
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          {/* Left eye */}
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 18,
              width: 10,
              height: 12,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                right: 1,
                top: 3,
                width: 6,
                height: 6,
                backgroundColor: "#1A1A2E",
                borderRadius: "50%",
              }}
            />
          </div>
          {/* Right eye */}
          <div
            style={{
              position: "absolute",
              right: 10,
              top: 18,
              width: 10,
              height: 12,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 1,
                top: 3,
                width: 6,
                height: 6,
                backgroundColor: "#1A1A2E",
                borderRadius: "50%",
              }}
            />
          </div>
          {/* Smile */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 35,
              transform: "translateX(-50%)",
              width: 16,
              height: 6,
              borderBottom: "2.5px solid #1A1A2E",
              borderRadius: "0 0 8px 8px",
            }}
          />
        </div>
      }
    />
  );
};

export default Head3D;
