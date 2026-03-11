import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PlacementStage } from "@/data/placementTestQuestions";
import {
  selectNextQuestion,
  getNextDifficulty,
  buildStageResult,
  calculateOverallLevel,
  getStageOrder,
  getStageQuestionCount,
  INITIAL_DIFFICULTY,
  StageResult,
  PlacementResult,
} from "@/utils/placementEngine";
import PlacementWelcome from "@/components/placement/PlacementWelcome";
import PlacementStageComponent from "@/components/placement/PlacementStage";
import StageTransition from "@/components/placement/StageTransition";
import PlacementResultComponent from "@/components/placement/PlacementResult";
import { toast } from "sonner";

type Phase = "welcome" | "transition" | "quiz" | "result";

const PlacementTestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("welcome");
  const stageOrder = getStageOrder();

  // Current stage tracking
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(INITIAL_DIFFICULTY);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [currentAnswers, setCurrentAnswers] = useState<
    { questionId: string; difficulty: number; correct: boolean }[]
  >([]);

  // All stage results
  const [stageResults, setStageResults] = useState<Partial<Record<PlacementStage, StageResult>>>({});

  // Overall progress counter
  const [overallAnswered, setOverallAnswered] = useState(0);
  const totalQuestions = stageOrder.reduce((sum, s) => sum + getStageQuestionCount(s), 0);

  // Current question
  const currentStage = stageOrder[currentStageIdx];
  const currentQuestion = selectNextQuestion(currentStage, answeredIds, currentDifficulty);

  // Final result
  const [finalResult, setFinalResult] = useState<PlacementResult | null>(null);

  const handleStart = () => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำแบบทดสอบ");
      navigate("/auth");
      return;
    }
    setPhase("transition");
  };

  const handleTransitionComplete = () => {
    setPhase("quiz");
  };

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (!currentQuestion) return;

      const newAnswer = {
        questionId: currentQuestion.id,
        difficulty: currentQuestion.difficulty,
        correct,
      };
      const newAnswers = [...currentAnswers, newAnswer];
      const newAnsweredIds = new Set(answeredIds);
      newAnsweredIds.add(currentQuestion.id);

      setCurrentAnswers(newAnswers);
      setAnsweredIds(newAnsweredIds);
      setOverallAnswered((p) => p + 1);

      const stageQuestionCount = getStageQuestionCount(currentStage);
      const nextQuestionNum = currentQuestionNum + 1;

      if (nextQuestionNum >= stageQuestionCount) {
        // Stage complete - save result
        const result = buildStageResult(currentStage, newAnswers);
        const newStageResults = { ...stageResults, [currentStage]: result };
        setStageResults(newStageResults);

        if (currentStageIdx + 1 >= stageOrder.length) {
          // All stages complete - calculate final result
          finishTest(newStageResults as Record<PlacementStage, StageResult>);
        } else {
          // Move to next stage
          setCurrentStageIdx((i) => i + 1);
          setCurrentQuestionNum(0);
          setCurrentDifficulty(INITIAL_DIFFICULTY);
          setCurrentAnswers([]);
          setPhase("transition");
        }
      } else {
        // Next question in same stage
        setCurrentQuestionNum(nextQuestionNum);
        setCurrentDifficulty(getNextDifficulty(currentDifficulty, correct));
      }
    },
    [currentQuestion, currentAnswers, answeredIds, currentStage, currentQuestionNum, stageResults, currentStageIdx, stageOrder]
  );

  const finishTest = async (allStageResults: Record<PlacementStage, StageResult>) => {
    const overallLevel = calculateOverallLevel(allStageResults);
    const totalScore = Object.values(allStageResults).reduce((sum, r) => sum + r.score, 0);
    const totalQ = Object.values(allStageResults).reduce((sum, r) => sum + r.total, 0);

    const result: PlacementResult = {
      overallLevel,
      stages: allStageResults,
      totalScore,
      totalQuestions: totalQ,
    };
    setFinalResult(result);
    setPhase("result");

    // Save to database
    if (user) {
      const detail = Object.fromEntries(
        Object.entries(allStageResults).map(([stage, r]) => [stage, r.answers])
      );

      await Promise.all([
        supabase.from("placement_test_results" as any).upsert(
          {
            user_id: user.id,
            overall_level: overallLevel,
            grammar_score: allStageResults.grammar.score,
            vocabulary_score: allStageResults.vocabulary.score,
            reading_score: allStageResults.reading.score,
            listening_score: allStageResults.listening.score,
            total_score: totalScore,
            total_questions: totalQ,
            detail,
          } as any,
          { onConflict: "user_id" }
        ),
        supabase
          .from("profiles")
          .update({
            placement_completed: true,
            placement_level: overallLevel,
            current_level: overallLevel,
          } as any)
          .eq("user_id", user.id),
      ]);
    }
  };

  const handleStartLearning = () => {
    navigate("/path");
  };

  // Render based on phase
  if (phase === "welcome") {
    return <PlacementWelcome onStart={handleStart} />;
  }

  if (phase === "transition") {
    return (
      <StageTransition
        stage={currentStage}
        stageIndex={currentStageIdx}
        totalStages={stageOrder.length}
        onComplete={handleTransitionComplete}
      />
    );
  }

  if (phase === "result" && finalResult) {
    return (
      <PlacementResultComponent
        result={finalResult}
        onStartLearning={handleStartLearning}
      />
    );
  }

  // Quiz phase
  if (!currentQuestion) {
    // Fallback if no more questions available
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white font-thai">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <PlacementStageComponent
      stage={currentStage}
      question={currentQuestion}
      questionNumber={currentQuestionNum + 1}
      totalQuestions={getStageQuestionCount(currentStage)}
      overallProgress={overallAnswered}
      totalOverall={totalQuestions}
      onAnswer={handleAnswer}
    />
  );
};

export default PlacementTestPage;
