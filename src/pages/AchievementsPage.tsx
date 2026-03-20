import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useFriends } from "@/hooks/useFriends";
import { achievements, getUnlockedAchievements, categoryLabels, type UserStats } from "@/data/achievements";
import { ChevronLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { friends } = useFriends();

  const stats: UserStats = useMemo(() => ({
    lessonsCompleted: profile?.lessons_completed || 0,
    totalExp: profile?.total_exp || 0,
    currentStreak: profile?.current_streak || 0,
    longestStreak: profile?.longest_streak || 0,
    friendCount: friends.length,
    gachaTickets: profile?.gacha_tickets || 0,
    coins: profile?.coins || 0,
    evolutionStage: profile?.evolution_stage || 1,
    currentLevel: profile?.current_level || 1,
    totalMissionsCompleted: profile?.total_missions_completed || 0,
    dailyMissionStreak: profile?.daily_mission_streak || 0,
  }), [profile, friends]);

  const unlocked = useMemo(() => getUnlockedAchievements(stats), [stats]);
  const unlockedIds = useMemo(() => new Set(unlocked.map((a) => a.id)), [unlocked]);

  // Group by category
  const categories = ["learning", "streak", "social", "collection", "special"] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white pb-24 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold font-thai">🏅 เหรียญรางวัล</h1>
              <p className="text-xs text-amber-100 font-thai">
                ปลดล็อกแล้ว {unlocked.length}/{achievements.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-5">
        {/* Progress overview */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{unlocked.length}</p>
              <p className="text-xs text-amber-100 font-thai">เหรียญที่ปลดล็อก</p>
            </div>
            <div className="flex -space-x-2">
              {unlocked.slice(0, 5).map((a) => (
                <span key={a.id} className="text-2xl bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                  {a.emoji}
                </span>
              ))}
              {unlocked.length > 5 && (
                <span className="text-xs bg-white/30 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  +{unlocked.length - 5}
                </span>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-700"
              style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* By category */}
        {categories.map((cat) => {
          const catAchievements = achievements.filter((a) => a.category === cat);
          if (catAchievements.length === 0) return null;
          const catInfo = categoryLabels[cat];

          return (
            <div key={cat}>
              <h3 className="text-sm font-bold font-thai mb-2 flex items-center gap-1.5 dark:text-gray-200">
                {catInfo.emoji} {catInfo.label}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {catAchievements.map((ach) => {
                  const isUnlocked = unlockedIds.has(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={cn(
                        "rounded-2xl p-3 text-center transition-all border",
                        isUnlocked
                          ? "bg-gradient-to-b from-amber-50 to-yellow-50 border-amber-200 shadow-sm dark:from-amber-900/20 dark:to-yellow-900/20 dark:border-amber-700"
                          : "bg-muted/30 border-transparent opacity-50 dark:bg-gray-800/50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full mx-auto flex items-center justify-center text-2xl mb-1.5",
                        isUnlocked ? "bg-amber-100 dark:bg-amber-800/30" : "bg-muted dark:bg-gray-700"
                      )}>
                        {isUnlocked ? ach.emoji : <Lock className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <p className={cn(
                        "text-[10px] font-bold leading-tight",
                        isUnlocked ? "text-foreground dark:text-gray-200" : "text-muted-foreground"
                      )}>
                        {ach.nameThai}
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 font-thai">
                        {ach.description}
                      </p>
                      {isUnlocked && (
                        <p className="text-[9px] text-amber-600 font-bold mt-1 dark:text-amber-400">
                          +{ach.reward.coins}🪙 +{ach.reward.exp}⚡
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
