import React from "react";
import CSSBox3D from "../CSSBox3D";
import { shade } from "../colorUtils";

interface Torso3DProps {
  shirtColor: string;
  shirtId: string;
  skinColor: string;
  y: number;
}

const ShirtPattern: React.FC<{ shirtId: string; shirtColor: string }> = ({ shirtId, shirtColor }) => {
  switch (shirtId) {
    case "shirt_striped":
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 5px,
              rgba(255,255,255,0.3) 5px,
              rgba(255,255,255,0.3) 10px
            )`,
          }}
        />
      );

    case "shirt_hoodie":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Pocket */}
          <div
            style={{
              position: "absolute",
              bottom: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 20,
              height: 10,
              border: `1.5px solid ${shade(shirtColor, -15)}`,
              borderTop: "none",
              borderRadius: "0 0 3px 3px",
            }}
          />
          {/* Drawstrings */}
          <div style={{ position: "absolute", top: 4, left: 16, width: 1.5, height: 12, backgroundColor: "#ddd" }} />
          <div style={{ position: "absolute", top: 4, right: 16, width: 1.5, height: 12, backgroundColor: "#ddd" }} />
        </div>
      );

    case "shirt_superhero":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Star */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 16,
              height: 16,
              color: "#FFD700",
              fontSize: 16,
              lineHeight: "16px",
              textAlign: "center",
            }}
          >
            ★
          </div>
          {/* Belt */}
          <div
            style={{
              position: "absolute",
              bottom: 2,
              left: 0,
              right: 0,
              height: 5,
              backgroundColor: "#FFD700",
            }}
          />
        </div>
      );

    case "shirt_tuxedo":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Lapels */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 6,
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderTop: `18px solid ${shade(shirtColor, 15)}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 6,
              width: 0,
              height: 0,
              borderRight: "10px solid transparent",
              borderTop: `18px solid ${shade(shirtColor, 15)}`,
            }}
          />
          {/* Bow tie */}
          <div
            style={{
              position: "absolute",
              top: 3,
              left: "50%",
              transform: "translateX(-50%)",
              width: 10,
              height: 6,
              backgroundColor: "#D32F2F",
              borderRadius: 2,
            }}
          />
          {/* Buttons */}
          {[20, 28, 36].map((top) => (
            <div
              key={top}
              style={{
                position: "absolute",
                top,
                left: "50%",
                transform: "translateX(-50%)",
                width: 3,
                height: 3,
                backgroundColor: "#fff",
                borderRadius: "50%",
              }}
            />
          ))}
        </div>
      );

    case "gacha_shirt_dragon":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Scale pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 6px,
                rgba(255,215,0,0.2) 6px,
                rgba(255,215,0,0.2) 8px
              )`,
            }}
          />
          {/* Dragon emblem */}
          <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontSize: 14, lineHeight: "14px" }}>
            🐉
          </div>
        </div>
      );

    case "gacha_shirt_galaxy":
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 40%, rgba(138,43,226,0.4), transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,150,255,0.3), transparent 50%)",
          }}
        >
          {/* Stars */}
          {[
            { top: 8, left: 10 },
            { top: 20, left: 28 },
            { top: 14, left: 18 },
            { top: 30, left: 8 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                width: 2,
                height: 2,
                backgroundColor: "#fff",
                borderRadius: "50%",
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
};

const Torso3D: React.FC<Torso3DProps> = ({ shirtColor, shirtId, skinColor, y }) => {
  const isHoodie = shirtId === "shirt_hoodie";

  return (
    <>
      {/* Neck */}
      <CSSBox3D width={16} height={8} depth={12} color={skinColor} x={0} y={y - 26} z={0} />

      {/* Main torso */}
      <CSSBox3D
        width={40}
        height={44}
        depth={20}
        color={shirtColor}
        x={0}
        y={y}
        z={0}
        frontContent={
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* V-neck skin peek (for plain shirts) */}
            {shirtId === "shirt_default" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: `10px solid ${skinColor}`,
                }}
              />
            )}
            <ShirtPattern shirtId={shirtId} shirtColor={shirtColor} />
          </div>
        }
      />

      {/* Hoodie hood behind head */}
      {isHoodie && (
        <CSSBox3D
          width={42}
          height={20}
          depth={16}
          color={shade(shirtColor, -5)}
          x={0}
          y={y - 38}
          z={-14}
        />
      )}
    </>
  );
};

export default Torso3D;
