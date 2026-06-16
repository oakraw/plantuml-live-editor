import { renderPlantUmlSvg, initPlantUmlEngine } from './engine';
import { validatePlantUmlSource } from './validate';
import type { RenderError, RenderResult } from '../types/plantuml';
import { svgToPngBlob } from '../utils/png';

export function initRenderer(): Promise<void> {
  return initPlantUmlEngine();
}

export function pingWorker(): Promise<void> {
  return initPlantUmlEngine();
}

export function terminateRenderWorker(): void {}

export const terminateWorker = terminateRenderWorker;

export async function renderPlantUmlPreview(source: string): Promise<RenderResult> {
  const validationError = validatePlantUmlSource(source);
  if (validationError) throw validationError;

  const svg = await renderPlantUmlSvg(source);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return { blob, width: 0, height: 0 };
}

export async function exportPng(options: {
  source: string;
  width: number;
  height: number;
}): Promise<Blob> {
  const validationError = validatePlantUmlSource(options.source);
  if (validationError) throw validationError as unknown as RenderError;

  const svg = await renderPlantUmlSvg(options.source);
  return svgToPngBlob(svg, options.width, options.height);
}
