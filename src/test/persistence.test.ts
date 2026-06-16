import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const FORBIDDEN = ['localStorage', 'sessionStorage', 'indexedDB', 'document.cookie'];

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'test') continue;
      files.push(...walkDir(full));
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.includes('.test.')) {
      files.push(full);
    }
  }
  return files;
}

describe('persistence guard', () => {
  it('src/ contains no forbidden persistence APIs', () => {
    const violations: string[] = [];
    for (const file of walkDir(join(process.cwd(), 'src'))) {
      const content = readFileSync(file, 'utf-8');
      for (const symbol of FORBIDDEN) {
        if (content.includes(symbol)) violations.push(`${file}: ${symbol}`);
      }
    }
    expect(violations).toEqual([]);
  });
});
