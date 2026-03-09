import { getEvolutionProgress } from "@/data/evolutionStages";

interface Props {
  totalExp: number;
}

const EvolutionProgressBar = ({ totalExp }: Props) => {
  const { current, next, progress, expToNext } = getEvolutionProgress(totalExp);
  const isMaxStage = next === null;
  const isAlmostEvolving = !isMaxStage && progress > 80;

  const currentExp = isMaxStage ? totalExp : totalExp - current.minExp;
  const nextExp = isMaxStage ? totalExp : (next?.minExp ?? 0) - current.minExp;

  return (
    <div className="w-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 space-y-2">
      {/* Stage Labels */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">{current.icon}</span>
          <span className="font-bold" style={{ color: current.color }}>
            {current.nameThai}
          </span>
        </div>

        {isMaxStage ? (
          <span className="text-yellow-400 font-bold text-xs animate-pulse">
            ขั้นสูงสุดแล้ว! 👑
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-white/60 text-xs animate-bounce-x">→</span>
            <span className="text-xl">{next.icon}</span>
            <span className="font-semibold" style={{ color: next.color }}>
              {next.nameThai}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 rounded-full bg-gray-700/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${current.color}AA, ${current.color})`,
            boxShadow: `0 0 12px ${current.color}80`,
          }}
        />
        {/* Shimmer Effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>

      {/* EXP Text */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/70 font-medium">
          {currentExp.toLocaleString()}/{nextExp.toLocaleString()} EXP
        </span>

        {isAlmostEvolving && (
          <span className="text-amber-300 font-bold animate-pulse">
            ใกล้จะวิวัฒนาการ!
          </span>
        )}

        {isMaxStage && (
          <span className="text-yellow-400/80 text-[10px]">MAX</span>
        )}
      </div>
    </div>
  );
};

export default EvolutionProgressBar;
