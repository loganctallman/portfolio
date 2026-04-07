import { test, expect } from '@playwright/test';

const PROJECT_IDS = ['logangpt', 'math-trainer', 'portfolio', 'xrshots', 'sourcecreative'];

test.describe('Development Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#development').scrollIntoViewIfNeeded();
  });

  test('section heading is visible', async ({ page }) => {
    await expect(page.locator('#development')).toContainText('Development Work');
  });

  test('renders all 5 project cards', async ({ page }) => {
    const cards = page.locator('[data-testid^="project-card-"]');
    await expect(cards).toHaveCount(5);
  });

  for (const id of PROJECT_IDS) {
    test(`project card "${id}" is visible`, async ({ page }) => {
      await expect(page.getByTestId(`project-card-${id}`)).toBeVisible();
    });

    test(`"${id}" has live and repo links`, async ({ page }) => {
      await expect(page.getByTestId(`project-live-${id}`)).toBeVisible();
      await expect(page.getByTestId(`project-repo-${id}`)).toBeVisible();
    });

    test(`"${id}" live link opens in new tab`, async ({ page }) => {
      await expect(page.getByTestId(`project-live-${id}`)).toHaveAttribute('target', '_blank');
    });
  }

  test('deep dive panel is hidden by default', async ({ page }) => {
    await expect(page.locator('#deep-dive-logangpt')).not.toBeAttached();
  });

  test('clicking deep dive toggle expands the panel', async ({ page }) => {
    const toggle = page.getByTestId('deep-dive-toggle-logangpt');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await expect(page.locator('#deep-dive-logangpt')).toBeVisible();
  });

  test('deep dive toggle has correct aria-expanded state', async ({ page }) => {
    const toggle = page.getByTestId('deep-dive-toggle-logangpt');
    await toggle.scrollIntoViewIfNeeded();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking toggle again collapses the panel', async ({ page }) => {
    const toggle = page.getByTestId('deep-dive-toggle-logangpt');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await expect(page.locator('#deep-dive-logangpt')).toBeVisible();
    await toggle.click();
    await expect(page.locator('#deep-dive-logangpt')).not.toBeAttached();
  });

  test('only one deep dive panel is open at a time', async ({ page }) => {
    const firstToggle = page.getByTestId('deep-dive-toggle-logangpt');
    const secondToggle = page.getByTestId('deep-dive-toggle-math-trainer');
    await firstToggle.scrollIntoViewIfNeeded();
    await firstToggle.click();
    await secondToggle.scrollIntoViewIfNeeded();
    await secondToggle.click();
    await expect(page.locator('#deep-dive-logangpt')).not.toBeAttached();
    await expect(page.locator('#deep-dive-math-trainer')).toBeVisible();
  });

  test('XR Shots project card is visible', async ({ page }) => {
    const card = page.getByTestId('project-card-xrshots');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toContainText('XR Shots');
  });

  test('Source Creative project card is visible', async ({ page }) => {
    const card = page.getByTestId('project-card-sourcecreative');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toContainText('Source Creative');
  });
});
