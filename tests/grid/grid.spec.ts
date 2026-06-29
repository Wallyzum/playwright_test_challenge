import { test, expect } from '../../fixtures/test.fixtures';

test.describe('Grid', () => {
  test('item at position 7 is Super Pepperoni priced at $10', async ({ gridPage }) => {
    await gridPage.goto();
    const item = await gridPage.getItemAt(7);
    expect(item.title).toBe('Super Pepperoni');
    expect(item.price).toBe('$10');
  });

  test('all items have a title, price, image, and add-to-order button', async ({ gridPage }) => {
    await gridPage.goto();
    const items = await gridPage.getAllItems();

    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      expect(item.title.trim()).not.toBe('');
      expect(item.price.trim()).not.toBe('');
      expect(item.hasImage).toBe(true);
      expect(item.hasButton).toBe(true);
    }
  });
});
