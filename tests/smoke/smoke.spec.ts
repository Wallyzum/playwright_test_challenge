import { test, expect } from '../../fixtures/test.fixtures';

test.describe('Smoke: Application availability', () => {
  test('homepage has a link to the login page', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page is reachable', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.page).toHaveURL(/\/login/);
  });

  test('checkout page is reachable', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await expect(checkoutPage.page).toHaveURL(/\/checkout/);
  });

  test('grid page is reachable', async ({ gridPage }) => {
    await gridPage.goto();
    await expect(gridPage.page).toHaveURL(/\/grid/);
  });

  test('search page is reachable', async ({ searchPage }) => {
    await searchPage.goto();
    await expect(searchPage.page).toHaveURL(/\/search/);
  });
});
