import { loadCards, saveCards, SRSCard, createCard } from "@/data/flashcardSRS";

export interface WeakVocabItem {
  word: string;
  phonetic: string;
  meaning: string;
  partOfSpeech: string;
}

/**
 * Push weak vocabulary items into the SRS deck with reset intervals.
 * Call this when a quiz score is below the threshold (60%).
 * Words already in the deck get their interval reset to 0 (review tomorrow).
 * New words are created fresh.
 */
export function pushWeakItemsToSRS(
  userId: string,
  items: WeakVocabItem[],
  moduleId: string
): void {
  if (!items.length) return;

  const cards = loadCards(userId);
  const cardMap = new Map<string, SRSCard>(cards.map((c) => [c.wordId, c]));

  const today = new Date();

  for (const item of items) {
    const wordId = `${moduleId}_${item.word}`;
    const existing = cardMap.get(wordId);

    if (existing) {
      // Reset the card so it appears for review tomorrow
      cardMap.set(wordId, {
        ...existing,
        interval: 1,
        repetitions: 0,
        easeFactor: Math.max(1.3, existing.easeFactor - 0.2),
        nextReview: today.toISOString().split("T")[0],
      });
    } else {
      // Create a brand-new card flagged for immediate review
      cardMap.set(wordId, createCard(item.word, item.phonetic, item.meaning, item.partOfSpeech, moduleId));
    }
  }

  saveCards(userId, Array.from(cardMap.values()));
}
