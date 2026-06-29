import { test, expect } from '../../fixtures/test.fixtures';

const FORM_DATA = {
  firstName:  'John Doe',
  email:      'john@example.com',
  address:    '123 Main St',
  city:       'Austin',
  state:      'TX',
  zip:        '78701',
  cardName:   'John Doe',
  cardNumber: '4111111111111111',
  expMonth:   'January',
  expYear:    '2027',
  cvv:        '123',
};

test.describe('Checkout', () => {
  test('order is confirmed when same-as-billing is checked', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await checkoutPage.fillForm(FORM_DATA);
    await checkoutPage.ensureSameAsBillingIs(true);
    await checkoutPage.submit();

    await expect(checkoutPage.confirmationNumber).toBeVisible();
    const text = await checkoutPage.confirmationNumber.innerText();
    expect(text).toMatch(/Order Number: \d+/);
  });

  test('alert appears and is dismissed when same-as-billing is unchecked', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await checkoutPage.fillForm(FORM_DATA);
    await checkoutPage.ensureSameAsBillingIs(false);

    const dialogPromise = checkoutPage.page.waitForEvent('dialog');
    await checkoutPage.submit();
    const dialog = await dialogPromise;

    expect(dialog.message()).toBe('Shipping address same as billing checkbox must be selected.');
    await dialog.accept();

    // After dismissing, we are still on the checkout form
    await expect(checkoutPage.submitButton).toBeVisible();
  });

  test('cart total matches sum of item prices', async ({ checkoutPage }) => {
    await checkoutPage.goto();
    const prices = await checkoutPage.getCartItemPrices();
    const sum    = prices.reduce((acc, p) => acc + p, 0);
    const total  = await checkoutPage.getCartTotalAmount();

    expect(sum).toBeCloseTo(total, 2);
  });
});
