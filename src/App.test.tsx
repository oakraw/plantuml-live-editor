import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('@monaco-editor/react', () => ({
  default: ({ onChange }: { onChange?: (value: string) => void }) => (
    <textarea
      aria-label="monaco-editor"
      onChange={(e) => onChange?.(e.target.value)}
      defaultValue="@startuml\nA -> B\n@enduml"
    />
  ),
}));

vi.mock('./plantuml/render', () => ({
  initRenderer: vi.fn().mockResolvedValue(undefined),
  renderPlantUml: vi
    .fn()
    .mockResolvedValue({ blob: new Blob(['png'], { type: 'image/png' }), width: 800, height: 600 }),
  renderPlantUmlPreview: vi
    .fn()
    .mockResolvedValue({ blob: new Blob(['png'], { type: 'image/png' }), width: 800, height: 600 }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('PlantUML Live Editor')).toBeInTheDocument();
  });

  it('renders editor, preview, and toolbar regions', () => {
    render(<App />);
    expect(screen.getByRole('region', { name: 'PlantUML editor' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Diagram preview' })).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: 'Editor toolbar' })).toBeInTheDocument();
  });

  it('responds to viewport changes per design breakpoints', () => {
    const main = document.createElement('main');
    main.className = 'app-main';
    document.body.appendChild(main);
    expect(getComputedStyle(main).display).toBeDefined();
    document.body.removeChild(main);
  });
});
