import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly searchInput:   Locator;
  readonly searchButton:  Locator;
  readonly resultMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput   = page.locator('input[name="searchWord"]');
    this.searchButton  = page.locator('button[type="submit"]');
    this.resultMessage = page.locator('p#result');
  }

  async goto(): Promise<void> {
    await this.page.goto('/search');
    await this.waitForReady();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
}
