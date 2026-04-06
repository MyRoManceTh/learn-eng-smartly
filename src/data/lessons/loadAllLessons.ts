import type { LessonSeedData } from './core-a1-greetings';

let cached: LessonSeedData[] | null = null;

export async function loadAllLessons(): Promise<LessonSeedData[]> {
  if (cached) return cached;

  const groups = await Promise.all([
    import('./_group-core-pre').then(m => m.lessons),
    import('./_group-core-a1').then(m => m.lessons),
    import('./_group-core-a2').then(m => m.lessons),
    import('./_group-core-b1').then(m => m.lessons),
    import('./_group-core-b2').then(m => m.lessons),
    import('./_group-core-c1').then(m => m.lessons),
    import('./_group-business').then(m => m.lessons),
    import('./_group-travel').then(m => m.lessons),
    import('./_group-entertainment').then(m => m.lessons),
    import('./_group-tech').then(m => m.lessons),
    import('./_group-ielts').then(m => m.lessons),
    import('./_group-toeic').then(m => m.lessons),
  ]);

  cached = groups.flat();
  return cached;
}
