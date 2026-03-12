export type CharacterPose = "idle" | "walking" | "sitting" | "reading";

export type ZoneId = "desk" | "bookshelf" | "gameCorner" | "quizBoard" | "restArea";

export interface ZoneSpeech {
  th: string;
  en: string;
}

export interface ClassroomZone {
  id: ZoneId;
  nameThai: string;
  nameEn: string;
  icon: string;

  /** Character standing position (percentage) */
  position: { x: number; bottom: number };

  /** Furniture visual position (CSS) */
  furniturePosition: { left: string; bottom: string; zIndex: number; scale?: number };

  /** React Router path */
  route: string;

  /** Random speech when character arrives */
  speeches: ZoneSpeech[];

  /** Main furniture emoji */
  furnitureEmoji: string;
  /** Small decor emojis around it */
  decorEmojis?: string[];

  /** Character pose when at this zone */
  characterPose: CharacterPose;
}
