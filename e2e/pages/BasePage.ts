import type { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async scrollToSection(id: string): Promise<void> {
    await this.page.locator(`#${id}`).scrollIntoViewIfNeeded();
  }

  async scrollInstant(elementId: string): Promise<void> {
    await this.page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'instant' });
    }, elementId);
  }

  async freezeAnimations(): Promise<void> {
    await this.page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
    });
  }
}
