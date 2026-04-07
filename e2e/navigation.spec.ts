import { test, expect } from '@playwright/test';

test.describe('Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('brand logo is visible', async ({ page }) => {
    await expect(page.getByTestId('brand-logo')).toBeVisible();
  });

  test('brand logo contains Logan name', async ({ page }) => {
    await expect(page.getByTestId('brand-logo')).toContainText('Logan');
  });

  test('sections dropdown trigger is visible', async ({ page }) => {
    await expect(page.getByTestId('sections-menu-trigger')).toBeVisible();
  });

  test('sections dropdown opens and shows all 5 sections', async ({ page }) => {
    await page.getByTestId('sections-menu-trigger').click();
    await expect(page.getByTestId('nav-hero')).toBeVisible();
    await expect(page.getByTestId('nav-test-suites')).toBeVisible();
    await expect(page.getByTestId('nav-development')).toBeVisible();
    await expect(page.getByTestId('nav-resume')).toBeVisible();
    await expect(page.getByTestId('nav-contact')).toBeVisible();
  });

  test('Profile nav item label shows correctly', async ({ page }) => {
    await page.getByTestId('sections-menu-trigger').click();
    await expect(page.getByTestId('nav-hero')).toContainText('Profile');
  });

  test('clicking a nav item scrolls to the target section', async ({ page }) => {
    await page.getByTestId('sections-menu-trigger').click();
    await page.getByTestId('nav-contact').click();
    await expect(page.locator('#contact')).toBeInViewport({ ratio: 0.3 });
  });

  test('resume header link is present', async ({ page }) => {
    await expect(page.getByTestId('resume-link')).toBeVisible();
  });

  test('header becomes scrolled after scrolling down', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(page.locator('.site-header')).toHaveClass(/scrolled/);
  });
});
