import { describe, expect, it } from 'vitest';
import { tokenize } from './language';

describe('language tokenizer', () => {
  it('tokenize("@startuml\n@enduml") returns expected token types', () => {
    const tokens = tokenize('@startuml\n@enduml');
    expect(tokens.some((t) => t.type === 'directive' && t.value === '@startuml')).toBe(true);
    expect(tokens.some((t) => t.type === 'directive' && t.value === '@enduml')).toBe(true);
  });

  it('detects arrows and keywords', () => {
    const tokens = tokenize('Alice -> Bob\nBob --> Carol\nactor User');
    expect(tokens.filter((t) => t.type === 'arrow').length).toBeGreaterThan(0);
    expect(tokens.some((t) => t.type === 'keyword' && t.value === 'actor')).toBe(true);
  });

  it('detects comment lines', () => {
    const tokens = tokenize("' this is a comment");
    expect(tokens.some((t) => t.type === 'comment')).toBe(true);
  });
});
