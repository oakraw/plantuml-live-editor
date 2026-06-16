import { describe, expect, it } from 'vitest';
import { validateExportDimensions } from './export-validation';

describe('validateExportDimensions', () => {
  it('accepts valid dimensions', () => {
    expect(validateExportDimensions(1920, 1080)).toBeNull();
  });

  it('rejects out-of-range values', () => {
    expect(validateExportDimensions(8, 1080)).toMatch(/Width/);
    expect(validateExportDimensions(1920, 9000)).toMatch(/Height/);
  });
});
