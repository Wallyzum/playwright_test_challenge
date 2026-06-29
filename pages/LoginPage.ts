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
    this.usernameInput  = page.locator('#username');
    this.passwordInput  = page.locator('#password');
    this.submitButton   = page.locator('#signin-button');
    this.errorMessage   = page.locator('#message');
    // After successful login the browser navigates to /home;
    // p[data-id="username"] holds the logged-in username there.
    this.welcomeMessage = page.locator('p[data-id="username"]');
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
