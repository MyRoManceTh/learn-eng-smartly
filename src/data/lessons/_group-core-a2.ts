import type { LessonSeedData } from './core-a1-greetings';
import { coreA2HealthLessons } from './core-a2-health';
import { coreA2EducationLessons } from './core-a2-education';
import { coreA2TransportLessons } from './core-a2-transport';
import { coreA2WeatherLessons } from './core-a2-weather';
import { coreA2TechnologyLessons } from './core-a2-technology';
import { coreA2EventsLessons } from './core-a2-events';
import { coreA2HomeLessons } from './core-a2-home';
import { coreA2PhoneLessons } from './core-a2-phone';
import { coreA2ComparingLessons } from './core-a2-comparing';
import { coreA2StoriesLessons } from './core-a2-stories';

export const lessons: LessonSeedData[] = [
  ...coreA2HealthLessons,
  ...coreA2EducationLessons,
  ...coreA2TransportLessons,
  ...coreA2WeatherLessons,
  ...coreA2TechnologyLessons,
  ...coreA2EventsLessons,
  ...coreA2HomeLessons,
  ...coreA2PhoneLessons,
  ...coreA2ComparingLessons,
  ...coreA2StoriesLessons,
];
