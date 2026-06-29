import { test, expect } from '../../fixtures/test.fixtures';

test.describe('Search', () => {
  test('searching "automation" shows one result message', async ({ searchPage }) => {
    await searchPage.goto();
    await searchPage.search('automation');
    await expect(searchPage.resultMessage).toHaveText('Found one result for automation');
  });

  test('submitting empty search shows validation message', async ({ searchPage }) => {
    await searchPage.goto();
    await searchPage.search('');
    await expect(searchPage.resultMessage).toHaveText('Please provide a search word.');
  });
});
