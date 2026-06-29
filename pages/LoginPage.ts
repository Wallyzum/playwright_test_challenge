import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput:  Locator;
  readonly passwordInput:  Locator;
  readonly submitButton:   Locator;
  readonly errorMessage:   Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Selectors to be confirmed against the live app; refined in test branch
    this.usernameInput  = page.locator('#username, input[name="username"]').first();
    this.passwordInput  = page.locator('#password, input[name="password"]').first();
    this.submitButton   = page.locator('button[type="submit"]');
    this.errorMessage   = page.locator('.error-message, .alert, [role="alert"]').first();
    this.welcomeMessage = page.locator('.welcome, h1, [data-testid="welcome"]').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.waitForReady();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorText(): Promise<string> {
    return this.errorMessage.innerText();
  }

  async getWelcomeText(): Promise<string> {
    return this.welcomeMessage.innerText();
  }
}
