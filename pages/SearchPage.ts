import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly searchInput:   Locator;
  readonly searchButton:  Locator;
  readonly resultMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Selectors to be refined after inspecting the live app
    this.searchInput   = page.locator('input[type="search"], input[name="q"], #search').first();
    this.searchButton  = page.locator('button[type="submit"], button:has-text("Search")').first();
    this.resultMessage = page.locator('.result-message, .search-result, [data-testid="result-message"]').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/search');
    await this.waitForReady();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.searchInput.clear();
    await this.searchButton.click();
  }

  async getResultText(): Promise<string> {
    return this.resultMessage.innerText();
  }
}
