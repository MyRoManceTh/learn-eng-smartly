import { InterlinearWord } from "@/types/lesson";
import { useSpeech } from "@/hooks/useSpeech";
import { Volume2 } from "lucide-react";

interface ArticleReaderProps {
  sentences: InterlinearWord[][];
  translation: string;
  imageUrl?: string;
  title: string;
  titleThai: string;
}

const ArticleReader = ({ sentences, translation, imageUrl, title, titleThai }: ArticleReaderProps) => {
  const { speak } = useSpeech();

  const readFullArticle = () => {
    const fullText = sentences.map(s => s.map(w => w.english).join(" ")).join(". ");
    speak(fullText);
  };

  return (
    <div className="rounded-lg border border-border bg-reading p-4 sm:p-6">
      {/* Title */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-reading font-bold text-english leading-tight">{title}</h2>
            <p className="text-sm font-thai text-thai-phonetic mt-1">{titleThai}</p>
          </div>
          <button
            onClick={readFullArticle}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-thai text-primary bg-primary/10 hover:bg-primary/20 active:bg-primary/30 transition-colors shrink-0"
            title="ฟังทั้งบทความ"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">ฟังทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mb-4 sm:mb-5 rounded-lg overflow-hidden border border-border">
          <img src={imageUrl} alt={title} className="w-full h-40 sm:h-48 object-cover" />
        </div>
      )}

      {/* Interlinear text */}
      <div className="mb-4 sm:mb-6 leading-relaxed">
        {sentences.map((sentence, si) => (
          <span key={si} className="inline">
            {sentence.map((word, wi) => (
              <span
                key={wi}
                className="interlinear-word group cursor-pointer active:bg-primary/10 rounded px-0.5 transition-colors"
                onClick={() => speak(word.english)}
              >
                <span className="interlinear-eng group-hover:text-primary group-active:text-primary transition-colors">
                  {word.english}
                </span>
                <span className="interlinear-thai">{word.thai}</span>
              </span>
            ))}
            <span className="mx-1" />
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-border my-3 sm:my-4" />

      {/* Thai translation */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-2 font-thai">📝 แปลเป็นไทย</h4>
        <p className="font-thai text-foreground leading-relaxed text-sm">{translation}</p>
      </div>
    </div>
  );
};

export default ArticleReader;
