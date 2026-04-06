import type { LessonSeedData } from './core-a1-greetings';
import { corePreAlphabetLessons } from './core-pre0-alphabet';
import { corePreNumbersLessons } from './core-pre0-numbers';
import { corePreColorsLessons } from './core-pre0-colors';
import { corePreGreetingsLessons } from './core-pre0-greetings';
import { corePreFirstwordsLessons } from './core-pre0-firstwords';

export const lessons: LessonSeedData[] = [
  ...corePreAlphabetLessons,
  ...corePreNumbersLessons,
  ...corePreColorsLessons,
  ...corePreGreetingsLessons,
  ...corePreFirstwordsLessons,
];
