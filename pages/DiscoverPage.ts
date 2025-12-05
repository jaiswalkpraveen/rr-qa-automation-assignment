import { Page, Locator } from '@playwright/test';

/**
 * Discover Page Object
 * Main page for TMDB Discover - handles navigation, search, filters, and movie grid
 */
export class DiscoverPage {
    private readonly page: Page;

    // Navigation locators
    private readonly popularLink: Locator;
    private readonly trendLink: Locator;
    private readonly newestLink: Locator;
    private readonly topRatedLink: Locator;

    // Search locator
    private readonly searchInput: Locator;

    // Filter locators - use text-based selectors
    private readonly typeMovieButton: Locator;
    private readonly typeTvButton: Locator;
    private readonly genreDropdown: Locator;
    private readonly yearMinInput: Locator;
    private readonly yearMaxInput: Locator;
    private readonly ratingStars: Locator;

    // Content locators - more flexible
    private readonly movieGrid: Locator;
    private readonly movieCards: Locator;

    // Pagination locators
    private readonly prevPageButton: Locator;
    private readonly nextPageButton: Locator;
    private readonly pageNumbers: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation - look for links containing text or by href
        this.popularLink = page.locator('a:has-text("Popular"), [href*="popular"]').first();
        this.trendLink = page.locator('a:has-text("Trend"), [href*="trend"]').first();
        this.newestLink = page.locator('a:has-text("Newest"), a:has-text("New"), [href*="new"]').first();
        this.topRatedLink = page.locator('a:has-text("Top"), a:has-text("Top Rated"), [href*="top"]').first();

        // Search - try multiple variations
        this.searchInput = page.locator('input[placeholder*="Search" i], input[placeholder*="SEARCH"], input[type="search"]').first();

        // Filters - use text-based selection instead of role
        this.typeMovieButton = page.locator('text=Movie').first();
        this.typeTvButton = page.locator('text=TV').first();

        // Genre dropdown - look for select or custom dropdown
        this.genreDropdown = page.locator('select, [role="listbox"], [class*="dropdown"]').first();

        // Year inputs - look for number inputs
        this.yearMinInput = page.locator('input[type="number"], input[placeholder*="year" i]').first();
        this.yearMaxInput = page.locator('input[type="number"], input[placeholder*="year" i]').nth(1);

        // Rating stars - look for star icons or rating elements
        this.ratingStars = page.locator('[role="radio"], [class*="star"], [class*="rating"]');

        // Content grid - more flexible selection
        this.movieGrid = page.locator('[class*="grid"], [class*="scroll"], main').first();
        this.movieCards = page.locator('img').locator('xpath=./..'); // Parent of images

        // Pagination
        this.prevPageButton = page.locator('[aria-label*="Previous" i], [aria-label*="Prev" i], text=Previous, text=Prev').first();
        this.nextPageButton = page.locator('[aria-label*="Next" i], text=Next').first();
        this.pageNumbers = page.locator('[aria-label^="Page "], a:has-text(/^\\d+$/)');
    }

    /**
     * Navigate to the Discover page
     */
    async goto(path: string = '/') {
        await this.page.goto(path);
        await this.waitForContentLoad();
    }

    /**
     * Wait for content to load
     */
    async waitForContentLoad() {
        await this.page.waitForLoadState('networkidle');
        // Wait for any image to be visible (more reliable)
        await this.page.locator('img').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
    }

    // ===== Navigation Methods =====

    /**
     * Navigate to Popular section
     */
    async navigateToPopular() {
        await this.popularLink.click();
        await this.waitForContentLoad();
    }

    /**
     * Navigate to Trending section
     */
    async navigateToTrend() {
        await this.trendLink.click();
        await this.waitForContentLoad();
    }

    /**
     * Navigate to Newest section
     */
    async navigateToNewest() {
        await this.newestLink.click();
        await this.waitForContentLoad();
    }

    /**
     * Navigate to Top Rated section
     */
    async navigateToTopRated() {
        await this.topRatedLink.click();
        await this.waitForContentLoad();
    }

    /**
     * Check if a navigation link is active
     */
    async isNavActive(navType: 'popular' | 'trend' | 'newest' | 'toprated'): Promise<boolean> {
        const navMap = {
            popular: this.popularLink,
            trend: this.trendLink,
            newest: this.newestLink,
            toprated: this.topRatedLink,
        };
        const navLink = navMap[navType];
        const className = await navLink.getAttribute('class');
        return className?.includes('active') || className?.includes('selected') || className?.includes('current') || false;
    }

    // ===== Search Methods =====

    /**
     * Search for movies/TV shows
     */
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
        await this.waitForContentLoad();
    }

    /**
     * Clear search input
     */
    async clearSearch() {
        await this.searchInput.clear();
        await this.searchInput.press('Enter');
        await this.waitForContentLoad();
    }

    /**
     * Get current search value
     */
    async getSearchValue(): Promise<string> {
        return await this.searchInput.inputValue();
    }

    // ===== Filter Methods =====

    /**
     * Select content type (Movie or TV)
     */
    async selectType(type: 'movie' | 'tv') {
        if (type === 'movie') {
            await this.typeMovieButton.click();
        } else {
            await this.typeTvButton.click();
        }
        await this.waitForContentLoad();
    }

    /**
     * Select genre from dropdown
     */
    async selectGenre(genre: string) {
        const isSelect = await this.genreDropdown.evaluate(el => el.tagName === 'SELECT');
        if (isSelect) {
            await this.genreDropdown.selectOption({ label: genre });
        } else {
            await this.genreDropdown.click();
            await this.page.locator(`text=${genre}`).click();
        }
        await this.waitForContentLoad();
    }

    /**
     * Set year range
     */
    async setYearRange(minYear: number, maxYear: number) {
        await this.yearMinInput.fill(minYear.toString());
        await this.yearMaxInput.fill(maxYear.toString());
        await this.waitForContentLoad();
    }

    /**
     * Set minimum rating (1-5 stars)
     */
    async setRating(stars: number) {
        if (stars >= 1 && stars <= 5) {
            await this.ratingStars.nth(stars - 1).click();
            await this.waitForContentLoad();
        }
    }

    // ===== Content Methods =====

    /**
     * Get count of movie cards displayed
     */
    async getMovieCardCount(): Promise<number> {
        // Count images which represent movie posters
        return await this.page.locator('img').count();
    }

    /**
     * Get all movie titles
     */
    async getMovieTitles(): Promise<string[]> {
        const titles: string[] = [];
        // Look for text near images (movie titles are usually near posters)
        const textElements = await this.page.locator('p, h3, h4, [class*="title"]').allTextContents();
        return textElements.filter(t => t.trim().length > 0 && t.trim().length < 100);
    }

    /**
     * Click on a movie card by index
     */
    async clickMovieCard(index: number) {
        await this.page.locator('img').nth(index).click();
    }

    /**
     * Check if movie grid has content
     */
    async hasContent(): Promise<boolean> {
        const count = await this.getMovieCardCount();
        return count > 0;
    }

    // ===== Pagination Methods =====

    /**
     * Scroll to pagination area
     */
    async scrollToPagination() {
        await this.page.evaluate(() => {
            const scrollContainer = document.querySelector('[class*="scroll"]') || document.body;
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        });
        await this.page.waitForTimeout(500);
    }

    /**
     * Go to next page
     */
    async goToNextPage() {
        await this.scrollToPagination();
        await this.nextPageButton.click();
        await this.waitForContentLoad();
    }

    /**
     * Go to previous page
     */
    async goToPreviousPage() {
        await this.scrollToPagination();
        await this.prevPageButton.click();
        await this.waitForContentLoad();
    }

    /**
     * Go to specific page number
     */
    async goToPage(pageNumber: number) {
        await this.scrollToPagination();
        await this.page.locator(`[aria-label="Page ${pageNumber}"], a:has-text("${pageNumber}")`).first().click();
        await this.waitForContentLoad();
    }

    /**
     * Check if next page button is enabled
     */
    async isNextPageEnabled(): Promise<boolean> {
        const isVisible = await this.nextPageButton.isVisible().catch(() => false);
        if (!isVisible) return false;
        const isDisabled = await this.nextPageButton.getAttribute('aria-disabled');
        return isDisabled !== 'true';
    }

    /**
     * Check if previous page button is enabled
     */
    async isPreviousPageEnabled(): Promise<boolean> {
        const isVisible = await this.prevPageButton.isVisible().catch(() => false);
        if (!isVisible) return false;
        const isDisabled = await this.prevPageButton.getAttribute('aria-disabled');
        return isDisabled !== 'true';
    }

    /**
     * Get current page URL path
     */
    async getCurrentPath(): Promise<string> {
        return new URL(this.page.url()).pathname;
    }
}
