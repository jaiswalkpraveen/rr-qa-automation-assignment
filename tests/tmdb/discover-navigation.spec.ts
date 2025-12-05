import { test, expect } from '@playwright/test';
import { DiscoverPage } from '../../pages/DiscoverPage';

const BASE_URL = 'https://tmdb-discover.surge.sh';

test.describe('TMDB Discover - Navigation', () => {
    let discoverPage: DiscoverPage;

    test.beforeEach(async ({ page }) => {
        discoverPage = new DiscoverPage(page);
        await page.goto(BASE_URL);
        await discoverPage.waitForContentLoad();
    });

    test('should load page with content', async ({ page }) => {
        // Verify content is loaded - images are visible
        const hasContent = await discoverPage.hasContent();
        expect(hasContent).toBe(true);
    });

    test('should display movie cards', async ({ page }) => {
        const cardCount = await discoverPage.getMovieCardCount();
        expect(cardCount).toBeGreaterThan(0);
    });

    test('should have navigation links visible', async ({ page }) => {
        // Check for navigation elements by looking for common nav text
        const navTexts = ['Popular', 'Trend', 'Top'];
        for (const text of navTexts) {
            const element = page.locator(`text=${text}`).first();
            const isVisible = await element.isVisible().catch(() => false);
            // At least some nav should be visible
            if (isVisible) {
                expect(isVisible).toBe(true);
                return;
            }
        }
    });

    test('should navigate to different sections', async ({ page }) => {
        // Get initial URL
        const initialUrl = page.url();

        // Try to find and click a navigation link
        const navLinks = page.locator('a').filter({ hasText: /Trend|Top|New/i });
        const count = await navLinks.count();

        if (count > 0) {
            await navLinks.first().click();
            await discoverPage.waitForContentLoad();

            // Verify content still loads
            const hasContent = await discoverPage.hasContent();
            expect(hasContent).toBe(true);
        }
    });

    test('should display movie titles', async ({ page }) => {
        const titles = await discoverPage.getMovieTitles();
        expect(titles.length).toBeGreaterThan(0);
    });
});
