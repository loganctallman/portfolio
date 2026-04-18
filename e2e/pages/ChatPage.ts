import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChatPage extends BasePage {
  readonly fab: Locator;
  readonly panel: Locator;
  readonly openPanel: Locator;
  readonly closeBtn: Locator;
  readonly expandBtn: Locator;
  readonly iframe: Locator;

  constructor(page: Page) {
    super(page);
    this.fab       = page.getByTestId('chat-fab');
    this.panel     = page.locator('.chat-panel');
    this.openPanel = page.locator('.chat-panel.is-open');
    this.closeBtn  = page.getByTestId('chat-close-btn');
    this.expandBtn = page.getByTestId('chat-expand-btn');
    this.iframe    = page.getByTestId('chat-iframe');
  }

  async open(): Promise<void> {
    await this.fab.click();
  }

  async close(): Promise<void> {
    await this.closeBtn.click();
  }

  async toggle(): Promise<void> {
    await this.fab.click();
  }

  async expand(): Promise<void> {
    await this.expandBtn.click();
  }
}
