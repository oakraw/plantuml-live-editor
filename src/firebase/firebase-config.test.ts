import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('firebase.json', () => {
  it('parses hosting config with dist public and SPA rewrite', () => {
    const config = JSON.parse(readFileSync('firebase.json', 'utf8')) as {
      hosting: { public: string; rewrites: Array<{ source: string; destination: string }> };
    };

    expect(config.hosting.public).toBe('dist');
    expect(config.hosting.rewrites).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: '**', destination: '/index.html' }),
      ]),
    );
  });
});
