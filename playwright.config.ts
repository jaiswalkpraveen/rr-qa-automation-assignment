import { defineConfig, devices } from '@playwright/test';
import { getEnvironment } from './config/environment';

const env = getEnvironment();

export default defineConfig({
  testDir: './tests',

  // Timeouts
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Workers
  workers: process.env.CI ? 2 : undefined,

  // Reporters - Console and HTML reports
  reporter: [
    ['list'],                                                           // Console output
    ['html', { outputFolder: 'playwright-report', open: 'never' }],     // HTML report
    ['json', { outputFile: 'test-results/results.json' }],              // JSON for CI/tooling
    ['junit', { outputFile: 'test-results/junit.xml' }],                // JUnit for CI integration
  ],

  use: {
    baseURL: env.baseURL,

    // Browser settings
    viewport: { width: 1280, height: 720 },

    // Debug artifacts
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // Timeouts
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});