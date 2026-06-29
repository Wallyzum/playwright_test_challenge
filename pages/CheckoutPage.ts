import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Billing fields
  readonly firstNameInput: Locator;
  readonly lastNameInput:  Locator;
  readonly emailInput:     Locator;
  readonly addressInput:   Locator;
  readonly cityInput:      Locator;
  readonly stateInput:     Locator;
  readonly zipInput:       Locator;

  // Shipping
  readonly sameAsBillingCheckbox: Locator;

  // Submission & feedback
  readonly submitButton:       Locator;
  readonly confirmationNumber: Locator;

  // Cart summary
  readonly cartTotal: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    // Selectors to be refined after inspecting the live app
    this.firstNameInput = page.locator('input[name="firstName"], #firstName').first();
    this.lastNameInput  = page.locator('input[name="lastName"], #lastName').first();
    this.emailInput     = page.locator('input[type="email"], input[name="email"]').first();
    this.addressInput   = page.locator('input[name="address"], #address').first();
    this.cityInput      = page.locator('input[name="city"], #city').first();
    this.stateInput     = page.locator('input[name="state"], select[name="state"], #state').first();
    this.zipInput       = page.locator('input[name="zip"], #zip').first();

    this.sameAsBillingCheckbox = page.locator('input[type="checkbox"]').first();
    this.submitButton          = page.locator('button[type="submit"]');
    this.confirmationNumber    = page.locator('.confirmation-number, .order-id, [data-testid="confirmation"]').first();

    this.cartTotal = page.locator('.cart-total, .total, [data-testid="cart-total"]').first();
    this.cartItems = page.locator('.cart-item, .line-item, [data-testid="cart-item"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await this.waitForReady();
  }

  async fillBillingForm(data: {
    firstName: string;
    lastName:  string;
    email:     string;
    address:   string;
    city:      string;
    state:     string;
    zip:       string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
  }

  async ensureSameAsBillingIs(checked: boolean): Promise<void> {
    const isChecked = await this.sameAsBillingCheckbox.isChecked();
    if (isChecked !== checked) {
      await this.sameAsBillingCheckbox.click();
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async getConfirmationNumber(): Promise<string> {
    return this.confirmationNumber.innerText();
  }

  async getCartTotalText(): Promise<string> {
    return this.cartTotal.innerText();
  }

  async getCartItemPrices(): Promise<number[]> {
    // Selectors refined in checkout test branch after inspecting the live app
    const priceLocators = this.page.locator('.item-price, [data-testid="item-price"]');
    const count = await priceLocators.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await priceLocators.nth(i).innerText();
      prices.push(parseFloat(text.replace(/[^0-9.]/g, '')));
    }
    return prices;
  }
}
