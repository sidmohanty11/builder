import { expect } from '@playwright/test';
import { excludeTestFor, test } from '../helpers/index.js';

test.describe('Accordion', () => {
  test.fail(
    excludeTestFor({
      rsc: true,
      angular: true,
    })
  );
  test('Accordion renders correctly', async ({ page }) => {
    await page.goto('/accordion');

    for (let i = 1; i <= 3; i++) {
      await page.locator(`text=Item ${i}`).click();
    }
  });
  test('Accordion opens', async ({ page }) => {
    await page.goto('/accordion');

    for (let i = 1; i <= 3; i++) {
      await page.locator(`text=Item ${i}`).click();
      expect(await page.locator(`text=Inside Item ${i}`).isVisible()).toBeTruthy();
    }
  });
  test('Content is hidden when accordion is closed', async ({ page }) => {
    await page.goto('/accordion');

    for (let i = 1; i <= 3; i++) {
      await page.locator(`text=Item ${i}`).click();
      expect(await page.locator(`text=Inside Item ${i}`).isVisible()).toBeTruthy();
      await page.getByText(`Item ${i}`, { exact: true }).click();
      expect(await page.locator(`text=Inside Item ${i}`).isVisible()).toBeFalsy();
    }
  });
});
