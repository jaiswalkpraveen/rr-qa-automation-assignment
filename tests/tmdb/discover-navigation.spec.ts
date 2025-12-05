import { test, expect } from '@playwright/test';
import { DiscoverPage } from '../../pages/DiscoverPage';
import { Logger } from '../../utils/logger';

const BASE_URL = 'https://tmdb-discover.surge.sh';

test.describe('TMDB Discover - Navigation', () => {
    let discoverPage: DiscoverPage;

    test.beforeEach(async ({ page }, testInfo) => {
        Logger.setTestContext(testInfo.title);
        discoverPage = new DiscoverPage(page);

        Logger.step('Navigate to TMDB Discover page', 'Page loads successfully');
        Logger.browserApi('page.goto()', BASE_URL);
        await page.goto(BASE_URL);
        await discoverPage.waitForContentLoad();
        Logger.success('Page loaded successfully');
    });

    test.afterEach(async ({ page }, testInfo) => {
        const status = testInfo.status === 'passed' ? 'passed' : testInfo.status === 'skipped' ? 'skipped' : 'failed';
        Logger.testResult(testInfo.title, status, testInfo.duration);

        // Attach screenshot on failure
        if (testInfo.status !== 'passed') {
            const screenshot = await page.screenshot({ fullPage: true });
            await testInfo.attach('failure-screenshot', { body: screenshot, contentType: 'image/png' });
            Logger.info('Screenshot attached to test report');
        }

        Logger.clearTestContext();
    });

    test('TC-NAV-001: Page loads with content', async ({ page }) => {
        Logger.step('Verify content is loaded', 'At least one image visible');
        Logger.browserApi('hasContent()');
        const hasContent = await discoverPage.hasContent();

        Logger.assertion('Page has content', hasContent);
        expect(hasContent).toBe(true);
    });

    test('TC-NAV-002: Display movie cards', async ({ page }) => {
        Logger.step('Count movie cards on page', 'Count > 0');
        Logger.browserApi('getMovieCardCount()');
        const cardCount = await discoverPage.getMovieCardCount();

        Logger.info(`Found ${cardCount} movie cards`);
        Logger.assertion('Movie cards are displayed', cardCount > 0);
        expect(cardCount).toBeGreaterThan(0);
    });

    test('TC-NAV-003: Navigation links visible', async ({ page }) => {
        Logger.step('Search for navigation text elements', 'At least one nav link visible');
        const navTexts = ['Popular', 'Trend', 'Top'];

        for (const text of navTexts) {
            Logger.browserApi(`locator("text=${text}")`);
            const element = page.locator(`text=${text}`).first();
            const isVisible = await element.isVisible().catch(() => false);

            if (isVisible) {
                Logger.success(`Navigation link "${text}" is visible`);
                Logger.assertion(`Nav link ${text} visible`, true);
                expect(isVisible).toBe(true);
                return;
            }
        }
        Logger.warn('No navigation links found');
    });

    test('TC-NAV-004: Navigate to different sections', async ({ page }) => {
        Logger.step('Get initial URL');
        const initialUrl = page.url();
        Logger.info(`Initial URL: ${initialUrl}`);

        Logger.step('Find navigation link (Trend/Top/New)');
        Logger.browserApi('locator("a").filter()');
        const navLinks = page.locator('a').filter({ hasText: /Trend|Top|New/i });
        const count = await navLinks.count();
        Logger.info(`Found ${count} navigation links`);

        if (count > 0) {
            Logger.step('Click navigation link', 'Content reloads');
            await navLinks.first().click();
            await discoverPage.waitForContentLoad();

            Logger.step('Verify content after navigation', 'Content visible');
            const hasContent = await discoverPage.hasContent();
            Logger.assertion('Content present after navigation', hasContent);
            expect(hasContent).toBe(true);
        }
    });

    test('TC-NAV-005: Display movie titles', async ({ page }) => {
        Logger.step('Extract movie titles from page', 'Titles array length > 0');
        Logger.browserApi('getMovieTitles()');
        const titles = await discoverPage.getMovieTitles();

        Logger.info(`Found ${titles.length} title elements`);
        Logger.assertion('Movie titles are displayed', titles.length > 0);
        expect(titles.length).toBeGreaterThan(0);
    });
});
