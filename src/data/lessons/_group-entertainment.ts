import type { LessonSeedData } from './core-a1-greetings';
import { entA2MoviesLessons } from './ent-a2-movies';
import { entA2MusicLessons } from './ent-a2-music';
import { entA2SocialLessons } from './ent-a2-social';
import { entB1StreamingLessons } from './ent-b1-streaming';
import { entB1GamingLessons } from './ent-b1-gaming';
import { entB1CelebrityLessons } from './ent-b1-celebrity';
import { entB1ReviewLessons } from './ent-b1-review';

export const lessons: LessonSeedData[] = [
  ...entA2MoviesLessons,
  ...entA2MusicLessons,
  ...entA2SocialLessons,
  ...entB1StreamingLessons,
  ...entB1GamingLessons,
  ...entB1CelebrityLessons,
  ...entB1ReviewLessons,
];
