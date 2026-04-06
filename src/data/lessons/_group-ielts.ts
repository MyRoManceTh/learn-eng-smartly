import type { LessonSeedData } from './core-a1-greetings';
import { ieltsB1ListeningLessons } from './ielts-b1-listening';
import { ieltsB1ReadingLessons } from './ielts-b1-reading';
import { ieltsB1WritingLessons } from './ielts-b1-writing';
import { ieltsB1SpeakingLessons } from './ielts-b1-speaking';
import { ieltsB2Writing1Lessons } from './ielts-b2-writing1';
import { ieltsB2Writing2Lessons } from './ielts-b2-writing2';
import { ieltsB2ReadingLessons } from './ielts-b2-reading';
import { ieltsB2SpeakingLessons } from './ielts-b2-speaking';
import { ieltsC1StrategiesLessons } from './ielts-c1-strategies';
import { ieltsC1AcademicLessons } from './ielts-c1-academic';

export const lessons: LessonSeedData[] = [
  ...ieltsB1ListeningLessons,
  ...ieltsB1ReadingLessons,
  ...ieltsB1WritingLessons,
  ...ieltsB1SpeakingLessons,
  ...ieltsB2Writing1Lessons,
  ...ieltsB2Writing2Lessons,
  ...ieltsB2ReadingLessons,
  ...ieltsB2SpeakingLessons,
  ...ieltsC1StrategiesLessons,
  ...ieltsC1AcademicLessons,
];
