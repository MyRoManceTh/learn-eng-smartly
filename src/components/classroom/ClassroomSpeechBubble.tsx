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
      <div className="bg-white rounded-xl px-3 py-2 shadow-lg border-2 border-gray-800/20 min-w-[80px] max-w-[160px] text-center relative">
        <p className="text-[9px] md:text-[11px] font-bold text-gray-800 leading-tight">
          {currentSpeech.th}
        </p>
        <p className="text-[7px] md:text-[9px] text-gray-400 leading-tight mt-0.5">
          {currentSpeech.en}
        </p>
        {/* Triangle tail pointing down */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
      </div>
    </div>
  );
};

export default ClassroomSpeechBubble;
