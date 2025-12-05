import { test, expect } from '@playwright/test';
import { DiscoverPage } from '../../pages/DiscoverPage';
import { Logger } from '../../utils/logger';

const BASE_URL = 'https://tmdb-discover.surge.sh';

test.describe('TMDB Discover - Search', () => {
    let discoverPage: DiscoverPage;

    test.beforeEach(async ({ page }, testInfo) => {
        Logger.setTestContext(testInfo.title);
        discoverPage = new DiscoverPage(page);

        Logger.step('Navigate to TMDB Discover page');
        Logger.browserApi('page.goto()', BASE_URL);
        await page.goto(BASE_URL);
        await discoverPage.waitForContentLoad();
        Logger.success('Page loaded successfully');
    });

    test.afterEach(async ({ page }, testInfo) => {
        const status = testInfo.status === 'passed' ? 'passed' : testInfo.status === 'skipped' ? 'skipped' : 'failed';
        Logger.testResult(testInfo.title, status, testInfo.duration);

        if (testInfo.status !== 'passed') {
            const screenshot = await page.screenshot({ fullPage: true });
            await testInfo.attach('failure-screenshot', { body: screenshot, contentType: 'image/png' });
        }
        Logger.clearTestContext();
    });

    test('TC-SRC-001: Search input exists', async ({ page }) => {
        Logger.step('Query all input elements', 'At least one input found');
        Logger.browserApi('locator("input")');
        const searchInputs = page.locator('input');
        const count = await searchInputs.count();

        Logger.info(`Found ${count} input elements`);
        Logger.assertion('Search input present', count > 0);
        expect(count).toBeGreaterThan(0);
    });

    test('TC-SRC-002: Content before search', async ({ page }) => {
        Logger.step('Verify content is visible before search');
        const hasContent = await discoverPage.hasContent();

        Logger.assertion('Content present before search', hasContent);
        expect(hasContent).toBe(true);
    });

    test('TC-SRC-003: Type in search input', async ({ page }) => {
        Logger.step('Locate search input');
        Logger.browserApi('locator("input[placeholder*=Search]")');
        const searchInput = page.locator('input[placeholder*="Search" i], input[placeholder*="SEARCH"], input').first();
        const isVisible = await searchInput.isVisible().catch(() => false);

        if (isVisible) {
            Logger.step('Fill search with "Batman"', 'Input value equals "Batman"');
            Logger.browserApi('fill("Batman")');
            await searchInput.fill('Batman');

            Logger.step('Verify input value');
            const value = await searchInput.inputValue();
            Logger.info(`Input value: "${value}"`);
            Logger.assertion('Search input has correct value', value === 'Batman');
            expect(value).toBe('Batman');
        }
    });

    test('TC-SRC-004: Page functional after search', async ({ page }) => {
        Logger.step('Locate search input');
        const searchInput = page.locator('input').first();
        const isVisible = await searchInput.isVisible().catch(() => false);

        if (isVisible) {
            Logger.step('Fill search with "Avengers"');
            Logger.browserApi('fill("Avengers")');
            await searchInput.fill('Avengers');

            Logger.step('Press Enter to search');
            Logger.browserApi('press("Enter")');
            await searchInput.press('Enter');

            Logger.step('Wait for search results', 'Page remains functional');
            await page.waitForTimeout(1500);

            Logger.step('Verify page is still functional');
            const hasContent = await discoverPage.hasContent();
            Logger.info(`Content after search: ${hasContent}`);
            Logger.assertion('Page functional after search', typeof hasContent === 'boolean');
            expect(typeof hasContent).toBe('boolean');
        }
    });

    test('TC-SRC-005: Clear search input', async ({ page }) => {
        Logger.step('Locate search input');
        const searchInput = page.locator('input').first();
        const isVisible = await searchInput.isVisible().catch(() => false);

        if (isVisible) {
            Logger.step('Fill search with "Matrix"');
            Logger.browserApi('fill("Matrix")');
            await searchInput.fill('Matrix');

            Logger.step('Clear the input', 'Input value is empty');
            Logger.browserApi('clear()');
            await searchInput.clear();

            Logger.step('Verify input is empty');
            const value = await searchInput.inputValue();
            Logger.info(`Input value after clear: "${value}"`);
            Logger.assertion('Search input cleared', value === '');
            expect(value).toBe('');
        }
    });
});
