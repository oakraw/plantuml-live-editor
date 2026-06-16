import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockRenderSvg = vi.fn();
const mockInit = vi.fn();
const mockSvgToPngBlob = vi.fn();

vi.mock('./engine', () => ({
  initPlantUmlEngine: () => mockInit(),
  renderPlantUmlSvg: (...args: unknown[]) => mockRenderSvg(...args),
}));

vi.mock('../utils/png', () => ({
  svgToPngBlob: (...args: unknown[]) => mockSvgToPngBlob(...args),
}));

const SAMPLE_SVG = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>';

describe('render', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInit.mockResolvedValue(undefined);
    mockRenderSvg.mockResolvedValue(SAMPLE_SVG);
    mockSvgToPngBlob.mockResolvedValue(new Blob(['png'], { type: 'image/png' }));
    vi.resetModules();
  });

  afterEach(async () => {
    const { terminateRenderWorker } = await import('./render');
    terminateRenderWorker();
  });

  it('responds to ping', async () => {
    const { pingWorker } = await import('./render');
    await expect(pingWorker()).resolves.toBeUndefined();
    expect(mockInit).toHaveBeenCalled();
  });

  it('preview returns an SVG blob', async () => {
    const { renderPlantUmlPreview } = await import('./render');
    const result = await renderPlantUmlPreview(`@startuml\nA -> B\n@enduml`);
    expect(result.blob.type).toBe('image/svg+xml');
    expect(mockRenderSvg).toHaveBeenCalled();
  });

  it('rejects render errors from engine', async () => {
    mockRenderSvg.mockRejectedValue({ message: 'Render failed', line: 1, column: 1 });
    const { renderPlantUmlPreview } = await import('./render');
    await expect(renderPlantUmlPreview('@startuml\nA\n@enduml')).rejects.toMatchObject({
      message: 'Render failed',
    });
  });

  it('exportPng rasterises SVG to PNG at requested dimensions', async () => {
    const { exportPng } = await import('./render');
    const blob = await exportPng({ source: `@startuml\nA -> B\n@enduml`, width: 640, height: 480 });
    expect(blob.type).toBe('image/png');
    expect(mockSvgToPngBlob).toHaveBeenCalledWith(SAMPLE_SVG, 640, 480);
  });
});
