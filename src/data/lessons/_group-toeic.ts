import type { LessonSeedData } from './core-a1-greetings';
import { toeicA2PhotosLessons } from './toeic-a2-photos';
import { toeicA2QnaLessons } from './toeic-a2-qna';
import { toeicA2VocabLessons } from './toeic-a2-vocab';
import { toeicB1ConversationsLessons } from './toeic-b1-conversations';
import { toeicB1TalksLessons } from './toeic-b1-talks';
import { toeicB1IncompleteLessons } from './toeic-b1-incomplete';
import { toeicB1TextcompLessons } from './toeic-b1-textcomp';
import { toeicB2SingleLessons } from './toeic-b2-single';
import { toeicB2MultiLessons } from './toeic-b2-multi';
import { toeicB2StrategiesLessons } from './toeic-b2-strategies';

export const lessons: LessonSeedData[] = [
  ...toeicA2PhotosLessons,
  ...toeicA2QnaLessons,
  ...toeicA2VocabLessons,
  ...toeicB1ConversationsLessons,
  ...toeicB1TalksLessons,
  ...toeicB1IncompleteLessons,
  ...toeicB1TextcompLessons,
  ...toeicB2SingleLessons,
  ...toeicB2MultiLessons,
  ...toeicB2StrategiesLessons,
];
