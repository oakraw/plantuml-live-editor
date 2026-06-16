import type { RenderError } from '../types/plantuml';

export function validatePlantUmlSource(source: string): RenderError | null {
  const trimmed = source.trim();
  if (!trimmed) {
    return { message: 'Diagram source is empty', line: 1, column: 1 };
  }

  const startMatch = trimmed.match(/@start[a-z]*/i);
  if (!startMatch) {
    return { message: 'Missing @startuml directive', line: 1, column: 1 };
  }

  const startToken = startMatch[0].toLowerCase();
  const endToken = startToken.replace('@start', '@end');

  if (!trimmed.toLowerCase().includes(endToken)) {
    const lines = source.split('\n');
    const startLine = lines.findIndex((line) => line.toLowerCase().includes(startToken));
    return {
      message: `Missing ${endToken} directive`,
      line: startLine >= 0 ? startLine + 1 : 1,
      column: 1,
    };
  }

  return null;
}
