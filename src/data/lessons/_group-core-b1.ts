import type { LessonSeedData } from './core-a1-greetings';
import { coreB1OpinionsLessons } from './core-b1-opinions';
import { coreB1NewsLessons } from './core-b1-news';
import { coreB1GoalsLessons } from './core-b1-goals';
import { coreB1EmotionsLessons } from './core-b1-emotions';
import { coreB1WorkplaceLessons } from './core-b1-workplace';
import { coreB1CultureLessons } from './core-b1-culture';
import { coreB1DataLessons } from './core-b1-data';
import { coreB1ProblemsLessons } from './core-b1-problems';
import { coreB1HypotheticalLessons } from './core-b1-hypothetical';
import { coreB1ReadingLessons } from './core-b1-reading';

export const lessons: LessonSeedData[] = [
  ...coreB1OpinionsLessons,
  ...coreB1NewsLessons,
  ...coreB1GoalsLessons,
  ...coreB1EmotionsLessons,
  ...coreB1WorkplaceLessons,
  ...coreB1CultureLessons,
  ...coreB1DataLessons,
  ...coreB1ProblemsLessons,
  ...coreB1HypotheticalLessons,
  ...coreB1ReadingLessons,
];
