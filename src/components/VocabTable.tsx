import { VocabWord } from "@/types/lesson";
import { SpeakButton } from "@/hooks/useSpeech";
import { useHighlightWord, normalizeWord } from "@/contexts/HighlightWordContext";

interface VocabTableProps {
  vocabulary: VocabWord[];
  /** Optional override (legacy). When provided, takes precedence over context. */
  highlightWord?: string;
}

const VocabTable = ({ vocabulary, highlightWord: highlightOverride }: VocabTableProps) => {
  const { highlightWord: ctxHighlight, toggleHighlight } = useHighlightWord();
  const active = highlightOverride ?? ctxHighlight ?? "";
  const isActive = (word: string) => normalizeWord(active) === normalizeWord(word);

  return (
    <div className="rounded-2xl border border-indigo-100/50 bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-lg shadow-indigo-500/5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 text-foreground font-thai">📖 คำศัพท์</h3>

      {/* Card layout for mobile, table for desktop */}
      <div className="block sm:hidden space-y-2">
        {vocabulary.map((word, i) => (
          <button
            type="button"
            key={i}
            onClick={() => toggleHighlight(word.word)}
            className={`w-full text-left rounded-xl p-3 transition-all ${
              isActive(word.word)
                ? "bg-purple-100 border-l-4 border-l-purple-500 border border-purple-200/50 ring-2 ring-purple-300 shadow-md scale-[1.01]"
                : "bg-purple-50/30 border-l-4 border-l-purple-300 border border-purple-100/30 hover:bg-purple-50/50 active:bg-purple-100/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-reading text-base font-bold text-english flex items-center gap-1">
                {word.word}
                <SpeakButton text={word.word} />
              </span>
              <span className="text-muted-foreground italic text-xs">({word.partOfSpeech})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-thai-phonetic font-thai text-sm">{word.phonetic}</span>
              <span className="font-thai text-sm text-foreground">{word.meaning}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Table for larger screens */}
      <table className="w-full text-sm hidden sm:table">
        <thead>
          <tr className="border-b border-purple-100/50">
            <th className="text-left py-2 px-2 text-muted-foreground font-thai">คำศัพท์</th>
            <th className="text-left py-2 px-2 text-muted-foreground font-thai">Part of Speech</th>
            <th className="text-left py-2 px-2 text-muted-foreground font-thai">คำอ่าน</th>
            <th className="text-left py-2 px-2 text-muted-foreground font-thai">คำแปล</th>
          </tr>
        </thead>
        <tbody>
          {vocabulary.map((word, i) => (
            <tr
              key={i}
              onClick={() => toggleHighlight(word.word)}
              className={`border-b border-purple-100/30 transition-colors cursor-pointer ${
                isActive(word.word)
                  ? "bg-purple-100/80 ring-2 ring-purple-300"
                  : "hover:bg-purple-50/40"
              }`}
            >
              <td className="py-2.5 px-2 font-reading text-base font-semibold text-english">
                <span className="flex items-center gap-1">
                  {word.word}
                  <SpeakButton text={word.word} />
                </span>
              </td>
              <td className="py-2.5 px-2 text-muted-foreground italic text-xs">
                ({word.partOfSpeech})
              </td>
              <td className="py-2.5 px-2 text-thai-phonetic font-thai text-sm">
                {word.phonetic}
              </td>
              <td className="py-2.5 px-2 font-thai text-sm text-foreground">
                {word.meaning}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VocabTable;
