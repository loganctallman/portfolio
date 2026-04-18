import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DevelopmentPage extends BasePage {
  readonly section: Locator;
  readonly allProjectCards: Locator;

  constructor(page: Page) {
    super(page);
    this.section         = page.locator('#development');
    this.allProjectCards = page.locator('[data-testid^="project-card-"]');
  }

  projectCard(id: string): Locator {
    return this.page.getByTestId(`project-card-${id}`);
  }

  liveLink(id: string): Locator {
    return this.page.getByTestId(`project-live-${id}`);
  }

  repoLink(id: string): Locator {
    return this.page.getByTestId(`project-repo-${id}`);
  }

  deepDiveToggle(id: string): Locator {
    return this.page.getByTestId(`deep-dive-toggle-${id}`);
  }

  deepDivePanel(id: string): Locator {
    return this.page.locator(`#deep-dive-${id}`);
  }

  carouselDots(nthProject = 0): Locator {
    return this.page.locator('.carousel-dots').nth(nthProject);
  }

  carouselNextArrow(nthProject = 0): Locator {
    return this.page.locator('.carousel-arrow--next').nth(nthProject);
  }

  carouselPrevArrow(nthProject = 0): Locator {
    return this.page.locator('.carousel-arrow--prev').nth(nthProject);
  }

  carouselImages(): Locator {
    return this.page.locator('.carousel-img');
  }

  async scrollToSection(): Promise<void> {
    await super.scrollToSection('development');
  }

  async expandProject(id: string): Promise<void> {
    const toggle = this.deepDiveToggle(id);
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
  }

  async collapseProject(id: string): Promise<void> {
    await this.expandProject(id);
  }
}
