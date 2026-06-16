import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';
import { getFirebaseConfig, isAnalyticsEnabled } from './config';

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

export function initAnalytics(): Analytics | null {
  if (!isAnalyticsEnabled()) return null;
  const config = getFirebaseConfig();
  if (!config) return null;
  if (!app) {
    app = initializeApp(config);
    analytics = getAnalytics(app);
  }
  return analytics;
}

export function trackEvent(eventName: string, params?: Record<string, string | number>): void {
  if (!isAnalyticsEnabled() || !analytics) return;
  logEvent(analytics, eventName, params);
}

export function trackAppOpen(): void {
  trackEvent('app_open');
}
export function trackRenderSuccess(): void {
  trackEvent('diagram_render_success');
}
export function trackRenderError(): void {
  trackEvent('diagram_render_error');
}
export function trackExportPng(width: number, height: number): void {
  trackEvent('export_png', { width, height });
}

export function resetAnalyticsForTests(): void {
  app = null;
  analytics = null;
}
