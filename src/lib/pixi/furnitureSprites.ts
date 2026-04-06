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

/* ═══════════════════════════════════════════════════════
   ROOM FURNITURE SPRITES
   Pixel art drawers for room items (MyPage Room tab)
   ═══════════════════════════════════════════════════════ */

/* ─── desks ─────────────────────────────────────── */

function drawDeskWood(ctx: CanvasRenderingContext2D) {
  const top = "#c4956a", dk = "#8b6b4a", leg = "#6b4d35";
  px(ctx, 3, 12, 26, 3, top);
  px(ctx, 3, 12, 26, 1, "#d4a57a");
  px(ctx, 4, 15, 24, 5, dk);
  px(ctx, 5, 16, 22, 3, "#a88060");
  px(ctx, 13, 16, 6, 1, leg); // handle
  px(ctx, 5, 20, 2, 10, leg);
  px(ctx, 25, 20, 2, 10, leg);
  px(ctx, 7, 10, 6, 2, "#fffff0"); // paper
  px(ctx, 17, 10, 5, 1, "#f1c40f"); // pencil
  px(ctx, 4, 30, 24, 1, "rgba(0,0,0,0.08)");
}

function drawDeskGamer(ctx: CanvasRenderingContext2D) {
  const top = "#2c2c3e", dk = "#1a1a2e", leg = "#111122", glow = "#00ff88";
  px(ctx, 2, 12, 28, 3, top);
  px(ctx, 2, 12, 28, 1, "#3a3a5e");
  px(ctx, 3, 15, 26, 5, dk);
  px(ctx, 2, 11, 28, 1, glow); // LED strip
  px(ctx, 5, 20, 2, 10, leg);
  px(ctx, 25, 20, 2, 10, leg);
  // Monitor
  px(ctx, 8, 2, 16, 10, "#1a1a2e");
  px(ctx, 9, 3, 14, 8, "#0a0a1e");
  px(ctx, 10, 4, 4, 3, glow); // screen content
  px(ctx, 16, 5, 3, 2, "#ff6666");
  px(ctx, 14, 12, 4, 1, "#333");
  // Keyboard
  px(ctx, 7, 10, 10, 2, "#333");
  px(ctx, 8, 10, 8, 1, "#555");
  // Mouse
  px(ctx, 20, 10, 3, 2, "#444");
  px(ctx, 4, 30, 24, 1, "rgba(0,0,0,0.08)");
}

function drawDeskMagic(ctx: CanvasRenderingContext2D) {
  const top = "#4a148c", dk = "#311b92", leg = "#1a0052", glow = "#e040fb";
  px(ctx, 3, 12, 26, 3, top);
  px(ctx, 3, 12, 26, 1, "#7c43bd");
  px(ctx, 4, 15, 24, 5, dk);
  px(ctx, 5, 20, 2, 10, leg);
  px(ctx, 25, 20, 2, 10, leg);
  // Crystal ball
  px(ctx, 12, 5, 8, 8, "#e1bee7");
  px(ctx, 13, 6, 6, 6, "#ce93d8");
  px(ctx, 14, 7, 2, 2, "#f3e5f5"); // glint
  px(ctx, 14, 13, 4, 1, dk); // base
  // Floating stars
  px(ctx, 8, 4, 2, 2, "#ffd700");
  px(ctx, 22, 6, 2, 2, "#ffd700");
  px(ctx, 6, 9, 1, 1, glow);
  px(ctx, 25, 3, 1, 1, glow);
  // Book
  px(ctx, 5, 10, 5, 3, "#8e24aa");
  px(ctx, 6, 10, 3, 1, "#ab47bc");
  px(ctx, 4, 30, 24, 1, "rgba(0,0,0,0.08)");
}

/* ─── beds ──────────────────────────────────────── */

function drawBedSimple(ctx: CanvasRenderingContext2D) {
  const frame = "#8b6b4a", dk = "#6b4d35", sheet = "#e8e8e8", pillow = "#f5f5f5";
  // Frame
  px(ctx, 2, 14, 36, 14, frame);
  px(ctx, 2, 14, 36, 2, dk);
  // Headboard
  px(ctx, 2, 6, 8, 10, dk);
  px(ctx, 3, 7, 6, 8, frame);
  // Mattress
  px(ctx, 4, 16, 32, 10, sheet);
  px(ctx, 5, 17, 30, 1, "#f0f0f0");
  // Pillow
  px(ctx, 5, 17, 8, 5, pillow);
  px(ctx, 6, 18, 6, 3, "#fafafa");
  // Blanket fold
  px(ctx, 15, 16, 20, 3, "#90caf9");
  px(ctx, 15, 19, 20, 7, "#bbdefb");
  // Legs
  px(ctx, 3, 28, 3, 4, dk);
  px(ctx, 34, 28, 3, 4, dk);
  px(ctx, 4, 31, 32, 1, "rgba(0,0,0,0.08)");
}

function drawBedPrincess(ctx: CanvasRenderingContext2D) {
  const frame = "#f8bbd0", dk = "#f48fb1", sheet = "#fce4ec", pillow = "#fff";
  px(ctx, 2, 14, 36, 14, frame);
  px(ctx, 2, 14, 36, 2, dk);
  // Tall headboard with heart
  px(ctx, 1, 2, 10, 14, dk);
  px(ctx, 2, 3, 8, 12, frame);
  px(ctx, 4, 6, 2, 2, "#e91e63"); // heart
  px(ctx, 6, 6, 2, 2, "#e91e63");
  px(ctx, 5, 8, 2, 1, "#e91e63");
  // Canopy hint
  px(ctx, 0, 0, 40, 2, "#f8bbd0");
  px(ctx, 0, 0, 2, 4, "#f48fb1");
  px(ctx, 38, 0, 2, 4, "#f48fb1");
  // Mattress + blanket
  px(ctx, 4, 16, 32, 10, sheet);
  px(ctx, 5, 17, 8, 5, pillow);
  px(ctx, 15, 16, 20, 3, "#f48fb1");
  px(ctx, 15, 19, 20, 7, "#f8bbd0");
  // Crown on pillow
  px(ctx, 7, 16, 4, 2, "#ffd700");
  px(ctx, 3, 28, 3, 4, dk);
  px(ctx, 34, 28, 3, 4, dk);
  px(ctx, 4, 31, 32, 1, "rgba(0,0,0,0.08)");
}

function drawBedSpaceship(ctx: CanvasRenderingContext2D) {
  const hull = "#546e7a", dk = "#37474f", glow = "#00e5ff", sheet = "#b0bec5";
  px(ctx, 2, 14, 36, 14, hull);
  px(ctx, 2, 14, 36, 2, dk);
  // Cockpit headboard
  px(ctx, 1, 4, 10, 12, dk);
  px(ctx, 2, 5, 8, 10, hull);
  px(ctx, 3, 6, 6, 4, "#0a0a1e"); // viewport
  px(ctx, 4, 7, 4, 2, "#00e5ff"); // stars
  px(ctx, 5, 7, 1, 1, "#fff");
  // LED strips
  px(ctx, 12, 14, 24, 1, glow);
  // Mattress
  px(ctx, 4, 16, 32, 10, sheet);
  px(ctx, 5, 17, 8, 5, "#eceff1");
  px(ctx, 15, 16, 20, 3, "#455a64");
  px(ctx, 15, 19, 20, 7, "#607d8b");
  // Rocket fin
  px(ctx, 36, 10, 3, 8, "#ff5722");
  px(ctx, 3, 28, 3, 4, dk);
  px(ctx, 34, 28, 3, 4, dk);
  px(ctx, 4, 31, 32, 1, "rgba(0,0,0,0.08)");
}

/* ─── shelves ───────────────────────────────────── */

function drawShelfSmall(ctx: CanvasRenderingContext2D) {
  const wood = "#8b6b4a", dk = "#6b4d35", lt = "#a88868";
  px(ctx, 4, 4, 24, 40, wood);
  px(ctx, 4, 4, 24, 2, dk);
  px(ctx, 4, 4, 2, 40, dk);
  px(ctx, 26, 4, 2, 40, dk);
  px(ctx, 4, 42, 24, 2, dk);
  px(ctx, 6, 22, 20, 2, dk); // middle shelf
  // Books top
  px(ctx, 7, 7, 3, 14, "#e74c3c");
  px(ctx, 10, 8, 3, 13, "#3498db");
  px(ctx, 13, 7, 2, 14, "#2ecc71");
  px(ctx, 15, 9, 3, 12, "#f39c12");
  px(ctx, 18, 7, 3, 14, "#9b59b6");
  px(ctx, 21, 8, 3, 13, "#1abc9c");
  // Books bottom
  px(ctx, 7, 25, 4, 16, "#2c3e50");
  px(ctx, 11, 26, 3, 15, "#e74c3c");
  px(ctx, 14, 25, 3, 16, "#f1c40f");
  px(ctx, 17, 27, 3, 14, "#27ae60");
  px(ctx, 20, 25, 4, 16, "#2980b9");
  px(ctx, 6, 6, 20, 1, lt);
}

function drawShelfBig(ctx: CanvasRenderingContext2D) {
  // Reuse bookshelf from classroom — it's already good
  drawBookshelf(ctx);
}

function drawShelfEnchanted(ctx: CanvasRenderingContext2D) {
  const wood = "#4a148c", dk = "#311b92", lt = "#7c43bd", glow = "#e040fb";
  px(ctx, 4, 4, 24, 40, wood);
  px(ctx, 4, 4, 24, 2, dk);
  px(ctx, 4, 4, 2, 40, dk);
  px(ctx, 26, 4, 2, 40, dk);
  px(ctx, 4, 42, 24, 2, dk);
  px(ctx, 6, 22, 20, 2, dk);
  // Glowing books
  px(ctx, 7, 7, 3, 14, "#e040fb");
  px(ctx, 10, 8, 3, 13, "#7c4dff");
  px(ctx, 13, 7, 2, 14, "#448aff");
  px(ctx, 15, 9, 3, 12, "#e040fb");
  px(ctx, 18, 7, 3, 14, "#7c4dff");
  // Crystal orb
  px(ctx, 9, 26, 6, 6, "#e1bee7");
  px(ctx, 10, 27, 4, 4, "#ce93d8");
  px(ctx, 11, 28, 1, 1, "#f3e5f5");
  // Potion bottle
  px(ctx, 19, 28, 4, 10, "#76ff03");
  px(ctx, 20, 26, 2, 2, "#aaa");
  // Glow particles
  px(ctx, 8, 6, 1, 1, glow);
  px(ctx, 22, 10, 1, 1, glow);
  px(ctx, 14, 38, 1, 1, glow);
  px(ctx, 6, 6, 20, 1, lt);
}

/* ─── posters ───────────────────────────────────── */

function drawPosterAbc(ctx: CanvasRenderingContext2D) {
  const frame = "#8b6b4a", bg = "#fffff0";
  px(ctx, 1, 1, 22, 22, frame);
  px(ctx, 2, 2, 20, 20, bg);
  // "ABC" in pixel letters
  px(ctx, 4, 5, 4, 1, "#e74c3c"); px(ctx, 3, 6, 1, 4, "#e74c3c"); px(ctx, 8, 6, 1, 4, "#e74c3c"); px(ctx, 4, 8, 4, 1, "#e74c3c"); // A
  px(ctx, 10, 5, 1, 6, "#3498db"); px(ctx, 11, 5, 3, 1, "#3498db"); px(ctx, 11, 8, 3, 1, "#3498db"); px(ctx, 11, 10, 3, 1, "#3498db"); px(ctx, 14, 6, 1, 2, "#3498db"); px(ctx, 14, 9, 1, 1, "#3498db"); // B
  px(ctx, 16, 5, 4, 1, "#2ecc71"); px(ctx, 15, 6, 1, 4, "#2ecc71"); px(ctx, 16, 10, 4, 1, "#2ecc71"); // C
  // Stars
  px(ctx, 5, 14, 2, 2, "#ffd700");
  px(ctx, 12, 15, 2, 2, "#ffd700");
  px(ctx, 18, 13, 2, 2, "#ffd700");
}

function drawPosterWorld(ctx: CanvasRenderingContext2D) {
  const frame = "#8b6b4a", bg = "#87ceeb";
  px(ctx, 1, 1, 22, 22, frame);
  px(ctx, 2, 2, 20, 20, bg);
  // Simple globe
  px(ctx, 7, 5, 10, 10, "#4caf50"); // land
  px(ctx, 8, 6, 8, 8, "#2196f3"); // ocean
  px(ctx, 9, 7, 3, 4, "#4caf50"); // continent
  px(ctx, 14, 8, 2, 3, "#4caf50");
  px(ctx, 10, 12, 4, 1, "#4caf50");
  // Pin
  px(ctx, 11, 8, 2, 2, "#e74c3c");
}

function drawPosterFlame(ctx: CanvasRenderingContext2D) {
  const frame = "#333", bg = "#1a1a2e";
  px(ctx, 1, 1, 22, 22, frame);
  px(ctx, 2, 2, 20, 20, bg);
  // Flame
  px(ctx, 10, 4, 4, 2, "#ff9800");
  px(ctx, 9, 6, 6, 3, "#ff5722");
  px(ctx, 8, 9, 8, 4, "#f44336");
  px(ctx, 9, 13, 6, 3, "#ff9800");
  px(ctx, 11, 5, 2, 2, "#ffeb3b");
  // "1st" text
  px(ctx, 5, 17, 1, 3, "#ffd700");
  px(ctx, 8, 17, 3, 1, "#ffd700"); px(ctx, 8, 19, 3, 1, "#ffd700");
}

function drawPosterStar(ctx: CanvasRenderingContext2D) {
  const frame = "#ffd700", bg = "#fff8e1";
  px(ctx, 1, 1, 22, 22, frame);
  px(ctx, 2, 2, 20, 20, bg);
  // Big star
  px(ctx, 10, 4, 4, 2, "#ffd700");
  px(ctx, 8, 6, 8, 4, "#ffd700");
  px(ctx, 6, 8, 12, 2, "#ffd700");
  px(ctx, 8, 10, 8, 2, "#ffd700");
  px(ctx, 9, 12, 2, 3, "#ffd700");
  px(ctx, 13, 12, 2, 3, "#ffd700");
  px(ctx, 11, 6, 2, 2, "#ffeb3b"); // center glint
  // Sparkles
  px(ctx, 5, 5, 1, 1, "#ffc107");
  px(ctx, 18, 4, 1, 1, "#ffc107");
  px(ctx, 16, 16, 1, 1, "#ffc107");
}

/* ─── windows ───────────────────────────────────── */

function drawWindowBasic(ctx: CanvasRenderingContext2D) {
  const frame = "#f5f5f5", dk = "#bdbdbd", sky = "#87ceeb";
  px(ctx, 2, 2, 24, 24, frame);
  px(ctx, 3, 3, 22, 22, sky);
  // Cross frame
  px(ctx, 13, 3, 2, 22, frame);
  px(ctx, 3, 13, 22, 2, frame);
  // Clouds
  px(ctx, 5, 6, 4, 2, "#fff");
  px(ctx, 4, 7, 6, 1, "#fff");
  px(ctx, 18, 8, 3, 2, "#fff");
  // Sun
  px(ctx, 20, 4, 3, 3, "#ffd700");
  // Curtain hint
  px(ctx, 1, 1, 2, 26, "#e8d5c4");
  px(ctx, 25, 1, 2, 26, "#e8d5c4");
  px(ctx, 1, 1, 26, 2, dk);
}

function drawWindowStained(ctx: CanvasRenderingContext2D) {
  const frame = "#6b4d35", dk = "#4a3428";
  px(ctx, 2, 2, 24, 24, frame);
  // Stained glass panes
  px(ctx, 3, 3, 10, 10, "#e74c3c");
  px(ctx, 15, 3, 10, 10, "#3498db");
  px(ctx, 3, 15, 10, 10, "#2ecc71");
  px(ctx, 15, 15, 10, 10, "#f39c12");
  // Cross frame
  px(ctx, 13, 3, 2, 22, frame);
  px(ctx, 3, 13, 22, 2, frame);
  // Inner light
  px(ctx, 5, 5, 3, 3, "#ff8a80");
  px(ctx, 17, 5, 3, 3, "#82b1ff");
  px(ctx, 5, 17, 3, 3, "#69f0ae");
  px(ctx, 17, 17, 3, 3, "#ffe57f");
  // Arch top
  px(ctx, 6, 1, 16, 2, dk);
  px(ctx, 4, 2, 2, 1, dk);
  px(ctx, 22, 2, 2, 1, dk);
}

/* ─── plants ────────────────────────────────────── */

function drawPlantCactus(ctx: CanvasRenderingContext2D) {
  const pot = "#d4845e", potDk = "#b0674a", green = "#4caf50", dk = "#388e3c";
  // Pot
  px(ctx, 4, 16, 8, 6, pot);
  px(ctx, 3, 16, 10, 2, potDk);
  px(ctx, 5, 22, 6, 2, potDk);
  // Cactus body
  px(ctx, 6, 4, 4, 13, green);
  px(ctx, 7, 5, 2, 11, dk);
  // Arms
  px(ctx, 3, 8, 3, 3, green);
  px(ctx, 3, 7, 2, 1, green);
  px(ctx, 10, 10, 3, 3, green);
  px(ctx, 12, 9, 1, 1, green);
  // Flower
  px(ctx, 7, 3, 2, 2, "#ff69b4");
  px(ctx, 8, 2, 1, 1, "#ff69b4");
}

function drawPlantFlower(ctx: CanvasRenderingContext2D) {
  const pot = "#d4845e", potDk = "#b0674a", stem = "#4caf50";
  px(ctx, 4, 16, 8, 6, pot);
  px(ctx, 3, 16, 10, 2, potDk);
  px(ctx, 5, 22, 6, 2, potDk);
  // Stems
  px(ctx, 7, 8, 1, 9, stem);
  px(ctx, 5, 10, 1, 7, stem);
  px(ctx, 10, 9, 1, 8, stem);
  // Flowers
  px(ctx, 6, 5, 3, 3, "#ff69b4"); px(ctx, 7, 6, 1, 1, "#ffd700");
  px(ctx, 4, 7, 3, 3, "#ff9800"); px(ctx, 5, 8, 1, 1, "#ffd700");
  px(ctx, 9, 6, 3, 3, "#e040fb"); px(ctx, 10, 7, 1, 1, "#ffd700");
  // Leaves
  px(ctx, 5, 12, 2, 1, "#66bb6a");
  px(ctx, 9, 13, 2, 1, "#66bb6a");
}

function drawPlantTree(ctx: CanvasRenderingContext2D) {
  const pot = "#6b4d35", potDk = "#4a3428", trunk = "#8b6b4a", leaf = "#2e7d32", lt = "#4caf50";
  px(ctx, 5, 18, 6, 4, pot);
  px(ctx, 4, 18, 8, 2, potDk);
  px(ctx, 6, 22, 4, 2, potDk);
  // Trunk
  px(ctx, 7, 12, 2, 7, trunk);
  // Foliage (round)
  px(ctx, 3, 3, 10, 4, leaf);
  px(ctx, 2, 5, 12, 4, leaf);
  px(ctx, 3, 9, 10, 4, leaf);
  // Highlights
  px(ctx, 4, 4, 3, 2, lt);
  px(ctx, 3, 7, 4, 2, lt);
  px(ctx, 7, 10, 3, 2, lt);
  // Fruits
  px(ctx, 5, 6, 1, 1, "#ff5722");
  px(ctx, 10, 8, 1, 1, "#ff5722");
  px(ctx, 8, 4, 1, 1, "#ffd700");
}

/* ─── trophies ──────────────────────────────────── */

function drawTrophy(ctx: CanvasRenderingContext2D, color: string, colorDk: string) {
  // Cup
  px(ctx, 4, 3, 8, 6, color);
  px(ctx, 5, 4, 6, 4, colorDk);
  px(ctx, 6, 5, 4, 2, color); // glint
  // Handles
  px(ctx, 2, 4, 2, 4, color);
  px(ctx, 12, 4, 2, 4, color);
  // Stem
  px(ctx, 7, 9, 2, 4, colorDk);
  // Base
  px(ctx, 4, 13, 8, 2, color);
  px(ctx, 3, 15, 10, 2, colorDk);
  // Star on cup
  px(ctx, 7, 5, 2, 2, "#ffd700");
}

function drawTrophyBronze(ctx: CanvasRenderingContext2D) { drawTrophy(ctx, "#cd7f32", "#a0622b"); }
function drawTrophySilver(ctx: CanvasRenderingContext2D) { drawTrophy(ctx, "#c0c0c0", "#909090"); }
function drawTrophyGold(ctx: CanvasRenderingContext2D) { drawTrophy(ctx, "#ffd700", "#daa520"); }
function drawTrophyDiamond(ctx: CanvasRenderingContext2D) {
  drawTrophy(ctx, "#b3e5fc", "#81d4fa");
  // Diamond sparkles
  px(ctx, 5, 3, 1, 1, "#fff");
  px(ctx, 10, 6, 1, 1, "#fff");
  px(ctx, 3, 8, 1, 1, "#e1f5fe");
}

/* ─── toys ──────────────────────────────────────── */

function drawToyConsole(ctx: CanvasRenderingContext2D) {
  const body = "#333", screen = "#1a1a2e";
  px(ctx, 2, 4, 16, 10, body);
  px(ctx, 3, 5, 14, 8, "#444");
  // Screen
  px(ctx, 4, 5, 8, 6, screen);
  px(ctx, 5, 6, 3, 2, "#00ff88"); // game
  px(ctx, 9, 7, 2, 1, "#ff6666");
  // Buttons
  px(ctx, 13, 6, 2, 2, "#e74c3c");
  px(ctx, 15, 8, 2, 2, "#3498db");
  // D-pad
  px(ctx, 4, 12, 3, 1, "#666");
  px(ctx, 5, 11, 1, 3, "#666");
}

function drawToyTeddy(ctx: CanvasRenderingContext2D) {
  const fur = "#d4a574", dk = "#b8885c";
  // Body
  px(ctx, 5, 9, 10, 8, fur);
  px(ctx, 6, 10, 8, 6, dk);
  // Head
  px(ctx, 6, 3, 8, 7, fur);
  px(ctx, 7, 4, 6, 5, dk);
  // Ears
  px(ctx, 4, 2, 3, 3, fur);
  px(ctx, 13, 2, 3, 3, fur);
  px(ctx, 5, 3, 1, 1, "#ffccbc");
  px(ctx, 14, 3, 1, 1, "#ffccbc");
  // Face
  px(ctx, 8, 5, 1, 1, "#1a1a2e"); // eye
  px(ctx, 11, 5, 1, 1, "#1a1a2e");
  px(ctx, 9, 7, 2, 1, "#1a1a2e"); // nose
  // Arms
  px(ctx, 3, 10, 2, 5, fur);
  px(ctx, 15, 10, 2, 5, fur);
  // Legs
  px(ctx, 6, 17, 3, 2, fur);
  px(ctx, 11, 17, 3, 2, fur);
}

function drawToyRobot(ctx: CanvasRenderingContext2D) {
  const body = "#78909c", dk = "#546e7a", glow = "#00e5ff";
  // Head
  px(ctx, 6, 2, 8, 6, body);
  px(ctx, 7, 3, 6, 4, dk);
  px(ctx, 8, 4, 1, 1, glow); // eye
  px(ctx, 11, 4, 1, 1, glow);
  px(ctx, 5, 1, 1, 2, "#ffd700"); // antenna
  px(ctx, 14, 1, 1, 2, "#ffd700");
  // Body
  px(ctx, 5, 8, 10, 8, body);
  px(ctx, 6, 9, 8, 6, dk);
  px(ctx, 8, 10, 4, 3, glow); // chest panel
  // Arms
  px(ctx, 3, 9, 2, 6, body);
  px(ctx, 15, 9, 2, 6, body);
  // Legs
  px(ctx, 6, 16, 3, 3, body);
  px(ctx, 11, 16, 3, 3, body);
}

function drawToyGlobe(ctx: CanvasRenderingContext2D) {
  const stand = "#8b6b4a", dk = "#6b4d35";
  // Stand
  px(ctx, 7, 15, 6, 2, stand);
  px(ctx, 5, 17, 10, 2, dk);
  px(ctx, 9, 13, 2, 3, stand);
  // Globe
  px(ctx, 4, 2, 12, 12, "#2196f3");
  px(ctx, 5, 3, 10, 10, "#42a5f5");
  // Land masses
  px(ctx, 6, 4, 4, 3, "#4caf50");
  px(ctx, 11, 6, 3, 4, "#4caf50");
  px(ctx, 7, 9, 5, 2, "#4caf50");
  // Glint
  px(ctx, 6, 3, 2, 2, "#90caf9");
  // Axis
  px(ctx, 9, 1, 2, 1, dk);
  px(ctx, 9, 14, 2, 1, dk);
}

/* ─── room furniture registry ───────────────────── */

type RoomDrawer = (ctx: CanvasRenderingContext2D) => void;

const ROOM_ITEM_SIZE: Record<string, { w: number; h: number }> = {
  desk_wood: { w: 32, h: 32 }, desk_gamer: { w: 32, h: 32 }, desk_magic: { w: 32, h: 32 },
  bed_simple: { w: 40, h: 32 }, bed_princess: { w: 40, h: 32 }, bed_spaceship: { w: 40, h: 32 },
  shelf_small: { w: 32, h: 48 }, shelf_big: { w: 32, h: 48 }, shelf_enchanted: { w: 32, h: 48 },
  poster_abc: { w: 24, h: 24 }, poster_world: { w: 24, h: 24 }, poster_flame: { w: 24, h: 24 }, poster_star: { w: 24, h: 24 },
  window_basic: { w: 28, h: 28 }, window_stained: { w: 28, h: 28 },
  plant_cactus: { w: 16, h: 24 }, plant_flower: { w: 16, h: 24 }, plant_tree: { w: 16, h: 24 },
  trophy_bronze: { w: 16, h: 18 }, trophy_silver: { w: 16, h: 18 }, trophy_gold: { w: 16, h: 18 }, trophy_diamond: { w: 16, h: 18 },
  toy_console: { w: 20, h: 16 }, toy_teddy: { w: 20, h: 20 }, toy_robot: { w: 20, h: 20 }, toy_globe: { w: 20, h: 20 },
};

const ROOM_ITEM_DRAWERS: Record<string, RoomDrawer> = {
  desk_wood: drawDeskWood, desk_gamer: drawDeskGamer, desk_magic: drawDeskMagic,
  bed_simple: drawBedSimple, bed_princess: drawBedPrincess, bed_spaceship: drawBedSpaceship,
  shelf_small: drawShelfSmall, shelf_big: drawShelfBig, shelf_enchanted: drawShelfEnchanted,
  poster_abc: drawPosterAbc, poster_world: drawPosterWorld, poster_flame: drawPosterFlame, poster_star: drawPosterStar,
  window_basic: drawWindowBasic, window_stained: drawWindowStained,
  plant_cactus: drawPlantCactus, plant_flower: drawPlantFlower, plant_tree: drawPlantTree,
  trophy_bronze: drawTrophyBronze, trophy_silver: drawTrophySilver, trophy_gold: drawTrophyGold, trophy_diamond: drawTrophyDiamond,
  toy_console: drawToyConsole, toy_teddy: drawToyTeddy, toy_robot: drawToyRobot, toy_globe: drawToyGlobe,
};

const _roomCache = new Map<string, string>();

/**
 * Generate a pixel art data-URL for a room furniture item.
 * Returns null if no drawer exists for the item.
 */
export function generateRoomItemSprite(itemId: string): string | null {
  const cached = _roomCache.get(itemId);
  if (cached) return cached;

  const size = ROOM_ITEM_SIZE[itemId];
  const drawer = ROOM_ITEM_DRAWERS[itemId];
  if (!size || !drawer) return null;

  const canvas = document.createElement("canvas");
  canvas.width = size.w;
  canvas.height = size.h;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size.w, size.h);
  drawer(ctx);

  const url = canvas.toDataURL("image/png");
  _roomCache.set(itemId, url);
  return url;
}
