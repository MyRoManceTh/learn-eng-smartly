import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { readingCategories, getStoriesByCategory, ReadingStory } from "@/data/readingData";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const levelLabel: Record<number, string> = { 1: "ง่าย", 2: "ปานกลาง", 3: "ยาก" };
const levelColor: Record<number, string> = { 1: "bg-emerald-100 text-emerald-700", 2: "bg-amber-100 text-amber-700", 3: "bg-red-100 text-red-700" };

const ReadingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addExp, addCoins } = useProfile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<ReadingStory | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizComplete = async (score: number) => {
    if (user && selectedStory) {
      const exp = score * 10 + 5;
      const coins = score * 5;
      await addExp(exp);
      await addCoins(coins);
      toast.success(`+${exp} EXP, +${coins} เหรียญ!`);
    }
  };

  // Story view
  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setSelectedStory(null); setShowQuiz(false); }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", levelColor[selectedStory.level])}>
              {levelLabel[selectedStory.level]}
            </span>
            <span className="text-base font-bold font-thai truncate">{selectedStory.titleThai}</span>
          </div>
        </header>
        <main className="px-4 py-4 space-y-4 max-w-3xl mx-auto">
          <VocabTable vocabulary={selectedStory.vocabulary} />
          <ArticleReader
            sentences={selectedStory.articleSentences}
            translation={selectedStory.articleTranslation}
            title={selectedStory.title}
            titleThai={selectedStory.titleThai}
          />
          {!showQuiz ? (
            <div className="text-center py-2">
              <Button onClick={() => setShowQuiz(true)} className="font-thai w-full max-w-xs bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg">
                📝 ทำแบบทดสอบ (+EXP & เหรียญ)
              </Button>
            </div>
          ) : (
            <QuizSection questions={selectedStory.quiz} onComplete={handleQuizComplete} />
          )}
        </main>
      </div>
    );
  }

  // Category stories view
  if (selectedCategory) {
    const cat = readingCategories.find(c => c.id === selectedCategory)!;
    const stories = getStoriesByCategory(selectedCategory);
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className="text-xl">{cat.icon}</span>
            <span className="text-base font-bold font-thai">{cat.nameThai}</span>
          </div>
        </header>
        <main className="px-4 py-5 max-w-3xl mx-auto">
          <div className="space-y-3">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="w-full text-left rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(s => (
                        <Star key={s} className={cn("w-3 h-3", s <= story.level ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
                      ))}
                    </div>
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", levelColor[story.level])}>
                      {levelLabel[story.level]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold font-thai text-foreground">{story.titleThai}</h3>
                    <p className="text-sm text-muted-foreground font-reading">{story.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{story.preview}</p>
                  </div>
                  <svg className="w-5 h-5 text-muted-foreground mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            ))}
            {stories.length === 0 && (
              <p className="text-center text-muted-foreground font-thai py-8">ยังไม่มีเรื่องในหมวดนี้</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Categories view
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/practice")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-lg font-bold font-thai">📖 ฝึกอ่าน</h1>
        </div>
      </header>
      <main className="px-4 py-5 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground font-thai mb-4">เลือกหมวดที่สนใจ แต่ละเรื่องมีเนื้อหาสนุกๆ คำศัพท์ และ quiz</p>
        <div className="grid grid-cols-2 gap-3">
          {readingCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="group relative rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition-all active:scale-[0.97] text-left overflow-hidden"
            >
              <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", cat.color)} />
              <div className="relative">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2 shadow-sm bg-gradient-to-br", cat.color)}>
                  {cat.icon}
                </div>
                <h3 className="font-bold font-thai text-sm">{cat.nameThai}</h3>
                <p className="text-[11px] text-muted-foreground font-reading">{cat.name}</p>
                <p className="text-[10px] text-muted-foreground font-thai mt-1">{cat.storiesCount} เรื่อง</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReadingPage;
