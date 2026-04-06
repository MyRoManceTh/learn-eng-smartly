import type { LessonSeedData } from './core-a1-greetings';
import { coreC1RhetoricLessons } from './core-c1-rhetoric';
import { coreC1LiteratureLessons } from './core-c1-literature';
import { coreC1ResearchLessons } from './core-c1-research';
import { coreC1PhilosophyLessons } from './core-c1-philosophy';
import { coreC1GlobalLessons } from './core-c1-global';
import { coreC1AbstractLessons } from './core-c1-abstract';
import { coreC1MasteryLessons } from './core-c1-mastery';
import { coreC1NativeLessons } from './core-c1-native';

export const lessons: LessonSeedData[] = [
  ...coreC1RhetoricLessons,
  ...coreC1LiteratureLessons,
  ...coreC1ResearchLessons,
  ...coreC1PhilosophyLessons,
  ...coreC1GlobalLessons,
  ...coreC1AbstractLessons,
  ...coreC1MasteryLessons,
  ...coreC1NativeLessons,
];
