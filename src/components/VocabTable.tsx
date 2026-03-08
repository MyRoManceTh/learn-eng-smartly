import { VocabWord } from "@/types/lesson";
import { SpeakButton } from "@/hooks/useSpeech";

interface VocabTableProps {
  vocabulary: VocabWord[];
  highlightWord?: string;
}

const VocabTable = ({ vocabulary, highlightWord }: VocabTableProps) => {
  return (
    <div className="rounded-lg border border-border bg-vocab p-4">
      <h3 className="text-lg font-semibold mb-3 text-foreground font-thai">📖 คำศัพท์</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
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
              className={`border-b border-border/50 transition-colors ${
                highlightWord === word.word ? "bg-primary/10" : "hover:bg-secondary/50"
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
