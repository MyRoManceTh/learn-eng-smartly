import { useCallback } from "react";
import { Volume2 } from "lucide-react";

export const useSpeech = () => {
  const speak = useCallback((text: string, lang = "en-US") => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[.,!?;:]/g, ""));
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
};

export const SpeakButton = ({ text, className = "" }: { text: string; className?: string }) => {
  const { speak } = useSpeech();
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      className={`inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors ${className}`}
      title="ฟังเสียง"
      aria-label={`Pronounce ${text}`}
    >
      <Volume2 className="w-3.5 h-3.5" />
    </button>
  );
};
