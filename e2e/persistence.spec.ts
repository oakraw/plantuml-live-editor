import { test, expect } from '@playwright/test';

test('reload clears user content', async ({ page }) => {
  await page.goto('/');
  await page.locator('.monaco-editor').click();
  await page.keyboard.press('Meta+A');
  await page.keyboard.type('@startuml\nEdited content\n@enduml');
  await page.reload();
  await page.waitForSelector('.monaco-editor');
  const content = await page.locator('.view-lines').innerText();
  expect(content).toContain('Alice');
  expect(content).not.toContain('Edited content');
});
