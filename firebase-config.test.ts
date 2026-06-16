import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';

describe('firebase.json', () => {
  it('has public dist and SPA rewrite', () => {
    const config = JSON.parse(readFileSync('firebase.json', 'utf-8')) as {
      hosting: { public: string; rewrites: Array<{ source: string; destination: string }> };
    };
    expect(config.hosting.public).toBe('dist');
    expect(config.hosting.rewrites).toContainEqual({ source: '**', destination: '/index.html' });
  });
});
