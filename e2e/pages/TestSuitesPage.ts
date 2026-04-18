import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestSuitesPage extends BasePage {
  readonly section: Locator;
  readonly allToolCards: Locator;
  readonly categoryBadges: Locator;
  readonly carouselDotGroups: Locator;

  constructor(page: Page) {
    super(page);
    this.section           = page.locator('#test-suites');
    this.allToolCards      = page.locator('[data-testid^="tool-card-"]');
    this.categoryBadges    = page.locator('.tool-category-badge');
    this.carouselDotGroups = page.locator('.card-carousel .carousel-dots');
  }

  toolCard(id: string): Locator {
    return this.page.getByTestId(`tool-card-${id}`);
  }

  // Handles both single-link (tool-link-{id}) and multi-link (tool-link-{id}-0) cards
  toolLink(id: string): Locator {
    return this.page.locator(`[data-testid^="tool-link-${id}"]`).first();
  }

  carouselDots(toolId: string): Locator {
    return this.toolCard(toolId).locator('.carousel-dots .dot');
  }

  async scrollToSection(): Promise<void> {
    await super.scrollToSection('test-suites');
  }
}
