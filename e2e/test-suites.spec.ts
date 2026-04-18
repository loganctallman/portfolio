import { test, expect } from '@playwright/test';
import { TestSuitesPage } from './pages';

const TOOL_IDS = ['playwright', 'cypress', 'junit', 'postman', 'jmeter', 'github-actions'];

test.describe('Test Suites Section', () => {
  let suites: TestSuitesPage;

  test.beforeEach(async ({ page }) => {
    suites = new TestSuitesPage(page);
    await suites.goto();
    await suites.scrollToSection();
  });

  test('section heading is visible', async () => {
    await expect(suites.section).toContainText('Automated Test Suites');
  });

  test('renders all 6 tool cards', async () => {
    await expect(suites.allToolCards).toHaveCount(6);
  });

  for (const id of TOOL_IDS) {
    test(`tool card "${id}" is visible`, async () => {
      await expect(suites.toolCard(id)).toBeVisible();
    });

    test(`"${id}" has a View Docs link that opens in new tab`, async () => {
      const link = suites.toolLink(id);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('href', /https?:\/\//);
    });
  }

  test('each tool card shows a category badge', async () => {
    await expect(suites.categoryBadges).toHaveCount(6);
  });

  test('carousel dot indicators are present', async () => {
    const count = await suites.carouselDotGroups.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a carousel dot changes the active dot', async () => {
    const secondDot = suites.carouselDots('playwright').nth(1);
    await secondDot.click();
    await expect(secondDot).toHaveClass(/active/);
  });
});
