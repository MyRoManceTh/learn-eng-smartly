import { PlacementQuestion, PlacementStage, placementQuestions, stageInfo } from '@/data/placementTestQuestions';

export interface StageResult {
  stage: PlacementStage;
  answers: { questionId: string; difficulty: number; correct: boolean }[];
  score: number;
  total: number;
  avgDifficulty: number;
}

export interface PlacementResult {
  overallLevel: number;
  stages: Record<PlacementStage, StageResult>;
  totalScore: number;
  totalQuestions: number;
}

/**
 * Selects the next question for a stage based on adaptive difficulty.
 * - Start at difficulty 2 (A2)
 * - Correct → difficulty + 1, Wrong → difficulty - 1
 * - Clamp between 1-5
 * - Never repeat a question
 */
export function selectNextQuestion(
  stage: PlacementStage,
  answeredIds: Set<string>,
  currentDifficulty: number
): PlacementQuestion | null {
  const difficulty = Math.max(1, Math.min(5, Math.round(currentDifficulty)));

  // Try exact difficulty first, then search nearby
  for (let offset = 0; offset <= 4; offset++) {
    for (const dir of [0, 1, -1]) {
      const targetDiff = difficulty + (dir * offset);
      if (targetDiff < 1 || targetDiff > 5) continue;

      const candidates = placementQuestions.filter(
        (q) => q.stage === stage && q.difficulty === targetDiff && !answeredIds.has(q.id)
      );

      if (candidates.length > 0) {
        // Pick a random candidate at this difficulty
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
    }
  }

  return null;
}

/**
 * Calculate the next difficulty based on answer correctness.
 */
export function getNextDifficulty(currentDifficulty: number, wasCorrect: boolean): number {
  const adjustment = wasCorrect ? 1 : -1;
  return Math.max(1, Math.min(5, currentDifficulty + adjustment));
}

/**
 * Calculate the estimated level for a stage based on answer history.
 * Uses weighted average: correct answers at higher difficulty = higher score.
 */
export function calculateStageLevel(answers: { difficulty: number; correct: boolean }[]): number {
  if (answers.length === 0) return 1;

  let weightedSum = 0;
  let weightTotal = 0;

  answers.forEach((answer) => {
    if (answer.correct) {
      // Correct answer: contribute the difficulty level
      weightedSum += answer.difficulty;
      weightTotal += 1;
    } else {
      // Wrong answer: contribute difficulty - 1 (penalize less)
      weightedSum += Math.max(0, answer.difficulty - 1.5);
      weightTotal += 1;
    }
  });

  const avg = weightTotal > 0 ? weightedSum / weightTotal : 1;
  return Math.max(0, Math.min(5, Math.round(avg)));
}

/**
 * Calculate overall placement level from all stage results.
 * Weighted: Grammar(30%) + Vocabulary(30%) + Reading(20%) + Listening(20%)
 */
export function calculateOverallLevel(stages: Record<PlacementStage, StageResult>): number {
  const weights: Record<PlacementStage, number> = {
    grammar: 0.3,
    vocabulary: 0.3,
    reading: 0.2,
    listening: 0.2,
  };

  let weightedSum = 0;
  for (const [stage, result] of Object.entries(stages)) {
    weightedSum += result.avgDifficulty * (weights[stage as PlacementStage] || 0.25);
  }

  return Math.max(1, Math.min(5, Math.round(weightedSum)));
}

/**
 * Build complete StageResult from answer history.
 */
export function buildStageResult(
  stage: PlacementStage,
  answers: { questionId: string; difficulty: number; correct: boolean }[]
): StageResult {
  const score = answers.filter((a) => a.correct).length;
  const total = answers.length;
  const avgDifficulty = calculateStageLevel(answers);

  return { stage, answers, score, total, avgDifficulty };
}

/**
 * Get the ordered list of stages for the placement test.
 */
export function getStageOrder(): PlacementStage[] {
  return ['grammar', 'vocabulary', 'reading', 'listening'];
}

/**
 * Get how many questions to ask per stage.
 */
export function getStageQuestionCount(stage: PlacementStage): number {
  return stageInfo[stage].questionCount;
}

/**
 * Initial difficulty for the first question in any stage.
 */
export const INITIAL_DIFFICULTY = 2;
