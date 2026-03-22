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
  const c = shirtColor;

  switch (shirtId) {
    // ── Plain Tee — เสื้อยืดธรรมดา (ไม่มีลวดลาย) ──
    case "shirt_default":
      return null;

    // ── Stripe Tee — เสื้อลายทาง ──
    case "shirt_stripe":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {[0, 8, 16, 24, 32].map((top) => (
            <div key={top} style={{
              position: "absolute", top, left: 0, right: 0, height: 4,
              backgroundColor: shade(c, -20), opacity: 0.5,
            }} />
          ))}
        </div>
      );

    // ── Sailor Top — เสื้อนักเรียนญี่ปุ่น (ไม่มีเนคไท/โบว์) ──
    case "shirt_sailor":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Sailor collar V-shape */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "14px solid transparent", borderRight: "14px solid transparent",
            borderTop: "16px solid #1565C0",
          }} />
          {/* White stripes on collar */}
          <div style={{ position: "absolute", top: 3, left: 4, right: 4, height: 2, backgroundColor: "rgba(255,255,255,0.6)" }} />
          <div style={{ position: "absolute", top: 7, left: 6, right: 6, height: 1.5, backgroundColor: "rgba(255,255,255,0.4)" }} />
          {/* Anchor emblem (แทนโบว์) */}
          <div style={{
            position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
            fontSize: 8, lineHeight: "8px", opacity: 0.6,
          }}>⚓</div>
          {/* Bottom stripe */}
          <div style={{ position: "absolute", bottom: 4, left: 4, right: 4, height: 2, backgroundColor: "#1565C0", opacity: 0.4 }} />
        </div>
      );

    // ── Cute Overalls — เอี๊ยมน่ารัก ──
    case "shirt_overalls":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Bib front */}
          <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            width: 24, height: 28, backgroundColor: shade(c, -10), borderRadius: "3px 3px 0 0",
          }} />
          {/* Left strap */}
          <div style={{ position: "absolute", top: 0, left: 8, width: 5, height: 14, backgroundColor: shade(c, -10) }} />
          {/* Right strap */}
          <div style={{ position: "absolute", top: 0, right: 8, width: 5, height: 14, backgroundColor: shade(c, -10) }} />
          {/* Buttons on straps */}
          <div style={{ position: "absolute", top: 12, left: 9, width: 3, height: 3, backgroundColor: "#FFD700", borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: 12, right: 9, width: 3, height: 3, backgroundColor: "#FFD700", borderRadius: "50%" }} />
          {/* Heart pocket */}
          <div style={{
            position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 7, backgroundColor: "#FF80AB", borderRadius: "50% 50% 0 0",
          }} />
        </div>
      );

    // ── Bear Hoodie — ฮู้ดมีหูหมี ──
    case "shirt_hoodie":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Pocket */}
          <div style={{
            position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
            width: 22, height: 12, border: `1.5px solid ${shade(c, -15)}`,
            borderTop: "none", borderRadius: "0 0 4px 4px",
          }} />
          {/* Bear face on belly */}
          <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            width: 14, height: 14, backgroundColor: shade(c, 15), borderRadius: "50%",
          }} />
          {/* Bear eyes */}
          <div style={{ position: "absolute", top: 14, left: "calc(50% - 4px)", width: 2, height: 2, backgroundColor: "#1A1A1A", borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: 14, left: "calc(50% + 2px)", width: 2, height: 2, backgroundColor: "#1A1A1A", borderRadius: "50%" }} />
          {/* Bear nose */}
          <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 3, height: 2, backgroundColor: "#5D4037", borderRadius: 1 }} />
          {/* Drawstrings */}
          <div style={{ position: "absolute", top: 4, left: 14, width: 1.5, height: 10, backgroundColor: shade(c, 20) }} />
          <div style={{ position: "absolute", top: 4, right: 14, width: 1.5, height: 10, backgroundColor: shade(c, 20) }} />
        </div>
      );

    // ── Pastel Cardigan — คาร์ดิแกนนุ่ม ──
    case "shirt_cardigan":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Center opening line */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 2, height: "100%", backgroundColor: shade(c, -10),
          }} />
          {/* Buttons */}
          {[12, 22, 32].map((top) => (
            <div key={top} style={{
              position: "absolute", top, left: "50%", transform: "translateX(-50%)",
              width: 4, height: 4, backgroundColor: "#FFF8E1", borderRadius: "50%",
              border: `0.5px solid ${shade(c, -15)}`,
            }} />
          ))}
          {/* Inner shirt peek */}
          <div style={{
            position: "absolute", top: 2, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 8, backgroundColor: "#FFFFFF",
          }} />
        </div>
      );

    // ── Magical Dress — ชุดเมจิคอลเกิร์ล ──
    case "shirt_magical":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Ribbon chest bow */}
          <div style={{
            position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
            width: 16, height: 8, backgroundColor: "#FFD700",
            clipPath: "polygon(0% 50%, 40% 0%, 50% 50%, 60% 0%, 100% 50%, 60% 100%, 50% 50%, 40% 100%)",
          }} />
          {/* Center gem */}
          <div style={{
            position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
            width: 5, height: 5, backgroundColor: "#E040FB", borderRadius: "50%",
            boxShadow: "0 0 4px #E040FB",
          }} />
          {/* Frilly bottom edge */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 6,
            background: `repeating-linear-gradient(90deg, ${shade(c, 15)}, ${shade(c, 15)} 4px, transparent 4px, transparent 8px)`,
          }} />
          {/* Star accents */}
          {[{ top: 20, left: 6 }, { top: 28, left: 26 }, { top: 16, left: 30 }].map((pos, i) => (
            <div key={i} style={{
              position: "absolute", top: pos.top, left: pos.left,
              width: 3, height: 3, backgroundColor: "#FFF176", borderRadius: "50%",
              opacity: 0.7,
            }} />
          ))}
        </div>
      );

    // ── Sakura Kimono — กิโมโนซากุระ ──
    case "shirt_kimono":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Kimono overlap left-over-right */}
          <div style={{
            position: "absolute", top: 0, left: 4, width: 0, height: 0,
            borderRight: "16px solid transparent", borderTop: `26px solid ${shade(c, -8)}`,
          }} />
          {/* Obi belt */}
          <div style={{
            position: "absolute", bottom: 4, left: 0, right: 0, height: 8,
            backgroundColor: "#E91E63",
          }} />
          {/* Obi knot */}
          <div style={{
            position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)",
            width: 6, height: 10, backgroundColor: "#AD1457", borderRadius: 2,
          }} />
          {/* Sakura petals */}
          {[{ t: 8, l: 8 }, { t: 18, l: 24 }, { t: 28, l: 12 }].map((p, i) => (
            <div key={i} style={{
              position: "absolute", top: p.t, left: p.l,
              width: 4, height: 4, backgroundColor: "#F8BBD0", borderRadius: "50% 0 50% 0",
              transform: "rotate(45deg)", opacity: 0.7,
            }} />
          ))}
        </div>
      );

    // ── Celestial Robe — ชุดดวงดาว ──
    case "shirt_celestial":
      return (
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden",
          background: "radial-gradient(circle at 30% 30%, rgba(63,81,181,0.3), transparent 40%), radial-gradient(circle at 70% 60%, rgba(123,31,162,0.2), transparent 50%)",
        }}>
          {/* Stars */}
          {[
            { t: 6, l: 8, s: 2.5 }, { t: 14, l: 24, s: 3 }, { t: 24, l: 6, s: 2 },
            { t: 10, l: 30, s: 2 }, { t: 32, l: 18, s: 2.5 }, { t: 20, l: 14, s: 1.5 },
          ].map((star, i) => (
            <div key={i} style={{
              position: "absolute", top: star.t, left: star.l,
              width: star.s, height: star.s, backgroundColor: "#FFF9C4",
              borderRadius: "50%", opacity: 0.9,
              boxShadow: "0 0 3px #FFF9C4",
            }} />
          ))}
          {/* Moon crescent */}
          <div style={{
            position: "absolute", top: 4, right: 6, width: 8, height: 8,
            borderRadius: "50%", border: "2px solid #FFF176",
            borderColor: "transparent #FFF176 transparent transparent",
            transform: "rotate(-45deg)",
          }} />
          {/* Collar V gold */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderTop: "10px solid #FFD700",
          }} />
        </div>
      );

    // ═══ GACHA SHIRT PATTERNS ═══

    // ── Dragon Scale — ชุดเกราะมังกร ──
    case "gacha_shirt_dragon":
      return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Scale pattern */}
          <div style={{
            position: "absolute", inset: 0,
            background: `repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,215,0,0.15) 5px, rgba(255,215,0,0.15) 7px),
              repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,215,0,0.1) 8px, rgba(255,215,0,0.1) 10px)`,
          }} />
          {/* Dragon emblem */}
          <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontSize: 14, lineHeight: "14px" }}>
            🐉
          </div>
          {/* Gold chest plate edge */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "12px solid transparent", borderRight: "12px solid transparent",
            borderTop: "14px solid #FFD700",
          }} />
        </div>
      );

    // ── Galaxy Outfit — ชุดกาแล็กซี่ ──
    case "gacha_shirt_galaxy":
      return (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 30% 40%, rgba(138,43,226,0.5), transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,150,255,0.4), transparent 50%)",
        }}>
          {[
            { t: 6, l: 8 }, { t: 18, l: 26 }, { t: 12, l: 16 },
            { t: 28, l: 6 }, { t: 8, l: 30 }, { t: 24, l: 20 },
            { t: 34, l: 14 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: "absolute", top: pos.t, left: pos.l,
              width: 2, height: 2, backgroundColor: "#fff",
              borderRadius: "50%", opacity: 0.8, boxShadow: "0 0 2px #fff",
            }} />
          ))}
        </div>
      );

    // ── Rainbow Dress — ชุดสายรุ้ง ──
    case "gacha_shirt_rainbow":
      return (
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden",
          background: "linear-gradient(180deg, #FF9A9E 0%, #FECFEF 15%, #FFD1DC 30%, #FFF5BA 45%, #B5FFCF 60%, #A8D8EA 75%, #D5AAFF 90%)",
          opacity: 0.6,
        }}>
          {/* Sparkle accents */}
          {[{ t: 8, l: 10 }, { t: 20, l: 24 }, { t: 32, l: 8 }].map((p, i) => (
            <div key={i} style={{
              position: "absolute", top: p.t, left: p.l,
              width: 3, height: 3, backgroundColor: "#fff",
              borderRadius: "50%", opacity: 0.9,
            }} />
          ))}
        </div>
      );

    default:
      return null;
  }
};

const Torso3D: React.FC<Torso3DProps> = ({ shirtColor, shirtId, skinColor, y }) => {
  const isHoodie = shirtId === "shirt_hoodie";
  const isKimono = shirtId === "shirt_kimono";
  const isMagical = shirtId === "shirt_magical";
  const isCelestial = shirtId === "shirt_celestial";

  return (
    <>
      {/* Neck */}
      <CSSBox3D width={16} height={8} depth={18} color={skinColor} x={0} y={y - 26} z={0} />

      {/* Main torso */}
      <CSSBox3D
        width={40}
        height={44}
        depth={28}
        color={shirtColor}
        x={0}
        y={y}
        z={0}
        frontContent={
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Round neck collar line for plain/stripe tee */}
            {(shirtId === "shirt_default" || shirtId === "shirt_stripe") && (
              <div style={{
                position: "absolute", top: 2, left: "50%", transform: "translateX(-50%)",
                width: 16, height: 8,
                borderBottom: `2px solid ${shade(shirtColor, -15)}`,
                borderRadius: "0 0 8px 8px",
              }} />
            )}
            <ShirtPattern shirtId={shirtId} shirtColor={shirtColor} />
          </div>
        }
      />

      {/* Hoodie hood behind head with bear ears */}
      {isHoodie && (
        <>
          <CSSBox3D width={42} height={22} depth={18} color={shade(shirtColor, -5)} x={0} y={y - 40} z={-14} />
          {/* Bear ears on hood */}
          <CSSBox3D width={10} height={10} depth={8} color={shade(shirtColor, -10)} x={-14} y={y - 52} z={-14} />
          <CSSBox3D width={10} height={10} depth={8} color={shade(shirtColor, -10)} x={14} y={y - 52} z={-14} />
          {/* Inner ear pink */}
          <CSSBox3D width={6} height={6} depth={4} color="#FFB6C1" x={-14} y={y - 50} z={-12} />
          <CSSBox3D width={6} height={6} depth={4} color="#FFB6C1" x={14} y={y - 50} z={-12} />
        </>
      )}

      {/* Kimono wide sleeves hint */}
      {isKimono && (
        <>
          <CSSBox3D width={8} height={20} depth={16} color={shade(shirtColor, -5)} x={-26} y={y - 4} z={0} />
          <CSSBox3D width={8} height={20} depth={16} color={shade(shirtColor, -5)} x={26} y={y - 4} z={0} />
        </>
      )}

      {/* Magical girl frilly extension */}
      {isMagical && (
        <CSSBox3D width={44} height={10} depth={32} color={shade(shirtColor, 10)} x={0} y={y + 22} z={0} />
      )}

      {/* Celestial robe flowing extension */}
      {isCelestial && (
        <>
          <CSSBox3D width={42} height={12} depth={30} color={shade(shirtColor, 5)} x={0} y={y + 22} z={0} />
          <CSSBox3D width={38} height={8} depth={26} color={shade(shirtColor, 10)} x={0} y={y + 30} z={0} />
        </>
      )}
    </>
  );
};

export default Torso3D;
