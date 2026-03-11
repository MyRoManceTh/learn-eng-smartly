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
    resolution: 2, // 2x for crisp vector art on retina displays
    autoDensity: true,
  });

  // Smooth rendering for LINE sticker vector art
  canvas.style.imageRendering = "auto";

  return app;
}
