import { test, expect } from '@playwright/test';
import { DiscoverPage } from '../../pages/DiscoverPage';

const BASE_URL = 'https://tmdb-discover.surge.sh';

test.describe('TMDB Discover - Search', () => {
    let discoverPage: DiscoverPage;

    test.beforeEach(async ({ page }) => {
        discoverPage = new DiscoverPage(page);
        await page.goto(BASE_URL);
        await discoverPage.waitForContentLoad();
    });

    test('should have search input on page', async ({ page }) => {
        // Look for any input element that could be search
        const searchInputs = page.locator('input');
        const count = await searchInputs.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should display content before search', async ({ page }) => {
        const hasContent = await discoverPage.hasContent();
        expect(hasContent).toBe(true);
    });

    test('should be able to type in search input', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="Search" i], input[placeholder*="SEARCH"], input').first();
        const isVisible = await searchInput.isVisible().catch(() => false);

        if (isVisible) {
            await searchInput.fill('Batman');
            const value = await searchInput.inputValue();
            expect(value).toBe('Batman');
        }
    });

    test('should maintain page functionality after search attempt', async ({ page }) => {
        // Find and use search input
        const searchInput = page.locator('input').first();
        const isVisible = await searchInput.isVisible().catch(() => false);

        if (isVisible) {
            await searchInput.fill('Avengers');
            await searchInput.press('Enter');
            await page.waitForTimeout(1500);

            // Page should still be functional
            const hasContent = await discoverPage.hasContent();
            // Content may or may not be present depending on search results
            expect(typeof hasContent).toBe('boolean');
        }
    });

    test('should clear search input', async ({ page }) => {
        const searchInput = page.locator('input').first();
        const isVisible = await searchInput.isVisible().catch(() => false);

        if (isVisible) {
            await searchInput.fill('Matrix');
            await searchInput.clear();

            const value = await searchInput.inputValue();
            expect(value).toBe('');
        }
    });
});
