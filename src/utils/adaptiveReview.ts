import { loadCards, saveCards, createCard, SRSCard } from "@/data/flashcardSRS";
import { toast } from "sonner";

/**
 * Push weak items back to SRS review queue.
 * Called after a quiz with score < 60%.
 * Resets the interval so they appear sooner for review.
 */
export function pushWeakItemsToSRS(
  userId: string,
  vocabItems: Array<{ word: string; phonetic: string; meaning: string; partOfSpeech?: string }>,
  moduleId: string
) {
  if (!userId || !vocabItems.length) return;

  const cards = loadCards(userId);
  let updatedCount = 0;

  for (const item of vocabItems) {
    const wordId = `${moduleId}_${item.word}`;
    const existingIdx = cards.findIndex((c) => c.wordId === wordId);

    if (existingIdx >= 0) {
      // Reset existing card's interval to force re-review
      cards[existingIdx].interval = 0;
      cards[existingIdx].repetitions = 0;
      cards[existingIdx].easeFactor = Math.max(1.3, cards[existingIdx].easeFactor - 0.3);
      const now = new Date();
      cards[existingIdx].nextReview = now.toISOString().split("T")[0];
      updatedCount++;
    } else {
      // Create new card
      cards.push(createCard(item.word, item.phonetic, item.meaning, item.partOfSpeech || "n.", moduleId));
      updatedCount++;
    }
  }

  saveCards(userId, cards);

  if (updatedCount > 0) {
    toast("📝 เพิ่มคำศัพท์ที่ต้องทบทวนแล้ว", {
      description: `${updatedCount} คำ ถูกเพิ่มเข้า Flashcard เพื่อทบทวน`,
      action: {
        label: "ไปทบทวน",
        onClick: () => {
          window.location.href = "/flashcards";
        },
      },
    });
  }
}