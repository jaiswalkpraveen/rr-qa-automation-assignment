import { Page, Locator } from '@playwright/test';

/**
 * Filter Component
 * Handles the filter section (Type, Genre, Year, Rating)
 */
export class FilterComponent {
    private readonly page: Page;

    // Type filter - use flexible text-based selectors
    private readonly typeMovieButton: Locator;
    private readonly typeTvButton: Locator;

    // Genre filter
    private readonly genreDropdown: Locator;

    // Year filter
    private readonly yearMinInput: Locator;
    private readonly yearMaxInput: Locator;

    // Rating filter
    private readonly ratingStars: Locator;

    constructor(page: Page) {
        this.page = page;

        // Type buttons - use text matching
        this.typeMovieButton = page.locator('text=Movie').first();
        this.typeTvButton = page.locator('text=TV').first();

        // Genre dropdown - more flexible
        this.genreDropdown = page.locator('select, [role="listbox"]').first();

        // Year inputs
        this.yearMinInput = page.locator('input[type="number"]').first();
        this.yearMaxInput = page.locator('input[type="number"]').nth(1);

        // Rating stars
        this.ratingStars = page.locator('[role="radio"], [class*="star"]');
    }

    /**
     * Wait for content to update after filter change
     */
    private async waitForUpdate() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(500);
    }

    // ===== Type Filter =====

    /**
     * Select Movies
     */
    async selectMovies() {
        await this.typeMovieButton.click();
        await this.waitForUpdate();
    }

    /**
     * Select TV Shows
     */
    async selectTvShows() {
        await this.typeTvButton.click();
        await this.waitForUpdate();
    }

    /**
     * Check if Movie type is selected
     */
    async isMovieSelected(): Promise<boolean> {
        const className = await this.typeMovieButton.getAttribute('class');
        return className?.includes('active') || className?.includes('selected') || false;
    }

    /**
     * Check if TV type is selected
     */
    async isTvSelected(): Promise<boolean> {
        const className = await this.typeTvButton.getAttribute('class');
        return className?.includes('active') || className?.includes('selected') || false;
    }

    // ===== Genre Filter =====

    /**
     * Select a genre by label
     */
    async selectGenre(genre: string) {
        const isSelect = await this.genreDropdown.evaluate(el => el.tagName === 'SELECT');
        if (isSelect) {
            await this.genreDropdown.selectOption({ label: genre });
        } else {
            await this.genreDropdown.click();
            await this.page.locator(`text=${genre}`).click();
        }
        await this.waitForUpdate();
    }

    /**
     * Get currently selected genre
     */
    async getSelectedGenre(): Promise<string> {
        return await this.genreDropdown.inputValue().catch(() => '');
    }

    /**
     * Get all available genres
     */
    async getAvailableGenres(): Promise<string[]> {
        try {
            const options = await this.genreDropdown.locator('option').allTextContents();
            return options.map(opt => opt.trim());
        } catch {
            return [];
        }
    }

    // ===== Year Filter =====

    /**
     * Set minimum year
     */
    async setMinYear(year: number) {
        await this.yearMinInput.fill(year.toString());
        await this.waitForUpdate();
    }

    /**
     * Set maximum year
     */
    async setMaxYear(year: number) {
        await this.yearMaxInput.fill(year.toString());
        await this.waitForUpdate();
    }

    /**
     * Set year range
     */
    async setYearRange(minYear: number, maxYear: number) {
        await this.yearMinInput.fill(minYear.toString());
        await this.yearMaxInput.fill(maxYear.toString());
        await this.waitForUpdate();
    }

    /**
     * Get current year range
     */
    async getYearRange(): Promise<{ min: number; max: number }> {
        try {
            const min = await this.yearMinInput.inputValue();
            const max = await this.yearMaxInput.inputValue();
            return {
                min: parseInt(min) || 1900,
                max: parseInt(max) || new Date().getFullYear(),
            };
        } catch {
            return { min: 1900, max: new Date().getFullYear() };
        }
    }

    // ===== Rating Filter =====

    /**
     * Set rating (1-5 stars)
     */
    async setRating(stars: number) {
        if (stars >= 1 && stars <= 5) {
            await this.ratingStars.nth(stars - 1).click();
            await this.waitForUpdate();
        }
    }

    /**
     * Get selected rating
     */
    async getSelectedRating(): Promise<number> {
        for (let i = 0; i < 5; i++) {
            try {
                const star = this.ratingStars.nth(i);
                const isChecked = await star.getAttribute('aria-checked');
                if (isChecked === 'true') {
                    return i + 1;
                }
            } catch {
                continue;
            }
        }
        return 0;
    }
}
