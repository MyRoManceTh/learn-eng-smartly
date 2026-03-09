import { EquippedItems, DEFAULT_EQUIPPED } from "@/types/avatar";
import { getItemById } from "@/data/avatarItems";

interface RobloxAvatarProps {
  equipped?: EquippedItems;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  evolutionStage?: number;
}

const sizeMap = { sm: 120, md: 200, lg: 300 };
const OL = "#2A2A3C"; // outline color
const OW = 2.2; // outline width

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
  const skinShade = shade(skin, -15);
  const hairColor = hairColorItem?.svgProps?.color || "#2C2C2C";
  const shirtColor = shirtItem?.svgProps?.color || "#FFFFFF";
  const shirtShade = shade(shirtColor, -20);
  const pantsColor = pantsItem?.svgProps?.color || "#4A90E2";
  const pantsShade = shade(pantsColor, -15);
  const shoesColor = shoesItem?.svgProps?.color || "#FFFFFF";

  const isRainbowHair = hairColor === "rainbow";
  const isShorts = pantsItem?.id === "pants_shorts";
  const isSkirt = pantsItem?.id === "pants_skirt";

  const legTop = 168;
  const legH = isShorts ? 22 : isSkirt ? 0 : 38;
  const skinLegTop = legTop + legH;
  const skinLegH = isShorts ? 20 : isSkirt ? 42 : 4;
  const shoeY = legTop + 42;

  return (
    <svg
      width={dim}
      height={dim * 1.3}
      viewBox="0 0 200 260"
      className={animated ? "animate-avatar-idle" : ""}
      style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.18))" }}
    >
      <defs>
        {isRainbowHair && (
          <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4444" />
            <stop offset="20%" stopColor="#FF8C00" />
            <stop offset="40%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#00C853" />
            <stop offset="80%" stopColor="#448AFF" />
            <stop offset="100%" stopColor="#AA00FF" />
          </linearGradient>
        )}
        {evolutionStage >= 2 && (
          <filter id="evo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={evolutionStage >= 4 ? "8" : evolutionStage >= 3 ? "5" : "3"} result="blur" />
            <feFlood floodColor={
              evolutionStage >= 5 ? "#FFD700" :
              evolutionStage >= 4 ? "#9C27B0" :
              evolutionStage >= 3 ? "#2196F3" : "#4CAF50"
            } floodOpacity={evolutionStage >= 4 ? "0.35" : "0.2"} />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={evolutionStage >= 2 ? "url(#evo-glow)" : undefined}>

      {/* ========== CAPE / WINGS (behind body) ========== */}
      {accItem?.id === "acc_cape" && (
        <g>
          <path d="M 72 120 Q 56 165 62 222 L 80 214 Q 74 168 78 125 Z" fill={accItem.svgProps?.color || "#D32F2F"} stroke={OL} strokeWidth={1.5} opacity="0.85" />
          <path d="M 128 120 Q 144 165 138 222 L 120 214 Q 126 168 122 125 Z" fill={accItem.svgProps?.color || "#D32F2F"} stroke={OL} strokeWidth={1.5} opacity="0.85" />
        </g>
      )}
      {accItem?.id === "acc_wings" && (
        <g>
          <ellipse cx="46" cy="145" rx="30" ry="42" fill={accItem.svgProps?.color || "#80DEEA"} stroke={OL} strokeWidth={1.5} opacity="0.5" />
          <ellipse cx="38" cy="140" rx="18" ry="28" fill={accItem.svgProps?.color || "#80DEEA"} opacity="0.3" />
          <ellipse cx="154" cy="145" rx="30" ry="42" fill={accItem.svgProps?.color || "#80DEEA"} stroke={OL} strokeWidth={1.5} opacity="0.5" />
          <ellipse cx="162" cy="140" rx="18" ry="28" fill={accItem.svgProps?.color || "#80DEEA"} opacity="0.3" />
        </g>
      )}

      {/* ========== LEGS ========== */}
      {(isShorts || isSkirt) && (
        <>
          <rect x="80" y={skinLegTop} width="18" height={skinLegH} rx="3" fill={skin} stroke={OL} strokeWidth={OW} />
          <rect x="102" y={skinLegTop} width="18" height={skinLegH} rx="3" fill={skin} stroke={OL} strokeWidth={OW} />
          <rect x="93" y={skinLegTop} width="5" height={skinLegH} rx="1" fill={skinShade} opacity="0.25" />
          <rect x="115" y={skinLegTop} width="5" height={skinLegH} rx="1" fill={skinShade} opacity="0.25" />
        </>
      )}

      {isSkirt ? (
        <g>
          <polygon points="74,168 126,168 134,200 66,200" fill={pantsColor} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
          <line x1="90" y1="170" x2="87" y2="198" stroke={pantsShade} strokeWidth="1.5" opacity="0.35" />
          <line x1="110" y1="170" x2="113" y2="198" stroke={pantsShade} strokeWidth="1.5" opacity="0.35" />
          <path d="M 66 198 Q 80 203 100 200 Q 120 203 134 198" fill="none" stroke={pantsShade} strokeWidth="1.5" opacity="0.25" />
        </g>
      ) : (
        <>
          <rect x="80" y={legTop} width="18" height={legH} rx="3" fill={pantsColor} stroke={OL} strokeWidth={OW} />
          <rect x="102" y={legTop} width="18" height={legH} rx="3" fill={pantsColor} stroke={OL} strokeWidth={OW} />
          <rect x="93" y={legTop} width="5" height={legH} rx="1" fill={pantsShade} opacity="0.25" />
          <rect x="115" y={legTop} width="5" height={legH} rx="1" fill={pantsShade} opacity="0.25" />
          {pantsItem?.id === "pants_jeans" && (
            <>
              <rect x="82" y={legTop + 3} width="6" height="8" rx="1" fill="none" stroke="#FFFFFF22" strokeWidth="1.2" />
              <rect x="112" y={legTop + 3} width="6" height="8" rx="1" fill="none" stroke="#FFFFFF22" strokeWidth="1.2" />
              <line x1="89" y1={legTop} x2="89" y2={legTop + legH} stroke="#FFFFFF15" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="111" y1={legTop} x2="111" y2={legTop + legH} stroke="#FFFFFF15" strokeWidth="1" strokeDasharray="3,3" />
            </>
          )}
          {isShorts && (
            <>
              <rect x="80" y={legTop + legH - 4} width="18" height="4" rx="1" fill={pantsShade} opacity="0.2" />
              <rect x="102" y={legTop + legH - 4} width="18" height="4" rx="1" fill={pantsShade} opacity="0.2" />
            </>
          )}
        </>
      )}

      {/* ========== SHOES ========== */}
      <ShoeLayer shoeId={shoesItem?.id || "shoes_default"} color={shoesColor} y={shoeY} />

      {/* ========== BODY (Torso) / SHIRT ========== */}
      <ShirtLayer shirtId={shirtItem?.id || "shirt_default"} color={shirtColor} shirtShade={shirtShade} skin={skin} />

      {/* ========== ARMS ========== */}
      <rect x="60" y="118" width="14" height="40" rx="5" fill={skin} stroke={OL} strokeWidth={OW} />
      <rect x="60" y="118" width="14" height="20" rx="5" fill={shirtColor} stroke={OL} strokeWidth={OW} />
      <rect x="126" y="118" width="14" height="40" rx="5" fill={skin} stroke={OL} strokeWidth={OW} />
      <rect x="126" y="118" width="14" height="20" rx="5" fill={shirtColor} stroke={OL} strokeWidth={OW} />
      <rect x="70" y="118" width="4" height="20" rx="2" fill={shirtShade} opacity="0.2" />
      <rect x="126" y="118" width="4" height="20" rx="2" fill={shirtShade} opacity="0.2" />
      {/* Hands */}
      <circle cx="67" cy="161" r="7" fill={skin} stroke={OL} strokeWidth={OW} />
      <circle cx="133" cy="161" r="7" fill={skin} stroke={OL} strokeWidth={OW} />

      {/* ========== HEAD ========== */}
      <rect x="65" y="22" width="70" height="70" rx="10" fill={skin} stroke={OL} strokeWidth={OW} />
      <rect x="125" y="28" width="8" height="58" rx="4" fill={skinShade} opacity="0.15" />

      {/* ========== NECK ========== */}
      <rect x="90" y="88" width="20" height="28" rx="5" fill={skin} stroke={OL} strokeWidth={OW} />

      {/* ========== HAIR ========== */}
      <HairLayer hairStyle={hairItem?.svgProps?.path || "short"} color={isRainbowHair ? "url(#rainbow-grad)" : hairColor} />

      {/* ========== HAT ========== */}
      {hatItem && <HatLayer hat={hatItem.id} color={hatItem.svgProps?.color || "#333"} />}

      {/* ========== FACE (chibi cute!) ========== */}
      {/* Big round eyes with white sclera */}
      <ellipse cx="87" cy="54" rx="7" ry="7.5" fill="#FFFFFF" stroke={OL} strokeWidth={1.5} />
      <ellipse cx="113" cy="54" rx="7" ry="7.5" fill="#FFFFFF" stroke={OL} strokeWidth={1.5} />
      {/* Iris */}
      <circle cx="89" cy="55" r="5" fill="#4A3728" />
      <circle cx="115" cy="55" r="5" fill="#4A3728" />
      {/* Pupil */}
      <circle cx="89" cy="55" r="2.5" fill={OL} />
      <circle cx="115" cy="55" r="2.5" fill={OL} />
      {/* Eye shine */}
      <circle cx="91" cy="52" r="2.2" fill="#FFFFFF" />
      <circle cx="87" cy="56" r="1.2" fill="#FFFFFF" opacity="0.7" />
      <circle cx="117" cy="52" r="2.2" fill="#FFFFFF" />
      <circle cx="113" cy="56" r="1.2" fill="#FFFFFF" opacity="0.7" />
      {/* Blush */}
      <ellipse cx="78" cy="64" rx="6" ry="3.5" fill="#FF9999" opacity="0.45" />
      <ellipse cx="122" cy="64" rx="6" ry="3.5" fill="#FF9999" opacity="0.45" />
      {/* Cat mouth :3 */}
      <path d="M 95 67 Q 100 73 105 67" stroke={OL} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 95 67 Q 92 69 89 67" stroke={OL} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45" />
      <path d="M 105 67 Q 108 69 111 67" stroke={OL} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45" />
      {/* Tiny eyebrows */}
      <line x1="82" y1="44" x2="90" y2="45" stroke={OL} strokeWidth="1.8" strokeLinecap="round" opacity="0.25" />
      <line x1="118" y1="44" x2="110" y2="45" stroke={OL} strokeWidth="1.8" strokeLinecap="round" opacity="0.25" />

      {/* ========== GLASSES ========== */}
      {accItem?.id === "acc_glasses" && (
        <g>
          <rect x="78" y="47" width="18" height="16" rx="3" fill="#87CEEB" fillOpacity="0.15" stroke={OL} strokeWidth="2" />
          <rect x="104" y="47" width="18" height="16" rx="3" fill="#87CEEB" fillOpacity="0.15" stroke={OL} strokeWidth="2" />
          <line x1="96" y1="55" x2="104" y2="55" stroke={OL} strokeWidth="2" />
          <line x1="78" y1="53" x2="68" y2="50" stroke={OL} strokeWidth="1.5" />
          <line x1="122" y1="53" x2="132" y2="50" stroke={OL} strokeWidth="1.5" />
        </g>
      )}

      {/* ========== BACKPACK ========== */}
      {accItem?.id === "acc_backpack" && (
        <g>
          <rect x="132" y="118" width="18" height="42" rx="5" fill={accItem.svgProps?.color || "#E65100"} stroke={OL} strokeWidth={OW} />
          <rect x="135" y="122" width="12" height="10" rx="2" fill="#00000015" stroke={OL} strokeWidth="1" />
          <rect x="139" y="125" width="4" height="3" rx="1" fill="#00000020" />
          <line x1="140" y1="118" x2="138" y2="112" stroke={accItem.svgProps?.color || "#E65100"} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* ========== HEADPHONES OVER FACE ========== */}
      {hatItem?.id === "hat_headphones" && (
        <g>
          <rect x="78" y="47" width="16" height="16" rx="4" fill="#555" stroke={OL} strokeWidth="1.5" />
          <rect x="106" y="47" width="16" height="16" rx="4" fill="#555" stroke={OL} strokeWidth="1.5" />
          <rect x="80" y="49" width="12" height="12" rx="3" fill="#777" />
          <rect x="108" y="49" width="12" height="12" rx="3" fill="#777" />
        </g>
      )}

      {/* ========== EVOLUTION SPARKLES ========== */}
      {evolutionStage >= 3 && (
        <g>
          <circle cx="42" cy="28" r="2" fill="#FFD700" opacity="0.7">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="158" cy="48" r="2.5" fill="#FFD700" opacity="0.5">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <circle cx="48" cy="190" r="2" fill="#FFD700" opacity="0.6">
            <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="1s" />
          </circle>
          {evolutionStage >= 4 && (
            <>
              <circle cx="150" cy="170" r="3" fill="#E040FB" opacity="0.5">
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="0.3s" />
              </circle>
              <circle cx="32" cy="110" r="2" fill="#E040FB" opacity="0.4">
                <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" begin="0.8s" />
              </circle>
            </>
          )}
          {evolutionStage >= 5 && (
            <>
              <circle cx="168" cy="95" r="3.5" fill="#FFD700" opacity="0.8">
                <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;4;2" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="8" r="3" fill="#FFD700" opacity="0.6">
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

// ============================================================
// SHIRT LAYER
// ============================================================
const ShirtLayer = ({ shirtId, color, shirtShade, skin }: { shirtId: string; color: string; shirtShade: string; skin: string }) => {
  const base = (
    <>
      <rect x="74" y="112" width="52" height="58" rx="5" fill={color} stroke={OL} strokeWidth={OW} />
      <rect x="118" y="116" width="6" height="50" rx="3" fill={shirtShade} opacity="0.2" />
    </>
  );

  switch (shirtId) {
    case "shirt_striped":
      return (
        <g>
          {base}
          <rect x="76" y="122" width="48" height="5" rx="1" fill="#FFFFFF" opacity="0.45" />
          <rect x="76" y="134" width="48" height="5" rx="1" fill="#FFFFFF" opacity="0.45" />
          <rect x="76" y="146" width="48" height="5" rx="1" fill="#FFFFFF" opacity="0.45" />
          <rect x="76" y="158" width="48" height="5" rx="1" fill="#FFFFFF" opacity="0.45" />
          <path d="M 88 112 Q 100 120 112 112" fill={skin} stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case "shirt_hoodie":
      return (
        <g>
          {base}
          <path d="M 70 92 Q 68 76 82 70 L 118 70 Q 132 76 130 92 L 130 116 L 70 116 Z"
            fill={color} stroke={OL} strokeWidth={OW} />
          <path d="M 122 76 Q 128 80 128 92 L 128 114 L 124 114 L 124 90 Q 124 82 120 78 Z"
            fill={shirtShade} opacity="0.15" />
          <path d="M 82 112 Q 100 106 118 112" fill="none" stroke={OL} strokeWidth="1.5" />
          <line x1="92" y1="114" x2="90" y2="130" stroke="#FFFFFF40" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="108" y1="114" x2="110" y2="130" stroke="#FFFFFF40" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="90" cy="131" r="2" fill="#FFFFFF40" />
          <circle cx="110" cy="131" r="2" fill="#FFFFFF40" />
          <rect x="86" y="148" width="28" height="14" rx="3" fill="none" stroke="#FFFFFF28" strokeWidth="1.5" />
          <path d="M 86 155 L 114 155" stroke="#FFFFFF18" strokeWidth="1" />
        </g>
      );
    case "shirt_superhero":
      return (
        <g>
          {base}
          <path d="M 86 112 Q 100 116 114 112" fill="none" stroke={shirtShade} strokeWidth="1.5" />
          <circle cx="100" cy="138" r="12" fill="#FFD700" stroke={OL} strokeWidth="1.5" />
          <polygon points="100,128 103,134 109,135 104,139 106,145 100,142 94,145 96,139 91,135 97,134"
            fill="#FFFFFF" stroke={OL} strokeWidth="0.8" />
          <rect x="74" y="160" width="52" height="6" rx="2" fill="#FFD700" stroke={OL} strokeWidth="1.2" />
          <rect x="96" y="159" width="8" height="8" rx="1.5" fill="#FFD700" stroke={OL} strokeWidth="1" />
        </g>
      );
    case "shirt_tuxedo":
      return (
        <g>
          {base}
          <path d="M 90 112 L 82 138 L 94 130 Z" fill="#1A1A30" stroke={OL} strokeWidth="1.2" />
          <path d="M 110 112 L 118 138 L 106 130 Z" fill="#1A1A30" stroke={OL} strokeWidth="1.2" />
          <path d="M 92 112 L 100 128 L 108 112" fill="#FFFFFF" stroke={OL} strokeWidth="1" />
          <polygon points="94,115 100,118 106,115 100,120" fill="#C62828" stroke={OL} strokeWidth="1" />
          <circle cx="100" cy="117.5" r="2" fill="#E53935" stroke={OL} strokeWidth="0.8" />
          <circle cx="100" cy="142" r="2" fill="#2C2C2C" stroke="#FFFFFF30" strokeWidth="0.8" />
          <circle cx="100" cy="154" r="2" fill="#2C2C2C" stroke="#FFFFFF30" strokeWidth="0.8" />
          <path d="M 82 122 L 82 128 L 88 126 Z" fill="#E53935" opacity="0.8" />
        </g>
      );
    default:
      return (
        <g>
          {base}
          <path d="M 88 112 Q 100 120 112 112" fill={skin} stroke={OL} strokeWidth="1.5" />
          <path d="M 86 113 Q 100 122 114 113" fill="none" stroke={shirtShade} strokeWidth="1.2" opacity="0.25" />
        </g>
      );
  }
};

// ============================================================
// SHOE LAYER
// ============================================================
const ShoeLayer = ({ shoeId, color, y }: { shoeId: string; color: string; y: number }) => {
  switch (shoeId) {
    case "shoes_boots":
      return (
        <g>
          <rect x="76" y={y - 10} width="22" height="26" rx="4" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="102" y={y - 10} width="22" height="26" rx="4" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="74" y={y + 12} width="26" height="6" rx="3" fill={shade(color, -25)} stroke={OL} strokeWidth={OW} />
          <rect x="100" y={y + 12} width="26" height="6" rx="3" fill={shade(color, -25)} stroke={OL} strokeWidth={OW} />
          <rect x="78" y={y - 4} width="18" height="4" rx="1" fill={shade(color, -15)} stroke={OL} strokeWidth="1" />
          <rect x="104" y={y - 4} width="18" height="4" rx="1" fill={shade(color, -15)} stroke={OL} strokeWidth="1" />
        </g>
      );
    case "shoes_heels":
      return (
        <g>
          <rect x="76" y={y} width="22" height="12" rx="4" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="102" y={y} width="22" height="12" rx="4" fill={color} stroke={OL} strokeWidth={OW} />
          <polygon points={`82,${y + 12} 86,${y + 12} 84,${y + 20}`} fill={color} stroke={OL} strokeWidth="1.5" />
          <polygon points={`114,${y + 12} 118,${y + 12} 116,${y + 20}`} fill={color} stroke={OL} strokeWidth="1.5" />
          <path d={`M 76 ${y + 6} Q 72 ${y + 6} 72 ${y + 10} L 76 ${y + 12}`} fill={color} stroke={OL} strokeWidth="1.5" />
          <path d={`M 124 ${y + 6} Q 128 ${y + 6} 128 ${y + 10} L 124 ${y + 12}`} fill={color} stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case "shoes_rocket":
      return (
        <g>
          <rect x="74" y={y - 4} width="26" height="18" rx="5" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="100" y={y - 4} width="26" height="18" rx="5" fill={color} stroke={OL} strokeWidth={OW} />
          <polygon points={`74,${y + 4} 68,${y + 14} 76,${y + 10}`} fill="#FF6D00" stroke={OL} strokeWidth="1.2" />
          <polygon points={`126,${y + 4} 132,${y + 14} 124,${y + 10}`} fill="#FF6D00" stroke={OL} strokeWidth="1.2" />
          <ellipse cx="87" cy={y + 16} rx="6" ry="3" fill="#FFD600" opacity="0.7" />
          <ellipse cx="113" cy={y + 16} rx="6" ry="3" fill="#FFD600" opacity="0.7" />
          <polygon points={`84,${y + 14} 87,${y + 28} 90,${y + 14}`} fill="#FF6D00" opacity="0.8" />
          <polygon points={`82,${y + 14} 87,${y + 22} 92,${y + 14}`} fill="#FFD600" opacity="0.9" />
          <polygon points={`110,${y + 14} 113,${y + 28} 116,${y + 14}`} fill="#FF6D00" opacity="0.8" />
          <polygon points={`108,${y + 14} 113,${y + 22} 118,${y + 14}`} fill="#FFD600" opacity="0.9" />
        </g>
      );
    default:
      return (
        <g>
          <rect x="74" y={y} width="26" height="14" rx="5" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="100" y={y} width="26" height="14" rx="5" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="74" y={y + 10} width="26" height="4" rx="2" fill={shade(color, -20)} opacity="0.4" />
          <rect x="100" y={y + 10} width="26" height="4" rx="2" fill={shade(color, -20)} opacity="0.4" />
          <line x1="80" y1={y + 3} x2="94" y2={y + 3} stroke={shade(color, -30)} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
          <line x1="106" y1={y + 3} x2="120" y2={y + 3} stroke={shade(color, -30)} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
          <circle cx="79" cy={y + 6} r="3" fill={shade(color, -10)} opacity="0.15" />
          <circle cx="121" cy={y + 6} r="3" fill={shade(color, -10)} opacity="0.15" />
        </g>
      );
  }
};

// ============================================================
// HAIR LAYER
// ============================================================
const HairLayer = ({ hairStyle, color }: { hairStyle: string; color: string }) => {
  switch (hairStyle) {
    case "short":
      return (
        <g>
          <path d="M 65 50 Q 65 14 100 10 Q 135 14 135 50 L 135 35 Q 135 18 100 14 Q 65 18 65 35 Z" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="65" y="22" width="70" height="14" rx="7" fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    case "long":
      return (
        <g>
          <path d="M 62 50 Q 62 10 100 6 Q 138 10 138 50" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="62" y="22" width="76" height="16" rx="7" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="58" y="38" width="14" height="65" rx="6" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="128" y="38" width="14" height="65" rx="6" fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    case "ponytail":
      return (
        <g>
          <path d="M 65 50 Q 65 14 100 10 Q 135 14 135 50 L 135 35 Q 135 18 100 14 Q 65 18 65 35 Z" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="65" y="22" width="70" height="14" rx="7" fill={color} stroke={OL} strokeWidth={OW} />
          <circle cx="100" cy="14" r="8" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="96" y="14" width="8" height="50" rx="4" fill={color} stroke={OL} strokeWidth={OW} />
          <ellipse cx="100" cy="65" rx="7" ry="5" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="94" y="18" width="12" height="5" rx="2" fill="#FF4081" stroke={OL} strokeWidth="1" />
        </g>
      );
    case "bun":
      return (
        <g>
          <path d="M 65 50 Q 65 14 100 10 Q 135 14 135 50 L 135 35 Q 135 18 100 14 Q 65 18 65 35 Z" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="65" y="22" width="70" height="14" rx="7" fill={color} stroke={OL} strokeWidth={OW} />
          <circle cx="100" cy="12" r="14" fill={color} stroke={OL} strokeWidth={OW} />
          <circle cx="104" cy="8" r="3" fill="#FFFFFF" opacity="0.15" />
        </g>
      );
    case "curly":
      return (
        <g>
          <path d="M 60 55 Q 58 10 100 6 Q 142 10 140 55" fill={color} stroke={OL} strokeWidth={OW} />
          <circle cx="62" cy="32" r="10" fill={color} stroke={OL} strokeWidth="1.5" />
          <circle cx="138" cy="32" r="10" fill={color} stroke={OL} strokeWidth="1.5" />
          <circle cx="68" cy="50" r="8" fill={color} stroke={OL} strokeWidth="1.5" />
          <circle cx="132" cy="50" r="8" fill={color} stroke={OL} strokeWidth="1.5" />
          <circle cx="82" cy="14" r="9" fill={color} stroke={OL} strokeWidth="1.5" />
          <circle cx="118" cy="14" r="9" fill={color} stroke={OL} strokeWidth="1.5" />
          <circle cx="100" cy="8" r="10" fill={color} stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case "spike":
      return (
        <g>
          <rect x="65" y="22" width="70" height="14" rx="7" fill={color} stroke={OL} strokeWidth={OW} />
          <polygon points="72,24 80,0 88,24" fill={color} stroke={OL} strokeWidth="1.5" />
          <polygon points="86,22 96,-2 106,22" fill={color} stroke={OL} strokeWidth="1.5" />
          <polygon points="100,24 110,2 120,24" fill={color} stroke={OL} strokeWidth="1.5" />
          <polygon points="116,26 124,8 132,30" fill={color} stroke={OL} strokeWidth="1.5" />
        </g>
      );
    case "afro":
      return (
        <g>
          <ellipse cx="100" cy="38" rx="44" ry="40" fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    case "mohawk":
      return (
        <g>
          <rect x="65" y="22" width="70" height="12" rx="6" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="92" y="-2" width="16" height="32" rx="5" fill={color} stroke={OL} strokeWidth={OW} />
          <ellipse cx="100" cy="0" rx="10" ry="6" fill={color} stroke={OL} strokeWidth={OW} />
        </g>
      );
    default:
      return null;
  }
};

// ============================================================
// HAT LAYER
// ============================================================
const HatLayer = ({ hat, color }: { hat: string; color: string }) => {
  switch (hat) {
    case "hat_baseball":
      return (
        <g>
          <ellipse cx="100" cy="26" rx="38" ry="12" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="64" y="14" width="72" height="16" rx="7" fill={color} stroke={OL} strokeWidth={OW} />
          <ellipse cx="82" cy="30" rx="30" ry="7" fill={color} stroke={OL} strokeWidth={OW} />
          <circle cx="100" cy="14" r="3" fill={shade(color, -20)} stroke={OL} strokeWidth="1" />
        </g>
      );
    case "hat_beanie":
      return (
        <g>
          <path d="M 62 36 Q 62 6 100 2 Q 138 6 138 36" fill={color} stroke={OL} strokeWidth={OW} />
          <rect x="62" y="30" width="76" height="10" rx="4" fill={color} stroke={OL} strokeWidth={OW} />
          <line x1="66" y1="34" x2="134" y2="34" stroke="#FFFFFF25" strokeWidth="2" />
          <circle cx="100" cy="4" r="8" fill={color} stroke={OL} strokeWidth={OW} />
          <circle cx="96" cy="2" r="2" fill="#FFFFFF" opacity="0.2" />
        </g>
      );
    case "hat_crown":
      return (
        <g>
          <rect x="66" y="16" width="68" height="18" rx="3" fill={color} stroke={OL} strokeWidth={OW} />
          <polygon points="66,16 72,0 82,16" fill={color} stroke={OL} strokeWidth="1.5" />
          <polygon points="88,16 100,-4 112,16" fill={color} stroke={OL} strokeWidth="1.5" />
          <polygon points="118,16 128,0 134,16" fill={color} stroke={OL} strokeWidth="1.5" />
          <circle cx="77" cy="24" r="4" fill="#E53935" stroke={OL} strokeWidth="1" />
          <circle cx="100" cy="24" r="4" fill="#2196F3" stroke={OL} strokeWidth="1" />
          <circle cx="123" cy="24" r="4" fill="#4CAF50" stroke={OL} strokeWidth="1" />
          <rect x="66" y="30" width="68" height="4" rx="2" fill={shade(color, -15)} opacity="0.4" />
        </g>
      );
    case "hat_wizard":
      return (
        <g>
          <ellipse cx="100" cy="28" rx="40" ry="10" fill={color} stroke={OL} strokeWidth={OW} />
          <polygon points="72,28 100,-18 128,28" fill={color} stroke={OL} strokeWidth={OW} />
          <polygon points="108,6 110,0 112,6 118,6 113,10 115,16 110,12 105,16 107,10 102,6" fill="#FFD700" stroke={OL} strokeWidth="0.8" />
          <circle cx="90" cy="18" r="2.5" fill="#FFD700" />
          <circle cx="118" cy="20" r="1.5" fill="#FFD700" opacity="0.7" />
          <rect x="72" y="24" width="56" height="5" rx="2" fill={shade(color, 20)} stroke={OL} strokeWidth="1" />
        </g>
      );
    case "hat_santa":
      return (
        <g>
          <rect x="62" y="22" width="76" height="12" rx="6" fill="#FFFFFF" stroke={OL} strokeWidth={OW} />
          <path d="M 68 22 Q 80,0 124,4 L 142,0" fill={color} stroke={OL} strokeWidth={OW} />
          <circle cx="142" cy="0" r="9" fill="#FFFFFF" stroke={OL} strokeWidth={OW} />
          <circle cx="140" cy="-2" r="2" fill="#EEE" opacity="0.3" />
        </g>
      );
    case "hat_headphones":
      return (
        <g>
          <path d="M 62 50 Q 62 10 100 6 Q 138 10 138 50" fill="none" stroke="#444" strokeWidth="6" strokeLinecap="round" />
          <path d="M 62 50 Q 62 10 100 6 Q 138 10 138 50" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
};

// ============================================================
// UTILITY
// ============================================================
function shade(hex: string, percent: number): string {
  if (hex.startsWith("url") || hex === "rainbow") return hex;
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default RobloxAvatar;
