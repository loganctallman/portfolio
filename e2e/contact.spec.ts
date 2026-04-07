import { test, expect } from '@playwright/test';

test.describe('Contact Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('contact section is visible', async ({ page }) => {
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('section contains "Let\'s Work Together" heading', async ({ page }) => {
    await expect(page.locator('#contact')).toContainText("Let's Work Together");
  });

  test('email link has a valid mailto href', async ({ page }) => {
    const link = page.getByTestId('contact-email-link');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /^mailto:.+@.+\..+/);
  });

  test('email trigger button is present', async ({ page }) => {
    await expect(page.getByTestId('contact-email-trigger')).toBeVisible();
  });

  test('GitHub social link is present and opens in new tab', async ({ page }) => {
    const link = page.getByTestId('contact-github');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('href', /github\.com/);
  });

  test('LinkedIn social link is present and opens in new tab', async ({ page }) => {
    const link = page.getByTestId('contact-linkedin');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('href', /linkedin\.com/);
  });

  test('Twitter social link is present and opens in new tab', async ({ page }) => {
    const link = page.getByTestId('contact-twitter');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('all social rows have noopener noreferrer', async ({ page }) => {
    const links = page.locator('.social-row');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
    }
  });

  test('source code link is present', async ({ page }) => {
    const link = page.getByTestId('contact-source-link');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /github\.com/);
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('LinkedIn URL in social row does not overflow its container', async ({ page }) => {
    const socialInfo = page.locator('.social-info').first();
    const infoBox = await socialInfo.boundingBox();
    const urlSpan = page.locator('.social-url').first();
    const urlBox = await urlSpan.boundingBox();
    expect(urlBox!.width).toBeLessThanOrEqual(infoBox!.width + 1);
  });
});
