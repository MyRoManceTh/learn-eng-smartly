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
  const legTop = torsoY + 22; // below torso
  const legGap = 9; // distance from center to each leg

  const isShorts = pantsId === "pants_shorts";
  const isSkirt = pantsId === "pants_skirt";

  const renderLeg = (side: "left" | "right") => {
    const x = side === "left" ? -legGap : legGap;

    if (isSkirt) {
      return (
        <React.Fragment key={side}>
          {/* Skin leg below skirt */}
          <CSSBox3D width={14} height={20} depth={18} color={skinColor} x={x} y={legTop + 22} z={0} />
        </React.Fragment>
      );
    }

    if (isShorts) {
      return (
        <React.Fragment key={side}>
          {/* Short pant upper */}
          <CSSBox3D width={14} height={18} depth={18} color={pantsColor} x={x} y={legTop} z={0} />
          {/* Skin shin */}
          <CSSBox3D width={14} height={18} depth={18} color={skinColor} x={x} y={legTop + 18} z={0} />
        </React.Fragment>
      );
    }

    // Default / jeans: full-length pants
    const isDenim = pantsId === "pants_jeans";
    return (
      <React.Fragment key={side}>
        <CSSBox3D
          width={16}
          height={36}
          depth={18}
          color={pantsColor}
          x={x}
          y={legTop}
          z={0}
          frontContent={
            isDenim ? (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {/* Pocket stitch */}
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    [side === "left" ? "left" : "right"]: 2,
                    width: 7,
                    height: 8,
                    border: `1px solid ${shade(pantsColor, 15)}`,
                    borderRadius: "0 0 2px 2px",
                    borderTop: "none",
                  }}
                />
              </div>
            ) : undefined
          }
        />
      </React.Fragment>
    );
  };

  const renderShoe = (side: "left" | "right") => {
    const x = side === "left" ? -legGap : legGap;
    const shoeTop = isShorts || isSkirt ? legTop + 36 : legTop + 36;
    const shoeDepth = 22; // slightly longer than wide for foot look

    // Special shoe styles
    switch (shoesId) {
      case "shoes_boots":
        return (
          <CSSBox3D
            key={`shoe-${side}`}
            width={16}
            height={14}
            depth={shoeDepth}
            color={shoesColor}
            x={x}
            y={shoeTop}
            z={2}
          />
        );
      case "shoes_heels":
        return (
          <React.Fragment key={`shoe-${side}`}>
            <CSSBox3D width={14} height={8} depth={16} color={shoesColor} x={x} y={shoeTop + 2} z={2} />
            {/* Heel */}
            <CSSBox3D width={4} height={8} depth={4} color={shade(shoesColor, -20)} x={x} y={shoeTop + 4} z={-6} />
          </React.Fragment>
        );
      case "shoes_rocket":
        return (
          <React.Fragment key={`shoe-${side}`}>
            <CSSBox3D width={16} height={10} depth={shoeDepth} color={shoesColor} x={x} y={shoeTop} z={2} />
            {/* Rocket flame nozzle */}
            <CSSBox3D width={8} height={6} depth={8} color="#FFD600" x={x} y={shoeTop + 10} z={0} />
          </React.Fragment>
        );
      case "gacha_shoes_cloud":
        return (
          <React.Fragment key={`shoe-${side}`}>
            <CSSBox3D width={18} height={10} depth={20} color={shoesColor} x={x} y={shoeTop} z={2} />
            {/* Cloud puff */}
            <CSSBox3D width={10} height={6} depth={10} color="#fff" x={x + 4} y={shoeTop + 2} z={8} />
          </React.Fragment>
        );
      default:
        // Sneakers
        return (
          <CSSBox3D
            key={`shoe-${side}`}
            width={16}
            height={10}
            depth={shoeDepth}
            color={shoesColor}
            x={x}
            y={shoeTop}
            z={2}
          />
        );
    }
  };

  return (
    <>
      {/* Skirt wide box */}
      {isSkirt && (
        <CSSBox3D
          width={30}
          height={20}
          depth={22}
          color={pantsColor}
          x={0}
          y={legTop + 4}
          z={0}
        />
      )}

      {renderLeg("left")}
      {renderLeg("right")}
      {renderShoe("left")}
      {renderShoe("right")}
    </>
  );
};

export default Leg3D;
