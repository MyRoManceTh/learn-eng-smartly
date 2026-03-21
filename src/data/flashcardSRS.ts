export interface SRSCard {
  wordId: string;
  word: string;
  phonetic: string;
  meaning: string;
  partOfSpeech: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReview: string | null;
}

const today = () => {
  const now = new Date();
  const thai = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return thai.toISOString().split("T")[0];
};

export function createCard(word: string, phonetic: string, meaning: string, partOfSpeech: string, moduleId: string): SRSCard {
  return {
    wordId: `${moduleId}_${word}`,
    word,
    phonetic,
    meaning,
    partOfSpeech,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: today(),
    lastReview: null,
  };
}

export function reviewCard(card: SRSCard, know: boolean): SRSCard {
  const quality = know ? 4 : 1;
  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(interval * easeFactor);

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
  } else {
    repetitions = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  const next = new Date();
  next.setDate(next.getDate() + interval);

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview: next.toISOString().split("T")[0],
    lastReview: today(),
  };
}

export function getDueCards(cards: SRSCard[]): SRSCard[] {
  const t = today();
  return cards.filter((c) => c.nextReview <= t).sort((a, b) => a.nextReview.localeCompare(b.nextReview));
}

export function loadCards(userId: string): SRSCard[] {
  try {
    const raw = localStorage.getItem(`srs_cards_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCards(userId: string, cards: SRSCard[]): void {
  localStorage.setItem(`srs_cards_${userId}`, JSON.stringify(cards));
}
