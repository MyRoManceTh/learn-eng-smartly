import { useState } from "react";
import { Story, StoryChapter, themeMeta, rarityMeta } from "@/data/storyCollection";
import { useStoryProgress } from "@/hooks/useStoryProgress";
import ArticleReader from "@/components/ArticleReader";
import VocabTable from "@/components/VocabTable";
import QuizSection from "@/components/QuizSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Check, BookOpen, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  story: Story;
  onBack: () => void;
}

type View = "toc" | "read" | "quiz";

export const StoryReader = ({ story, onBack }: Props) => {
  const { isChapterRead, markChapterRead, getStoryProgress } = useStoryProgress();
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [view, setView] = useState<View>("toc");

  const theme = themeMeta[story.theme];
  const rarity = rarityMeta[story.rarity];
  const chapter: StoryChapter | undefined = story.chapters[activeChapterIdx];
  const progress = getStoryProgress(story.id, story.chapters.length);

  const openChapter = (idx: number) => {
    setActiveChapterIdx(idx);
    setView("read");
  };

  const handleQuizComplete = () => {
    if (!chapter) return;
    const wasFirstTime = !isChapterRead(story.id, chapter.id);
    markChapterRead(story.id, chapter.id);
    if (wasFirstTime) {
      // Re-check if just completed full story
      const newProg = getStoryProgress(story.id, story.chapters.length);
      if (newProg.done + 1 >= story.chapters.length) {
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#fbbf24", "#a855f7", "#ec4899", "#22d3ee"],
        });
      }
    }
  };

  // ===== Table of Contents =====
  if (view === "toc") {
    return (
      <div className="min-h-screen pb-24 bg-gradient-to-b from-sky-50 via-purple-50 to-pink-50">
        {/* Hero cover */}
        <div className={`relative h-72 bg-gradient-to-br ${story.cover.gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
          <button
            onClick={onBack}
            className="absolute top-3 left-3 z-10 bg-black/30 backdrop-blur text-white rounded-full p-2 hover:bg-black/50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]">
              {story.cover.emoji}
            </span>
          </div>
          {progress.completed && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full px-3 py-1 text-xs font-bold font-thai shadow-lg flex items-center gap-1">
              <Check className="w-3.5 h-3.5" strokeWidth={3} /> สะสมแล้ว
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 -mt-8 relative">
          <div className={`rounded-3xl border-2 ${rarity.bg} p-5 shadow-xl bg-white`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full bg-gradient-to-r ${theme.color} text-white font-thai font-bold`}>
                {theme.emoji} {theme.th}
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-thai font-bold ${rarity.bg} ${rarity.color} border`}>
                ◆ {rarity.th}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">{story.title}</h1>
            <p className="text-sm font-thai text-muted-foreground mt-0.5">{story.titleThai}</p>
            <p className="text-sm font-thai text-foreground/80 mt-3 leading-relaxed">{story.tagline}</p>

            {/* progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-thai mb-1">
                <span className="text-muted-foreground">ความคืบหน้า</span>
                <span className="font-bold text-foreground">{progress.done}/{progress.total} บท</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${theme.color} transition-all duration-500`}
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="px-4 mt-5 space-y-2.5">
          <div className="flex items-center gap-2 px-1 mb-1">
            <BookOpen className="w-4 h-4 text-foreground/70" />
            <h2 className="font-thai font-bold text-base">สารบัญ</h2>
          </div>
          {story.chapters.map((c, i) => {
            const read = isChapterRead(story.id, c.id);
            return (
              <button
                key={c.id}
                onClick={() => openChapter(i)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl bg-white border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                  read ? "border-emerald-300" : "border-white"
                }`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  read ? "bg-emerald-500 text-white" : `bg-gradient-to-br ${theme.color} text-white`
                }`}>
                  {read ? <Check className="w-5 h-5" strokeWidth={3} /> : i + 1}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{c.title}</div>
                  <div className="text-xs font-thai text-muted-foreground truncate">{c.titleThai}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== Read view =====
  if (!chapter) return null;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-sky-50 via-purple-50 to-pink-50">
      <header className="sticky top-0 z-20 border-b border-white/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="px-3 py-2.5 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setView("toc")} className="font-thai">
            <ArrowLeft className="w-4 h-4 mr-1" /> สารบัญ
          </Button>
          <div className="flex-1 min-w-0 text-center">
            <div className="text-xs text-muted-foreground font-thai">บทที่ {activeChapterIdx + 1}/{story.chapters.length}</div>
            <div className="text-sm font-bold font-thai truncate">{chapter.titleThai}</div>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="px-3 sm:px-4 py-4 space-y-4 max-w-3xl mx-auto">
        {view === "read" && (
          <>
            <ArticleReader
              sentences={chapter.sentences}
              translation={chapter.translation}
              title={chapter.title}
              titleThai={chapter.titleThai}
            />
            <VocabTable vocabulary={chapter.vocabulary} />

            <Button
              onClick={() => setView("quiz")}
              className={`w-full font-thai font-bold text-base py-6 rounded-2xl shadow-lg bg-gradient-to-r ${theme.color} text-white hover:opacity-90 transition`}
            >
              <Sparkles className="w-5 h-5 mr-1" />
              ทำแบบทดสอบเก็บบท
            </Button>
          </>
        )}

        {view === "quiz" && (
          <>
            <QuizSection
              questions={chapter.quiz}
              onComplete={handleQuizComplete}
              nextLessonLabel={
                activeChapterIdx + 1 < story.chapters.length ? "บทถัดไป" : "กลับสารบัญ"
              }
              onNextLesson={() => {
                if (activeChapterIdx + 1 < story.chapters.length) {
                  setActiveChapterIdx((i) => i + 1);
                  setView("read");
                } else {
                  setView("toc");
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => setView("read")}
              className="w-full font-thai"
            >
              ← กลับไปอ่านบทอีกครั้ง
            </Button>
          </>
        )}
      </main>
    </div>
  );
};

export default StoryReader;
