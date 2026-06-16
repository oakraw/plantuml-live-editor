export interface PngDimensions {
  width: number;
  height: number;
}

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'));
    reader.readAsArrayBuffer(blob);
  });
}

export async function decodePngDimensions(blob: Blob): Promise<PngDimensions> {
  const buffer = await blobToArrayBuffer(blob);
  const view = new DataView(buffer);
  if (view.getUint32(0) !== 0x89504e47) throw new Error('Invalid PNG signature');
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

export async function scalePngBlob(
  blob: Blob,
  targetWidth: number,
  targetHeight: number,
): Promise<Blob> {
  if (typeof createImageBitmap === 'undefined') return blob;
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to acquire canvas context');
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('Failed to encode PNG'))),
      'image/png',
    );
  });
}

export const resizePngBlob = scalePngBlob;

export function validateExportDimension(value: number): string | null {
  if (!Number.isInteger(value)) return 'Must be a whole number';
  if (value < 16 || value > 8192) return 'Must be between 16 and 8192';
  return null;
}

export function buildExportFilename(timestamp = new Date()): string {
  return `diagram-${timestamp.toISOString().replace(/[:.]/g, '-').slice(0, 19)}.png`;
}

export const createTimestampFilename = buildExportFilename;

export async function svgToPngBlob(
  svgString: string,
  width: number,
  height: number,
): Promise<Blob> {
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Failed to load SVG for export'));
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to acquire canvas context');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Failed to encode PNG'))),
        'image/png',
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
