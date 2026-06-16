import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({ mocked: true })),
  logEvent: vi.fn(),
}));
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({ app: true })) }));

describe('analytics', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('does not call logEvent when env is missing', async () => {
    const { logEvent } = await import('firebase/analytics');
    const { trackEvent, resetAnalyticsForTests } = await import('./analytics');
    resetAnalyticsForTests();
    trackEvent('app_open');
    expect(logEvent).not.toHaveBeenCalled();
  });

  it('does not enable analytics outside production', async () => {
    const { isAnalyticsEnabled } = await import('./config');
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it('trackExportPng is safe without analytics instance', async () => {
    const { trackExportPng, resetAnalyticsForTests } = await import('./analytics');
    resetAnalyticsForTests();
    expect(() => trackExportPng(1920, 1080)).not.toThrow();
  });

  it('initializes analytics in production when config exists', async () => {
    vi.stubEnv('PROD', true);
    vi.doMock('./config', () => ({
      getFirebaseConfig: () => ({
        apiKey: 'k',
        authDomain: 'd',
        projectId: 'p',
        storageBucket: 'b',
        messagingSenderId: 'm',
        appId: 'a',
        measurementId: 'g',
      }),
      isAnalyticsEnabled: () => true,
    }));
    const { initAnalytics, trackExportPng, resetAnalyticsForTests } = await import('./analytics');
    resetAnalyticsForTests();
    expect(initAnalytics()).toBeTruthy();
    trackExportPng(1920, 1080);
    const { logEvent } = await import('firebase/analytics');
    expect(logEvent).toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
});
