import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  readonly section: Locator;
  readonly emailLink: Locator;
  readonly emailTrigger: Locator;
  readonly githubLink: Locator;
  readonly linkedinLink: Locator;
  readonly twitterLink: Locator;
  readonly sourceLink: Locator;
  readonly socialRows: Locator;
  readonly socialUrls: Locator;
  readonly socialInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.section      = page.locator('#contact');
    this.emailLink    = page.getByTestId('contact-email-link');
    this.emailTrigger = page.getByTestId('contact-email-trigger');
    this.githubLink   = page.getByTestId('contact-github');
    this.linkedinLink = page.getByTestId('contact-linkedin');
    this.twitterLink  = page.getByTestId('contact-twitter');
    this.sourceLink   = page.getByTestId('contact-source-link');
    this.socialRows   = page.locator('.social-row');
    this.socialUrls   = page.locator('.social-url');
    this.socialInfo   = page.locator('.social-info');
  }

  async scrollToSection(): Promise<void> {
    await super.scrollToSection('contact');
  }
}
