import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeroPage extends BasePage {
  readonly section: Locator;
  readonly headline: Locator;
  readonly resumeBtn: Locator;
  readonly viewWorkBtn: Locator;
  readonly githubLink: Locator;
  readonly linkedinLink: Locator;
  readonly skillChips: Locator;
  readonly badgeTop: Locator;
  readonly badgeBottom: Locator;
  readonly badgeTopText: Locator;

  constructor(page: Page) {
    super(page);
    this.section      = page.locator('#hero');
    this.headline     = page.locator('.hero-headline');
    this.resumeBtn    = page.getByTestId('hero-resume-btn');
    this.viewWorkBtn  = page.getByTestId('hero-view-work-btn');
    this.githubLink   = page.getByTestId('hero-github-link');
    this.linkedinLink = page.getByTestId('hero-linkedin-link');
    this.skillChips   = page.locator('.skill-chip');
    this.badgeTop     = page.locator('.badge-top');
    this.badgeBottom  = page.locator('.badge-bottom');
    this.badgeTopText = page.locator('.badge-top .badge-text');
  }

  async scrollToSection(): Promise<void> {
    await super.scrollToSection('hero');
  }

  async clickViewWork(): Promise<void> {
    await this.viewWorkBtn.click();
    await super.scrollInstant('development');
  }
}
