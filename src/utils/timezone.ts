/** Thai timezone (UTC+7) utilities */

const THAI_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Get current date in Thai timezone as YYYY-MM-DD string */
export function getThaiToday(): string {
  const now = new Date();
  const thaiNow = new Date(now.getTime() + THAI_OFFSET_MS);
  return thaiNow.toISOString().split("T")[0];
}

/** Get Thai midnight ISO string for today (e.g. "2026-04-07T00:00:00+07:00") */
export function getThaiMidnight(): string {
  return getThaiToday() + "T00:00:00+07:00";
}
