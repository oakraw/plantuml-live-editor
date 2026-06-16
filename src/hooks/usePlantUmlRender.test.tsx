import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlantUmlRender } from './usePlantUmlRender';

const renderPlantUmlPreviewMock = vi.fn();

vi.mock('../plantuml/render', () => ({
  renderPlantUmlPreview: (...args: unknown[]) => renderPlantUmlPreviewMock(...args),
}));

vi.mock('../firebase/analytics', () => ({
  trackRenderSuccess: vi.fn(),
  trackRenderError: vi.fn(),
}));

const validSource = `@startuml
A -> B
@enduml`;

describe('usePlantUmlRender', () => {
  beforeEach(() => {
    renderPlantUmlPreviewMock.mockReset();
  });

  it('emits preview error and keeps last good preview', async () => {
    renderPlantUmlPreviewMock.mockResolvedValue({
      blob: new Blob(['ok'], { type: 'image/png' }),
      width: 800,
      height: 600,
    });

    const hook = renderHook(({ source }) => usePlantUmlRender(source), {
      initialProps: { source: validSource },
    });

    await waitFor(() => {
      expect(hook.result.current.lastGoodUrl).toBeTruthy();
    });

    hook.rerender({ source: '@startuml\nA -> B' });

    await waitFor(() => {
      expect(hook.result.current.error?.message).toContain('@enduml');
      expect(hook.result.current.lastGoodUrl).toBeTruthy();
    });
  });
});
