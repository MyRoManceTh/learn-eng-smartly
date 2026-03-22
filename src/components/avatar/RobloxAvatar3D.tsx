import React from "react";
import { EquippedItems } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";
import Head3D from "./parts/Head3D";
import Hair3D from "./parts/Hair3D";
import Torso3D from "./parts/Torso3D";
import Arm3D from "./parts/Arm3D";
import Leg3D from "./parts/Leg3D";
import Hat3D from "./parts/Hat3D";
import Necklace3D from "./parts/Necklace3D";
import HandItem3D from "./parts/HandItem3D";
import Aura3D from "./parts/Aura3D";

interface RobloxAvatar3DProps {
  equipped: EquippedItems;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  evolutionStage?: number;
}

const SIZE_CONFIG = {
  sm: { scale: 0.6, container: 140 },
  md: { scale: 1.0, container: 220 },
  lg: { scale: 1.5, container: 340 },
};

const RobloxAvatar3D: React.FC<RobloxAvatar3DProps> = ({
  equipped,
  size = "md",
  animated = false,
  evolutionStage = 1,
}) => {
  const { scale, container } = SIZE_CONFIG[size];

  // Resolve item colors
  const skinItem = getItemById(equipped.skin);
  const hairItem = getItemById(equipped.hair);
  const hairColorItem = getItemById(equipped.hairColor);
  const shirtItem = getItemById(equipped.shirt);
  const pantsItem = getItemById(equipped.pants);
  const shoesItem = getItemById(equipped.shoes);
  const hatItem = equipped.hat ? getItemById(equipped.hat) : null;
  const necklaceItem = equipped.necklace ? getItemById(equipped.necklace) : null;
  const leftHandItem = equipped.leftHand ? getItemById(equipped.leftHand) : null;
  const rightHandItem = equipped.rightHand ? getItemById(equipped.rightHand) : null;

  const skinColor = skinItem?.svgProps?.color ?? "#F5D5C0";
  const hairColor = hairColorItem?.svgProps?.color ?? "#2C2C2C";
  const hairStyle = hairItem?.svgProps?.path ?? "softbob";
  const shirtColor = shirtItem?.svgProps?.color ?? "#A8D8EA";
  const pantsColor = pantsItem?.svgProps?.color ?? "#B0C4DE";
  const shoesColor = shoesItem?.svgProps?.color ?? "#FFE4F0";
  const hatColor = hatItem?.svgProps?.color ?? "#FF8A80";
  const necklaceColor = necklaceItem?.svgProps?.color ?? "#FFD700";
  const leftHandColor = leftHandItem?.svgProps?.color ?? "#78909C";
  const rightHandColor = rightHandItem?.svgProps?.color ?? "#CE93D8";

  // Y positions (centered around 0)
  const headY = -50;
  const torsoY = 0;

  // Evolution effects
  const evolutionGlow = (): React.CSSProperties => {
    switch (evolutionStage) {
      case 2: return { filter: "drop-shadow(0 0 6px rgba(76,175,80,0.3))" };
      case 3: return { filter: "drop-shadow(0 0 10px rgba(33,150,243,0.4))" };
      case 4: return { filter: "drop-shadow(0 0 12px rgba(156,39,176,0.5))" };
      case 5: return { filter: "drop-shadow(0 0 16px rgba(255,215,0,0.6))" };
      default: return {};
    }
  };

  return (
    <div
      style={{
        width: container,
        height: container,
        position: "relative",
        perspective: 300,
        perspectiveOrigin: "50% 45%",
      }}
      className={animated ? "animate-avatar-idle" : undefined}
    >
      {/* Aura effect (rendered behind avatar) */}
      <Aura3D auraId={equipped.aura} containerSize={container} />

      {/* Evolution aura (stage 4+) */}
      {evolutionStage >= 4 && (
        <div
          className="avatar-3d-aura"
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            background: evolutionStage === 5
              ? "radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(156,39,176,0.12) 0%, transparent 70%)",
            animation: "avatar-3d-aura-pulse 2s ease-in-out infinite",
          }}
        />
      )}

      {/* Sparkle effects (stage 3+) */}
      {evolutionStage >= 3 && (
        <>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="avatar-3d-sparkle"
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: evolutionStage >= 5 ? "#FFD700" : evolutionStage >= 4 ? "#CE93D8" : "#64B5F6",
                left: `${20 + i * 30}%`,
                top: `${10 + i * 15}%`,
                animation: `avatar-3d-sparkle ${1.5 + i * 0.3}s ease-in-out infinite ${i * 0.5}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Particle effects (stage 5) */}
      {evolutionStage >= 5 && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`p-${i}`}
              style={{
                position: "absolute",
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "#FFD700",
                left: `${15 + i * 20}%`,
                bottom: 0,
                animation: `avatar-3d-particle 2.5s ease-out infinite ${i * 0.6}s`,
                opacity: 0,
              }}
            />
          ))}
        </>
      )}

      {/* 3D Scene */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transformStyle: "preserve-3d",
          transform: `translate(-50%, -50%) scale(${scale}) rotateX(-18deg) rotateY(-35deg)`,
          animation: animated ? "avatar-3d-rotate 6s ease-in-out infinite" : undefined,
          ...evolutionGlow(),
        }}
      >
        {/* Hat (rendered before head so it sits on top) */}
        <Hat3D hatId={equipped.hat} hatColor={hatColor} headY={headY} />

        {/* Head */}
        <Head3D skinColor={skinColor} y={headY} />

        {/* Hair */}
        <Hair3D hairStyle={hairStyle} hairColor={hairColor} headY={headY} />

        {/* Torso + Shirt */}
        <Torso3D
          shirtColor={shirtColor}
          shirtId={equipped.shirt}
          skinColor={skinColor}
          y={torsoY}
        />

        {/* Necklace */}
        <Necklace3D
          necklaceId={equipped.necklace}
          necklaceColor={necklaceColor}
          torsoY={torsoY}
        />

        {/* Arms */}
        <Arm3D side="left" skinColor={skinColor} shirtColor={shirtColor} torsoY={torsoY} animated={animated} />
        <Arm3D side="right" skinColor={skinColor} shirtColor={shirtColor} torsoY={torsoY} animated={animated} />

        {/* Hand items */}
        <HandItem3D
          itemId={equipped.leftHand}
          itemColor={leftHandColor}
          side="left"
          torsoY={torsoY}
        />
        <HandItem3D
          itemId={equipped.rightHand}
          itemColor={rightHandColor}
          side="right"
          torsoY={torsoY}
        />

        {/* Legs + Pants + Shoes */}
        <Leg3D
          skinColor={skinColor}
          pantsColor={pantsColor}
          pantsId={equipped.pants}
          shoesColor={shoesColor}
          shoesId={equipped.shoes}
          torsoY={torsoY}
        />
      </div>
    </div>
  );
};

export default RobloxAvatar3D;
