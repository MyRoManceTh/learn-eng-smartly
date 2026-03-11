import { useNavigate } from "react-router-dom";
import { useFriendLeaderboard } from "@/hooks/useFriendLeaderboard";
import { useChallenges } from "@/hooks/useChallenges";
import { useFriends } from "@/hooks/useFriends";
import { evolutionStages } from "@/data/evolutionStages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const rankMedals = ["", "🥇", "🥈", "🥉"];

function getEvoIcon(stage: number) {
  return evolutionStages.find((s) => s.stage === stage)?.icon || "🥚";
}

export default function SocialHomeSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sortEntries, hasFriends, loading: lbLoading } = useFriendLeaderboard();
  const { pendingChallenges, loading: chLoading } = useChallenges();
  const { pendingGifts, claimGift } = useFriends();

  if (lbLoading && chLoading) return null;
  if (!hasFriends && pendingChallenges.length === 0 && pendingGifts.length === 0) return null;

  const topFriends = sortEntries("weekly").slice(0, 3);

  const handleAcceptChallenge = async (challengeId: string, lessonId: string | null) => {
    // Accept and navigate to quiz
    await supabase
      .from("quiz_challenges")
      .update({ status: "active" } as any)
      .eq("id", challengeId);

    if (lessonId) {
      const { data: lesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

      if (lesson) {
        const l = lesson as any;
        navigate("/quiz", {
          state: {
            questions: l.quiz,
            lessonTitle: l.title,
            lessonLevel: l.level,
            lessonId: l.id,
            challengeId,
            isChallenge: true,
            opponentName: pendingChallenges.find((c) => c.id === challengeId)?.challenger_name || "เพื่อน",
          },
        });
        return;
      }
    }

    navigate("/quiz", {
      state: {
        challengeId,
        isChallenge: true,
        opponentName: pendingChallenges.find((c) => c.id === challengeId)?.challenger_name || "เพื่อน",
      },
    });
  };

  return (
    <div className="rounded-2xl bg-white/80 border border-white/60 p-4 shadow-sm backdrop-blur-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">👥</span>
          <span className="text-sm font-bold font-thai">กิจกรรมเพื่อน</span>
        </div>
        <button
          onClick={() => navigate("/my")}
          className="text-[10px] font-bold text-purple-600 hover:underline font-thai"
        >
          ดูเพิ่ม →
        </button>
      </div>

      {/* Mini Friend Leaderboard */}
      {topFriends.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-muted-foreground font-thai mb-1">🏆 อันดับประจำสัปดาห์</p>
          <div className="flex gap-2">
            {topFriends.map((entry) => (
              <div
                key={entry.user_id}
                className={cn(
                  "flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs",
                  entry.isMe ? "bg-purple-50 ring-1 ring-purple-200" : "bg-gray-50"
                )}
              >
                <span className="text-sm">{entry.rank <= 3 ? rankMedals[entry.rank] : ""}</span>
                <span className="text-xs">{getEvoIcon(entry.evolution_stage)}</span>
                <span className={cn(
                  "truncate font-thai",
                  entry.isMe ? "font-bold text-purple-700" : "text-muted-foreground"
                )}>
                  {entry.isMe ? "คุณ" : entry.display_name}
                </span>
                <span className="ml-auto text-[10px] font-bold text-purple-600 shrink-0">
                  +{entry.weekly_exp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Challenges */}
      {pendingChallenges.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-muted-foreground font-thai mb-1">
            ⚔️ คำท้าทาย ({pendingChallenges.length})
          </p>
          {pendingChallenges.slice(0, 2).map((challenge) => (
            <div
              key={challenge.id}
              className="flex items-center gap-2 bg-orange-50 rounded-lg p-2 mb-1"
            >
              <span className="text-xs font-medium font-thai flex-1 truncate">
                {challenge.challenger_name} ท้าทายคุณ!
              </span>
              <Button
                size="sm"
                className="h-6 px-2 text-[10px] font-thai"
                onClick={() => handleAcceptChallenge(challenge.id, challenge.lesson_id)}
              >
                รับ
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] font-thai"
                onClick={async () => {
                  await supabase
                    .from("quiz_challenges")
                    .update({ status: "expired" } as any)
                    .eq("id", challenge.id);
                }}
              >
                ปฏิเสธ
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Pending Gifts */}
      {pendingGifts.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-muted-foreground font-thai mb-1">
            🎁 ของขวัญ ({pendingGifts.length})
          </p>
          {pendingGifts.slice(0, 2).map((gift) => (
            <div
              key={gift.id}
              className="flex items-center gap-2 bg-pink-50 rounded-lg p-2 mb-1"
            >
              <span className="text-xs font-medium font-thai flex-1 truncate">
                {gift.sender_name} ส่ง {gift.coins > 0 ? `${gift.coins}🪙` : "ไอเทม"} ให้คุณ
              </span>
              <Button
                size="sm"
                className="h-6 px-2 text-[10px] font-thai"
                onClick={() => claimGift(gift.id)}
              >
                รับ
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
