import { Locator } from '@playwright/test';

/**
 * Movie Card Component
 * Represents a single movie/TV show card in the grid
 */
export class MovieCardComponent {
    private readonly card: Locator;
    private readonly image: Locator;
    private readonly title: Locator;
    private readonly genre: Locator;

    constructor(cardLocator: Locator) {
        this.card = cardLocator;
        this.image = this.card.locator('img').first();
        this.title = this.card.locator('p, h3, h4').first();
        this.genre = this.card.locator('span, p').nth(1);
    }

    /**
     * Get movie/TV show title
     */
    async getTitle(): Promise<string> {
        const text = await this.title.textContent();
        return text?.trim() || '';
    }

    /**
     * Get genre text
     */
    async getGenre(): Promise<string> {
        const text = await this.genre.textContent();
        return text?.trim() || '';
    }

    /**
     * Get image source URL
     */
    async getImageSrc(): Promise<string> {
        return await this.image.getAttribute('src') || '';
    }

    /**
     * Check if image is loaded
     */
    async isImageLoaded(): Promise<boolean> {
        const src = await this.getImageSrc();
        return src.length > 0;
    }

    /**
     * Click on the card
     */
    async click() {
        await this.card.click();
    }

    /**
     * Check if card is visible
     */
    async isVisible(): Promise<boolean> {
        return await this.card.isVisible();
    }
}
