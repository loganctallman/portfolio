import { test, expect } from '@playwright/test';

// Mobile-specific tests run at 390x844 (iPhone 14 viewport)
test.use({ viewport: { width: 390, height: 844 } });

test.describe('Mobile Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads without horizontal scroll', async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('header is visible on mobile', async ({ page }) => {
    await expect(page.locator('.site-header')).toBeVisible();
  });

  test('brand logo is visible on mobile', async ({ page }) => {
    await expect(page.getByTestId('brand-logo')).toBeVisible();
  });

  test('hero headline is visible on mobile', async ({ page }) => {
    await expect(page.locator('.hero-headline')).toBeVisible();
  });

  test('floating badges are visible on mobile', async ({ page }) => {
    await expect(page.locator('.badge-top')).toBeVisible();
    await expect(page.locator('.badge-bottom')).toBeVisible();
  });

  test('badge-top does not overflow viewport on mobile', async ({ page }) => {
    const badge = page.locator('.badge-top');
    const box = await badge.boundingBox();
    const viewportWidth = page.viewportSize()!.width;
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('badge-bottom does not overflow viewport on mobile', async ({ page }) => {
    const badge = page.locator('.badge-bottom');
    const box = await badge.boundingBox();
    const viewportWidth = page.viewportSize()!.width;
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('resume CTA button is visible on mobile', async ({ page }) => {
    await expect(page.getByTestId('hero-resume-btn')).toBeVisible();
  });

  test('test suites section is visible on mobile', async ({ page }) => {
    await page.locator('#test-suites').scrollIntoViewIfNeeded();
    await expect(page.locator('#test-suites')).toBeVisible();
  });

  test('development project cards stack on mobile', async ({ page }) => {
    await page.locator('#development').scrollIntoViewIfNeeded();
    const cards = page.locator('[data-testid^="project-card-"]');
    await expect(cards).toHaveCount(5);
    // On mobile the grid collapses to 1 column — first and second cards should have same x position
    const firstBox = await cards.nth(0).boundingBox();
    const secondBox = await cards.nth(1).boundingBox();
    expect(Math.abs(firstBox!.x - secondBox!.x)).toBeLessThan(5);
  });

  test('contact section is visible on mobile', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('deep dive toggle works on mobile', async ({ page }) => {
    await page.locator('#development').scrollIntoViewIfNeeded();
    const toggle = page.getByTestId('deep-dive-toggle-logangpt');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await expect(page.locator('#deep-dive-logangpt')).toBeVisible();
  });
});
