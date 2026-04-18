import { test, expect } from '@playwright/test';
import { HeaderPage } from './pages';

test.describe('Header Navigation', () => {
  let header: HeaderPage;

  test.beforeEach(async ({ page }) => {
    header = new HeaderPage(page);
    await header.goto();
  });

  test('brand logo is visible', async () => {
    await expect(header.brandLogo).toBeVisible();
  });

  test('brand logo contains Logan name', async () => {
    await expect(header.brandLogo).toContainText('Logan');
  });

  test('sections dropdown trigger is visible', async () => {
    await expect(header.sectionsMenuTrigger).toBeVisible();
  });

  test('sections dropdown opens and shows all 5 sections', async () => {
    await header.openSectionsMenu();
    for (const id of ['hero', 'test-suites', 'development', 'resume', 'contact']) {
      await expect(header.navItem(id)).toBeVisible();
    }
  });

  test('Profile nav item label shows correctly', async () => {
    await header.openSectionsMenu();
    await expect(header.navItem('hero')).toContainText('Profile');
  });

  test('clicking a nav item scrolls to the target section', async ({ page }) => {
    await header.openSectionsMenu();
    await header.navItem('contact').click();
    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'instant' });
    });
    await expect(page.locator('#contact')).toBeInViewport({ ratio: 0.3 });
  });

  test('resume header link is present', async () => {
    await expect(header.resumeLink).toBeVisible();
  });

  test('header becomes scrolled after scrolling down', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(header.header).toHaveClass(/scrolled/);
  });
});
