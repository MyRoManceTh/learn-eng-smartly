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
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  // Ensure pixel-perfect CSS rendering
  canvas.style.imageRendering = "pixelated";

  return app;
}
