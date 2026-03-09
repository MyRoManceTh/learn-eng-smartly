import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pathNodes, levelLabels, PathNode } from "@/data/pathNodes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sampleLesson, sampleQuiz } from "@/data/sampleLesson";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, CheckCircle2, Play, Loader2, Trophy, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CompletedNode {
  node_index: number;
  quiz_score: number | null;
  quiz_total: number | null;
}

const LearningPathPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completedNodes, setCompletedNodes] = useState<CompletedNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [lessonImage, setLessonImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("path_progress")
      .select("node_index, quiz_score, quiz_total")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setCompletedNodes(data);
      });
  }, [user]);

  const isCompleted = (index: number) => completedNodes.some((n) => n.node_index === index);
  const isUnlocked = (index: number) => index === 0 || isCompleted(index - 1);
  const getScore = (index: number) => completedNodes.find((n) => n.node_index === index);

  const nextUnlockedIndex = completedNodes.length > 0
    ? Math.max(...completedNodes.map((n) => n.node_index)) + 1
    : 0;

  const handleNodeClick = async (node: PathNode) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนเริ่มเรียน");
      navigate("/auth");
      return;
    }
    if (!isUnlocked(node.index)) return;

    setSelectedNode(node);
    setShowQuiz(false);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: { level: node.level, topic: node.topic, lessonsCompleted: node.index },
      });
      if (error) throw error;
      if (data.lesson) {
        setLesson(data.lesson);
        setQuiz(data.quiz || sampleQuiz);
        setLessonImage(data.imageUrl || null);
      }
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถสร้างบทเรียนได้ กรุณาลองใหม่");
      setSelectedNode(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (score: number) => {
    if (!user || !selectedNode) return;

    const { error } = await supabase.from("path_progress").insert({
      user_id: user.id,
      node_index: selectedNode.index,
      quiz_score: score,
      quiz_total: quiz.length,
    });

    if (!error) {
      setCompletedNodes((prev) => [
        ...prev,
        { node_index: selectedNode.index, quiz_score: score, quiz_total: quiz.length },
      ]);
      
      // Also update profiles
      await supabase.from("profiles").update({
        lessons_completed: selectedNode.index + 1,
        current_level: selectedNode.level,
      }).eq("user_id", user.id);
    }
  };

  // If a lesson is active, show lesson view
  if (selectedNode && (loading || lesson)) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setSelectedNode(null); setLesson(null); }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className="text-lg font-bold font-thai">
              {selectedNode.icon} {selectedNode.topicThai}
            </span>
            <span className="text-sm text-muted-foreground">Level {selectedNode.level}</span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
              <p className="font-thai">กำลังสร้างบทเรียน...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <VocabTable vocabulary={lesson.vocabulary} />
                </div>
                <div className="lg:col-span-3">
                  <ArticleReader
                    sentences={lesson.articleSentences}
                    translation={lesson.articleTranslation}
                    title={lesson.title}
                    titleThai={lesson.titleThai}
                    imageUrl={lessonImage || undefined}
                  />
                </div>
              </div>
              {!showQuiz ? (
                <div className="text-center">
                  <Button onClick={() => setShowQuiz(true)} variant="outline" className="font-thai">
                    📝 ทำแบบทดสอบ
                  </Button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <QuizSection questions={quiz} onComplete={handleQuizComplete} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    );
  }

  // Path view
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> หน้าหลัก
          </Button>
          <Trophy className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold font-thai">เส้นทางการเรียน</h1>
          <span className="text-sm text-muted-foreground font-thai ml-auto">
            {completedNodes.length}/{pathNodes.length} บทเรียน
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {levels.map((lvl) => {
          const nodesInLevel = pathNodes.filter((n) => n.level === lvl);
          return (
            <div key={lvl} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-bold font-thai",
                  "bg-primary/10 text-primary"
                )}>
                  Level {lvl} — {levelLabels[lvl]}
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex flex-col items-center gap-2">
                {nodesInLevel.map((node, i) => {
                  const completed = isCompleted(node.index);
                  const unlocked = isUnlocked(node.index);
                  const isCurrent = node.index === nextUnlockedIndex;
                  const score = getScore(node.index);
                  // Zigzag offset
                  const offset = i % 2 === 0 ? -60 : 60;

                  return (
                    <div key={node.index} className="relative flex flex-col items-center">
                      {/* Connector line */}
                      {i > 0 && (
                        <div className={cn(
                          "w-0.5 h-4 -mt-2 mb-1",
                          completed ? "bg-primary" : "bg-border"
                        )} />
                      )}

                      <button
                        onClick={() => handleNodeClick(node)}
                        disabled={!unlocked}
                        style={{ transform: `translateX(${offset}px)` }}
                        className={cn(
                          "relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-200",
                          "border-4 shadow-md",
                          completed && "bg-primary/20 border-primary scale-100",
                          isCurrent && !completed && "bg-primary/10 border-primary animate-pulse scale-110",
                          unlocked && !completed && !isCurrent && "bg-card border-border hover:border-primary hover:scale-105",
                          !unlocked && "bg-muted border-muted-foreground/20 opacity-50 cursor-not-allowed"
                        )}
                      >
                        {completed ? (
                          <CheckCircle2 className="w-7 h-7 text-primary" />
                        ) : !unlocked ? (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <span>{node.icon}</span>
                        )}

                        {isCurrent && !completed && (
                          <span className="absolute -right-1 -top-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-primary-foreground fill-current" />
                          </span>
                        )}
                      </button>

                      <div
                        style={{ transform: `translateX(${offset}px)` }}
                        className="text-center mt-1"
                      >
                        <p className={cn(
                          "text-xs font-thai font-medium",
                          completed ? "text-primary" : unlocked ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {node.topicThai}
                        </p>
                        {score && (
                          <div className="flex items-center justify-center gap-0.5 mt-0.5">
                            {Array.from({ length: score.quiz_total || 4 }).map((_, si) => (
                              <Star
                                key={si}
                                className={cn(
                                  "w-3 h-3",
                                  si < (score.quiz_score || 0) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {completedNodes.length === pathNodes.length && (
          <div className="text-center py-10">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-thai">🎉 ยินดีด้วย! เรียนจบทุกบทเรียนแล้ว!</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningPathPage;
