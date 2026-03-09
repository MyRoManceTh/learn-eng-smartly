import { EquippedItems, DEFAULT_EQUIPPED } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";

interface RobloxAvatarProps {
  equipped?: EquippedItems;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  evolutionStage?: number;
}

const sizeMap = { sm: 120, md: 200, lg: 300 };

const RobloxAvatar = ({ equipped = DEFAULT_EQUIPPED, size = "md", animated = false, evolutionStage = 1 }: RobloxAvatarProps) => {
  const dim = sizeMap[size];

  const skinItem = getItemById(equipped.skin);
  const hairItem = getItemById(equipped.hair);
  const hairColorItem = getItemById(equipped.hairColor);
  const hatItem = equipped.hat ? getItemById(equipped.hat) : null;
  const shirtItem = getItemById(equipped.shirt);
  const pantsItem = getItemById(equipped.pants);
  const shoesItem = getItemById(equipped.shoes);
  const accItem = equipped.accessory ? getItemById(equipped.accessory) : null;

  const skin = skinItem?.svgProps?.color || "#F5D5C0";
  const hairColor = hairColorItem?.svgProps?.color || "#2C2C2C";
  const shirtColor = shirtItem?.svgProps?.color || "#FFFFFF";
  const pantsColor = pantsItem?.svgProps?.color || "#4A90E2";
  const shoesColor = shoesItem?.svgProps?.color || "#FFFFFF";

  const isRainbowHair = hairColor === "rainbow";

  return (
    <svg
      width={dim}
      height={dim * 1.4}
      viewBox="0 0 200 280"
      className={animated ? "animate-avatar-idle" : ""}
      style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
    >
      <defs>
        {isRainbowHair && (
          <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="20%" stopColor="#FF8C00" />
            <stop offset="40%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#00C853" />
            <stop offset="80%" stopColor="#2196F3" />
            <stop offset="100%" stopColor="#9C27B0" />
          </linearGradient>
        )}
        {shirtItem?.svgProps?.pattern === "stripes" && (
          <pattern id="stripes-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <rect width="4" height="8" fill={shirtColor} />
            <rect x="4" width="4" height="8" fill="#FFFFFF" />
          </pattern>
        )}
        {shirtItem?.svgProps?.pattern === "hero" && (
          <pattern id="hero-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill={shirtColor} />
            <polygon points="15,5 18,12 25,12 19,17 21,24 15,20 9,24 11,17 5,12 12,12" fill="#FFD700" />
          </pattern>
        )}
        {/* Evolution Effects */}
        {evolutionStage >= 2 && (
          <filter id="evolution-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={evolutionStage >= 4 ? "8" : evolutionStage >= 3 ? "5" : "3"} result="blur" />
            <feFlood floodColor={
              evolutionStage >= 5 ? "#FFD700" :
              evolutionStage >= 4 ? "#9C27B0" :
              evolutionStage >= 3 ? "#2196F3" : "#4CAF50"
            } floodOpacity={evolutionStage >= 4 ? "0.4" : "0.25"} />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={evolutionStage >= 2 ? "url(#evolution-glow)" : undefined}>

      {/* === CAPE (behind body) === */}
      {accItem?.id === "acc_cape" && (
        <g className="cape-layer">
          <path
            d="M 68 110 Q 55 160 60 230 L 80 220 Q 75 170 80 120 Z"
            fill={accItem.svgProps?.color || "#D32F2F"}
            opacity="0.9"
          />
          <path
            d="M 132 110 Q 145 160 140 230 L 120 220 Q 125 170 120 120 Z"
            fill={accItem.svgProps?.color || "#D32F2F"}
            opacity="0.9"
          />
        </g>
      )}

      {/* === WINGS (behind body) === */}
      {accItem?.id === "acc_wings" && (
        <g className="wings-layer">
          <ellipse cx="45" cy="140" rx="30" ry="45" fill={accItem.svgProps?.color || "#80DEEA"} opacity="0.6" />
          <ellipse cx="35" cy="135" rx="20" ry="35" fill={accItem.svgProps?.color || "#80DEEA"} opacity="0.4" />
          <ellipse cx="155" cy="140" rx="30" ry="45" fill={accItem.svgProps?.color || "#80DEEA"} opacity="0.6" />
          <ellipse cx="165" cy="135" rx="20" ry="35" fill={accItem.svgProps?.color || "#80DEEA"} opacity="0.4" />
        </g>
      )}

      {/* === LEGS === */}
      <rect x="78" y="192" width="20" height="55" rx="4" fill={pantsColor} />
      <rect x="102" y="192" width="20" height="55" rx="4" fill={pantsColor} />

      {/* Shoes */}
      <rect x="74" y="240" width="28" height="16" rx="6" fill={shoesColor} stroke="#00000020" strokeWidth="1" />
      <rect x="98" y="240" width="28" height="16" rx="6" fill={shoesColor} stroke="#00000020" strokeWidth="1" />
      {shoesItem?.id === "shoes_rocket" && (
        <>
          <polygon points="82,256 88,256 85,270" fill="#FF6D00" opacity="0.8" />
          <polygon points="80,256 90,256 85,265" fill="#FFD600" opacity="0.9" />
          <polygon points="108,256 118,256 113,270" fill="#FF6D00" opacity="0.8" />
          <polygon points="106,256 120,256 113,265" fill="#FFD600" opacity="0.9" />
        </>
      )}

      {/* === BODY (torso) === */}
      <rect x="72" y="110" width="56" height="85" rx="6" fill={shirtColor} />
      {shirtItem?.svgProps?.pattern === "stripes" && (
        <rect x="72" y="110" width="56" height="85" rx="6" fill="url(#stripes-pattern)" />
      )}
      {shirtItem?.svgProps?.pattern === "hero" && (
        <rect x="72" y="110" width="56" height="85" rx="6" fill="url(#hero-pattern)" />
      )}
      {/* Shirt collar */}
      <path d="M 88 110 L 100 120 L 112 110" fill="none" stroke="#00000015" strokeWidth="2" />
      {/* Tuxedo lapels */}
      {shirtItem?.id === "shirt_tuxedo" && (
        <>
          <path d="M 88 110 L 80 140 L 95 130 Z" fill="#2C2C2C" />
          <path d="M 112 110 L 120 140 L 105 130 Z" fill="#2C2C2C" />
          <circle cx="100" cy="145" r="3" fill="#FFFFFF" />
          <circle cx="100" cy="158" r="3" fill="#FFFFFF" />
          <circle cx="100" cy="171" r="3" fill="#FFFFFF" />
        </>
      )}
      {/* Hoodie hood outline */}
      {shirtItem?.id === "shirt_hoodie" && (
        <>
          <path d="M 82 110 Q 100 100 118 110" fill="none" stroke="#00000020" strokeWidth="3" />
          <rect x="90" y="160" width="20" height="15" rx="4" fill="#00000015" />
        </>
      )}

      {/* === ARMS === */}
      <rect x="56" y="115" width="16" height="55" rx="6" fill={skin} />
      <rect x="128" y="115" width="16" height="55" rx="6" fill={skin} />
      {/* Shirt sleeves */}
      <rect x="56" y="115" width="16" height="25" rx="6"
        fill={shirtItem?.svgProps?.pattern === "stripes" ? "url(#stripes-pattern)" : shirtColor}
      />
      <rect x="128" y="115" width="16" height="25" rx="6"
        fill={shirtItem?.svgProps?.pattern === "stripes" ? "url(#stripes-pattern)" : shirtColor}
      />
      {/* Hands */}
      <circle cx="64" cy="173" r="8" fill={skin} />
      <circle cx="136" cy="173" r="8" fill={skin} />

      {/* === HEAD === */}
      <rect x="75" y="30" width="50" height="50" rx="12" fill={skin} />
      {/* Ears */}
      <circle cx="75" cy="55" r="6" fill={skin} />
      <circle cx="125" cy="55" r="6" fill={skin} />

      {/* === NECK === */}
      <rect x="92" y="78" width="16" height="35" rx="4" fill={skin} />

      {/* === HAIR === */}
      <HairLayer hairStyle={hairItem?.svgProps?.path || "short"} color={isRainbowHair ? "url(#rainbow-grad)" : hairColor} />

      {/* === HAT === */}
      {hatItem && <HatLayer hat={hatItem.id} color={hatItem.svgProps?.color || "#333"} />}

      {/* === FACE === */}
      {/* Eyes */}
      <circle cx="90" cy="52" r="4" fill="#2C2C2C" />
      <circle cx="110" cy="52" r="4" fill="#2C2C2C" />
      {/* Eye shine */}
      <circle cx="91.5" cy="50.5" r="1.5" fill="#FFFFFF" />
      <circle cx="111.5" cy="50.5" r="1.5" fill="#FFFFFF" />
      {/* Blush */}
      <ellipse cx="84" cy="60" rx="5" ry="3" fill="#FFB4B4" opacity="0.4" />
      <ellipse cx="116" cy="60" rx="5" ry="3" fill="#FFB4B4" opacity="0.4" />
      {/* Mouth - smile */}
      <path d="M 93 63 Q 100 70 107 63" stroke="#2C2C2C" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* === GLASSES ACCESSORY === */}
      {accItem?.id === "acc_glasses" && (
        <g className="glasses-layer">
          <circle cx="90" cy="52" r="8" fill="none" stroke="#212121" strokeWidth="2" />
          <circle cx="110" cy="52" r="8" fill="none" stroke="#212121" strokeWidth="2" />
          <line x1="98" y1="52" x2="102" y2="52" stroke="#212121" strokeWidth="2" />
          <line x1="82" y1="52" x2="75" y2="50" stroke="#212121" strokeWidth="1.5" />
          <line x1="118" y1="52" x2="125" y2="50" stroke="#212121" strokeWidth="1.5" />
          {/* Lens tint */}
          <circle cx="90" cy="52" r="7" fill="#87CEEB" opacity="0.15" />
          <circle cx="110" cy="52" r="7" fill="#87CEEB" opacity="0.15" />
        </g>
      )}

      {/* === BACKPACK ACCESSORY === */}
      {accItem?.id === "acc_backpack" && (
        <g className="backpack-layer">
          <rect x="130" y="115" width="22" height="55" rx="6" fill={accItem.svgProps?.color || "#E65100"} />
          <rect x="133" y="120" width="16" height="12" rx="3" fill="#00000015" />
          <line x1="141" y1="115" x2="141" y2="110" stroke={accItem.svgProps?.color || "#E65100"} strokeWidth="3" />
        </g>
      )}

      {/* === HEADPHONES (on hat layer) === */}
      {hatItem?.id === "hat_headphones" && (
        <g className="headphones-over-face">
          <circle cx="90" cy="52" r="6" fill="none" stroke="#333" strokeWidth="3" />
          <circle cx="110" cy="52" r="6" fill="none" stroke="#333" strokeWidth="3" />
        </g>
      )}
      {/* Evolution sparkle particles */}
      {evolutionStage >= 3 && (
        <g className="sparkle-particles">
          <circle cx="40" cy="30" r="2" fill="#FFD700" opacity="0.7">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="160" cy="50" r="2.5" fill="#FFD700" opacity="0.5">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <circle cx="50" cy="200" r="2" fill="#FFD700" opacity="0.6">
            <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="1s" />
          </circle>
          {evolutionStage >= 4 && (
            <>
              <circle cx="150" cy="180" r="3" fill="#E040FB" opacity="0.5">
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="0.3s" />
              </circle>
              <circle cx="30" cy="120" r="2" fill="#E040FB" opacity="0.4">
                <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" begin="0.8s" />
              </circle>
            </>
          )}
          {evolutionStage >= 5 && (
            <>
              <circle cx="170" cy="100" r="3.5" fill="#FFD700" opacity="0.8">
                <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;4;2" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="10" r="3" fill="#FFD700" opacity="0.6">
                <animate attributeName="opacity" values="0;0.6;0" dur="1.5s" repeatCount="indefinite" begin="0.4s" />
                <animate attributeName="r" values="2;3.5;2" dur="1.5s" repeatCount="indefinite" begin="0.4s" />
              </circle>
            </>
          )}
        </g>
      )}
      </g>
    </svg>
  );
};

// === Hair Styles ===
const HairLayer = ({ hairStyle, color }: { hairStyle: string; color: string }) => {
  switch (hairStyle) {
    case "short":
      return (
        <g>
          <path d="M 75 50 Q 75 22 100 20 Q 125 22 125 50 L 125 40 Q 125 25 100 23 Q 75 25 75 40 Z" fill={color} />
          <rect x="75" y="30" width="50" height="12" rx="6" fill={color} />
        </g>
      );
    case "long":
      return (
        <g>
          <path d="M 73 50 Q 73 18 100 16 Q 127 18 127 50" fill={color} />
          <rect x="73" y="30" width="54" height="14" rx="6" fill={color} />
          {/* Long hair sides */}
          <rect x="70" y="40" width="12" height="65" rx="5" fill={color} />
          <rect x="118" y="40" width="12" height="65" rx="5" fill={color} />
        </g>
      );
    case "ponytail":
      return (
        <g>
          <path d="M 75 50 Q 75 22 100 20 Q 125 22 125 50 L 125 40 Q 125 25 100 23 Q 75 25 75 40 Z" fill={color} />
          <rect x="75" y="30" width="50" height="12" rx="6" fill={color} />
          {/* Ponytail */}
          <ellipse cx="100" cy="25" rx="8" ry="5" fill={color} />
          <rect x="96" y="20" width="8" height="45" rx="4" fill={color} />
          <ellipse cx="100" cy="65" rx="6" ry="4" fill={color} />
        </g>
      );
    case "bun":
      return (
        <g>
          <path d="M 75 50 Q 75 22 100 20 Q 125 22 125 50 L 125 40 Q 125 25 100 23 Q 75 25 75 40 Z" fill={color} />
          <rect x="75" y="30" width="50" height="12" rx="6" fill={color} />
          {/* Bun */}
          <circle cx="100" cy="22" r="12" fill={color} />
        </g>
      );
    case "curly":
      return (
        <g>
          <path d="M 72 55 Q 70 18 100 15 Q 130 18 128 55" fill={color} />
          {/* Curly bumps */}
          <circle cx="74" cy="35" r="8" fill={color} />
          <circle cx="126" cy="35" r="8" fill={color} />
          <circle cx="78" cy="50" r="7" fill={color} />
          <circle cx="122" cy="50" r="7" fill={color} />
          <circle cx="88" cy="22" r="7" fill={color} />
          <circle cx="112" cy="22" r="7" fill={color} />
          <circle cx="100" cy="18" r="8" fill={color} />
        </g>
      );
    case "spike":
      return (
        <g>
          <rect x="75" y="30" width="50" height="12" rx="6" fill={color} />
          {/* Spikes */}
          <polygon points="80,30 85,8 90,30" fill={color} />
          <polygon points="90,28 97,5 104,28" fill={color} />
          <polygon points="103,30 110,10 117,30" fill={color} />
          <polygon points="115,32 120,15 125,35" fill={color} />
        </g>
      );
    case "afro":
      return (
        <g>
          <ellipse cx="100" cy="42" rx="38" ry="35" fill={color} />
        </g>
      );
    case "mohawk":
      return (
        <g>
          <rect x="75" y="30" width="50" height="10" rx="5" fill={color} />
          {/* Mohawk strip */}
          <rect x="94" y="5" width="12" height="30" rx="4" fill={color} />
          <ellipse cx="100" cy="7" rx="8" ry="5" fill={color} />
        </g>
      );
    default:
      return null;
  }
};

// === Hat Styles ===
const HatLayer = ({ hat, color }: { hat: string; color: string }) => {
  switch (hat) {
    case "hat_baseball":
      return (
        <g>
          <ellipse cx="100" cy="32" rx="30" ry="10" fill={color} />
          <rect x="74" y="22" width="52" height="14" rx="6" fill={color} />
          {/* Brim */}
          <ellipse cx="85" cy="35" rx="25" ry="6" fill={color} />
        </g>
      );
    case "hat_beanie":
      return (
        <g>
          <path d="M 73 40 Q 73 15 100 12 Q 127 15 127 40" fill={color} />
          <rect x="73" y="35" width="54" height="8" rx="3" fill={color} />
          {/* Fold line */}
          <line x1="76" y1="38" x2="124" y2="38" stroke="#FFFFFF20" strokeWidth="2" />
          {/* Pom */}
          <circle cx="100" cy="14" r="6" fill={color} />
        </g>
      );
    case "hat_crown":
      return (
        <g>
          <rect x="76" y="22" width="48" height="14" rx="2" fill={color} />
          {/* Crown points */}
          <polygon points="76,22 80,8 88,22" fill={color} />
          <polygon points="92,22 100,5 108,22" fill={color} />
          <polygon points="112,22 120,8 124,22" fill={color} />
          {/* Jewels */}
          <circle cx="84" cy="28" r="3" fill="#E53935" />
          <circle cx="100" cy="28" r="3" fill="#2196F3" />
          <circle cx="116" cy="28" r="3" fill="#4CAF50" />
        </g>
      );
    case "hat_wizard":
      return (
        <g>
          <ellipse cx="100" cy="33" rx="32" ry="8" fill={color} />
          <polygon points="80,33 100,-10 120,33" fill={color} />
          {/* Stars */}
          <polygon points="105,10 107,5 109,10 114,10 110,14 112,19 107,16 102,19 104,14 100,10" fill="#FFD700" />
          <circle cx="92" cy="22" r="2" fill="#FFD700" />
        </g>
      );
    case "hat_santa":
      return (
        <g>
          <rect x="73" y="28" width="54" height="10" rx="5" fill="#FFFFFF" />
          <path d="M 78 28 Q 85 5 120 10 L 135 8" fill={color} />
          {/* Pom */}
          <circle cx="135" cy="8" r="8" fill="#FFFFFF" />
        </g>
      );
    case "hat_headphones":
      return (
        <g>
          {/* Headband */}
          <path d="M 72 50 Q 72 18 100 15 Q 128 18 128 50" fill="none" stroke="#333" strokeWidth="5" strokeLinecap="round" />
          {/* Ear cups */}
          <rect x="65" y="43" width="14" height="18" rx="5" fill="#444" />
          <rect x="121" y="43" width="14" height="18" rx="5" fill="#444" />
          {/* Padding */}
          <rect x="67" y="46" width="10" height="12" rx="3" fill="#666" />
          <rect x="123" y="46" width="10" height="12" rx="3" fill="#666" />
        </g>
      );
    default:
      return null;
  }
};

export default RobloxAvatar;
