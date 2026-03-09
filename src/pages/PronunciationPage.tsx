import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pronunciationGroups, PronunciationGroup, PronunciationWord } from "@/data/pronunciationData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/useSpeech";

const diffLabel: Record<number, string> = { 1: "ง่าย", 2: "ปานกลาง", 3: "ยาก" };
const diffColor: Record<number, string> = { 1: "bg-emerald-100 text-emerald-700", 2: "bg-amber-100 text-amber-700", 3: "bg-red-100 text-red-700" };

const PronunciationPage = () => {
  const navigate = useNavigate();
  const { speak } = useSpeech();
  const [selectedGroup, setSelectedGroup] = useState<PronunciationGroup | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const handleSpeak = (word: string) => {
    setPlayingWord(word);
    speak(word);
    setTimeout(() => setPlayingWord(null), 1500);
  };

  // Group detail view
  if (selectedGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedGroup(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className="text-xl">{selectedGroup.icon}</span>
            <div>
              <h2 className="text-base font-bold font-thai">{selectedGroup.titleThai}</h2>
              <p className="text-[10px] text-muted-foreground">{selectedGroup.description}</p>
            </div>
          </div>
        </header>
        <main className="px-4 py-5 max-w-md mx-auto">
          <div className="space-y-2">
            {selectedGroup.words.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleSpeak(word.english)}
                className={cn(
                  "w-full text-left rounded-xl border-2 p-3 transition-all active:scale-[0.98]",
                  playingWord === word.english
                    ? "border-purple-400 bg-purple-50 shadow-md"
                    : "border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    playingWord === word.english
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110"
                      : "bg-purple-100 text-purple-600"
                  )}>
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-reading text-foreground text-base">{word.english}</span>
                      <span className="text-xs text-purple-500 font-mono">{word.ipa}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-thai text-pink-600">{word.phonetic}</span>
                      <span className="text-xs text-muted-foreground font-thai">— {word.thai}</span>
                    </div>
                  </div>
                  {playingWord === word.english && (
                    <div className="flex gap-0.5">
                      <div className="w-1 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1 h-4 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "100ms" }} />
                      <div className="w-1 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          {/* Tips section */}
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
            <h3 className="font-bold font-thai text-sm text-purple-700 mb-2">💡 เคล็ดลับ</h3>
            <ul className="text-xs text-purple-600 font-thai space-y-1">
              <li>• กดที่คำเพื่อฟังเสียง แล้วลองพูดตาม</li>
              <li>• สังเกตความแตกต่างระหว่างเสียงที่คล้ายกัน</li>
              <li>• ฝึกซ้ำหลายๆ รอบจะช่วยได้มาก</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // Groups list
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/practice")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-lg font-bold font-thai">🗣️ ฝึกออกเสียง</h1>
        </div>
      </header>
      <main className="px-4 py-5 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground font-thai mb-4">เลือกหมวดเสียงที่อยากฝึก กดฟังแล้วพูดตาม</p>
        <div className="space-y-3">
          {pronunciationGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g)}
              className="group w-full text-left rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition-all active:scale-[0.98] overflow-hidden relative"
            >
              <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b", g.color)} />
              <div className="flex items-center gap-4 pl-3">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md bg-gradient-to-br", g.color)}>
                  {g.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold font-thai text-foreground">{g.titleThai}</h3>
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", diffColor[g.difficulty])}>
                      {diffLabel[g.difficulty]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{g.description}</p>
                  <p className="text-[10px] text-muted-foreground font-thai mt-1">{g.words.length} คำ</p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PronunciationPage;
