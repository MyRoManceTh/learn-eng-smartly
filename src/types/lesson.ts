export interface VocabWord {
  word: string;
  phonetic: string;
  meaning: string;
  partOfSpeech: string;
}

export interface InterlinearWord {
  english: string;
  thai: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleThai: string;
  level: number;
  vocabulary: VocabWord[];
  articleSentences: InterlinearWord[][];
  articleTranslation: string;
  imagePrompt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  type?: 'vocab' | 'comprehension';
  explanation?: string;
}

export type LearnerLevel = 1 | 2 | 3 | 4 | 5;
