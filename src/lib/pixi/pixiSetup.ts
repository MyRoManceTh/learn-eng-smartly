import { Application, TextureStyle } from "pixi.js";

export interface PixiAppOptions {
  width: number;
  height: number;
  backgroundColor?: number;
  transparent?: boolean;
}

export async function createPixelApp(
  canvas: HTMLCanvasElement,
  options: PixiAppOptions
): Promise<Application> {
  // Set nearest-neighbor globally for pixel-perfect textures
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const app = new Application();
  await app.init({
    canvas,
    width: options.width,
    height: options.height,
    backgroundColor: options.transparent ? 0x000000 : (options.backgroundColor ?? 0x000000),
    backgroundAlpha: options.transparent ? 0 : 1,
    antialias: false,
    // CRITICAL: resolution=1 to prevent hi-dpi smoothing.
    // The 8-bit look comes from rendering at low res and CSS-upscaling.
    resolution: 1,
    autoDensity: false,
  });

  // Ensure pixel-perfect CSS rendering (nearest-neighbor upscale)
  canvas.style.imageRendering = "pixelated";

  return app;
}
