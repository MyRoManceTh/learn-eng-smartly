import { useEffect, useState } from "react";
import { stageInfo, PlacementStage } from "@/data/placementTestQuestions";

interface StageTransitionProps {
  stage: PlacementStage;
  stageIndex: number;
  totalStages: number;
  onComplete: () => void;
}

const StageTransition = ({ stage, stageIndex, totalStages, onComplete }: StageTransitionProps) => {
  const [visible, setVisible] = useState(true);
  const info = stageInfo[stage];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${info.color} transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center space-y-4 animate-in zoom-in duration-500">
        <div className="text-7xl">{info.icon}</div>
        <div>
          <p className="text-white/60 text-sm font-thai">
            ด่านที่ {stageIndex + 1}/{totalStages}
          </p>
          <h2 className="text-3xl font-bold text-white mt-1">{info.name}</h2>
          <p className="text-white/80 font-thai mt-1">{info.nameThai}</p>
        </div>
        <p className="text-white/60 text-sm font-thai">
          {info.questionCount} ข้อ
        </p>
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: totalStages }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stageIndex ? "w-8 bg-white" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StageTransition;
