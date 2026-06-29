import { test as base } from '@playwright/test';
import { LoginPage }    from '../pages/LoginPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { GridPage }     from '../pages/GridPage';
import { SearchPage }   from '../pages/SearchPage';

type PageFixtures = {
  loginPage:    LoginPage;
  checkoutPage: CheckoutPage;
  gridPage:     GridPage;
  searchPage:   SearchPage;
};

/**
 * Extended test object with page-object fixtures pre-wired.
 *
 * Playwright automatically calls each fixture before the test (setup)
 * and tears it down after (teardown), satisfying the challenge's
 * setup/teardown requirement without manual beforeEach/afterEach calls.
 *
 * Usage in test files:
 *   import { test, expect } from '../../fixtures/test.fixtures';
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  gridPage: async ({ page }, use) => {
    await use(new GridPage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
});

export { expect } from '@playwright/test';
