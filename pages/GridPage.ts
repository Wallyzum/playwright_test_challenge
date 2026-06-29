import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type GridItem = {
  title:     string;
  price:     string;
  hasImage:  boolean;
  hasButton: boolean;
};

export class GridPage extends BasePage {
  readonly gridItems: Locator;

  constructor(page: Page) {
    super(page);
    // Selector to be refined after inspecting the live app
    this.gridItems = page.locator('.grid-item, .product-card, [data-testid="grid-item"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/grid');
    await this.waitForReady();
  }

  /** Get item at 1-based position (e.g. position 7 per the challenge spec). */
  async getItemAt(position: number): Promise<GridItem> {
    const item = this.gridItems.nth(position - 1);
    return {
      title:     await item.locator('.title, h2, h3, [data-testid="item-title"]').first().innerText(),
      price:     await item.locator('.price, [data-testid="item-price"]').first().innerText(),
      hasImage:  await item.locator('img').isVisible(),
      hasButton: await item.locator('button, a[role="button"]').first().isVisible(),
    };
  }

  async getAllItems(): Promise<GridItem[]> {
    const count = await this.gridItems.count();
    const results: GridItem[] = [];
    for (let i = 1; i <= count; i++) {
      results.push(await this.getItemAt(i));
    }
    return results;
  }

  async getCount(): Promise<number> {
    return this.gridItems.count();
  }
}
