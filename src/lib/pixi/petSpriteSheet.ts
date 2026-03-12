/**
 * Pixel Art Pet Sprite Sheet Generator
 *
 * Generates 16×16 pixel art pet sprite sheets at runtime.
 * Each pet has: idle (2 frames) + walk (2 frames) = 4 frames
 * Atlas: 64×16 px (single row)
 *
 * 10 pets: hippo, calico, corgi, hamster, penguin,
 *          redpanda, sloth, axolotl, bunny, dragon
 */

export const PET_FRAME_W = 16;
export const PET_FRAME_H = 16;

/* ─── shorthand ──────────────────────────────────── */

function px(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  c: string,
) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

/* ─── pet drawers ────────────────────────────────── */

function drawHippo(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#8e8ea0";
  const dark = "#6b6b7b";
  const belly = "#b5b5c5";
  const eye = "#1a1a2e";
  const mouth = "#d48e8e";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body
  px(ctx, ox+4, 7+bob, 8, 6, body);
  px(ctx, ox+5, 6+bob, 6, 1, body);
  // Belly
  px(ctx, ox+5, 10+bob, 6, 2, belly);
  // Head
  px(ctx, ox+3, 4+bob, 10, 4, body);
  px(ctx, ox+4, 3+bob, 8, 1, body);
  // Eyes
  px(ctx, ox+5, 5+bob, 1, 1, eye);
  px(ctx, ox+10, 5+bob, 1, 1, eye);
  // Nostrils
  px(ctx, ox+6, 7+bob, 1, 1, dark);
  px(ctx, ox+9, 7+bob, 1, 1, dark);
  // Mouth
  px(ctx, ox+7, 8+bob, 2, 1, mouth);
  // Ears
  px(ctx, ox+4, 3+bob, 2, 1, dark);
  px(ctx, ox+10, 3+bob, 2, 1, dark);
  // Legs
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+5, 13, 2, 2, dark);
  px(ctx, ox+9+legOff, 13, 2, 2, dark);
  // Shadow
  px(ctx, ox+4, 15, 8, 1, "rgba(0,0,0,0.1)");
}

function drawCalico(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const white = "#f5f0e8";
  const orange = "#e8a050";
  const dark = "#4a3828";
  const eye = "#1a1a2e";
  const nose = "#e88888";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body
  px(ctx, ox+5, 7+bob, 6, 5, white);
  px(ctx, ox+7, 7+bob, 3, 3, orange); // calico patch
  // Head
  px(ctx, ox+4, 3+bob, 8, 5, white);
  px(ctx, ox+4, 3+bob, 3, 3, orange); // head patch
  // Ears
  px(ctx, ox+4, 2+bob, 2, 2, orange);
  px(ctx, ox+10, 2+bob, 2, 2, white);
  px(ctx, ox+5, 2+bob, 1, 1, nose); // inner ear
  px(ctx, ox+10, 2+bob, 1, 1, nose);
  // Eyes
  px(ctx, ox+5, 5+bob, 2, 1, eye);
  px(ctx, ox+9, 5+bob, 2, 1, eye);
  // Nose
  px(ctx, ox+7, 6+bob, 2, 1, nose);
  // Whiskers (tiny lines)
  px(ctx, ox+3, 6+bob, 1, 1, dark);
  px(ctx, ox+12, 6+bob, 1, 1, dark);
  // Legs
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+5, 12, 2, 2, white);
  px(ctx, ox+9+legOff, 12, 2, 2, white);
  // Tail
  px(ctx, ox+11, 8+bob, 2, 1, dark);
  px(ctx, ox+12, 7+bob, 1, 2, dark);
  // Shadow
  px(ctx, ox+4, 15, 8, 1, "rgba(0,0,0,0.1)");
}

function drawCorgi(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#e8a050";
  const white = "#f5f0e8";
  const dark = "#8a6030";
  const eye = "#1a1a2e";
  const nose = "#3a2a1a";
  const tongue = "#e88888";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body (long, short legs = corgi!)
  px(ctx, ox+3, 7+bob, 10, 4, body);
  px(ctx, ox+4, 9+bob, 8, 2, white); // white belly
  // Head
  px(ctx, ox+4, 3+bob, 8, 5, body);
  px(ctx, ox+6, 6+bob, 4, 2, white); // white muzzle
  // Ears (big pointy)
  px(ctx, ox+4, 1+bob, 2, 3, body);
  px(ctx, ox+10, 1+bob, 2, 3, body);
  px(ctx, ox+5, 2+bob, 1, 1, tongue); // inner ear
  px(ctx, ox+10, 2+bob, 1, 1, tongue);
  // Eyes
  px(ctx, ox+5, 5+bob, 1, 1, eye);
  px(ctx, ox+10, 5+bob, 1, 1, eye);
  // Nose
  px(ctx, ox+7, 6+bob, 2, 1, nose);
  // Tongue
  px(ctx, ox+8, 7+bob, 1, 1, tongue);
  // Short legs
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+4, 11, 2, 3, white);
  px(ctx, ox+10+legOff, 11, 2, 3, white);
  // Fluffy butt
  px(ctx, ox+12, 8+bob, 2, 2, body);
  // Shadow
  px(ctx, ox+3, 15, 10, 1, "rgba(0,0,0,0.1)");
}

function drawHamster(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#e8c888";
  const belly = "#f5edd8";
  const dark = "#b89858";
  const eye = "#1a1a2e";
  const cheek = "#ffaaaa";
  const nose = "#d48080";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Round body
  px(ctx, ox+4, 6+bob, 8, 7, body);
  px(ctx, ox+5, 5+bob, 6, 1, body);
  // Belly
  px(ctx, ox+5, 9+bob, 6, 3, belly);
  // Head (chubby cheeks!)
  px(ctx, ox+3, 4+bob, 10, 5, body);
  px(ctx, ox+4, 3+bob, 8, 1, body);
  // Cheeks
  px(ctx, ox+3, 6+bob, 2, 2, cheek);
  px(ctx, ox+11, 6+bob, 2, 2, cheek);
  // Ears
  px(ctx, ox+4, 2+bob, 2, 2, body);
  px(ctx, ox+10, 2+bob, 2, 2, body);
  px(ctx, ox+5, 2+bob, 1, 1, nose);
  px(ctx, ox+10, 2+bob, 1, 1, nose);
  // Eyes
  px(ctx, ox+5, 5+bob, 2, 1, eye);
  px(ctx, ox+9, 5+bob, 2, 1, eye);
  // Nose
  px(ctx, ox+7, 6+bob, 2, 1, nose);
  // Tiny legs
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+5, 13, 2, 2, dark);
  px(ctx, ox+9+legOff, 13, 2, 2, dark);
  // Shadow
  px(ctx, ox+4, 15, 8, 1, "rgba(0,0,0,0.1)");
}

function drawPenguin(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#2a2a3e";
  const belly = "#f5f0e8";
  const beak = "#e8a050";
  const eye = "#ffffff";
  const feet = "#e8a050";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body
  px(ctx, ox+5, 6+bob, 6, 7, body);
  px(ctx, ox+6, 5+bob, 4, 1, body);
  // Belly
  px(ctx, ox+6, 8+bob, 4, 4, belly);
  // Head
  px(ctx, ox+4, 3+bob, 8, 4, body);
  px(ctx, ox+5, 2+bob, 6, 1, body);
  // Eyes
  px(ctx, ox+5, 4+bob, 2, 1, eye);
  px(ctx, ox+9, 4+bob, 2, 1, eye);
  px(ctx, ox+6, 4+bob, 1, 1, "#1a1a2e"); // pupil
  px(ctx, ox+9, 4+bob, 1, 1, "#1a1a2e");
  // Beak
  px(ctx, ox+7, 5+bob, 2, 1, beak);
  // Wings
  const wingUp = frame % 2 === 1;
  px(ctx, ox+3, 7+(wingUp ? -1 : 0)+bob, 2, 4, body);
  px(ctx, ox+11, 7+(wingUp ? -1 : 0)+bob, 2, 4, body);
  // Feet
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+5, 13, 2, 2, feet);
  px(ctx, ox+9+legOff, 13, 2, 2, feet);
  // Shadow
  px(ctx, ox+4, 15, 8, 1, "rgba(0,0,0,0.1)");
}

function drawRedPanda(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#c85030";
  const face = "#f5e0c8";
  const dark = "#5a2818";
  const eye = "#1a1a2e";
  const nose = "#3a2a1a";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body
  px(ctx, ox+4, 7+bob, 8, 5, body);
  // Head
  px(ctx, ox+3, 3+bob, 10, 5, body);
  px(ctx, ox+5, 4+bob, 6, 3, face); // white face
  // Ears
  px(ctx, ox+3, 2+bob, 2, 2, body);
  px(ctx, ox+11, 2+bob, 2, 2, body);
  // Eyes
  px(ctx, ox+5, 5+bob, 2, 1, eye);
  px(ctx, ox+9, 5+bob, 2, 1, eye);
  // Dark markings around eyes
  px(ctx, ox+4, 5+bob, 1, 1, dark);
  px(ctx, ox+11, 5+bob, 1, 1, dark);
  // Nose
  px(ctx, ox+7, 6+bob, 2, 1, nose);
  // Tail (striped!)
  px(ctx, ox+12, 7+bob, 2, 2, body);
  px(ctx, ox+13, 9+bob, 2, 2, dark);
  px(ctx, ox+13, 11+bob, 2, 1, body);
  // Legs
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+5, 12, 2, 2, dark);
  px(ctx, ox+9+legOff, 12, 2, 2, dark);
  // Shadow
  px(ctx, ox+3, 15, 10, 1, "rgba(0,0,0,0.1)");
}

function drawSloth(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#a08868";
  const face = "#d8c8a8";
  const dark = "#685840";
  const eye = "#1a1a2e";
  const eyeMark = "#604830";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body
  px(ctx, ox+5, 7+bob, 6, 6, body);
  // Head
  px(ctx, ox+4, 3+bob, 8, 5, body);
  px(ctx, ox+5, 4+bob, 6, 3, face); // face
  // Eye markings
  px(ctx, ox+5, 5+bob, 2, 1, eyeMark);
  px(ctx, ox+9, 5+bob, 2, 1, eyeMark);
  // Eyes (sleepy half-closed)
  px(ctx, ox+6, 5+bob, 1, 1, eye);
  px(ctx, ox+9, 5+bob, 1, 1, eye);
  // Nose
  px(ctx, ox+7, 6+bob, 2, 1, "#5a4a3a");
  // Smile
  px(ctx, ox+7, 7+bob, 2, 1, face);
  // Arms (long claws)
  px(ctx, ox+3, 8+bob, 2, 4, body);
  px(ctx, ox+11, 8+bob, 2, 4, body);
  px(ctx, ox+3, 12+bob, 1, 1, dark); // claws
  px(ctx, ox+12, 12+bob, 1, 1, dark);
  // Legs
  px(ctx, ox+6, 13, 2, 2, dark);
  px(ctx, ox+8, 13, 2, 2, dark);
  // Shadow
  px(ctx, ox+4, 15, 8, 1, "rgba(0,0,0,0.1)");
}

function drawAxolotl(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#ffb5c8";
  const dark = "#e890a8";
  const gill = "#ff6888";
  const eye = "#1a1a2e";
  const belly = "#ffe8f0";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body (long)
  px(ctx, ox+4, 7+bob, 8, 5, body);
  px(ctx, ox+5, 9+bob, 6, 2, belly);
  // Head
  px(ctx, ox+3, 3+bob, 10, 5, body);
  px(ctx, ox+4, 2+bob, 8, 1, body);
  // Gills (feathery!)
  px(ctx, ox+2, 3+bob, 2, 1, gill);
  px(ctx, ox+1, 4+bob, 2, 1, gill);
  px(ctx, ox+2, 5+bob, 1, 1, gill);
  px(ctx, ox+12, 3+bob, 2, 1, gill);
  px(ctx, ox+13, 4+bob, 2, 1, gill);
  px(ctx, ox+13, 5+bob, 1, 1, gill);
  // Eyes (big and cute)
  px(ctx, ox+5, 4+bob, 2, 2, eye);
  px(ctx, ox+9, 4+bob, 2, 2, eye);
  px(ctx, ox+5, 4+bob, 1, 1, "#ffffff"); // shine
  px(ctx, ox+9, 4+bob, 1, 1, "#ffffff");
  // Smile
  px(ctx, ox+7, 6+bob, 2, 1, dark);
  // Legs (tiny)
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+4, 12, 2, 2, dark);
  px(ctx, ox+10+legOff, 12, 2, 2, dark);
  // Tail
  px(ctx, ox+12, 9+bob, 2, 2, body);
  px(ctx, ox+13, 8+bob, 2, 1, dark);
  // Shadow
  px(ctx, ox+3, 15, 10, 1, "rgba(0,0,0,0.1)");
}

function drawBunny(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#f5f0e8";
  const dark = "#d8d0c0";
  const ear = "#ffbbcc";
  const eye = "#1a1a2e";
  const nose = "#ffaaaa";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body
  px(ctx, ox+5, 8+bob, 6, 5, body);
  // Head
  px(ctx, ox+4, 5+bob, 8, 4, body);
  // Ears (long!)
  px(ctx, ox+5, 1+bob, 2, 5, body);
  px(ctx, ox+9, 1+bob, 2, 5, body);
  px(ctx, ox+6, 2+bob, 1, 3, ear); // inner ear
  px(ctx, ox+9, 2+bob, 1, 3, ear);
  // Eyes
  px(ctx, ox+5, 6+bob, 2, 2, eye);
  px(ctx, ox+9, 6+bob, 2, 2, eye);
  px(ctx, ox+5, 6+bob, 1, 1, "#ff4466"); // red eyes (bunny!)
  px(ctx, ox+9, 6+bob, 1, 1, "#ff4466");
  // Nose
  px(ctx, ox+7, 8+bob, 2, 1, nose);
  // Fluffy tail
  px(ctx, ox+11, 9+bob, 2, 2, body);
  // Legs (hoppy)
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+5, 13, 2, 2, dark);
  px(ctx, ox+9+legOff, 13, 2, 2, dark);
  // Shadow
  px(ctx, ox+4, 15, 8, 1, "rgba(0,0,0,0.1)");
}

function drawDragon(ctx: CanvasRenderingContext2D, ox: number, frame: number) {
  const body = "#50b888";
  const belly = "#a8e8c0";
  const dark = "#308060";
  const eye = "#1a1a2e";
  const fire = "#ff6830";
  const horn = "#e8d850";
  const bob = frame % 2 === 1 ? -1 : 0;

  // Body
  px(ctx, ox+5, 7+bob, 6, 5, body);
  px(ctx, ox+6, 9+bob, 4, 2, belly);
  // Head
  px(ctx, ox+4, 3+bob, 8, 5, body);
  px(ctx, ox+5, 2+bob, 6, 1, body);
  // Horns
  px(ctx, ox+4, 1+bob, 1, 2, horn);
  px(ctx, ox+11, 1+bob, 1, 2, horn);
  // Eyes (fierce but cute)
  px(ctx, ox+5, 4+bob, 2, 2, eye);
  px(ctx, ox+9, 4+bob, 2, 2, eye);
  px(ctx, ox+5, 4+bob, 1, 1, "#ffcc00"); // dragon eye shine
  px(ctx, ox+9, 4+bob, 1, 1, "#ffcc00");
  // Nostrils with tiny fire
  px(ctx, ox+7, 6+bob, 2, 1, dark);
  if (frame % 2 === 1) {
    px(ctx, ox+6, 7+bob, 1, 1, fire); // tiny fire breath!
  }
  // Wings (small)
  px(ctx, ox+2, 7+bob, 3, 2, body);
  px(ctx, ox+2, 6+bob, 2, 1, dark);
  px(ctx, ox+11, 7+bob, 3, 2, body);
  px(ctx, ox+13, 6+bob, 2, 1, dark);
  // Tail
  px(ctx, ox+11, 10+bob, 2, 1, body);
  px(ctx, ox+12, 11+bob, 2, 1, dark);
  px(ctx, ox+13, 12+bob, 1, 1, body);
  // Spikes on back
  px(ctx, ox+6, 6+bob, 1, 1, horn);
  px(ctx, ox+8, 6+bob, 1, 1, horn);
  // Legs
  const legOff = frame >= 2 ? (frame === 2 ? 1 : -1) : 0;
  px(ctx, ox+5, 12, 2, 3, dark);
  px(ctx, ox+9+legOff, 12, 2, 3, dark);
  // Shadow
  px(ctx, ox+3, 15, 10, 1, "rgba(0,0,0,0.1)");
}

/* ─── drawer dispatch ────────────────────────────── */

const PET_DRAWERS: Record<string, (ctx: CanvasRenderingContext2D, ox: number, frame: number) => void> = {
  pet_hippo: drawHippo,
  pet_calico: drawCalico,
  pet_corgi: drawCorgi,
  pet_hamster: drawHamster,
  pet_penguin: drawPenguin,
  pet_redpanda: drawRedPanda,
  pet_sloth: drawSloth,
  pet_axolotl: drawAxolotl,
  pet_bunny: drawBunny,
  pet_dragon: drawDragon,
};

/* ─── public API ─────────────────────────────────── */

export interface PetSpriteSheetData {
  canvas: HTMLCanvasElement;
  animations: {
    idle: { startFrame: number; frameCount: number };
    walk: { startFrame: number; frameCount: number };
  };
  frameWidth: number;
  frameHeight: number;
}

/** Cache to avoid re-generating */
const _petSheetCache = new Map<string, PetSpriteSheetData>();

/**
 * Generate a pixel art pet sprite sheet.
 * Returns the canvas + animation metadata.
 */
export function generatePetSpriteSheet(petId: string): PetSpriteSheetData {
  const cached = _petSheetCache.get(petId);
  if (cached) return cached;

  const drawer = PET_DRAWERS[petId];

  const animations = {
    idle: { startFrame: 0, frameCount: 2 },
    walk: { startFrame: 2, frameCount: 2 },
  };

  const totalFrames = 4;
  const canvas = document.createElement("canvas");
  canvas.width = totalFrames * PET_FRAME_W;
  canvas.height = PET_FRAME_H;

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (drawer) {
    for (let i = 0; i < totalFrames; i++) {
      drawer(ctx, i * PET_FRAME_W, i);
    }
  }

  const result: PetSpriteSheetData = {
    canvas,
    animations,
    frameWidth: PET_FRAME_W,
    frameHeight: PET_FRAME_H,
  };

  _petSheetCache.set(petId, result);
  return result;
}
