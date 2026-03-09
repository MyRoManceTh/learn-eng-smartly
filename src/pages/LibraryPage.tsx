import { useState } from "react";
import FableLibrary from "@/components/FableLibrary";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import { FableEntry } from "@/data/aesopFables";
import { LearnerLevel } from "@/types/lesson";
import { sampleQuiz } from "@/data/sampleLesson";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LibraryPage = () => {
  const [level] = useState<LearnerLevel>(1);
  const [selectedFable, setSelectedFable] = useState<FableEntry | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleSelectFable = (entry: FableEntry) => {
    setSelectedFable(entry);
    setShowQuiz(false);
  };

  if (selectedFable) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedFable(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className="text-base font-bold font-thai truncate">
              {selectedFable.lesson.titleThai}
            </span>
          </div>
        </header>

        <main className="px-4 py-4 space-y-4">
          <VocabTable vocabulary={selectedFable.lesson.vocabulary} />
          <ArticleReader
            sentences={selectedFable.lesson.articleSentences}
            translation={selectedFable.lesson.articleTranslation}
            title={selectedFable.lesson.title}
            titleThai={selectedFable.lesson.titleThai}
          />
          {!showQuiz ? (
            <div className="text-center py-2">
              <Button onClick={() => setShowQuiz(true)} variant="outline" className="font-thai w-full max-w-xs">
                📝 ทำแบบทดสอบ
              </Button>
            </div>
          ) : (
            <QuizSection questions={selectedFable.quiz} onComplete={() => {}} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold font-thai">📚 คลังนิทาน</h1>
        </div>
      </header>
      <main className="px-4 py-4">
        <FableLibrary currentLevel={level} onSelectFable={handleSelectFable} />
      </main>
    </div>
  );
};

export default LibraryPage;
