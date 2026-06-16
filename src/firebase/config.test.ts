import { describe, expect, it, vi } from 'vitest';
import { getFirebaseConfig } from './config';

describe('firebase config', () => {
  it('returns null when env vars missing', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', '');
    expect(getFirebaseConfig()).toBeNull();
    vi.unstubAllEnvs();
  });
});
