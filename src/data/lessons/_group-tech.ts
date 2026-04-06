import type { LessonSeedData } from './core-a1-greetings';
import { techA2DevicesLessons } from './tech-a2-devices';
import { techA2InternetLessons } from './tech-a2-internet';
import { techA2AppsLessons } from './tech-a2-apps';
import { techB1CodingLessons } from './tech-b1-coding';
import { techB1AiLessons } from './tech-b1-ai';
import { techB1SecurityLessons } from './tech-b1-security';
import { techB1StartupLessons } from './tech-b1-startup';

export const lessons: LessonSeedData[] = [
  ...techA2DevicesLessons,
  ...techA2InternetLessons,
  ...techA2AppsLessons,
  ...techB1CodingLessons,
  ...techB1AiLessons,
  ...techB1SecurityLessons,
  ...techB1StartupLessons,
];
