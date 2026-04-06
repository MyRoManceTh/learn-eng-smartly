import type { LessonSeedData } from './core-a1-greetings';
import { travelA2AirportLessons } from './travel-a2-airport';
import { travelA2HotelLessons } from './travel-a2-hotel';
import { travelA2RestaurantLessons } from './travel-a2-restaurant';
import { travelB1TourLessons } from './travel-b1-tour';
import { travelB1EmergencyLessons } from './travel-b1-emergency';
import { travelB1FriendsLessons } from './travel-b1-friends';
import { travelB1ReviewLessons } from './travel-b1-review';
import { travelB2CultureLessons } from './travel-b2-culture';
import { travelB2ProblemLessons } from './travel-b2-problem';

export const lessons: LessonSeedData[] = [
  ...travelA2AirportLessons,
  ...travelA2HotelLessons,
  ...travelA2RestaurantLessons,
  ...travelB1TourLessons,
  ...travelB1EmergencyLessons,
  ...travelB1FriendsLessons,
  ...travelB1ReviewLessons,
  ...travelB2CultureLessons,
  ...travelB2ProblemLessons,
];
