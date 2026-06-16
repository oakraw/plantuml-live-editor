import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(serious).toEqual([]);
});
