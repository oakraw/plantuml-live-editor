import { useState } from 'react';
import { DEFAULT_EXPORT_HEIGHT, DEFAULT_EXPORT_WIDTH } from '../../types/plantuml';
import './ExportDialog.css';

const MIN_DIM = 16;
const MAX_DIM = 8192;

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (width: number, height: number) => void;
  disabled: boolean;
}

function validateDimension(value: string): string | null {
  const num = Number(value);
  if (!Number.isInteger(num) || num < MIN_DIM || num > MAX_DIM) {
    return `Must be an integer between ${MIN_DIM} and ${MAX_DIM}`;
  }
  return null;
}

export function ExportDialog({ open, onClose, onExport, disabled }: ExportDialogProps) {
  const [width, setWidth] = useState(String(DEFAULT_EXPORT_WIDTH));
  const [height, setHeight] = useState(String(DEFAULT_EXPORT_HEIGHT));
  const [lockAspect, setLockAspect] = useState(true);

  const widthError = validateDimension(width);
  const heightError = validateDimension(height);
  const hasError = Boolean(widthError || heightError);
  const exportDisabled = disabled || hasError;

  if (!open) return null;

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (lockAspect && !validateDimension(value)) {
      const ratio = DEFAULT_EXPORT_HEIGHT / DEFAULT_EXPORT_WIDTH;
      setHeight(String(Math.round(Number(value) * ratio)));
    }
  };

  return (
    <div className="export-dialog-overlay" role="dialog" aria-modal="true" aria-label="Export PNG">
      <div className="export-dialog">
        <h2 className="export-dialog-title">Export PNG</h2>
        <label className="export-field">
          Width (px)
          <input
            id="export-width"
            aria-label="Width (px)"
            className="text-input"
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
            aria-invalid={Boolean(widthError)}
          />
          {widthError && <span className="export-error">{widthError}</span>}
        </label>
        <label className="export-field">
          Height (px)
          <input
            id="export-height"
            aria-label="Height (px)"
            className="text-input"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            aria-invalid={Boolean(heightError)}
          />
          {heightError && <span className="export-error">{heightError}</span>}
        </label>
        <label className="export-checkbox">
          <input
            type="checkbox"
            checked={lockAspect}
            onChange={(e) => setLockAspect(e.target.checked)}
          />
          Lock aspect ratio
        </label>
        <div className="export-actions">
          <button type="button" className="button-utility" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="button-primary"
            disabled={exportDisabled}
            onClick={() => onExport(Number(width), Number(height))}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
