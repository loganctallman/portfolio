import { test, expect } from '@playwright/test';
import { HeroPage } from './pages';

test.describe('Hero Section', () => {
  let hero: HeroPage;

  test.beforeEach(async ({ page }) => {
    hero = new HeroPage(page);
    await hero.goto();
  });

  test('hero section is visible', async () => {
    await expect(hero.section).toBeVisible();
  });

  test('headline contains Logan Tallman', async () => {
    await expect(hero.headline).toContainText('Logan Tallman');
  });

  test('tagline contains expected text', async () => {
    await expect(hero.headline).toContainText('break it on purpose');
  });

  test('skill chips render', async () => {
    await expect(hero.skillChips).toHaveCount(7);
  });

  test('resume download button is present and links to PDF', async () => {
    await expect(hero.resumeBtn).toBeVisible();
    await expect(hero.resumeBtn).toHaveAttribute('href', '/resume.pdf');
  });

  test('resume download button opens in new tab', async () => {
    await expect(hero.resumeBtn).toHaveAttribute('target', '_blank');
  });

  test('View Work button is present', async () => {
    await expect(hero.viewWorkBtn).toBeVisible();
  });

  test('GitHub social link points to correct profile', async () => {
    await expect(hero.githubLink).toHaveAttribute('href', /github\.com\/loganctallman/);
    await expect(hero.githubLink).toHaveAttribute('target', '_blank');
  });

  test('LinkedIn social link is present', async () => {
    await expect(hero.linkedinLink).toHaveAttribute('href', /linkedin\.com/);
    await expect(hero.linkedinLink).toHaveAttribute('target', '_blank');
  });

  test('floating badges are visible', async () => {
    await expect(hero.badgeTop).toBeVisible();
    await expect(hero.badgeBottom).toBeVisible();
  });

  test('badge text cycles — top badge changes within 5 seconds', async ({ page }) => {
    const initialText = await hero.badgeTopText.textContent();
    await page.waitForTimeout(3500);
    const updatedText = await hero.badgeTopText.textContent();
    expect(updatedText).not.toBe(initialText);
  });

  test('View Work button scrolls to development section', async ({ page }) => {
    await hero.clickViewWork();
    await expect(page.locator('#development')).toBeInViewport({ ratio: 0.10 });
  });
});
