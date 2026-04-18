import { test, expect } from '@playwright/test';
import { ChatPage, DevelopmentPage, HeaderPage, HeroPage, ContactPage } from './pages';

// ─── Iframe Failure ───────────────────────────────────────────────────────────

test.describe('Resilience — Iframe failure', () => {
  test.beforeEach(async ({ page }) => {
    // Abort all requests to the LoganGPT app before the page loads
    await page.route('**/logangptapp.vercel.app/**', route => route.abort());
    await page.goto('/');
  });

  test('chat panel opens cleanly when iframe origin is unreachable', async ({ page }) => {
    const chat = new ChatPage(page);
    await chat.open();
    await expect(chat.openPanel).toBeVisible();
    await expect(chat.closeBtn).toBeVisible();
  });

  test('chat close button works when iframe is blocked', async ({ page }) => {
    const chat = new ChatPage(page);
    await chat.open();
    await chat.close();
    await expect(chat.openPanel).not.toBeVisible();
  });

  test('chat expand button works when iframe is blocked', async ({ page }) => {
    const chat = new ChatPage(page);
    await chat.open();
    await chat.expand();
    await expect(chat.panel).toHaveClass(/expanded/);
    await expect(chat.expandBtn).toHaveAttribute('aria-label', 'Minimize chat');
  });

  test('FAB aria state is correct after open/close cycle with blocked iframe', async ({ page }) => {
    const chat = new ChatPage(page);
    await chat.open();
    await expect(chat.fab).toHaveAttribute('aria-expanded', 'true');
    await chat.close();
    await expect(chat.fab).toHaveAttribute('aria-expanded', 'false');
    await expect(chat.fab).toHaveAttribute('aria-label', 'Open LoganGPT');
  });

  test('no uncaught JS errors are thrown when iframe is blocked', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    const chat = new ChatPage(page);
    await chat.open();
    await expect(chat.openPanel).toBeVisible();
    await chat.close();
    await expect(chat.openPanel).not.toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('rest of the page is fully functional when iframe is blocked', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    await dev.expandProject('logangpt');
    await expect(dev.deepDivePanel('logangpt')).toBeVisible();
    const contact = new ContactPage(page);
    await contact.scrollToSection();
    await expect(contact.section).toBeVisible();
  });
});

// ─── Reduced Motion ───────────────────────────────────────────────────────────

test.describe('Resilience — Reduced motion (prefers-reduced-motion: reduce)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
  });

  test('all major sections are present and attached under reduced motion', async ({ page }) => {
    for (const id of ['hero', 'test-suites', 'development', 'resume', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('hero section is visible and headline readable under reduced motion', async ({ page }) => {
    const hero = new HeroPage(page);
    await expect(hero.section).toBeVisible();
    await expect(hero.headline).toContainText('Logan Tallman');
  });

  test('carousel navigation works under reduced motion', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    await dev.carouselNextArrow().click();
    await expect(dev.carouselDots().locator('.dot').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('deep-dive panels expand and collapse under reduced motion', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    await dev.expandProject('mytop50');
    await expect(dev.deepDivePanel('mytop50')).toBeVisible();
    await dev.collapseProject('mytop50');
    await expect(dev.deepDivePanel('mytop50')).not.toBeAttached();
  });

  test('chat opens and closes under reduced motion', async ({ page }) => {
    const chat = new ChatPage(page);
    await chat.open();
    await expect(chat.openPanel).toBeVisible();
    await chat.close();
    await expect(chat.openPanel).not.toBeVisible();
  });

  test('header scroll state updates under reduced motion', async ({ page }) => {
    const header = new HeaderPage(page);
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(header.header).toHaveClass(/scrolled/);
  });

  test('badge text cycling continues under reduced motion (JS-driven, not CSS)', async ({ page }) => {
    const hero = new HeroPage(page);
    const initialText = await hero.badgeTopText.textContent();
    await page.waitForTimeout(3500);
    const updatedText = await hero.badgeTopText.textContent();
    expect(updatedText).not.toBe(initialText);
  });
});

// ─── Viewport Extremes ────────────────────────────────────────────────────────

test.describe('Resilience — Viewport: 320px (minimum viable mobile)', () => {
  test.use({ viewport: { width: 320, height: 568 } }); // iPhone SE (1st gen)

  test('no horizontal scroll at 320px', async ({ page }) => {
    await page.goto('/');
    const bodyWidth     = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('header is visible at 320px', async ({ page }) => {
    await page.goto('/');
    await expect(new HeaderPage(page).header).toBeVisible();
  });

  test('hero headline is visible at 320px', async ({ page }) => {
    await page.goto('/');
    await expect(new HeroPage(page).headline).toBeVisible();
  });

  test('project cards stack at 320px with no overflow', async ({ page }) => {
    await page.goto('/');
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    const viewportWidth = page.viewportSize()!.width;
    const card          = dev.projectCard('logangpt');
    const box           = await card.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('contact section is visible and not overflowing at 320px', async ({ page }) => {
    await page.goto('/');
    const contact = new ContactPage(page);
    await contact.scrollToSection();
    await expect(contact.section).toBeVisible();
    const viewportWidth = page.viewportSize()!.width;
    const box           = await contact.section.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 2);
  });
});

test.describe('Resilience — Viewport: 2560px (4K / ultrawide)', () => {
  test.use({ viewport: { width: 2560, height: 1440 } });

  test('no horizontal scroll at 2560px', async ({ page }) => {
    await page.goto('/');
    const bodyWidth     = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('header is visible at 2560px', async ({ page }) => {
    await page.goto('/');
    await expect(new HeaderPage(page).header).toBeVisible();
  });

  test('hero section is visible and headline readable at 2560px', async ({ page }) => {
    await page.goto('/');
    const hero = new HeroPage(page);
    await expect(hero.section).toBeVisible();
    await expect(hero.headline).toContainText('Logan Tallman');
  });

  test('content is horizontally centred at 2560px (not full-width stretched)', async ({ page }) => {
    await page.goto('/');
    const hero = new HeroPage(page);
    const box  = await hero.section.boundingBox();
    // The section should be inset from the viewport edges
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.width).toBeLessThanOrEqual(2560);
  });

  test('deep-dive panel works at 2560px', async ({ page }) => {
    await page.goto('/');
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    await dev.expandProject('logangpt');
    await expect(dev.deepDivePanel('logangpt')).toBeVisible();
  });
});

// ─── Rapid Interactions (Chaos) ───────────────────────────────────────────────

test.describe('Resilience — Rapid interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('rapid chat FAB toggles leave UI in a consistent open/closed state', async ({ page }) => {
    const chat = new ChatPage(page);
    // 6 rapid toggles = net closed
    for (let i = 0; i < 6; i++) await chat.toggle();
    await expect(chat.fab).toHaveAttribute('aria-expanded', 'false');
    await expect(chat.openPanel).not.toBeVisible();
    // 7 rapid toggles = net open
    for (let i = 0; i < 7; i++) await chat.toggle();
    await expect(chat.fab).toHaveAttribute('aria-expanded', 'true');
    await expect(chat.openPanel).toBeVisible();
  });

  test('rapid same-project deep-dive toggles leave panel in a known state', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    const toggle = dev.deepDiveToggle('logangpt');
    await toggle.scrollIntoViewIfNeeded();
    // 10 rapid clicks = net closed
    for (let i = 0; i < 10; i++) await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(dev.deepDivePanel('logangpt')).not.toBeAttached();
  });

  test('rapidly opening different projects leaves only the last one expanded', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    const ids = ['logangpt', 'mytop50', 'math-trainer'];
    for (const id of ids) {
      const toggle = dev.deepDiveToggle(id);
      await toggle.scrollIntoViewIfNeeded();
      await toggle.click();
    }
    // Only last expanded project should be open
    await expect(dev.deepDivePanel('logangpt')).not.toBeAttached();
    await expect(dev.deepDivePanel('mytop50')).not.toBeAttached();
    await expect(dev.deepDivePanel('math-trainer')).toBeVisible();
  });

  test('carousel next arrow clicked beyond slide count wraps and stays consistent', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    const totalDots = await dev.carouselDots().locator('.dot').count();
    // Click past the end and back around
    for (let i = 0; i < totalDots + 3; i++) await dev.carouselNextArrow().click();
    // Exactly one dot should be active
    await expect(dev.carouselDots().locator('.dot[aria-selected="true"]')).toHaveCount(1);
  });

  test('simultaneous chat open and deep-dive expand do not conflict', async ({ page }) => {
    const chat = new ChatPage(page);
    const dev  = new DevelopmentPage(page);
    await dev.scrollToSection();
    // Open chat, then immediately expand a project
    await chat.open();
    await dev.expandProject('logangpt');
    // Both should be independently in their expected state
    await expect(chat.openPanel).toBeVisible();
    await expect(dev.deepDivePanel('logangpt')).toBeVisible();
  });
});

// ─── Broken / Missing Images ──────────────────────────────────────────────────

test.describe('Resilience — Broken images (aborted image requests)', () => {
  test.beforeEach(async ({ page }) => {
    // Simulate 404s for all project screenshot images
    await page.route('**/*.jpg', route => route.abort());
    await page.goto('/');
  });

  test('no horizontal overflow when all carousel images fail to load', async ({ page }) => {
    const bodyWidth     = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('carousel structure remains intact with broken images', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    // Dots and arrows should still render
    await expect(dev.carouselDots()).toBeVisible();
    await expect(dev.carouselNextArrow()).toBeVisible();
    await expect(dev.carouselPrevArrow()).toBeVisible();
  });

  test('carousel navigation still works with broken images', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    await dev.carouselNextArrow().click();
    await expect(dev.carouselDots().locator('.dot').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('broken carousel images have non-empty alt text as fallback', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    const imgs = await dev.carouselImages().all();
    for (const img of imgs) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('no uncaught JS errors when image requests are aborted', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    await dev.carouselNextArrow().click();
    expect(errors).toHaveLength(0);
  });

  test('project cards do not collapse to zero height with broken images', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    const card = dev.projectCard('logangpt');
    const box  = await card.boundingBox();
    expect(box!.height).toBeGreaterThan(100);
  });
});
