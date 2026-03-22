import React from "react";

interface Aura3DProps {
  auraId: string | null;
  containerSize: number;
}

/**
 * Renders aura effects as CSS animations around the avatar.
 * Uses absolute positioned divs outside the 3D scene for best visual effect.
 */
const Aura3D: React.FC<Aura3DProps> = ({ auraId, containerSize }) => {
  if (!auraId) return null;

  const center = containerSize / 2;

  switch (auraId) {
    // ── Fire Aura ──
    case "aura_fire":
      return (
        <>
          {/* Outer fire ring */}
          <div style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,109,0,0.25) 0%, rgba(255,143,0,0.15) 50%, transparent 75%)",
            animation: "aura-pulse 1.2s ease-in-out infinite",
          }} />
          {/* Flame particles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              position: "absolute",
              width: 6,
              height: 14,
              borderRadius: "50% 50% 30% 30%",
              background: `linear-gradient(180deg, #FFCA28, #FF6D00)`,
              left: `${15 + i * 17}%`,
              bottom: "5%",
              opacity: 0.8,
              animation: `aura-flame ${0.8 + i * 0.15}s ease-in-out infinite ${i * 0.2}s`,
            }} />
          ))}
        </>
      );

    // ── Ice Aura ──
    case "aura_ice":
      return (
        <>
          <div style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(179,229,252,0.3) 0%, rgba(129,212,250,0.15) 50%, transparent 75%)",
            animation: "aura-pulse 2s ease-in-out infinite",
          }} />
          {/* Ice crystals */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              position: "absolute",
              width: 4,
              height: 10,
              background: "linear-gradient(180deg, #E1F5FE, #B3E5FC)",
              left: `${20 + i * 20}%`,
              top: `${5 + (i % 2) * 8}%`,
              opacity: 0.7,
              animation: `aura-sparkle ${1.5 + i * 0.3}s ease-in-out infinite ${i * 0.4}s`,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }} />
          ))}
        </>
      );

    // ── Lightning Aura ──
    case "aura_lightning":
      return (
        <>
          <div style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,214,0,0.2) 0%, rgba(255,193,7,0.1) 50%, transparent 70%)",
            animation: "aura-pulse 0.8s ease-in-out infinite",
          }} />
          {/* Lightning bolts */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              position: "absolute",
              width: 3,
              height: 20,
              background: "linear-gradient(180deg, #FFFFFF, #FFD600, #FF8F00)",
              left: `${25 + i * 25}%`,
              top: `${8 + (i % 2) * 10}%`,
              opacity: 0.9,
              animation: `aura-zap ${0.6 + i * 0.2}s ease-in-out infinite ${i * 0.3}s`,
              clipPath: "polygon(40% 0%, 100% 40%, 60% 40%, 100% 100%, 0% 55%, 40% 55%)",
            }} />
          ))}
        </>
      );

    // ── Dark Aura ──
    case "aura_dark":
      return (
        <>
          <div style={{
            position: "absolute",
            inset: -12,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,20,140,0.3) 0%, rgba(49,27,146,0.2) 40%, transparent 70%)",
            animation: "aura-pulse 1.8s ease-in-out infinite",
          }} />
          {/* Dark orbs */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "radial-gradient(circle, #CE93D8, #4A148C)",
              left: `${10 + i * 22}%`,
              top: `${10 + (i % 2) * 70}%`,
              opacity: 0.7,
              animation: `aura-orbit ${2 + i * 0.5}s linear infinite ${i * 0.5}s`,
            }} />
          ))}
        </>
      );

    // ── Super Saiyan Aura ── (ออร่าซุปเปอร์ไซย่า)
    case "aura_supersaiyan":
      return (
        <>
          {/* Main golden energy field */}
          <div style={{
            position: "absolute",
            inset: -16,
            borderRadius: "40% 40% 50% 50%",
            background: "radial-gradient(ellipse at 50% 70%, rgba(255,214,0,0.5) 0%, rgba(255,193,7,0.3) 30%, rgba(255,152,0,0.15) 60%, transparent 80%)",
            animation: "ssj-aura 0.6s ease-in-out infinite alternate",
          }} />
          {/* Secondary flare */}
          <div style={{
            position: "absolute",
            inset: -8,
            borderRadius: "35% 35% 50% 50%",
            background: "radial-gradient(ellipse at 50% 80%, rgba(255,255,255,0.4) 0%, rgba(255,214,0,0.3) 25%, transparent 65%)",
            animation: "ssj-aura 0.4s ease-in-out infinite alternate-reverse",
          }} />
          {/* Energy spikes rising up */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{
              position: "absolute",
              width: 5 + (i % 3) * 3,
              height: 30 + (i % 3) * 20,
              background: `linear-gradient(180deg, transparent, rgba(255,214,0,0.9), rgba(255,255,255,0.6))`,
              left: `${8 + i * 15}%`,
              bottom: "10%",
              borderRadius: "50% 50% 0 0",
              opacity: 0.85,
              animation: `ssj-spike ${0.5 + i * 0.1}s ease-in-out infinite ${i * 0.1}s alternate`,
              transformOrigin: "bottom center",
            }} />
          ))}
          {/* Ground energy ring */}
          <div style={{
            position: "absolute",
            bottom: "5%",
            left: "10%",
            right: "10%",
            height: 12,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,214,0,0.6) 0%, rgba(255,193,7,0.3) 50%, transparent 80%)",
            animation: "ssj-ring 0.5s ease-in-out infinite alternate",
          }} />
          {/* Electric sparks */}
          {[0, 1, 2, 3].map((i) => (
            <div key={`spark-${i}`} style={{
              position: "absolute",
              width: 3,
              height: 12,
              background: "linear-gradient(180deg, #FFFFFF, #FFD600)",
              left: `${15 + i * 20}%`,
              top: `${15 + (i % 2) * 20}%`,
              opacity: 0.9,
              animation: `ssj-spark ${0.3 + i * 0.15}s ease-in-out infinite ${i * 0.2}s`,
              clipPath: "polygon(40% 0%, 100% 40%, 60% 40%, 100% 100%, 0% 55%, 40% 55%)",
            }} />
          ))}
        </>
      );

    default:
      return null;
  }
};

export default Aura3D;
