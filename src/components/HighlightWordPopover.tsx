import { useHighlightWord } from "@/contexts/HighlightWordContext";
import { SpeakButton } from "@/hooks/useSpeech";
import { X } from "lucide-react";

const HighlightWordPopover = () => {
  const { highlightWord, activeVocab, setHighlightWord } = useHighlightWord();

  if (!highlightWord) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md animate-in slide-in-from-bottom-4 fade-in duration-200 pointer-events-auto">
      <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 p-[2px] shadow-2xl shadow-purple-500/40">
        <div className="rounded-2xl bg-white px-4 py-3 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-reading text-lg font-bold text-purple-700 break-words">
                {activeVocab?.word ?? highlightWord}
              </span>
              <SpeakButton text={activeVocab?.word ?? highlightWord} />
              {activeVocab?.partOfSpeech && (
                <span className="text-xs italic text-muted-foreground">
                  ({activeVocab.partOfSpeech})
                </span>
              )}
            </div>
            {activeVocab ? (
              <div className="mt-1 space-y-0.5">
                <div className="text-sm font-thai text-thai-phonetic">
                  🔊 {activeVocab.phonetic}
                </div>
                <div className="text-base font-thai font-semibold text-foreground">
                  {activeVocab.meaning}
                </div>
              </div>
            ) : (
              <div className="mt-1 text-sm font-thai text-muted-foreground">
                ไม่พบคำนี้ในรายการคำศัพท์
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setHighlightWord(null)}
            className="shrink-0 rounded-full p-1.5 hover:bg-purple-50 active:bg-purple-100 transition-colors text-muted-foreground hover:text-purple-700"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightWordPopover;
