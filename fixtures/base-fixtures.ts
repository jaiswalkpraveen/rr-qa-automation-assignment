import { test as base, Page } from '@playwright/test';
import { DiscoverPage } from '../pages/DiscoverPage';
import { Logger } from '../utils/logger';

/**
 * Custom Fixtures for TMDB Discover Tests
 */
export const test = base.extend<{
  /** Pre-configured DiscoverPage instance */
  discoverPage: DiscoverPage;
  /** Page with automatic logging */
  loggedPage: Page;
}>({
  /**
   * DiscoverPage fixture
   * Provides ready-to-use DiscoverPage instance
   */
  discoverPage: async ({ page }, use) => {
    const discoverPage = new DiscoverPage(page);
    await use(discoverPage);
  },

  /**
   * Enhanced page with automatic logging
   */
  loggedPage: async ({ page }, use, testInfo) => {
    Logger.info(`Starting test: ${testInfo.title}`);

    await use(page);

    if (testInfo.status === 'failed') {
      Logger.error(`Test failed: ${testInfo.title}`);
      const screenshotPath = `screenshots/failure-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      Logger.info(`Screenshot saved: ${screenshotPath}`);
    } else {
      Logger.success(`Test passed: ${testInfo.title}`);
    }
  },
});

export { expect } from '@playwright/test';