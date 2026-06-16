import { describe, expect, it } from 'vitest';
import { getCompletionItems, provideCompletionItems } from './suggestions';

describe('suggestions', () => {
  it('exposes at least 20 completion items', () => {
    expect(getCompletionItems().length).toBeGreaterThanOrEqual(20);
  });

  it('returns @start* suggestions for @start prefix', () => {
    const model = {
      getWordUntilPosition: () => ({ word: '@start', startColumn: 1, endColumn: 7 }),
      getLineContent: () => '@start',
    };
    const result = provideCompletionItems(model as never, { lineNumber: 1, column: 7 } as never);
    const labels = result.suggestions.map((item) =>
      typeof item.label === 'string' ? item.label : item.label.label,
    );
    expect(labels).toContain('@startuml');
    expect(labels).toContain('@startmindmap');
    expect(labels).toContain('@startsalt');
  });
});
