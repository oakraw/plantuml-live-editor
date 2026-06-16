import { MAX_EXPORT_DIMENSION, MIN_EXPORT_DIMENSION } from '../constants';

export function validateExportDimensions(width: number, height: number): string | null {
  if (!Number.isInteger(width) || width < MIN_EXPORT_DIMENSION || width > MAX_EXPORT_DIMENSION) {
    return `Width must be an integer between ${MIN_EXPORT_DIMENSION} and ${MAX_EXPORT_DIMENSION}`;
  }
  if (!Number.isInteger(height) || height < MIN_EXPORT_DIMENSION || height > MAX_EXPORT_DIMENSION) {
    return `Height must be an integer between ${MIN_EXPORT_DIMENSION} and ${MAX_EXPORT_DIMENSION}`;
  }
  return null;
}
