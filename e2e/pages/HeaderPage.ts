import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderPage extends BasePage {
  readonly header: Locator;
  readonly brandLogo: Locator;
  readonly sectionsMenuTrigger: Locator;
  readonly resumeLink: Locator;
  readonly menu: Locator;

  constructor(page: Page) {
    super(page);
    this.header             = page.locator('.site-header');
    this.brandLogo          = page.getByTestId('brand-logo');
    this.sectionsMenuTrigger = page.getByTestId('sections-menu-trigger');
    this.resumeLink         = page.getByTestId('resume-link');
    this.menu               = page.locator('.mat-mdc-menu-panel');
  }

  navItem(sectionId: string): Locator {
    return this.page.getByTestId(`nav-${sectionId}`);
  }

  async openSectionsMenu(): Promise<void> {
    await this.sectionsMenuTrigger.click();
  }

  async navigateTo(sectionId: string): Promise<void> {
    await this.openSectionsMenu();
    await this.navItem(sectionId).click();
  }

  async isScrolled(): Promise<boolean> {
    return this.header.evaluate(el => el.classList.contains('scrolled'));
  }
}
