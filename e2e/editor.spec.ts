import { test, expect } from '@playwright/test';

test('live render flow updates preview', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'PlantUML editor' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Diagram preview' })).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.getByAltText('Rendered PlantUML diagram')).toBeVisible({ timeout: 5000 });
});
