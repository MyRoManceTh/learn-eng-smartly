import React from "react";
import CSSBox3D from "../CSSBox3D";
import { shade } from "../colorUtils";

interface Accessory3DProps {
  accId: string | null;
  accColor: string;
  headY: number;
  torsoY: number;
}

const Accessory3D: React.FC<Accessory3DProps> = ({ accId, accColor, headY, torsoY }) => {
  if (!accId) return null;

  switch (accId) {
    case "acc_glasses":
      return (
        <>
          {/* Left lens */}
          <CSSBox3D width={12} height={10} depth={4} color={accColor} x={-10} y={headY - 4} z={26}
            faceOverrides={{ front: "rgba(200,230,255,0.5)" }}
          />
          {/* Right lens */}
          <CSSBox3D width={12} height={10} depth={4} color={accColor} x={10} y={headY - 4} z={26}
            faceOverrides={{ front: "rgba(200,230,255,0.5)" }}
          />
          {/* Bridge */}
          <CSSBox3D width={6} height={3} depth={2} color={accColor} x={0} y={headY - 3} z={27} />
        </>
      );

    case "acc_backpack":
      return (
        <>
          {/* Main bag */}
          <CSSBox3D width={30} height={32} depth={12} color={accColor} x={0} y={torsoY - 4} z={-18} />
          {/* Top flap */}
          <CSSBox3D width={30} height={6} depth={14} color={shade(accColor, -10)} x={0} y={torsoY - 22} z={-18} />
          {/* Straps (on sides) */}
          <CSSBox3D width={4} height={28} depth={4} color={shade(accColor, -15)} x={-14} y={torsoY - 2} z={-6} />
          <CSSBox3D width={4} height={28} depth={4} color={shade(accColor, -15)} x={14} y={torsoY - 2} z={-6} />
        </>
      );

    case "acc_wings":
      return (
        <>
          {/* Left wing */}
          <CSSBox3D width={30} height={36} depth={4} color={accColor} x={-36} y={torsoY - 10} z={-8}
            rotateY={20}
            faceOverrides={{
              front: `linear-gradient(180deg, ${accColor}, ${shade(accColor, -20)})`,
            }}
          />
          <CSSBox3D width={18} height={24} depth={3} color={shade(accColor, 15)} x={-50} y={torsoY - 4} z={-10}
            rotateY={30}
          />
          {/* Right wing */}
          <CSSBox3D width={30} height={36} depth={4} color={accColor} x={36} y={torsoY - 10} z={-8}
            rotateY={-20}
            faceOverrides={{
              front: `linear-gradient(180deg, ${accColor}, ${shade(accColor, -20)})`,
            }}
          />
          <CSSBox3D width={18} height={24} depth={3} color={shade(accColor, 15)} x={50} y={torsoY - 4} z={-10}
            rotateY={-30}
          />
        </>
      );

    case "acc_cape":
      return (
        <CSSBox3D
          width={36}
          height={50}
          depth={4}
          color={accColor}
          x={0}
          y={torsoY - 12}
          z={-14}
          faceOverrides={{
            front: `linear-gradient(180deg, ${accColor} 0%, ${shade(accColor, -25)} 100%)`,
            back: `linear-gradient(180deg, ${shade(accColor, -10)} 0%, ${shade(accColor, -30)} 100%)`,
          }}
        />
      );

    // === GACHA ACCESSORIES ===
    case "gacha_acc_pet_cat":
      return (
        <>
          {/* Cat body */}
          <CSSBox3D width={14} height={10} depth={10} color={accColor} x={30} y={torsoY + 24} z={6} />
          {/* Cat head */}
          <CSSBox3D width={10} height={10} depth={10} color={accColor} x={30} y={torsoY + 14} z={8} />
          {/* Ears */}
          <CSSBox3D width={4} height={5} depth={3} color={accColor} x={25} y={torsoY + 8} z={8} />
          <CSSBox3D width={4} height={5} depth={3} color={accColor} x={35} y={torsoY + 8} z={8} />
          {/* Tail */}
          <CSSBox3D width={3} height={12} depth={3} color={accColor} x={22} y={torsoY + 18} z={2} rotateZ={-30} />
        </>
      );

    case "gacha_acc_pet_dog":
      return (
        <>
          {/* Dog body */}
          <CSSBox3D width={16} height={12} depth={10} color={accColor} x={32} y={torsoY + 22} z={6} />
          {/* Dog head */}
          <CSSBox3D width={12} height={12} depth={12} color={accColor} x={32} y={torsoY + 12} z={10} />
          {/* Snout */}
          <CSSBox3D width={8} height={6} depth={6} color={shade(accColor, 15)} x={32} y={torsoY + 16} z={18} />
          {/* Ears */}
          <CSSBox3D width={5} height={8} depth={4} color={shade(accColor, -10)} x={26} y={torsoY + 8} z={10} />
          <CSSBox3D width={5} height={8} depth={4} color={shade(accColor, -10)} x={38} y={torsoY + 8} z={10} />
          {/* Tail */}
          <CSSBox3D width={3} height={10} depth={3} color={accColor} x={22} y={torsoY + 16} z={2} rotateZ={-40} />
        </>
      );

    case "gacha_acc_sword":
      return (
        <>
          {/* Blade */}
          <CSSBox3D width={4} height={40} depth={2} color="#C0C0C0" x={-36} y={torsoY - 14} z={4}
            faceOverrides={{
              front: `linear-gradient(180deg, #E0E0E0 0%, ${accColor} 50%, #C0C0C0 100%)`,
            }}
          />
          {/* Guard */}
          <CSSBox3D width={14} height={4} depth={6} color="#FFD700" x={-36} y={torsoY + 8} z={4} />
          {/* Handle */}
          <CSSBox3D width={4} height={12} depth={4} color="#5D4037" x={-36} y={torsoY + 18} z={4} />
          {/* Pommel */}
          <CSSBox3D width={6} height={4} depth={6} color={accColor} x={-36} y={torsoY + 26} z={4} />
        </>
      );

    case "gacha_acc_shield":
      return (
        <>
          {/* Shield body */}
          <CSSBox3D width={24} height={28} depth={4} color={accColor} x={36} y={torsoY - 4} z={6}
            faceOverrides={{
              front: `radial-gradient(circle at 50% 40%, ${shade(accColor, 20)} 20%, ${accColor} 60%, ${shade(accColor, -15)} 100%)`,
            }}
          />
          {/* Center emblem */}
          <CSSBox3D width={8} height={8} depth={2} color={shade(accColor, -20)} x={36} y={torsoY - 4} z={9} />
        </>
      );

    default:
      return null;
  }
};

export default Accessory3D;
