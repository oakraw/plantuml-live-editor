import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExportDialog } from './ExportDialog';

describe('ExportDialog', () => {
  it('shows inline error and disables Export for invalid input', () => {
    render(<ExportDialog open onClose={vi.fn()} onExport={vi.fn()} disabled={false} />);
    fireEvent.change(screen.getByLabelText(/Width/), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Height/), { target: { value: '10' } });
    expect(screen.getAllByText(/Must be an integer between 16 and 8192/i).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
  });
});
