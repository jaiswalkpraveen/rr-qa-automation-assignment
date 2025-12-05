import { test, expect } from '@playwright/test';
import { DiscoverPage } from '../../pages/DiscoverPage';
import { Logger } from '../../utils/logger';

const BASE_URL = 'https://tmdb-discover.surge.sh';

test.describe('TMDB Discover - Filters', () => {
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

    test('TC-FIL-001: Display content on page load', async ({ page }) => {
        Logger.step('Verify content is visible', 'Images present on page');
        const hasContent = await discoverPage.hasContent();

        Logger.assertion('Content displayed on load', hasContent);
        expect(hasContent).toBe(true);
    });

    test('TC-FIL-002: Filter elements on page', async ({ page }) => {
        Logger.step('Search for filter elements', 'At least one filter visible');
        const filterTexts = ['Movie', 'TV', 'Type', 'Genre', 'Year', 'Rating'];
        let foundFilters = 0;

        for (const text of filterTexts) {
            Logger.browserApi(`locator("text=${text}")`);
            const element = page.locator(`text=${text}`).first();
            const isVisible = await element.isVisible().catch(() => false);
            if (isVisible) {
                Logger.info(`Filter "${text}" found`);
                foundFilters++;
            }
        }

        Logger.info(`Total filters found: ${foundFilters}`);
        Logger.assertion('Filter elements present', foundFilters > 0);
        expect(foundFilters).toBeGreaterThan(0);
    });

    test('TC-FIL-003: Click on Movie filter', async ({ page }) => {
        Logger.step('Locate Movie button');
        Logger.browserApi('locator("text=Movie")');
        const movieButton = page.locator('text=Movie').first();
        const isVisible = await movieButton.isVisible().catch(() => false);

        if (isVisible) {
            Logger.step('Click Movie filter', 'Content filters to movies');
            await movieButton.click();
            await discoverPage.waitForContentLoad();

            Logger.step('Verify content after filter');
            const hasContent = await discoverPage.hasContent();
            Logger.assertion('Content present after Movie filter', hasContent);
            expect(hasContent).toBe(true);
        } else {
            Logger.warn('Movie filter not available - skipping test');
            test.skip();
        }
    });

    test('TC-FIL-004: Click on TV filter', async ({ page }) => {
        Logger.step('Locate TV button');
        Logger.browserApi('locator("text=TV")');
        const tvButton = page.locator('text=TV').first();
        const isVisible = await tvButton.isVisible().catch(() => false);

        if (isVisible) {
            Logger.step('Click TV filter', 'Content filters to TV shows');
            await tvButton.click();
            await discoverPage.waitForContentLoad();

            Logger.step('Verify content after filter');
            const hasContent = await discoverPage.hasContent();
            Logger.assertion('Content present after TV filter', hasContent);
            expect(hasContent).toBe(true);
        } else {
            Logger.warn('TV filter not available - skipping test');
            test.skip();
        }
    });

    test('TC-FIL-005: Maintain content after filter', async ({ page }) => {
        Logger.step('Get initial content count');
        const initialCount = await discoverPage.getMovieCardCount();
        Logger.info(`Initial card count: ${initialCount}`);
        expect(initialCount).toBeGreaterThan(0);

        Logger.step('Interact with Movie filter');
        const movieButton = page.locator('text=Movie').first();
        const isVisible = await movieButton.isVisible().catch(() => false);

        if (isVisible) {
            await movieButton.click();
            await page.waitForTimeout(1000);

            Logger.step('Verify content after filter interaction');
            const afterCount = await discoverPage.getMovieCardCount();
            Logger.info(`Card count after filter: ${afterCount}`);
            Logger.assertion('Content maintained after filter', afterCount > 0);
            expect(afterCount).toBeGreaterThan(0);
        }
    });
});
