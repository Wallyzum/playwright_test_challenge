import { defineConfig } from '@playwright/test';
import { Env } from './utils/env';
import { buildProjects } from './utils/devices';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results/artifacts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
  ],

  use: {
    baseURL:           Env.baseUrl,
    headless:          Env.headless,
    ignoreHTTPSErrors: true,
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
    trace:             'on-first-retry',
  },

  projects: buildProjects(),
});
