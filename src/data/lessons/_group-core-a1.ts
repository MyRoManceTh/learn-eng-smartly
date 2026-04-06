import type { LessonSeedData } from './core-a1-greetings';
import { coreA1GreetingsLessons } from './core-a1-greetings';
import { coreA1NumbersLessons } from './core-a1-numbers';
import { coreA1FamilyLessons } from './core-a1-family';
import { coreA1DailyLessons } from './core-a1-daily';
import { coreA1FoodLessons } from './core-a1-food';
import { coreA1PlacesLessons } from './core-a1-places';
import { coreA1ShoppingLessons } from './core-a1-shopping';
import { coreA1ConversationLessons } from './core-a1-conversation';

export const lessons: LessonSeedData[] = [
  ...coreA1GreetingsLessons,
  ...coreA1NumbersLessons,
  ...coreA1FamilyLessons,
  ...coreA1DailyLessons,
  ...coreA1FoodLessons,
  ...coreA1PlacesLessons,
  ...coreA1ShoppingLessons,
  ...coreA1ConversationLessons,
];
