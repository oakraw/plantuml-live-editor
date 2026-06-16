import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlantUmlEditor } from './Editor';

const setModelMarkers = vi.fn();

vi.mock('@monaco-editor/react', () => ({
  default: ({
    onMount,
  }: {
    onMount?: (
      editor: { getModel: () => object; updateOptions: () => void },
      monaco: object,
    ) => void;
  }) => {
    onMount?.(
      { getModel: () => ({}), updateOptions: vi.fn() },
      {
        editor: { setModelMarkers },
        languages: {
          getLanguages: () => [],
          register: vi.fn(),
          setMonarchTokensProvider: vi.fn(),
          registerCompletionItemProvider: vi.fn(() => ({ dispose: vi.fn() })),
        },
      },
    );
    return <div aria-label="PlantUML editor" role="region" />;
  },
}));

describe('PlantUmlEditor', () => {
  it('updates editor markers when diagnostics change', async () => {
    const { rerender } = render(
      <PlantUmlEditor value="@startuml\nA\n@enduml" onChange={() => {}} diagnostics={[]} />,
    );
    rerender(
      <PlantUmlEditor
        value="@startuml\nA\n@enduml"
        onChange={() => {}}
        diagnostics={[{ message: 'Missing @enduml', line: 1, column: 1, severity: 'error' }]}
      />,
    );
    await waitFor(() => expect(setModelMarkers).toHaveBeenCalled());
  });
});
