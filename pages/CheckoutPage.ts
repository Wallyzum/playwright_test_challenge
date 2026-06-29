import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Billing fields
  readonly firstNameInput: Locator;
  readonly emailInput:     Locator;
  readonly addressInput:   Locator;
  readonly cityInput:      Locator;
  readonly stateInput:     Locator;
  readonly zipInput:       Locator;

  // Payment fields
  readonly cardNameInput:   Locator;
  readonly cardNumberInput: Locator;
  readonly expMonthSelect:  Locator;
  readonly expYearInput:    Locator;
  readonly cvvInput:        Locator;

  // Shipping checkbox & submit
  readonly sameAsBillingCheckbox: Locator;
  readonly submitButton:          Locator;

  // Order confirmation (on /order page after successful submit)
  readonly confirmationNumber: Locator;

  // Cart summary
  readonly cartItems: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    super(page);
    // Billing
    this.firstNameInput = page.locator('#fname');
    this.emailInput     = page.locator('#email');
    this.addressInput   = page.locator('#adr');
    this.cityInput      = page.locator('#city');
    this.stateInput     = page.locator('#state');
    this.zipInput       = page.locator('#zip');

    // Payment
    this.cardNameInput   = page.locator('#cname');
    this.cardNumberInput = page.locator('#ccnum');
    this.expMonthSelect  = page.locator('#expmonth');
    this.expYearInput    = page.locator('#expyear');
    this.cvvInput        = page.locator('#cvv');

    // Checkbox & button
    this.sameAsBillingCheckbox = page.locator('input[name="sameadr"]');
    this.submitButton          = page.locator('button.btn');

    // p[data-id="ordernumber"] lives on /order after a successful submit
    this.confirmationNumber = page.locator('p[data-id="ordernumber"]');

    // Cart: item rows have an <a>, Total row does not
    this.cartItems = page.locator('.col-25 p:has(a) span.price');
    this.cartTotal = page.locator('.col-25 p:not(:has(a)) span.price');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await this.waitForReady();
  }

  async fillForm(data: {
    firstName:  string;
    email:      string;
    address:    string;
    city:       string;
    state:      string;
    zip:        string;
    cardName:   string;
    cardNumber: string;
    expMonth:   string;
    expYear:    string;
    cvv:        string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
    await this.cardNameInput.fill(data.cardName);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.expMonthSelect.selectOption(data.expMonth);
    await this.expYearInput.fill(data.expYear);
    await this.cvvInput.fill(data.cvv);
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

  async getCartItemPrices(): Promise<number[]> {
    const count = await this.cartItems.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.cartItems.nth(i).innerText();
      prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
  }

  async getCartTotalAmount(): Promise<number> {
    const text = await this.cartTotal.innerText();
    return parseFloat(text.replace('$', ''));
  }
}
