import { test, expect } from '@playwright/test';

test('export PNG download', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);

  await page.getByRole('button', { name: 'Export diagram as PNG' }).click();
  await page.getByLabel('Width (px)').fill('1920');
  await page.getByLabel('Height (px)').fill('1080');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('dialog').getByRole('button', { name: 'Export', exact: true }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(
    /^diagram-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.png$/,
  );
});
