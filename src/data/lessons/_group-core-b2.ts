import type { LessonSeedData } from './core-a1-greetings';
import { coreB2MediaLessons } from './core-b2-media';
import { coreB2WritingLessons } from './core-b2-writing';
import { coreB2EnvironmentLessons } from './core-b2-environment';
import { coreB2ScienceLessons } from './core-b2-science';
import { coreB2DebateLessons } from './core-b2-debate';
import { coreB2PsychologyLessons } from './core-b2-psychology';
import { coreB2NarrativeLessons } from './core-b2-narrative';
import { coreB2AcademicLessons } from './core-b2-academic';
import { coreB2CriticalLessons } from './core-b2-critical';
import { coreB2FluencyLessons } from './core-b2-fluency';

export const lessons: LessonSeedData[] = [
  ...coreB2MediaLessons,
  ...coreB2WritingLessons,
  ...coreB2EnvironmentLessons,
  ...coreB2ScienceLessons,
  ...coreB2DebateLessons,
  ...coreB2PsychologyLessons,
  ...coreB2NarrativeLessons,
  ...coreB2AcademicLessons,
  ...coreB2CriticalLessons,
  ...coreB2FluencyLessons,
];
