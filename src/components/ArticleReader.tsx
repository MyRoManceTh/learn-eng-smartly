import { InterlinearWord } from "@/types/lesson";
import { useSpeech } from "@/hooks/useSpeech";
import { Volume2 } from "lucide-react";
import { useHighlightWord, normalizeWord } from "@/contexts/HighlightWordContext";

interface ArticleReaderProps {
  sentences: InterlinearWord[][];
  translation: string;
  imageUrl?: string;
  title: string;
  titleThai: string;
}

const ArticleReader = ({ sentences, translation, imageUrl, title, titleThai }: ArticleReaderProps) => {
  const { speak } = useSpeech();
  const { highlightWord, toggleHighlight } = useHighlightWord();
  const activeNorm = normalizeWord(highlightWord ?? "");

  const readFullArticle = () => {
    const fullText = sentences.map(s => s.map(w => w.english).join(" ")).join(". ");
    speak(fullText);
  };

  return (
    <div className="rounded-2xl border border-purple-100/50 bg-white/90 backdrop-blur-sm p-4 sm:p-6 shadow-lg shadow-purple-500/5">
      {/* Title */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-reading font-bold text-english leading-tight">{title}</h2>
            <p className="text-sm font-thai text-thai-phonetic mt-1">{titleThai}</p>
          </div>
          <button
            onClick={readFullArticle}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-thai text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 active:from-purple-600 active:to-pink-600 transition-colors shrink-0 shadow-sm"
            title="ฟังทั้งบทความ"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">ฟังทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mb-4 sm:mb-5 rounded-xl overflow-hidden border-2 border-purple-100/50 shadow-sm">
          <img src={imageUrl} alt={title} className="w-full h-40 sm:h-48 object-cover" />
        </div>
      )}

      {/* Interlinear text */}
      <div className="mb-4 sm:mb-6">
        {sentences.map((sentence, si) => (
          <span key={si} className="inline mr-2">
            {sentence.map((word, wi) => {
              const isActive = !!activeNorm && normalizeWord(word.english) === activeNorm;
              return (
                <span
                  key={wi}
                  className={`interlinear-word group cursor-pointer rounded-md px-0.5 transition-all ${
                    isActive
                      ? "bg-yellow-200 ring-2 ring-yellow-400 shadow-sm"
                      : "active:bg-purple-100"
                  }`}
                  onClick={() => {
                    speak(word.english);
                    toggleHighlight(word.english);
                  }}
                >
                  <span className={`interlinear-eng transition-colors ${
                    isActive ? "text-purple-800 font-bold" : "group-hover:text-purple-600 group-active:text-purple-700"
                  }`}>
                    {word.english}
                  </span>
                  <span className="interlinear-thai">{word.thai}</span>
                </span>
              );
            })}
            <span className="inline-block w-3" />
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-purple-100/50 my-3 sm:my-4" />

      {/* Thai translation */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-2 font-thai">📝 แปลเป็นไทย</h4>
        <p className="font-thai text-foreground leading-relaxed text-sm">{translation}</p>
      </div>
    </div>
  );
};

export default ArticleReader;
