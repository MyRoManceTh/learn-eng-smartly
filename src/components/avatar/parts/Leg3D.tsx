import React from "react";
import CSSBox3D from "../CSSBox3D";
import { shade } from "../colorUtils";

interface Leg3DProps {
  skinColor: string;
  pantsColor: string;
  pantsId: string;
  shoesColor: string;
  shoesId: string;
  torsoY: number;
}

const Leg3D: React.FC<Leg3DProps> = ({ skinColor, pantsColor, pantsId, shoesColor, shoesId, torsoY }) => {
  const legTop = torsoY + 22;
  const legGap = 9;
  const c = pantsColor;

  const isShorts = pantsId === "pants_shorts";
  const isPleated = pantsId === "pants_pleated";
  const isTutu = pantsId === "pants_tutu";
  const isCargo = pantsId === "pants_cargo";
  const isStarry = pantsId === "pants_starry";
  const isSkirtType = isPleated || isTutu;

  const renderLeg = (side: "left" | "right") => {
    const x = side === "left" ? -legGap : legGap;

    // Skirt-type: show skin legs below
    if (isSkirtType) {
      return (
        <React.Fragment key={side}>
          <CSSBox3D width={14} height={20} depth={18} color={skinColor} x={x} y={legTop + 22} z={0} />
        </React.Fragment>
      );
    }

    // Puffy Shorts
    if (isShorts) {
      return (
        <React.Fragment key={side}>
          {/* Puffy short upper */}
          <CSSBox3D width={16} height={16} depth={20} color={c} x={x} y={legTop} z={0} />
          {/* Cuff */}
          <CSSBox3D width={17} height={4} depth={21} color={shade(c, -8)} x={x} y={legTop + 14} z={0} />
          {/* Skin below */}
          <CSSBox3D width={14} height={16} depth={18} color={skinColor} x={x} y={legTop + 20} z={0} />
        </React.Fragment>
      );
    }

    // Cute Cargo
    if (isCargo) {
      return (
        <React.Fragment key={side}>
          <CSSBox3D
            width={16}
            height={36}
            depth={18}
            color={c}
            x={x}
            y={legTop}
            z={0}
            frontContent={
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {/* Cargo pocket */}
                <div style={{
                  position: "absolute",
                  top: 14,
                  [side === "left" ? "left" : "right"]: 2,
                  width: 8, height: 10,
                  border: `1px solid ${shade(c, -12)}`,
                  borderRadius: 1,
                }} />
                {/* Pocket flap */}
                <div style={{
                  position: "absolute",
                  top: 12,
                  [side === "left" ? "left" : "right"]: 1,
                  width: 10, height: 4,
                  backgroundColor: shade(c, -8),
                  borderRadius: "1px 1px 0 0",
                }} />
              </div>
            }
          />
        </React.Fragment>
      );
    }

    // Galaxy Pants — starry pattern
    if (isStarry) {
      return (
        <React.Fragment key={side}>
          <CSSBox3D
            width={16}
            height={36}
            depth={18}
            color={c}
            x={x}
            y={legTop}
            z={0}
            frontContent={
              <div style={{
                position: "relative", width: "100%", height: "100%",
                background: "radial-gradient(circle at 50% 30%, rgba(63,81,181,0.3), transparent 60%)",
              }}>
                {/* Mini stars */}
                {[
                  { t: 6, l: 4 }, { t: 16, l: 10 }, { t: 24, l: 3 }, { t: 30, l: 8 },
                ].map((s, i) => (
                  <div key={i} style={{
                    position: "absolute", top: s.t, left: s.l,
                    width: 1.5, height: 1.5, backgroundColor: "#FFF9C4",
                    borderRadius: "50%", opacity: 0.8,
                  }} />
                ))}
              </div>
            }
          />
        </React.Fragment>
      );
    }

    // Default: Soft Joggers
    return (
      <React.Fragment key={side}>
        <CSSBox3D
          width={16}
          height={36}
          depth={18}
          color={c}
          x={x}
          y={legTop}
          z={0}
          frontContent={
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {/* Jogger elastic cuff */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
                backgroundColor: shade(c, -8), borderRadius: "0 0 2px 2px",
              }} />
            </div>
          }
        />
      </React.Fragment>
    );
  };

  const renderShoe = (side: "left" | "right") => {
    const x = side === "left" ? -legGap : legGap;
    const shoeTop = legTop + 36;
    const shoeDepth = 22;
    const sc = shoesColor;

    switch (shoesId) {
      // ── Flower Sandals ──
      case "shoes_sandals":
        return (
          <React.Fragment key={`shoe-${side}`}>
            {/* Sole */}
            <CSSBox3D width={16} height={4} depth={shoeDepth} color={sc} x={x} y={shoeTop + 4} z={2} />
            {/* Strap */}
            <CSSBox3D width={16} height={3} depth={4} color={shade(sc, -10)} x={x} y={shoeTop + 2} z={6} />
            {/* Flower accent */}
            <CSSBox3D width={4} height={4} depth={2} color="#FF80AB" x={x + 4} y={shoeTop} z={8} />
          </React.Fragment>
        );

      // ── Lace Boots ──
      case "shoes_boots":
        return (
          <React.Fragment key={`shoe-${side}`}>
            {/* Boot tall */}
            <CSSBox3D width={16} height={16} depth={shoeDepth} color={sc} x={x} y={shoeTop - 4} z={2} />
            {/* Boot top cuff */}
            <CSSBox3D width={17} height={3} depth={shoeDepth + 1} color={shade(sc, -10)} x={x} y={shoeTop - 6} z={2} />
            {/* Lace cross detail on front */}
            <CSSBox3D width={3} height={12} depth={2} color={shade(sc, 20)} x={x} y={shoeTop - 2} z={14}
              frontContent={
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  {[2, 5, 8].map((t) => (
                    <div key={t} style={{
                      position: "absolute", top: t, left: 0, right: 0, height: 1,
                      backgroundColor: shade(sc, 30),
                    }} />
                  ))}
                </div>
              }
            />
            {/* Sole */}
            <CSSBox3D width={16} height={4} depth={shoeDepth + 2} color={shade(sc, -20)} x={x} y={shoeTop + 10} z={2} />
          </React.Fragment>
        );

      // ── Mary Jane ──
      case "shoes_maryjane":
        return (
          <React.Fragment key={`shoe-${side}`}>
            <CSSBox3D width={16} height={8} depth={shoeDepth} color={sc} x={x} y={shoeTop + 2} z={2} />
            {/* Rounded toe front */}
            <CSSBox3D width={14} height={6} depth={6} color={shade(sc, 5)} x={x} y={shoeTop + 2} z={12} />
            {/* Strap across */}
            <CSSBox3D width={16} height={3} depth={4} color={sc} x={x} y={shoeTop} z={4} />
            {/* Button */}
            <CSSBox3D width={3} height={3} depth={2} color="#FFD700" x={x + (side === "left" ? 5 : -5)} y={shoeTop} z={6} />
          </React.Fragment>
        );

      // ── Star Platform ──
      case "shoes_platform":
        return (
          <React.Fragment key={`shoe-${side}`}>
            {/* Tall platform sole */}
            <CSSBox3D width={16} height={10} depth={shoeDepth + 2} color={shade(sc, -20)} x={x} y={shoeTop + 4} z={2} />
            {/* Upper shoe */}
            <CSSBox3D width={16} height={8} depth={shoeDepth} color={sc} x={x} y={shoeTop - 2} z={2} />
            {/* Star decoration */}
            <CSSBox3D width={5} height={5} depth={2} color="#FFD700" x={x + (side === "left" ? -4 : 4)} y={shoeTop} z={14} />
            {/* Side stripe */}
            <CSSBox3D width={2} height={6} depth={16} color={shade(sc, 20)} x={x + (side === "left" ? -8 : 8)} y={shoeTop} z={2} />
          </React.Fragment>
        );

      // ── Roller Skates ──
      case "shoes_roller":
        return (
          <React.Fragment key={`shoe-${side}`}>
            {/* Skate boot */}
            <CSSBox3D width={16} height={12} depth={shoeDepth} color={sc} x={x} y={shoeTop - 2} z={2} />
            {/* Cuff detail */}
            <CSSBox3D width={17} height={3} depth={shoeDepth + 1} color={shade(sc, 15)} x={x} y={shoeTop - 4} z={2} />
            {/* Wheel plate */}
            <CSSBox3D width={14} height={3} depth={20} color="#455A64" x={x} y={shoeTop + 10} z={2} />
            {/* Wheels (front + back) */}
            <CSSBox3D width={16} height={6} depth={5} color="#FFFFFF" x={x} y={shoeTop + 10} z={10} />
            <CSSBox3D width={16} height={6} depth={5} color="#FFFFFF" x={x} y={shoeTop + 10} z={-4} />
            {/* Wheel hubs */}
            <CSSBox3D width={16} height={3} depth={2} color={sc} x={x} y={shoeTop + 10} z={10} />
            <CSSBox3D width={16} height={3} depth={2} color={sc} x={x} y={shoeTop + 10} z={-4} />
          </React.Fragment>
        );

      // ── Cloud Walkers (Gacha) ──
      case "gacha_shoes_cloud":
        return (
          <React.Fragment key={`shoe-${side}`}>
            <CSSBox3D width={18} height={10} depth={22} color={sc} x={x} y={shoeTop} z={2} />
            {/* Cloud puffs */}
            <CSSBox3D width={10} height={8} depth={10} color="#fff" x={x + 4} y={shoeTop + 2} z={10} />
            <CSSBox3D width={8} height={6} depth={8} color="#E3F2FD" x={x - 4} y={shoeTop + 2} z={-2} />
            <CSSBox3D width={6} height={6} depth={6} color="#fff" x={x} y={shoeTop - 2} z={4} />
          </React.Fragment>
        );

      // ── Default: Pastel Sneakers ──
      default:
        return (
          <React.Fragment key={`shoe-${side}`}>
            <CSSBox3D width={16} height={10} depth={shoeDepth} color={sc} x={x} y={shoeTop} z={2} />
            {/* Toe cap */}
            <CSSBox3D width={14} height={6} depth={6} color={shade(sc, 10)} x={x} y={shoeTop + 1} z={12} />
            {/* Sole accent */}
            <CSSBox3D width={16} height={3} depth={shoeDepth + 1} color={shade(sc, -12)} x={x} y={shoeTop + 6} z={2} />
          </React.Fragment>
        );
    }
  };

  return (
    <>
      {/* Pleated Skirt — กระโปรงพลีท */}
      {isPleated && (
        <>
          <CSSBox3D width={32} height={20} depth={24} color={c} x={0} y={legTop + 4} z={0}
            frontContent={
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {/* Pleat lines */}
                {[4, 10, 16, 22, 28].map((l) => (
                  <div key={l} style={{
                    position: "absolute", top: 0, left: l, width: 1, height: "100%",
                    backgroundColor: shade(c, -8),
                  }} />
                ))}
              </div>
            }
          />
          {/* Waistband */}
          <CSSBox3D width={33} height={4} depth={25} color={shade(c, -10)} x={0} y={legTop - 2} z={0} />
        </>
      )}

      {/* Tutu Skirt — กระโปรงทูทู่ */}
      {isTutu && (
        <>
          {/* Main tutu layers */}
          <CSSBox3D width={36} height={12} depth={28} color={c} x={0} y={legTop + 2} z={0} />
          <CSSBox3D width={40} height={8} depth={32} color={shade(c, 10)} x={0} y={legTop + 8} z={0} />
          <CSSBox3D width={44} height={6} depth={34} color={shade(c, 18)} x={0} y={legTop + 14} z={0} />
          {/* Waistband ribbon */}
          <CSSBox3D width={34} height={4} depth={26} color={shade(c, -15)} x={0} y={legTop - 2} z={0} />
        </>
      )}

      {renderLeg("left")}
      {renderLeg("right")}
      {renderShoe("left")}
      {renderShoe("right")}
    </>
  );
};

export default Leg3D;
