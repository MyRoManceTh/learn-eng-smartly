import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { evolutionStages } from "@/data/evolutionStages";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  myScore: number;
  myTotal: number;
  opponentScore: number | null;
  opponentTotal: number | null;
  opponentName: string;
  myName: string;
  myEvolution: number;
  opponentEvolution: number;
  challengeId: string;
  earnedExp: number;
  earnedCoins: number;
  onRematch?: () => void;
}

function getEvoIcon(stage: number) {
  return evolutionStages.find((s) => s.stage === stage)?.icon || "🥚";
}

export default function ChallengeResult({
  myScore,
  myTotal,
  opponentScore,
  opponentTotal,
  opponentName,
  myName,
  myEvolution,
  opponentEvolution,
  earnedExp,
  earnedCoins,
  onRematch,
}: Props) {
  const navigate = useNavigate();

  const isWaiting = opponentScore === null;
  const isWin = !isWaiting && myScore > (opponentScore || 0);
  const isLose = !isWaiting && myScore < (opponentScore || 0);
  const isDraw = !isWaiting && myScore === opponentScore;

  useEffect(() => {
    if (isWin) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.6 } }), 300);
    }
  }, [isWin]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-amber-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="rounded-3xl border border-white/50 bg-white/90 backdrop-blur-xl p-6 space-y-4 shadow-2xl">
          {/* Title */}
          <h2 className="text-lg font-bold font-thai">⚔️ ผลการท้าทาย</h2>

          {/* VS Display */}
          <div className="flex items-center justify-center gap-4">
            {/* Me */}
            <div className="text-center space-y-1">
              <span className="text-3xl">{getEvoIcon(myEvolution)}</span>
              <p className="text-xs font-bold font-thai truncate max-w-20">{myName}</p>
              <p className={cn(
                "text-2xl font-black",
                isWin ? "text-emerald-600" : isLose ? "text-red-500" : "text-purple-600"
              )}>
                {myScore}/{myTotal}
              </p>
            </div>

            {/* VS */}
            <div className="text-2xl font-black text-muted-foreground">VS</div>

            {/* Opponent */}
            <div className="text-center space-y-1">
              <span className="text-3xl">{getEvoIcon(opponentEvolution)}</span>
              <p className="text-xs font-bold font-thai truncate max-w-20">{opponentName}</p>
              {isWaiting ? (
                <p className="text-lg font-bold text-muted-foreground">?/?</p>
              ) : (
                <p className={cn(
                  "text-2xl font-black",
                  isLose ? "text-emerald-600" : isWin ? "text-red-500" : "text-purple-600"
                )}>
                  {opponentScore}/{opponentTotal || myTotal}
                </p>
              )}
            </div>
          </div>

          {/* Result message */}
          {isWaiting ? (
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-sm font-bold font-thai text-amber-700">
                ⏳ รอเพื่อนทำ Quiz...
              </p>
              <p className="text-xs text-amber-600 font-thai mt-0.5">
                จะมีแจ้งเตือนเมื่อเพื่อนทำเสร็จ!
              </p>
            </div>
          ) : isWin ? (
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-lg font-bold font-thai text-emerald-700">
                🎉 คุณชนะ!
              </p>
              <p className="text-xs text-emerald-600 font-thai">
                +30🪙 โบนัสชนะ Challenge!
              </p>
            </div>
          ) : isLose ? (
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-lg font-bold font-thai text-red-600">
                เพื่อนเก่งกว่า! 😤
              </p>
              <p className="text-xs text-red-500 font-thai">
                ลองทบทวนแล้วท้าทายอีกครั้ง!
              </p>
            </div>
          ) : (
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-lg font-bold font-thai text-purple-700">
                🤝 เสมอกัน!
              </p>
              <p className="text-xs text-purple-600 font-thai">
                ทั้งคู่เก่งพอกัน!
              </p>
            </div>
          )}

          {/* EXP + Coins earned */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 bg-purple-100 rounded-xl py-2 px-3">
              <span className="text-sm">⚡</span>
              <span className="font-bold text-sm text-purple-700">+{earnedExp} EXP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-100 rounded-xl py-2 px-3">
              <span className="text-sm">🪙</span>
              <span className="font-bold text-sm text-amber-700">+{earnedCoins}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {onRematch && (
            <Button
              onClick={onRematch}
              className="w-full font-thai bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            >
              ⚔️ ท้าทายอีกครั้ง
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full font-thai bg-white/80"
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    </div>
  );
}
