/**
 * Unit tests for studentSpriteSheet generator.
 *
 * Verifies that for many combinations of equipped hair/hat (and combos),
 * the generated sprite sheet:
 *   1. Does not throw
 *   2. Has correct overall canvas dimensions
 *   3. Draws all pixels horizontally within their owning frame slot
 *      (i.e. no x-axis bleed into the neighbouring frame — "จัดวางถูกต้อง")
 *   4. Equipment overlays actually produce additional draws vs. baseline
 *      (i.e. hat/hair styles aren't silently dropped — "รายละเอียดไม่เพี้ยน")
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  generateStudentSpriteSheet,
  SPRITE_FRAME_W,
  SPRITE_FRAME_H,
  type EquipmentOverlay,
} from "./studentSpriteSheet";

// ── Recording 2D context (jsdom has no canvas) ──────────────────────────
interface DrawCall {
  x: number;
  y: number;
  w: number;
  h: number;
  fillStyle: string;
}

let draws: DrawCall[] = [];

function createMockCtx(): CanvasRenderingContext2D {
  const ctx: any = {
    fillStyle: "#000000",
    imageSmoothingEnabled: true,
    clearRect: () => {
      draws.length = 0;
    },
    fillRect: (x: number, y: number, w: number, h: number) => {
      draws.push({ x, y, w, h, fillStyle: ctx.fillStyle });
    },
    // no-op stubs in case anything else is called
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
  };
  return ctx as CanvasRenderingContext2D;
}

let origGetContext: typeof HTMLCanvasElement.prototype.getContext;

beforeAll(() => {
  origGetContext = HTMLCanvasElement.prototype.getContext;
  // @ts-expect-error — override for jsdom
  HTMLCanvasElement.prototype.getContext = function (kind: string) {
    if (kind === "2d") return createMockCtx();
    return null;
  };
});

afterAll(() => {
  HTMLCanvasElement.prototype.getContext = origGetContext;
});

// ── Helpers ─────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 17;

function makeOverlay(
  hairStyle: string | null,
  hatId: string | null,
): EquipmentOverlay {
  return {
    hairStyle,
    hatId,
    hatColor: "#cc3344",
    accessoryId: null,
    accessoryColor: "#80DEEA",
    leftHandId: null,
    leftHandColor: "#80DEEA",
    rightHandId: null,
    rightHandColor: "#90A4AE",
  };
}

function generateAndCount(overlay: EquipmentOverlay | null): {
  drawCount: number;
  outOfFrameX: DrawCall[];
  width: number;
  height: number;
} {
  draws = [];
  const sheet = generateStudentSpriteSheet(undefined, overlay);
  // After generation, `draws` holds every fillRect since the final clearRect.
  // (clearRect in our mock resets the buffer, and the generator calls it once
  // at the start, so the buffer matches the full sheet content.)
  const all = draws.slice();
  // Verify each draw stays in some frame's x range — i.e. doesn't straddle a
  // frame boundary. Allowed band: floor(x/W)*W .. that+W.
  const outOfFrameX: DrawCall[] = [];
  for (const d of all) {
    const frameIdx = Math.floor(d.x / SPRITE_FRAME_W);
    const frameLeft = frameIdx * SPRITE_FRAME_W;
    const frameRight = frameLeft + SPRITE_FRAME_W;
    if (d.x < 0 || d.x + d.w > frameRight || frameIdx >= TOTAL_FRAMES) {
      outOfFrameX.push(d);
    }
  }
  return {
    drawCount: all.length,
    outOfFrameX,
    width: sheet.canvas.width,
    height: sheet.canvas.height,
  };
}

const HAIR_STYLES = [
  "softbob",
  "silkylong",
  "twintails",
  "wavy",
  "messy",
  "highpony",
  "spacebuns",
  "fluffy",
  "princess",
  "electrichawk",
];

const HAT_IDS = [
  "hat_baseball",
  "hat_beanie",
  "hat_crown",
  "hat_wizard",
  "hat_santa",
  "hat_headphones",
  "hat_halo",
  "hat_devil",
  "hat_astronaut",
  "hat_beret",
  "hat_bucket",
  "hat_catears",
  "hat_bunnyears",
  "hat_flowerband",
  "hat_tiara",
];

// ── Tests ───────────────────────────────────────────────────────────────
describe("generateStudentSpriteSheet — canvas dimensions", () => {
  it("produces a 17-frame-wide sheet with correct height", () => {
    const { width, height } = generateAndCount(null);
    expect(width).toBe(TOTAL_FRAMES * SPRITE_FRAME_W);
    expect(height).toBe(SPRITE_FRAME_H);
  });
});

describe("generateStudentSpriteSheet — baseline (no equipment)", () => {
  it("renders without throwing and stays within each frame's x range", () => {
    const r = generateAndCount(null);
    expect(r.drawCount).toBeGreaterThan(0);
    expect(r.outOfFrameX).toEqual([]);
  });
});

describe("generateStudentSpriteSheet — hair styles", () => {
  for (const style of HAIR_STYLES) {
    it(`hair="${style}" renders inside frame bounds`, () => {
      const r = generateAndCount(makeOverlay(style, null));
      expect(r.drawCount).toBeGreaterThan(0);
      expect(r.outOfFrameX, `${style} drew outside its frame`).toEqual([]);
    });
  }

  it("different hair styles produce visibly different sheets", () => {
    const baseline = generateAndCount(makeOverlay("softbob", null)).drawCount;
    const fluffy = generateAndCount(makeOverlay("fluffy", null)).drawCount;
    const princess = generateAndCount(makeOverlay("princess", null)).drawCount;
    // big hair styles draw more pixels
    expect(fluffy).toBeGreaterThan(baseline);
    expect(princess).toBeGreaterThan(baseline);
  });
});

describe("generateStudentSpriteSheet — hats", () => {
  for (const hatId of HAT_IDS) {
    it(`hat="${hatId}" renders inside frame bounds`, () => {
      const r = generateAndCount(makeOverlay("softbob", hatId));
      expect(r.drawCount).toBeGreaterThan(0);
      expect(r.outOfFrameX, `${hatId} drew outside its frame`).toEqual([]);
    });
  }

  it("equipping a hat adds drawing relative to no hat", () => {
    const noHat = generateAndCount(makeOverlay("softbob", null)).drawCount;
    for (const hatId of HAT_IDS) {
      const withHat = generateAndCount(makeOverlay("softbob", hatId)).drawCount;
      expect(withHat, `${hatId} did not add draws`).toBeGreaterThan(noHat);
    }
  });
});

describe("generateStudentSpriteSheet — hair × hat combinations", () => {
  // Sample matrix: every hair style × a representative subset of hats
  const HAT_SAMPLE = [
    "hat_baseball",
    "hat_wizard",
    "hat_crown",
    "hat_catears",
    "hat_astronaut",
  ];

  for (const hair of HAIR_STYLES) {
    for (const hat of HAT_SAMPLE) {
      it(`hair="${hair}" + hat="${hat}" renders inside frame bounds`, () => {
        const r = generateAndCount(makeOverlay(hair, hat));
        expect(r.drawCount).toBeGreaterThan(0);
        expect(
          r.outOfFrameX,
          `${hair}+${hat} drew outside its frame`,
        ).toEqual([]);
      });
    }
  }
});
