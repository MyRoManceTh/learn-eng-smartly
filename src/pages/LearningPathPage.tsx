import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pathNodes, levelLabels, PathNode } from "@/data/pathNodes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sampleQuiz } from "@/data/sampleLesson";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, CheckCircle2, Play, Loader2, Trophy, Star, Crown, Flame } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CompletedNode {
  node_index: number;
  quiz_score: number | null;
  quiz_total: number | null;
}

const levelColorMap: Record<number, { bg: string; border: string; text: string; glow: string; badge: string }> = {
  1: { bg: "bg-level-1/15", border: "border-level-1", text: "text-level-1", glow: "shadow-level-1/30", badge: "bg-level-1 text-primary-foreground" },
  2: { bg: "bg-level-2/15", border: "border-level-2", text: "text-level-2", glow: "shadow-level-2/30", badge: "bg-level-2 text-primary-foreground" },
  3: { bg: "bg-level-3/15", border: "border-level-3", text: "text-level-3", glow: "shadow-level-3/30", badge: "bg-level-3 text-primary-foreground" },
  4: { bg: "bg-level-4/15", border: "border-level-4", text: "text-level-4", glow: "shadow-level-4/30", badge: "bg-level-4 text-primary-foreground" },
  5: { bg: "bg-level-5/15", border: "border-level-5", text: "text-level-5", glow: "shadow-level-5/30", badge: "bg-level-5 text-primary-foreground" },
};

const levelIcons: Record<number, string> = {
  1: "🌱",
  2: "🌿",
  3: "🌳",
  4: "⭐",
  5: "👑",
};

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
      await supabase.from("profiles").update({
        lessons_completed: selectedNode.index + 1,
        current_level: selectedNode.level,
      }).eq("user_id", user.id);
    }
  };

  // Lesson view
  if (selectedNode && (loading || lesson)) {
    const colors = levelColorMap[selectedNode.level];
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setSelectedNode(null); setLesson(null); }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <div className={cn("px-2 py-0.5 rounded-md text-xs font-bold", colors.badge)}>
              Lv.{selectedNode.level}
            </div>
            <span className="text-lg font-bold font-thai">
              {selectedNode.icon} {selectedNode.topicThai}
            </span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <span className="absolute inset-0 flex items-center justify-center text-xl">
                  {selectedNode.icon}
                </span>
              </div>
              <p className="font-thai mt-4 text-lg">กำลังสร้างบทเรียน...</p>
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

  // Progress stats
  const totalCompleted = completedNodes.length;
  const progressPercent = Math.round((totalCompleted / pathNodes.length) * 100);

  // Calculate streak (consecutive from 0)
  let streak = 0;
  for (let i = 0; i < pathNodes.length; i++) {
    if (isCompleted(i)) streak++;
    else break;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> หน้าหลัก
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Flame className="w-5 h-5 text-destructive" />
            <span className="font-bold text-sm font-thai">{streak} ต่อเนื่อง</span>
            <div className="w-px h-4 bg-border mx-1" />
            <Trophy className="w-5 h-5 text-star-gold" />
            <span className="font-bold text-sm font-thai">{totalCompleted}/{pathNodes.length}</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <h1 className="text-lg font-bold font-thai flex items-center gap-2">
              🗺️ เส้นทางการเรียน
            </h1>
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-level-1 via-level-3 to-level-5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Path */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {[1, 2, 3, 4, 5].map((lvl) => {
          const nodesInLevel = pathNodes.filter((n) => n.level === lvl);
          const colors = levelColorMap[lvl];
          const levelCompleted = nodesInLevel.every((n) => isCompleted(n.index));
          const levelProgress = nodesInLevel.filter((n) => isCompleted(n.index)).length;

          return (
            <div key={lvl} className="mb-10 animate-fade-in" style={{ animationDelay: `${lvl * 80}ms` }}>
              {/* Level header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg",
                  colors.badge
                )}>
                  {levelIcons[lvl]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className={cn("text-base font-bold font-thai", colors.text)}>
                      Level {lvl} — {levelLabels[lvl]}
                    </h2>
                    {levelCompleted && (
                      <CheckCircle2 className={cn("w-5 h-5", colors.text)} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", colors.badge)}
                        style={{ width: `${(levelProgress / nodesInLevel.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-thai">
                      {levelProgress}/{nodesInLevel.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nodes - snake/zigzag path */}
              <div className="relative pl-4">
                {/* Vertical connector line */}
                <div className={cn(
                  "absolute left-[2.25rem] top-0 bottom-0 w-0.5 rounded-full",
                  levelCompleted ? colors.badge : "bg-border"
                )} />

                <div className="flex flex-col gap-3">
                  {nodesInLevel.map((node, i) => {
                    const completed = isCompleted(node.index);
                    const unlocked = isUnlocked(node.index);
                    const isCurrent = node.index === nextUnlockedIndex;
                    const score = getScore(node.index);
                    const offset = i % 2 === 0 ? 0 : 40;

                    return (
                      <div
                        key={node.index}
                        className="animate-fade-in"
                        style={{
                          animationDelay: `${(lvl * 10 + i) * 50}ms`,
                          paddingLeft: `${offset}px`,
                        }}
                      >
                        <button
                          onClick={() => handleNodeClick(node)}
                          disabled={!unlocked}
                          className={cn(
                            "group relative flex items-center gap-3 w-full max-w-xs rounded-2xl p-3 transition-all duration-300",
                            "border-2",
                            completed && cn(colors.bg, colors.border, "shadow-md", `shadow-[0_4px_14px_-3px] ${colors.glow}`),
                            isCurrent && !completed && cn(
                              colors.bg, colors.border,
                              "animate-path-glow",
                              "shadow-lg"
                            ),
                            unlocked && !completed && !isCurrent && cn(
                              "bg-card border-border",
                              "hover:border-current hover:shadow-md",
                              colors.text
                            ),
                            !unlocked && "bg-muted/50 border-muted-foreground/10 opacity-60 cursor-not-allowed"
                          )}
                        >
                          {/* Node circle */}
                          <div className={cn(
                            "relative w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300",
                            "border-2",
                            completed && cn(colors.badge, colors.border),
                            isCurrent && !completed && cn(colors.bg, colors.border, "animate-float"),
                            unlocked && !completed && !isCurrent && cn("bg-card", colors.border, "group-hover:scale-110"),
                            !unlocked && "bg-muted border-muted-foreground/20"
                          )}>
                            {completed ? (
                              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                            ) : !unlocked ? (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <span className={cn(isCurrent && "animate-float")}>{node.icon}</span>
                            )}

                            {isCurrent && !completed && (
                              <span className={cn(
                                "absolute -right-1 -top-1 w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in",
                                colors.badge
                              )}>
                                <Play className="w-3 h-3 text-primary-foreground fill-current" />
                              </span>
                            )}
                          </div>

                          {/* Node info */}
                          <div className="text-left flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-bold font-thai truncate",
                              completed ? colors.text : unlocked ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {node.topicThai}
                            </p>
                            <p className={cn(
                              "text-xs truncate",
                              completed ? colors.text + "/70" : "text-muted-foreground"
                            )}>
                              {node.topic}
                            </p>

                            {/* Stars */}
                            {score && (
                              <div className="flex items-center gap-0.5 mt-1">
                                {Array.from({ length: score.quiz_total || 4 }).map((_, si) => (
                                  <Star
                                    key={si}
                                    className={cn(
                                      "w-3.5 h-3.5 transition-all duration-300",
                                      si < (score.quiz_score || 0)
                                        ? "text-star-gold fill-star-gold"
                                        : "text-muted-foreground/20"
                                    )}
                                    style={{ animationDelay: `${si * 100}ms` }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Arrow / status */}
                          {unlocked && !completed && (
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1",
                              isCurrent ? colors.badge : "bg-muted"
                            )}>
                              <Play className={cn(
                                "w-4 h-4 fill-current",
                                isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                              )} />
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Completion celebration */}
        {totalCompleted === pathNodes.length && (
          <div className="text-center py-12 animate-bounce-in">
            <div className="relative inline-block">
              <Crown className="w-20 h-20 text-star-gold mx-auto animate-float" />
            </div>
            <h2 className="text-2xl font-bold font-thai mt-4">🎉 ยินดีด้วย!</h2>
            <p className="text-muted-foreground font-thai mt-2">เรียนจบทุกบทเรียนแล้ว คุณเก่งมาก!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningPathPage;
