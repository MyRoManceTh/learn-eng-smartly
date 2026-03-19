import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LearnerLevel } from "@/types/lesson";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, ChevronRight, BookOpen, MessageSquare, Gamepad2, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyReward } from "@/hooks/useDailyReward";
import { useDailyMissions } from "@/hooks/useDailyMissions";
import { useEnergy } from "@/hooks/useEnergy";
import { useProfile } from "@/hooks/useProfile";
import DailyRewardModal from "@/components/daily/DailyRewardModal";
import StreakFireDisplay from "@/components/daily/StreakFireDisplay";
import EnergyDisplay from "@/components/daily/EnergyDisplay";
import CoinDisplay from "@/components/avatar/CoinDisplay";
import SpriteAvatar from "@/components/avatar/SpriteAvatar";
import { DEFAULT_EQUIPPED, EquippedItems } from "@/types/avatar";
import { getEvolutionStage } from "@/data/evolutionStages";
import { trackEvent } from "@/utils/analytics";
import { cn } from "@/lib/utils";
import SocialHomeSection from "@/components/social/SocialHomeSection";
import GachaSpinner from "@/components/gacha/GachaSpinner";
import NotificationBell from "@/components/NotificationBell";
import type { DailyMission, MissionType } from "@/types/dopamine";

const missionIcons: Record<MissionType, string> = {
  streak_login: "🔥",
  complete_lesson: "📖",
  answer_quiz: "🧠",
  visit_avatar: "🛒",
  read_article: "📚",
  path_node: "🗺️",
};

const quickActions = [
  { path: "/reading", icon: BookOpen, label: "ฝึกอ่าน", color: "from-blue-400 to-indigo-500", emoji: "📖" },
  { path: "/conversation", icon: MessageSquare, label: "สนทนา", color: "from-pink-400 to-rose-500", emoji: "💬" },
  { path: "/games", icon: Gamepad2, label: "เกม", color: "from-emerald-400 to-green-500", emoji: "🎮" },
  { path: "/pronunciation", icon: Volume2, label: "ออกเสียง", color: "from-orange-400 to-amber-500", emoji: "🗣️" },
];

const activities = [
  { path: "/reading", icon: "📖", title: "ฝึกอ่าน", subtitle: "เรื่องสนุกๆ + บทเรียนแยก Level", color: "from-blue-400 to-indigo-500" },
  { path: "/conversation", icon: "💬", title: "ฝึกบทสนทนา", subtitle: "จำลองสถานการณ์จริง", color: "from-pink-400 to-rose-500" },
  { path: "/pronunciation", icon: "🗣️", title: "ฝึกออกเสียง", subtitle: "เน้นเสียงที่คนไทยออกยาก", color: "from-orange-400 to-amber-500" },
  { path: "/news", icon: "📰", title: "ข่าวง่ายรายวัน", subtitle: "อ่านข่าวจริง เขียนใหม่ให้เข้าใจง่าย", color: "from-purple-400 to-violet-500" },
  { path: "/library", icon: "📚", title: "คลังนิทาน", subtitle: "นิทานอีสปสนุกๆ พร้อม Quiz", color: "from-teal-400 to-cyan-500" },
];

interface CurrentLesson {
  id: string;
  title: string;
  title_thai: string;
  level: number;
  lesson_order: number;
}

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, refreshProfile } = useProfile();
  const { missions, loading: missionsLoading, completedCount, totalCount, allCompleted } = useDailyMissions();
  const dailyReward = useDailyReward(
    profile?.current_streak || 0,
    profile?.mystery_box_last_claimed || null,
    profile?.inventory || []
  );
  const { energy } = useEnergy(
    profile?.energy ?? 5,
    profile?.energy_last_refill || null,
    profile?.is_premium || false
  );

  const [currentLesson, setCurrentLesson] = useState<CurrentLesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [equipped, setEquipped] = useState<EquippedItems>(DEFAULT_EQUIPPED);
  const [newsHeadline, setNewsHeadline] = useState<{ title: string; level: number } | null>(null);

  const totalExp = profile?.total_exp || 0;
  const currentStreak = profile?.current_streak || 0;
  const coins = profile?.coins || 0;
  const level = (profile?.current_level || 1) as LearnerLevel;
  const rawName = profile?.display_name;
  const displayName =
    rawName && !rawName.includes("@line.local")
      ? rawName
      : user?.user_metadata?.display_name || user?.user_metadata?.full_name || "นักเรียน";
  const evolutionStage = getEvolutionStage(totalExp);

  useEffect(() => {
    trackEvent("page_view", { page: "home" });
  }, []);

  // Auto-redirect first-time users to placement test
  useEffect(() => {
    if (user && profile && !profile.placement_completed) {
      navigate("/placement", { replace: true });
    }
  }, [user, profile, navigate]);

  // Load equipped avatar items
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("equipped")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const d = data as any;
          if (d.equipped && typeof d.equipped === "object") {
            setEquipped({ ...DEFAULT_EQUIPPED, ...d.equipped });
          }
        }
      });
  }, [user]);

  // Load current lesson (next uncompleted)
  useEffect(() => {
    if (!user) return;

    const loadCurrentLesson = async () => {
      // Get completed lessons
      const { data: progress } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id);

      const completedIds = new Set((progress || []).map((d: any) => d.lesson_id));
      setCompletedLessonIds(completedIds);

      // Find next uncompleted lesson at user's level
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, title_thai, level, lesson_order")
        .eq("level", level)
        .eq("is_published", true)
        .order("lesson_order", { ascending: true });

      if (lessons) {
        const next = lessons.find((l: any) => !completedIds.has(l.id));
        setCurrentLesson((next || lessons[0]) as CurrentLesson);
      }
    };

    loadCurrentLesson();
  }, [user, level]);

  // Auto-refresh after quiz
  useEffect(() => {
    const navState = location.state as { generateNew?: boolean } | null;
    if (navState?.generateNew) {
      window.history.replaceState({}, "");
      refreshProfile();
    }
  }, [location.state]);

  const levelLabels = ["", "Starter", "Elementary", "Intermediate", "Upper", "Advanced"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
      <DailyRewardModal
        open={dailyReward.showModal}
        reward={dailyReward.reward}
        streakDays={dailyReward.streakDays}
        isMilestone={dailyReward.isMilestone}
        milestoneMessage={dailyReward.milestoneMessage}
        onClaim={async () => { await dailyReward.claimReward(); refreshProfile(); }}
        onClose={dailyReward.closeModal}
      />

      {/* === Status Bar Header === */}
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <h1 className="text-base font-bold text-foreground font-thai shrink-0">
            Learn<span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">English</span>
          </h1>
          <div className="flex items-center gap-1.5 shrink-0">
            {user && (
              <>
                <NotificationBell />
                <StreakFireDisplay streak={currentStreak} size="sm" />
                <EnergyDisplay energy={energy} />
              </>
            )}
            {user ? (
              <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8">
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="font-thai text-xs h-8">
                <LogIn className="w-4 h-4 mr-1" /> เข้าสู่ระบบ
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* === Avatar + Greeting Section === */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 via-white/80 to-pink-500/10 border border-white/60 p-4 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/my")}
              className="shrink-0 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-1 shadow-inner hover:scale-105 transition-transform"
            >
              <SpriteAvatar equipped={equipped} size="sm" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-thai">
                สวัสดี! 👋
              </p>
              <h2 className="text-lg font-bold font-thai text-foreground truncate">
                {displayName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-purple-600 bg-purple-100 rounded-full px-2 py-0.5">
                  Lv.{level} {levelLabels[level]}
                </span>
                <CoinDisplay coins={coins} size="sm" />
              </div>
              {/* EXP Progress */}
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                  <span className="font-thai">{totalExp} EXP</span>
                  <span className="font-thai">{evolutionStage.name}</span>
                </div>
                <div className="h-2 bg-gray-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                    style={{ width: `${Math.min(100, (totalExp / ((evolutionStage as any).maxExp || totalExp + 100)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === Daily Missions === */}
        {user && missions.length > 0 && (
          <div className="rounded-2xl bg-white/80 border border-white/60 p-3 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">📋</span>
                <span className="text-sm font-bold font-thai">ภารกิจวันนี้</span>
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full",
                allCompleted ? "bg-emerald-100 text-emerald-600" : "bg-purple-100 text-purple-600"
              )}>
                {completedCount}/{totalCount} {allCompleted && "🎉"}
              </span>
            </div>
            <div className="space-y-2">
              {missions.map((m: DailyMission) => {
                const done = m.completed;
                const progress = m.target_count > 0
                  ? Math.min((m.current_count / m.target_count) * 100, 100)
                  : 0;
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all",
                      done ? "bg-emerald-50/80 opacity-70" : "bg-gray-50/80"
                    )}
                  >
                    <span className="text-base shrink-0">
                      {done ? "✅" : (missionIcons[m.mission_type] || "📌")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "text-xs font-thai font-medium truncate",
                          done && "line-through text-muted-foreground"
                        )}>
                          {m.mission_title}
                        </span>
                        <span className="text-[10px] font-bold text-purple-600 shrink-0">
                          {m.current_count}/{m.target_count}
                        </span>
                      </div>
                      {!done && (
                        <div className="h-1.5 bg-gray-200/60 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${Math.max(progress, 2)}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-600 font-bold shrink-0">
                      +{m.reward_coins}🪙
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === Social Section (Friend Activity) === */}
        {user && <SocialHomeSection />}

        {/* === Continue Learning Card === */}
        {currentLesson && (
          <button
            onClick={() => navigate(`/reading`, { state: { lessonId: currentLesson.id } })}
            className="w-full text-left rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-4 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-thai mb-0.5">
                  {completedLessonIds.has(currentLesson.id) ? "ทบทวนบทเรียน" : "เรียนต่อเลย! 🎯"}
                </p>
                <h3 className="text-white font-bold text-base">
                  📖 บทที่ {currentLesson.lesson_order}: {currentLesson.title}
                </h3>
                <p className="text-purple-200 text-xs font-thai mt-0.5">
                  {currentLesson.title_thai} · Level {currentLesson.level}
                </p>
              </div>
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </button>
        )}

        {/* === Quick Actions Grid === */}
        <div>
          <h3 className="text-sm font-bold font-thai text-foreground mb-2">
            ⚡ กิจกรรมด่วน
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/80 border border-white/60 shadow-sm hover:shadow-md hover:scale-105 transition-all active:scale-95 backdrop-blur-sm"
              >
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br shadow-md",
                  action.color
                )}>
                  <span>{action.emoji}</span>
                </div>
                <span className="text-[10px] font-bold font-thai text-foreground leading-tight text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* === Gacha Machine === */}
        {user && (
          <GachaSpinner
            coins={coins}
            gachaTickets={profile?.gacha_tickets || 0}
            inventory={profile?.inventory || []}
            lastFreeGacha={profile?.last_free_gacha || null}
            onPullComplete={refreshProfile}
          />
        )}

        {/* === Placement Test Banner === */}
        {user && profile && !(profile as any).placement_completed && (
          <button
            onClick={() => navigate("/placement")}
            className="w-full text-left rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-thai mb-0.5">
                  แนะนำสำหรับผู้เรียนใหม่
                </p>
                <h3 className="text-white font-bold text-base">
                  🏰 ทำแบบทดสอบวัดระดับ
                </h3>
                <p className="text-amber-100 text-xs font-thai mt-0.5">
                  วัดระดับเพื่อเริ่มเรียนที่จุดที่เหมาะสม
                </p>
              </div>
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </button>
        )}

        {/* === Activities Section === */}
        <div>
          <h3 className="text-sm font-bold font-thai text-foreground mb-2">
            🎯 กิจกรรมทั้งหมด
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {activities.map((act) => (
              <button
                key={act.path}
                onClick={() => navigate(act.path)}
                className="group w-full text-left rounded-xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98] overflow-hidden relative"
              >
                <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b", act.color)} />
                <div className="flex items-center gap-3 pl-2">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm bg-gradient-to-br", act.color)}>
                    <span>{act.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold font-thai text-sm">{act.title}</h4>
                    <p className="text-[10px] text-muted-foreground font-thai truncate">{act.subtitle}</p>
                  </div>
                  <div className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* === Not logged in prompt === */}
        {!user && (
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 p-6 text-center">
            <p className="text-3xl mb-2">🎓</p>
            <h3 className="font-bold font-thai text-foreground mb-1">เริ่มเรียนภาษาอังกฤษ!</h3>
            <p className="text-xs text-muted-foreground font-thai mb-3">
              เข้าสู่ระบบเพื่อบันทึกความก้าวหน้า รับรางวัล และแต่ง Avatar
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="font-thai bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            >
              <LogIn className="w-4 h-4 mr-1" /> เข้าสู่ระบบ / สมัครสมาชิก
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
