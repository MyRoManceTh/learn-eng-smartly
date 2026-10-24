import { Application, TextureStyle } from "pixi.js";

export interface PixiAppOptions {
  width: number;
  height: number;
  backgroundColor?: number;
  transparent?: boolean;
  /**
   * Backing-store multiplier. Vector characters are drawn in a small logical
   * space (e.g. 64×80) and CSS-scaled up — without a high enough resolution
   * the result is blurry. Pass ceil(cssSize / logicalSize) × devicePixelRatio.
   */
  resolution?: number;
}

export async function createPixelApp(
  canvas: HTMLCanvasElement,
  options: PixiAppOptions
): Promise<Application> {
  // Use linear scaling for smooth vector-style rendering
  TextureStyle.defaultOptions.scaleMode = "linear";

  const app = new Application();
  await app.init({
    canvas,
    width: options.width,
    height: options.height,
    backgroundColor: options.transparent ? 0x000000 : (options.backgroundColor ?? 0x000000),
    backgroundAlpha: options.transparent ? 0 : 1,
    antialias: true,
    resolution: Math.min(8, Math.max(2, options.resolution ?? 2)),
    autoDensity: true,
  });

  // Smooth rendering for LINE sticker vector art
  canvas.style.imageRendering = "auto";

  return app;
}
