import { type Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to the page's own route. Implemented by each subclass. */
  abstract goto(): Promise<void>;

  /** Wait until the page is interactive. Override when default is insufficient. */
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
