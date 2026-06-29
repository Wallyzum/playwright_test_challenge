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
    this.gridItems = page.locator('#menu div.item');
  }

  async goto(): Promise<void> {
    await this.page.goto('/grid');
    await this.waitForReady();
  }

  /** Get item at 1-based position (e.g. position 7 per the challenge spec). */
  async getItemAt(position: number): Promise<GridItem> {
    const item = this.gridItems.nth(position - 1);
    return {
      title:     await item.locator('h4[data-test-id="item-name"]').innerText(),
      price:     await item.locator('p#item-price').innerText(),
      hasImage:  await item.locator('img').isVisible(),
      hasButton: await item.locator('button[data-test-id="add-to-order"]').isVisible(),
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
}
