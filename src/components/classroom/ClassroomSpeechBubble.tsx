import { useEffect, useState } from "react";
import type { ZoneSpeech } from "@/types/classroom";

interface ClassroomSpeechBubbleProps {
  speech: ZoneSpeech | null;
  charX: number;
}

const ClassroomSpeechBubble = ({ speech, charX }: ClassroomSpeechBubbleProps) => {
  const [visible, setVisible] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<ZoneSpeech | null>(null);

  useEffect(() => {
    if (speech) {
      setCurrentSpeech(speech);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [speech]);

  if (!currentSpeech) return null;

  return (
    <div
      className={`absolute z-20 transition-all duration-300 pointer-events-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
      style={{
        left: `${charX}%`,
        bottom: "55%",
        transform: "translateX(-50%)",
      }}
    >
      {/* Star-Office-UI style speech bubble — no rounded corners, hard border */}
      <div
        className="px-3 py-2 min-w-[80px] max-w-[160px] text-center relative"
        style={{
          backgroundColor: "#ffffff",
          border: "2px solid #1a1a2e",
          boxShadow: "2px 2px 0px #1a1a2e",
        }}
      >
        <p className="text-[9px] md:text-[11px] font-bold leading-tight" style={{ color: "#1a1a2e" }}>
          {currentSpeech.th}
        </p>
        <p className="text-[7px] md:text-[9px] leading-tight mt-0.5" style={{ color: "#64748b" }}>
          {currentSpeech.en}
        </p>
        {/* Pixel tail pointing down */}
        <div
          className="absolute -bottom-[6px] left-1/2 -translate-x-1/2"
          style={{
            width: 8,
            height: 6,
            backgroundColor: "#ffffff",
            borderRight: "2px solid #1a1a2e",
            borderBottom: "2px solid #1a1a2e",
            transform: "translateX(-50%) rotate(45deg)",
            marginBottom: -1,
          }}
        />
      </div>
    </div>
  );
};

export default ClassroomSpeechBubble;
