import { test, expect } from '../../fixtures/test.fixtures';
import { Env } from '../../utils/env';

test.describe('Login', () => {
  test('successful login shows welcome message with username', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(Env.loginUsername, Env.loginPassword);
    await expect(loginPage.welcomeMessage).toBeVisible();
    await expect(loginPage.welcomeMessage).toHaveText(Env.loginUsername);
  });

  test('wrong credentials shows error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(Env.loginUsername, 'wrongpassword');
    await expect(loginPage.errorMessage).toHaveText('Wrong credentials');
  });

  test('blank fields shows error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toHaveText('Fields can not be empty');
  });
});
