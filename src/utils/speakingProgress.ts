/** Minimum speaking sessions required to unlock Level 4 (B2) */
export const SPEAKING_GATE_REQUIRED = 3;

/** Core level that requires the speaking gate before proceeding */
export const SPEAKING_GATE_LEVEL = 3;

export function getSpeakingSessionCount(userId: string): number {
  return parseInt(localStorage.getItem(`speaking_count_${userId}`) || "0", 10);
}

export function incrementSpeakingSession(userId: string): number {
  const next = getSpeakingSessionCount(userId) + 1;
  localStorage.setItem(`speaking_count_${userId}`, String(next));
  return next;
}

export function isSpeakingGateUnlocked(userId: string): boolean {
  return getSpeakingSessionCount(userId) >= SPEAKING_GATE_REQUIRED;
}
