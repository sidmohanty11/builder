import { expect } from '@playwright/test';
import { checkIsRN, getClassSelector, test } from '../helpers/index.js';

test.describe('Block Styles', () => {
  test('check that block styles load', async ({ page, sdk }) => {
    test.skip(checkIsRN(sdk));
    await page.goto('/columns');
    const blocksWrapper = await page.locator(getClassSelector('builder-blocks', sdk)).first();
    await expect(blocksWrapper).toHaveCSS('display', 'flex');
  });
});
