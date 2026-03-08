import { InterlinearWord } from "@/types/lesson";

interface ArticleReaderProps {
  sentences: InterlinearWord[][];
  translation: string;
  imageUrl?: string;
  title: string;
  titleThai: string;
}

const ArticleReader = ({ sentences, translation, imageUrl, title, titleThai }: ArticleReaderProps) => {
  return (
    <div className="rounded-lg border border-border bg-reading p-6">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-reading font-bold text-english">{title}</h2>
        <p className="text-sm font-thai text-thai-phonetic mt-1">{titleThai}</p>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mb-5 rounded-lg overflow-hidden border border-border">
          <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        </div>
      )}

      {/* Interlinear text */}
      <div className="mb-6 leading-relaxed">
        {sentences.map((sentence, si) => (
          <span key={si} className="inline">
            {sentence.map((word, wi) => (
              <span key={wi} className="interlinear-word group cursor-default">
                <span className="interlinear-eng group-hover:text-primary transition-colors">
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
      <div className="border-t border-border my-4" />

      {/* Thai translation */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-2 font-thai">📝 แปลเป็นไทย</h4>
        <p className="font-thai text-foreground leading-relaxed text-sm">{translation}</p>
      </div>
    </div>
  );
};

export default ArticleReader;
