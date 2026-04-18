import { test, expect } from '@playwright/test';
import { HeaderPage, HeroPage, DevelopmentPage, ContactPage, TestSuitesPage } from './pages';

// Mobile-specific tests run at 390x844 (iPhone 14 viewport)
test.use({ viewport: { width: 390, height: 844 } });

test.describe('Mobile Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads without horizontal scroll', async ({ page }) => {
    const bodyWidth    = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('header is visible on mobile', async ({ page }) => {
    const header = new HeaderPage(page);
    await expect(header.header).toBeVisible();
  });

  test('brand logo is visible on mobile', async ({ page }) => {
    const header = new HeaderPage(page);
    await expect(header.brandLogo).toBeVisible();
  });

  test('hero headline is visible on mobile', async ({ page }) => {
    const hero = new HeroPage(page);
    await expect(hero.headline).toBeVisible();
  });

  test('floating badges are visible on mobile', async ({ page }) => {
    const hero = new HeroPage(page);
    await expect(hero.badgeTop).toBeVisible();
    await expect(hero.badgeBottom).toBeVisible();
  });

  test('badge-top does not overflow viewport on mobile', async ({ page }) => {
    const hero = new HeroPage(page);
    const box  = await hero.badgeTop.boundingBox();
    const viewportWidth = page.viewportSize()!.width;
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('badge-bottom does not overflow viewport on mobile', async ({ page }) => {
    const hero = new HeroPage(page);
    const box  = await hero.badgeBottom.boundingBox();
    const viewportWidth = page.viewportSize()!.width;
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('resume CTA button is visible on mobile', async ({ page }) => {
    const hero = new HeroPage(page);
    await expect(hero.resumeBtn).toBeVisible();
  });

  test('test suites section is visible on mobile', async ({ page }) => {
    const suites = new TestSuitesPage(page);
    await suites.scrollToSection();
    await expect(suites.section).toBeVisible();
  });

  test('development project cards stack on mobile', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    // On mobile the grid collapses to 1 column — first and second cards share the same x
    const firstBox  = await dev.allProjectCards.nth(0).boundingBox();
    const secondBox = await dev.allProjectCards.nth(1).boundingBox();
    expect(Math.abs(firstBox!.x - secondBox!.x)).toBeLessThan(5);
  });

  test('contact section is visible on mobile', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.scrollToSection();
    await expect(contact.section).toBeVisible();
  });

  test('deep dive toggle works on mobile', async ({ page }) => {
    const dev = new DevelopmentPage(page);
    await dev.scrollToSection();
    await dev.expandProject('logangpt');
    await expect(dev.deepDivePanel('logangpt')).toBeVisible();
  });
});
