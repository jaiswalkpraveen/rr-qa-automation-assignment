import { test, expect } from '@playwright/test';
import { DiscoverPage } from '../../pages/DiscoverPage';
import { FilterComponent } from '../../pages/components/FilterComponent';

const BASE_URL = 'https://tmdb-discover.surge.sh';

test.describe('TMDB Discover - Filters', () => {
    let discoverPage: DiscoverPage;
    let filterComponent: FilterComponent;

    test.beforeEach(async ({ page }) => {
        discoverPage = new DiscoverPage(page);
        filterComponent = new FilterComponent(page);
        await page.goto(BASE_URL);
        await discoverPage.waitForContentLoad();
    });

    test('should display content on page load', async ({ page }) => {
        const hasContent = await discoverPage.hasContent();
        expect(hasContent).toBe(true);
    });

    test('should have filter elements on page', async ({ page }) => {
        // Check for any filter-related text
        const filterTexts = ['Movie', 'TV', 'Type', 'Genre', 'Year', 'Rating'];
        let foundFilters = 0;

        for (const text of filterTexts) {
            const element = page.locator(`text=${text}`).first();
            const isVisible = await element.isVisible().catch(() => false);
            if (isVisible) foundFilters++;
        }

        expect(foundFilters).toBeGreaterThan(0);
    });

    test('should click on Movie filter if available', async ({ page }) => {
        const movieButton = page.locator('text=Movie').first();
        const isVisible = await movieButton.isVisible().catch(() => false);

        if (isVisible) {
            await movieButton.click();
            await discoverPage.waitForContentLoad();

            const hasContent = await discoverPage.hasContent();
            expect(hasContent).toBe(true);
        } else {
            // Skip test if filter not available
            test.skip();
        }
    });

    test('should click on TV filter if available', async ({ page }) => {
        const tvButton = page.locator('text=TV').first();
        const isVisible = await tvButton.isVisible().catch(() => false);

        if (isVisible) {
            await tvButton.click();
            await discoverPage.waitForContentLoad();

            const hasContent = await discoverPage.hasContent();
            expect(hasContent).toBe(true);
        } else {
            test.skip();
        }
    });

    test('should maintain content after filter interactions', async ({ page }) => {
        // Get initial count
        const initialCount = await discoverPage.getMovieCardCount();
        expect(initialCount).toBeGreaterThan(0);

        // Try to interact with any filter element
        const movieButton = page.locator('text=Movie').first();
        const isVisible = await movieButton.isVisible().catch(() => false);

        if (isVisible) {
            await movieButton.click();
            await page.waitForTimeout(1000);

            // Content should still be present
            const afterCount = await discoverPage.getMovieCardCount();
            expect(afterCount).toBeGreaterThan(0);
        }
    });
});
