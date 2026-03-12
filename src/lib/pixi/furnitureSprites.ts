/**
 * Pixel Art Furniture Sprite Generator
 *
 * Generates pixel art furniture canvases for classroom zones.
 * Uses Canvas 2D fillRect — same style as studentSpriteSheet.
 *
 * 5 zones: bookshelf, desk, quizBoard, restArea, gameCorner
 */

import type { ZoneId } from "@/types/classroom";

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

/* ─── furniture drawers ──────────────────────────── */

function drawBookshelf(ctx: CanvasRenderingContext2D) {
  // 32×48 — tall bookshelf with colorful books
  const wood = "#8b6b4a";
  const woodDk = "#6b4d35";
  const woodLt = "#a88868";

  // Frame
  px(ctx, 2, 2, 28, 44, wood);
  px(ctx, 2, 2, 28, 2, woodDk); // top
  px(ctx, 2, 2, 2, 44, woodDk); // left
  px(ctx, 28, 2, 2, 44, woodDk); // right
  px(ctx, 2, 44, 28, 2, woodDk); // bottom

  // Shelves (3 shelves)
  px(ctx, 4, 16, 24, 2, woodDk);
  px(ctx, 4, 30, 24, 2, woodDk);

  // Books on top shelf (row 1, y=4-15)
  px(ctx, 5, 5, 3, 11, "#e74c3c"); // red
  px(ctx, 8, 6, 3, 10, "#3498db"); // blue
  px(ctx, 11, 5, 2, 11, "#2ecc71"); // green
  px(ctx, 13, 7, 3, 9, "#f39c12"); // orange
  px(ctx, 16, 5, 3, 11, "#9b59b6"); // purple
  px(ctx, 19, 6, 2, 10, "#e74c3c"); // red small
  px(ctx, 21, 5, 3, 11, "#1abc9c"); // teal
  px(ctx, 24, 7, 3, 9, "#e67e22"); // dark orange
  // Book spines highlight
  px(ctx, 6, 5, 1, 11, "#ff6b6b");
  px(ctx, 12, 5, 1, 11, "#55efc4");
  px(ctx, 22, 5, 1, 11, "#48dbfb");

  // Books on middle shelf (row 2, y=18-29)
  px(ctx, 5, 19, 4, 11, "#2c3e50"); // dark blue
  px(ctx, 9, 20, 3, 10, "#e74c3c"); // red
  px(ctx, 12, 19, 2, 11, "#f1c40f"); // yellow
  px(ctx, 14, 21, 3, 9, "#8e44ad"); // violet
  px(ctx, 17, 19, 3, 11, "#27ae60"); // green
  px(ctx, 20, 20, 2, 10, "#d35400"); // brown
  px(ctx, 22, 19, 4, 11, "#2980b9"); // blue
  // Leaning book
  px(ctx, 26, 22, 1, 8, "#e74c3c");

  // Books on bottom shelf (row 3, y=32-43)
  px(ctx, 5, 33, 3, 11, "#16a085"); // teal
  px(ctx, 8, 34, 3, 10, "#c0392b"); // crimson
  px(ctx, 11, 33, 4, 11, "#2c3e50"); // navy
  px(ctx, 15, 35, 2, 9, "#f39c12"); // gold
  // Small plant/decor on shelf
  px(ctx, 19, 38, 4, 6, "#27ae60"); // pot plant
  px(ctx, 20, 36, 2, 2, "#2ecc71"); // leaves
  px(ctx, 19, 35, 4, 1, "#2ecc71");
  px(ctx, 20, 44, 2, 2, "#8b6b4a"); // pot
  // More books
  px(ctx, 24, 33, 3, 11, "#8e44ad");

  // Highlight on frame
  px(ctx, 4, 4, 24, 1, woodLt);
}

function drawDesk(ctx: CanvasRenderingContext2D) {
  // 32×32 — school desk with chair
  const deskTop = "#c4956a";
  const deskDk = "#8b6b4a";
  const deskLeg = "#6b4d35";
  const chairSeat = "#4a7bd9";
  const chairDk = "#3a5fa0";
  const paper = "#fffff0";
  const pencil = "#f1c40f";

  // Chair (behind desk)
  px(ctx, 10, 8, 12, 2, chairDk); // chair back
  px(ctx, 9, 10, 14, 1, chairDk);
  px(ctx, 10, 11, 12, 2, chairSeat); // seat
  px(ctx, 11, 11, 10, 1, "#5a8be9"); // highlight

  // Desk top surface
  px(ctx, 3, 16, 26, 3, deskTop);
  px(ctx, 3, 16, 26, 1, "#d4a57a"); // highlight top edge
  px(ctx, 3, 18, 26, 1, deskDk); // shadow bottom edge

  // Desk front panel
  px(ctx, 4, 19, 24, 6, deskDk);
  px(ctx, 5, 20, 22, 4, deskTop);
  // Desk drawer
  px(ctx, 8, 20, 16, 4, deskDk);
  px(ctx, 9, 21, 14, 2, "#a88060");
  px(ctx, 15, 21, 2, 1, "#6b4d35"); // drawer handle

  // Desk legs
  px(ctx, 5, 25, 2, 6, deskLeg);
  px(ctx, 25, 25, 2, 6, deskLeg);

  // Paper on desk
  px(ctx, 7, 14, 7, 3, paper);
  px(ctx, 8, 14, 5, 1, "#ddd"); // lines on paper
  px(ctx, 8, 15, 4, 1, "#ddd");

  // Pencil
  px(ctx, 16, 14, 6, 1, pencil);
  px(ctx, 22, 14, 1, 1, "#e8a87c"); // eraser
  px(ctx, 15, 14, 1, 1, "#2c3e50"); // tip

  // Chair legs
  px(ctx, 11, 13, 2, 5, deskLeg);
  px(ctx, 19, 13, 2, 5, deskLeg);

  // Shadow
  px(ctx, 4, 31, 24, 1, "rgba(0,0,0,0.1)");
}

function drawQuizBoard(ctx: CanvasRenderingContext2D) {
  // 48×32 — blackboard/quiz board
  const frame = "#8b6b4a";
  const frameDk = "#6b4d35";
  const board = "#2d4a3e";
  const boardLt = "#3a5e50";
  const chalk = "#f5f5f0";
  const star = "#ffd700";

  // Frame
  px(ctx, 2, 2, 44, 24, frame);
  px(ctx, 2, 2, 44, 2, frameDk);
  px(ctx, 2, 2, 2, 24, frameDk);
  px(ctx, 44, 2, 2, 24, frameDk);
  px(ctx, 2, 24, 44, 2, frameDk);

  // Board surface
  px(ctx, 4, 4, 40, 18, board);
  px(ctx, 5, 5, 38, 1, boardLt); // highlight

  // Chalk text: "QUIZ" (pixel letters)
  // Q
  px(ctx, 8, 7, 4, 1, chalk);
  px(ctx, 7, 8, 1, 3, chalk);
  px(ctx, 12, 8, 1, 3, chalk);
  px(ctx, 8, 11, 4, 1, chalk);
  px(ctx, 11, 10, 1, 1, chalk);
  // U
  px(ctx, 14, 7, 1, 5, chalk);
  px(ctx, 18, 7, 1, 5, chalk);
  px(ctx, 15, 11, 3, 1, chalk);
  // I
  px(ctx, 20, 7, 3, 1, chalk);
  px(ctx, 21, 7, 1, 5, chalk);
  px(ctx, 20, 11, 3, 1, chalk);
  // Z
  px(ctx, 24, 7, 4, 1, chalk);
  px(ctx, 27, 8, 1, 1, chalk);
  px(ctx, 26, 9, 1, 1, chalk);
  px(ctx, 25, 10, 1, 1, chalk);
  px(ctx, 24, 11, 4, 1, chalk);

  // Stars
  px(ctx, 33, 7, 2, 2, star);
  px(ctx, 37, 9, 2, 2, star);
  px(ctx, 35, 12, 2, 2, star);

  // Score/tally marks
  px(ctx, 8, 15, 1, 4, chalk);
  px(ctx, 10, 15, 1, 4, chalk);
  px(ctx, 12, 15, 1, 4, chalk);
  px(ctx, 14, 15, 1, 4, chalk);
  px(ctx, 7, 17, 9, 1, chalk); // crossing line

  // Chalk tray
  px(ctx, 10, 26, 28, 2, frameDk);
  // Chalk pieces
  px(ctx, 14, 26, 4, 1, "#f5f5f0");
  px(ctx, 20, 26, 3, 1, "#ffcccc");
  px(ctx, 25, 26, 4, 1, "#ccffcc");

  // Board stand/legs
  px(ctx, 8, 26, 3, 6, frameDk);
  px(ctx, 37, 26, 3, 6, frameDk);
}

function drawRestArea(ctx: CanvasRenderingContext2D) {
  // 48×32 — sofa + coffee table
  const sofa = "#6b8caa";
  const sofaDk = "#4a6a88";
  const sofaLt = "#8aaac8";
  const cushion = "#88aacc";
  const table = "#8b6b4a";
  const tableDk = "#6b4d35";
  const cup = "#f5f0e8";

  // Sofa back
  px(ctx, 2, 8, 28, 10, sofa);
  px(ctx, 3, 7, 26, 2, sofaDk); // top edge
  px(ctx, 2, 8, 2, 10, sofaDk); // left arm
  px(ctx, 28, 8, 2, 10, sofaDk); // right arm

  // Sofa seat
  px(ctx, 4, 18, 24, 4, sofa);
  px(ctx, 5, 18, 22, 1, sofaLt); // highlight

  // Cushions
  px(ctx, 6, 10, 8, 7, cushion);
  px(ctx, 7, 10, 6, 1, sofaLt); // cushion highlight
  px(ctx, 16, 10, 8, 7, cushion);
  px(ctx, 17, 10, 6, 1, sofaLt);
  // Cushion divider
  px(ctx, 14, 10, 2, 7, sofaDk);

  // Sofa legs
  px(ctx, 5, 22, 2, 3, sofaDk);
  px(ctx, 25, 22, 2, 3, sofaDk);

  // Coffee table
  px(ctx, 33, 18, 12, 2, table);
  px(ctx, 33, 18, 12, 1, "#a88868"); // highlight
  px(ctx, 34, 20, 2, 6, tableDk); // left leg
  px(ctx, 42, 20, 2, 6, tableDk); // right leg

  // Coffee cup on table
  px(ctx, 36, 16, 4, 3, cup);
  px(ctx, 37, 15, 2, 1, cup); // rim
  px(ctx, 37, 16, 2, 1, "#d4a574"); // coffee inside
  px(ctx, 40, 16, 1, 2, cup); // handle
  // Steam
  px(ctx, 37, 13, 1, 1, "rgba(255,255,255,0.5)");
  px(ctx, 38, 12, 1, 1, "rgba(255,255,255,0.4)");

  // Small teddy bear on sofa
  px(ctx, 23, 12, 3, 3, "#d4a574"); // body
  px(ctx, 23, 11, 3, 2, "#d4a574"); // head
  px(ctx, 24, 11, 1, 1, "#1a1a2e"); // eye
  px(ctx, 22, 11, 1, 1, "#d4a574"); // ear
  px(ctx, 26, 11, 1, 1, "#d4a574"); // ear

  // Shadow
  px(ctx, 3, 25, 26, 1, "rgba(0,0,0,0.08)");
  px(ctx, 34, 26, 10, 1, "rgba(0,0,0,0.08)");
}

function drawGameCorner(ctx: CanvasRenderingContext2D) {
  // 32×32 — arcade cabinet
  const cabinet = "#4a3a5e";
  const cabinetDk = "#3a2a4e";
  const cabinetLt = "#6a5a8e";
  const screen = "#1a1a2e";
  const screenGlow = "#00ff88";
  const button1 = "#e74c3c";
  const button2 = "#3498db";
  const joystick = "#2c3e50";

  // Cabinet body
  px(ctx, 6, 2, 20, 28, cabinet);
  px(ctx, 6, 2, 20, 2, cabinetLt); // top
  px(ctx, 6, 2, 2, 28, cabinetDk); // left shadow
  px(ctx, 24, 2, 2, 28, cabinetDk); // right

  // Screen area
  px(ctx, 9, 5, 14, 10, screen);
  // Screen glow border
  px(ctx, 8, 4, 16, 1, screenGlow);
  px(ctx, 8, 15, 16, 1, screenGlow);
  px(ctx, 8, 4, 1, 12, screenGlow);
  px(ctx, 24, 4, 1, 12, screenGlow);

  // Pixel art on screen (tiny game!)
  px(ctx, 12, 8, 2, 2, "#00ff88"); // player
  px(ctx, 18, 7, 1, 1, "#ff6666"); // enemy
  px(ctx, 15, 11, 3, 1, "#ffff88"); // platform
  px(ctx, 10, 13, 12, 1, "#444466"); // ground
  // Score display
  px(ctx, 10, 6, 1, 1, "#ffffff");
  px(ctx, 11, 6, 1, 1, "#ffffff");
  px(ctx, 12, 6, 1, 1, "#ffffff");

  // Control panel
  px(ctx, 8, 17, 16, 6, cabinetDk);
  px(ctx, 9, 18, 14, 4, cabinetLt);

  // Joystick
  px(ctx, 11, 19, 2, 2, joystick);
  px(ctx, 12, 18, 1, 1, joystick); // stick top

  // Buttons
  px(ctx, 17, 19, 2, 2, button1);
  px(ctx, 20, 19, 2, 2, button2);
  // Button highlights
  px(ctx, 17, 19, 1, 1, "#ff6b6b");
  px(ctx, 20, 19, 1, 1, "#5dade2");

  // Coin slot
  px(ctx, 14, 24, 4, 1, "#888");
  px(ctx, 15, 25, 2, 1, "#666");

  // Cabinet legs
  px(ctx, 8, 30, 3, 2, cabinetDk);
  px(ctx, 21, 30, 3, 2, cabinetDk);

  // "GAME" text on top
  px(ctx, 10, 3, 1, 1, "#ffd700");
  px(ctx, 12, 3, 1, 1, "#ffd700");
  px(ctx, 14, 3, 1, 1, "#ffd700");
  px(ctx, 16, 3, 1, 1, "#ffd700");

  // Shadow
  px(ctx, 7, 31, 18, 1, "rgba(0,0,0,0.1)");
}

/* ─── size config per zone ───────────────────────── */

const ZONE_SIZE: Record<ZoneId, { w: number; h: number }> = {
  bookshelf:  { w: 32, h: 48 },
  desk:       { w: 32, h: 32 },
  quizBoard:  { w: 48, h: 32 },
  restArea:   { w: 48, h: 32 },
  gameCorner: { w: 32, h: 32 },
};

const ZONE_DRAWERS: Record<ZoneId, (ctx: CanvasRenderingContext2D) => void> = {
  bookshelf:  drawBookshelf,
  desk:       drawDesk,
  quizBoard:  drawQuizBoard,
  restArea:   drawRestArea,
  gameCorner: drawGameCorner,
};

/* ─── public API ─────────────────────────────────── */

const _furnitureCache = new Map<string, HTMLCanvasElement>();

/**
 * Generate a pixel art furniture canvas for a classroom zone.
 */
export function generateFurnitureCanvas(zoneId: ZoneId): HTMLCanvasElement {
  const cached = _furnitureCache.get(zoneId);
  if (cached) return cached;

  const size = ZONE_SIZE[zoneId];
  const drawer = ZONE_DRAWERS[zoneId];

  const canvas = document.createElement("canvas");
  canvas.width = size.w;
  canvas.height = size.h;

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawer(ctx);

  _furnitureCache.set(zoneId, canvas);
  return canvas;
}

/** Get the pixel dimensions for a zone's furniture */
export function getFurnitureSize(zoneId: ZoneId): { w: number; h: number } {
  return ZONE_SIZE[zoneId];
}
