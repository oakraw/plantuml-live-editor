import { describe, expect, it, vi } from 'vitest';
import {
  buildExportFilename,
  createTimestampFilename,
  decodePngDimensions,
  downloadBlob,
  resizePngBlob,
  scalePngBlob,
  validateExportDimension,
} from './png';

function createMinimalPng(width: number, height: number): Blob {
  const buffer = new ArrayBuffer(24);
  const view = new DataView(buffer);
  view.setUint32(0, 0x89504e47);
  view.setUint32(16, width);
  view.setUint32(20, height);
  return new Blob([buffer], { type: 'image/png' });
}

describe('png utils', () => {
  it('decodes PNG dimensions from IHDR chunk', async () => {
    await expect(decodePngDimensions(createMinimalPng(1920, 1080))).resolves.toEqual({
      width: 1920,
      height: 1080,
    });
  });

  it('validates export dimensions', () => {
    expect(validateExportDimension(15)).toMatch(/between/);
    expect(validateExportDimension(800)).toBeNull();
  });

  it('builds timestamped export filenames', () => {
    expect(buildExportFilename(new Date('2026-06-14T12:00:00.000Z'))).toBe(
      'diagram-2026-06-14T12-00-00.png',
    );
    expect(createTimestampFilename()).toMatch(/^diagram-.*\.png$/);
  });

  it('scales png blobs when createImageBitmap is available', async () => {
    const close = vi.fn();
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => ({ close })),
    );
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({ drawImage: vi.fn() }),
          toBlob: (cb: (b: Blob) => void) => cb(new Blob(['png'], { type: 'image/png' })),
        } as unknown as HTMLCanvasElement;
      }
      return document.createElement.bind(document)(tag);
    });
    const scaled = await scalePngBlob(createMinimalPng(100, 100), 200, 200);
    expect(scaled.type).toBe('image/png');
    expect(resizePngBlob).toBe(scalePngBlob);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('downloads blob via temporary anchor', () => {
    const click = vi.fn();
    const anchor = document.createElement('a');
    anchor.click = click;
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    downloadBlob(new Blob(['x']), 'diagram.png');
    expect(click).toHaveBeenCalled();
  });
});
