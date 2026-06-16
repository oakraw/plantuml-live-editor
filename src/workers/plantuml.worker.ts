import type { RenderError, WorkerRequest, WorkerResponse } from '../types/plantuml';
import { validatePlantUmlSource } from '../plantuml/validate';

async function renderToPng(source: string, width: number, height: number) {
  const validationError = validatePlantUmlSource(source);
  if (validationError) throw validationError;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#0075de';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  ctx.fillStyle = '#000000';
  ctx.font = '14px Inter, sans-serif';
  source
    .split('\n')
    .slice(0, 20)
    .forEach((line, index) => {
      ctx.fillText(line.slice(0, 80), 30, 50 + index * 20);
    });

  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return { blob, width, height };
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  if (msg.type === 'ping') {
    self.postMessage({ type: 'pong' } satisfies WorkerResponse);
    return;
  }

  if (msg.type === 'render') {
    try {
      const w = msg.width ?? 800;
      const h = msg.height ?? 600;
      const result = await renderToPng(msg.source, w, h);
      self.postMessage({
        type: 'render-success',
        id: msg.id,
        blob: result.blob,
        width: result.width,
        height: result.height,
      } satisfies WorkerResponse);
    } catch (err) {
      const error = err as RenderError;
      self.postMessage({
        type: 'render-error',
        id: msg.id,
        error: {
          message: error.message ?? 'Render failed',
          line: error.line ?? 1,
          column: error.column ?? 1,
        },
      } satisfies WorkerResponse);
    }
  }
};
