import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useProfile } from "@/hooks/useProfile";
import { getEvolutionStage } from "@/data/evolutionStages";
import { EvolutionStage } from "@/types/dopamine";
import { playLevelUp } from "@/utils/sounds";
import EvolutionCelebration from "@/components/avatar/EvolutionCelebration";

interface LevelUpContextValue {
  /** Manually check for level-up after adding EXP (call after addExp) */
  checkLevelUp: (newTotalExp: number) => void;
}

const LevelUpContext = createContext<LevelUpContextValue>({
  checkLevelUp: () => {},
});

export function useLevelUp() {
  return useContext(LevelUpContext);
}

export function LevelUpProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  const prevExpRef = useRef<number | null>(null);

  const [showCelebration, setShowCelebration] = useState(false);
  const [previousStage, setPreviousStage] = useState<EvolutionStage | null>(null);
  const [newStage, setNewStage] = useState<EvolutionStage | null>(null);

  // Track previous EXP from profile changes
  useEffect(() => {
    if (!profile) return;
    const currentExp = profile.total_exp || 0;

    if (prevExpRef.current !== null && currentExp > prevExpRef.current) {
      const oldStage = getEvolutionStage(prevExpRef.current);
      const curStage = getEvolutionStage(currentExp);

      if (curStage.stage > oldStage.stage) {
        setPreviousStage(oldStage);
        setNewStage(curStage);
        setShowCelebration(true);
        playLevelUp();
      }
    }

    prevExpRef.current = currentExp;
  }, [profile?.total_exp]);

  const checkLevelUp = useCallback((newTotalExp: number) => {
    if (prevExpRef.current === null) return;
    const oldStage = getEvolutionStage(prevExpRef.current);
    const curStage = getEvolutionStage(newTotalExp);

    if (curStage.stage > oldStage.stage) {
      setPreviousStage(oldStage);
      setNewStage(curStage);
      setShowCelebration(true);
      playLevelUp();
    }
  }, []);

  return (
    <LevelUpContext.Provider value={{ checkLevelUp }}>
      {children}
      {showCelebration && previousStage && newStage && (
        <EvolutionCelebration
          open={showCelebration}
          previousStage={previousStage}
          newStage={newStage}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </LevelUpContext.Provider>
  );
}
