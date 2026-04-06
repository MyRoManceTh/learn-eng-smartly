import { Button } from "@/components/ui/button";
import { levelInfo, stageInfo, PlacementStage } from "@/data/placementTestQuestions";
import { PlacementResult } from "@/utils/placementEngine";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface PlacementResultProps {
  result: PlacementResult;
  onStartLearning: () => void;
}

const PlacementResultComponent = ({ result, onStartLearning }: PlacementResultProps) => {
  const navigate = useNavigate();
  const level = levelInfo[result.overallLevel as keyof typeof levelInfo];
  const stageOrder: PlacementStage[] = ['grammar', 'vocabulary', 'reading', 'listening'];

  useEffect(() => {
    // Celebration confetti
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.4 } });
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 } }), 400);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5 animate-in fade-in zoom-in duration-700">
        {/* Level badge */}
        <div className="text-center space-y-3">
          <div className="text-7xl animate-bounce">{level.icon}</div>
          <div>
            <p className="text-purple-400 text-sm font-thai">ระดับของคุณคือ</p>
            <h1 className="text-3xl font-bold text-white mt-1">{level.name}</h1>
            <p className="text-amber-400 font-bold text-sm">CEFR {level.cefr}</p>
          </div>
          <p className="text-purple-300 text-sm font-thai leading-relaxed px-4">
            {level.description}
          </p>
        </div>

        {/* Score card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">
              {result.totalScore}/{result.totalQuestions}
            </p>
            <p className="text-xs text-purple-400 font-thai mt-1">คะแนนรวม</p>
          </div>

          {/* Per-stage breakdown */}
          <div className="space-y-2">
            {stageOrder.map((stage) => {
              const stageResult = result.stages[stage];
              const info = stageInfo[stage];
              const pct = stageResult.total > 0
                ? Math.round((stageResult.score / stageResult.total) * 100)
                : 0;

              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center">{info.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-300 font-thai">{info.nameThai}</span>
                      <span className="text-xs text-white font-bold">
                        {stageResult.score}/{stageResult.total}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${info.color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-center">
                    <span className="text-xs font-bold text-purple-200">
                      {["","Pre-A1","A1","A2","B1","B2"][stageResult.avgDifficulty] || stageResult.avgDifficulty}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level scale */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const lvlInfo = levelInfo[lvl as keyof typeof levelInfo];
            const isActive = lvl === result.overallLevel;
            return (
              <div
                key={lvl}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-amber-500/20 border border-amber-500/50 scale-110"
                    : lvl < result.overallLevel
                    ? "opacity-50"
                    : "opacity-30"
                }`}
              >
                <span className="text-lg">{lvlInfo.icon}</span>
                <span className="text-[9px] text-purple-300">{lvlInfo.cefr}</span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onStartLearning}
            className="w-full h-14 text-lg font-thai bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/30 rounded-xl"
            size="lg"
          >
            เริ่มเส้นทางการเรียน
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full font-thai text-purple-400 hover:text-purple-300 hover:bg-white/5"
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlacementResultComponent;
