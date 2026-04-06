import type { LessonSeedData } from './core-a1-greetings';
import { bizA2EmailLessons } from './biz-a2-email';
import { bizA2InterviewLessons } from './biz-a2-interview';
import { bizA2OfficeLessons } from './biz-a2-office';
import { bizB1MeetingLessons } from './biz-b1-meeting';
import { bizB1PresentationLessons } from './biz-b1-presentation';
import { bizB1CustomerLessons } from './biz-b1-customer';
import { bizB1PhoneLessons } from './biz-b1-phone';
import { bizB2NegotiationLessons } from './biz-b2-negotiation';
import { bizB2ReportLessons } from './biz-b2-report';

export const lessons: LessonSeedData[] = [
  ...bizA2EmailLessons,
  ...bizA2InterviewLessons,
  ...bizA2OfficeLessons,
  ...bizB1MeetingLessons,
  ...bizB1PresentationLessons,
  ...bizB1CustomerLessons,
  ...bizB1PhoneLessons,
  ...bizB2NegotiationLessons,
  ...bizB2ReportLessons,
];
