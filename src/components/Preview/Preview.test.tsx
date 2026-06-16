import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Preview } from './Preview';

describe('Preview', () => {
  it('shows loading indicator while worker is busy', () => {
    render(<Preview imageUrl={null} lastGoodUrl={null} isLoading errorMessage={null} />);
    expect(screen.getByText(/Rendering diagram/)).toBeInTheDocument();
  });
});
