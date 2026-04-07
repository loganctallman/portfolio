import { test, expect } from '@playwright/test';

const TOOL_IDS = ['playwright', 'cypress', 'junit', 'postman', 'jmeter', 'github-actions'];

test.describe('Test Suites Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#test-suites').scrollIntoViewIfNeeded();
  });

  test('section heading is visible', async ({ page }) => {
    await expect(page.locator('#test-suites')).toContainText('Automated Test Suites');
  });

  test('renders all 6 tool cards', async ({ page }) => {
    const cards = page.locator('[data-testid^="tool-card-"]');
    await expect(cards).toHaveCount(6);
  });

  for (const id of TOOL_IDS) {
    test(`tool card "${id}" is visible`, async ({ page }) => {
      await expect(page.getByTestId(`tool-card-${id}`)).toBeVisible();
    });

    test(`"${id}" has a View Docs link that opens in new tab`, async ({ page }) => {
      const link = page.getByTestId(`tool-link-${id}`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('href', /https?:\/\//);
    });
  }

  test('each tool card shows a category badge', async ({ page }) => {
    const badges = page.locator('.tool-category-badge');
    await expect(badges).toHaveCount(6);
  });

  test('carousel dot indicators are present', async ({ page }) => {
    const dots = page.locator('.card-carousel .carousel-dots');
    const count = await dots.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a carousel dot changes the active dot', async ({ page }) => {
    const card = page.getByTestId('tool-card-playwright');
    const dots = card.locator('.carousel-dots .dot');
    const secondDot = dots.nth(1);
    await secondDot.click();
    await expect(secondDot).toHaveClass(/active/);
  });
});
