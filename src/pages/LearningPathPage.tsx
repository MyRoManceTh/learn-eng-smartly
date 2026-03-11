import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useSkillTreeProgress } from "@/hooks/useSkillTreeProgress";
import { supabase } from "@/integrations/supabase/client";
import { sampleQuiz } from "@/data/sampleLesson";
import {
  skillTreeModules,
  skillTreePaths,
  getModulesByPath,
  getLessonsByModule,
  SkillTreeModule,
  SkillTreeLesson,
  skillTreeLessons,
} from "@/data/skillTreeData";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import SkillTreeMap from "@/components/skilltree/SkillTreeMap";
import ModuleDetail from "@/components/skilltree/ModuleDetail";
import PathSwitcher from "@/components/skilltree/PathSwitcher";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Flame, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDailyMissions } from "@/hooks/useDailyMissions";

const LearningPathPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { incrementMission } = useDailyMissions();
  const {
    isNodeCompleted,
    getModuleProgress,
    isModuleCompleted,
    isModuleUnlocked,
    completeLesson,
    totalCompleted,
    totalModulesCompleted,
  } = useSkillTreeProgress();

  // Path & view states
  const [activePath, setActivePath] = useState(
    (profile as any)?.active_path || "core"
  );
  const [selectedModule, setSelectedModule] = useState<SkillTreeModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<SkillTreeLesson | null>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [lessonImage, setLessonImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const placementLevel = (profile as any)?.placement_level || null;

  // Modules for active path
  const pathModules = getModulesByPath(activePath);
  const totalLessons = skillTreeLessons.filter((l) =>
    pathModules.some((m) => m.id === l.moduleId)
  ).length;

  // Path progress calculator
  const getPathProgress = (pathId: string): number => {
    const mods = getModulesByPath(pathId);
    if (mods.length === 0) return 0;
    const completed = mods.filter((m) => isModuleCompleted(m.id)).length;
    return Math.round((completed / mods.length) * 100);
  };

  // Find next unlocked uncompleted module in active path
  const nextModuleId = pathModules.find(
    (m) => isModuleUnlocked(m, placementLevel) && !isModuleCompleted(m.id)
  )?.id || null;

  // Handle module click
  const handleModuleClick = (module: SkillTreeModule) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนเริ่มเรียน");
      navigate("/auth");
      return;
    }
    if (!isModuleUnlocked(module, placementLevel)) return;
    setSelectedModule(module);
  };

  // Handle lesson click
  const handleLessonClick = async (lesson: SkillTreeLesson) => {
    if (!user || !selectedModule) return;

    setSelectedLesson(lesson);
    setShowQuiz(false);
    setLoading(true);
    setLoadingLessonId(lesson.id);

    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: {
          moduleId: selectedModule.id,
          level: selectedModule.level,
          lessonOrder: lesson.order,
          topic: lesson.topic,
        },
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
      setSelectedLesson(null);
    } finally {
      setLoading(false);
      setLoadingLessonId(null);
    }
  };

  // Handle quiz complete
  const handleQuizComplete = async (score: number) => {
    if (!user || !selectedLesson || !selectedModule) return;

    await completeLesson(
      selectedLesson.id,
      selectedModule.id,
      selectedModule.pathId,
      score,
      quiz.length
    );

    // Update profile
    await supabase
      .from("profiles")
      .update({
        lessons_completed: totalCompleted + 1,
        current_level: selectedModule.level,
      } as any)
      .eq("user_id", user.id);

    // Track missions
    incrementMission("complete_lesson", 1);
    incrementMission("answer_quiz", quiz.length);
    incrementMission("path_node", 1);
  };

  // ─── Lesson View ────────────────────────────
  if (selectedLesson && selectedModule && (loading || lesson)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 pb-20 md:pb-0">
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {
                setSelectedLesson(null);
                setLesson(null);
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className="text-lg">{selectedModule.icon}</span>
            <span className="text-sm font-bold text-white font-thai">
              {selectedLesson.topicThai}
            </span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 animate-in fade-in duration-300">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
                <span className="absolute inset-0 flex items-center justify-center text-xl">
                  {selectedModule.icon}
                </span>
              </div>
              <p className="font-thai mt-4 text-lg text-white/60">กำลังสร้างบทเรียน...</p>
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
                  <Button
                    onClick={() => setShowQuiz(true)}
                    className="font-thai bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg"
                  >
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

  // ─── Module Detail View ─────────────────────
  if (selectedModule) {
    return (
      <ModuleDetail
        module={selectedModule}
        isNodeCompleted={isNodeCompleted}
        isModuleCompleted={isModuleCompleted(selectedModule.id)}
        onLessonClick={handleLessonClick}
        onBack={() => setSelectedModule(null)}
        loadingLessonId={loadingLessonId}
      />
    );
  }

  // ─── Skill Tree Map View ────────────────────
  const progressPercent = totalLessons > 0
    ? Math.round((totalCompleted / totalLessons) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> หน้าหลัก
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white font-thai">
              {totalModulesCompleted}/{pathModules.length}
            </span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <h1 className="text-lg font-bold text-white font-thai flex items-center gap-2">
              🗺️ เส้นทางการเรียน
            </h1>
            <span className="text-sm font-bold text-purple-300">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stats card */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-white">📚 {totalCompleted}</p>
              <p className="text-[10px] text-white/40 font-thai">บทเรียน</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-white">🏆 {totalModulesCompleted}</p>
              <p className="text-[10px] text-white/40 font-thai">Modules</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-white">🔥 {(profile as any)?.streak_count || 0}</p>
              <p className="text-[10px] text-white/40 font-thai">วันติดต่อ</p>
            </div>
          </div>

          {/* Path Switcher */}
          <div className="mt-3">
            <PathSwitcher activePath={activePath} onPathChange={setActivePath} getPathProgress={getPathProgress} />
          </div>

          {/* Placement test prompt */}
          {profile && !(profile as any).placement_completed && (
            <button
              onClick={() => navigate("/placement")}
              className="mt-3 w-full flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left hover:bg-amber-500/20 transition-colors"
            >
              <span className="text-2xl">🏰</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-300 font-thai">ยังไม่ได้ทำแบบทดสอบวัดระดับ</p>
                <p className="text-xs text-amber-400/60 font-thai">ทำเลยเพื่อเริ่มต้นที่ระดับที่เหมาะสม</p>
              </div>
              <span className="text-amber-400 text-sm font-bold">ทำเลย →</span>
            </button>
          )}
        </div>
      </div>

      {/* Skill Tree */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <SkillTreeMap
          modules={pathModules}
          isModuleUnlocked={(m) => isModuleUnlocked(m, placementLevel)}
          isModuleCompleted={isModuleCompleted}
          getModuleProgress={getModuleProgress}
          onModuleClick={handleModuleClick}
          nextModuleId={nextModuleId}
          activePath={activePath}
        />
      </main>
    </div>
  );
};

export default LearningPathPage;
