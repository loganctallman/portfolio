import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero section is visible', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible();
  });

  test('headline contains Logan Tallman', async ({ page }) => {
    await expect(page.locator('.hero-headline')).toContainText('Logan Tallman');
  });

  test('tagline contains expected text', async ({ page }) => {
    await expect(page.locator('.hero-headline')).toContainText('break it on purpose');
  });

  test('skill chips render', async ({ page }) => {
    const chips = page.locator('.skill-chip');
    await expect(chips).toHaveCount(7);
  });

  test('resume download button is present and links to PDF', async ({ page }) => {
    const btn = page.getByTestId('hero-resume-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', '/resume.pdf');
  });

  test('resume download button opens in new tab', async ({ page }) => {
    await expect(page.getByTestId('hero-resume-btn')).toHaveAttribute('target', '_blank');
  });

  test('View Work button is present', async ({ page }) => {
    await expect(page.getByTestId('hero-view-work-btn')).toBeVisible();
  });

  test('GitHub social link points to correct profile', async ({ page }) => {
    const link = page.getByTestId('hero-github-link');
    await expect(link).toHaveAttribute('href', /github\.com\/loganctallman/);
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('LinkedIn social link is present', async ({ page }) => {
    const link = page.getByTestId('hero-linkedin-link');
    await expect(link).toHaveAttribute('href', /linkedin\.com/);
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('scroll indicator button is visible', async ({ page }) => {
    await expect(page.getByTestId('hero-scroll-indicator')).toBeVisible();
  });

  test('floating badges are visible', async ({ page }) => {
    await expect(page.locator('.badge-top')).toBeVisible();
    await expect(page.locator('.badge-bottom')).toBeVisible();
  });

  test('badge text cycles — top badge changes within 5 seconds', async ({ page }) => {
    const badge = page.locator('.badge-top .badge-text');
    const initialText = await badge.textContent();
    await page.waitForTimeout(3500);
    const updatedText = await badge.textContent();
    expect(updatedText).not.toBe(initialText);
  });

  test('View Work button scrolls to test-suites section', async ({ page }) => {
    await page.getByTestId('hero-view-work-btn').click();
    await expect(page.locator('#test-suites')).toBeInViewport({ ratio: 0.3 });
  });
});
