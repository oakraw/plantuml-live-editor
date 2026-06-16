import { describe, expect, it } from 'vitest';
import { validatePlantUmlSource } from './validate';

describe('validatePlantUmlSource', () => {
  it('rejects empty source', () => {
    expect(validatePlantUmlSource('   ')?.message).toContain('empty');
  });

  it('rejects missing start directive', () => {
    expect(validatePlantUmlSource('Alice -> Bob')?.message).toContain('@startuml');
  });

  it('rejects missing end directive', () => {
    expect(validatePlantUmlSource('@startuml\nAlice -> Bob')?.message).toContain('@enduml');
  });

  it('accepts valid source', () => {
    expect(validatePlantUmlSource('@startuml\nA -> B\n@enduml')).toBeNull();
  });
});
