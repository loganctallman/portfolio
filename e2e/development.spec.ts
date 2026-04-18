import { test, expect } from '@playwright/test';
import { DevelopmentPage } from './pages';

const PROJECT_IDS = ['mytop50', 'logangpt', 'math-trainer', 'portfolio', 'xrshots', 'sourcecreative'];

test.describe('Development Section', () => {
  let dev: DevelopmentPage;

  test.beforeEach(async ({ page }) => {
    dev = new DevelopmentPage(page);
    await dev.goto();
    await dev.scrollToSection();
  });

  test('section heading is visible', async () => {
    await expect(dev.section).toContainText('Development Work');
  });

  test('renders all project cards', async () => {
    await expect(dev.allProjectCards).toHaveCount(PROJECT_IDS.length);
  });

  for (const id of PROJECT_IDS) {
    test(`project card "${id}" is visible`, async () => {
      await expect(dev.projectCard(id)).toBeVisible();
    });

    test(`"${id}" has live and repo links`, async () => {
      await expect(dev.liveLink(id)).toBeVisible();
      await expect(dev.repoLink(id)).toBeVisible();
    });

    test(`"${id}" live link opens in new tab`, async () => {
      await expect(dev.liveLink(id)).toHaveAttribute('target', '_blank');
    });
  }

  test('deep dive panel is hidden by default', async () => {
    await expect(dev.deepDivePanel('logangpt')).not.toBeAttached();
  });

  test('clicking deep dive toggle expands the panel', async () => {
    await dev.expandProject('logangpt');
    await expect(dev.deepDivePanel('logangpt')).toBeVisible();
  });

  test('deep dive toggle has correct aria-expanded state', async () => {
    const toggle = dev.deepDiveToggle('logangpt');
    await toggle.scrollIntoViewIfNeeded();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking toggle again collapses the panel', async () => {
    await dev.expandProject('logangpt');
    await expect(dev.deepDivePanel('logangpt')).toBeVisible();
    await dev.collapseProject('logangpt');
    await expect(dev.deepDivePanel('logangpt')).not.toBeAttached();
  });

  test('only one deep dive panel is open at a time', async () => {
    await dev.expandProject('logangpt');
    await dev.expandProject('math-trainer');
    await expect(dev.deepDivePanel('logangpt')).not.toBeAttached();
    await expect(dev.deepDivePanel('math-trainer')).toBeVisible();
  });

  test('XR Shots project card is visible', async () => {
    const card = dev.projectCard('xrshots');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toContainText('XR Shots');
  });

  test('Source Creative project card is visible', async () => {
    const card = dev.projectCard('sourcecreative');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toContainText('Source Creative');
  });
});
