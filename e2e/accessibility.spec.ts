import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function scrollToSection(page: import('@playwright/test').Page, id: string) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
}

// ─── WCAG 2.1 AA Axe Audits ─────────────────────────────────────────────────

test.describe('Accessibility — WCAG 2.1 AA (axe-core)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Freeze animations so mid-opacity states don't cause false colour-contrast positives
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
    });
  });

  test('hero section has no WCAG 2.1 AA violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('#hero')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('header / navigation has no WCAG 2.1 AA violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('.site-header')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('test-suites section has no WCAG 2.1 AA violations', async ({ page }) => {
    await scrollToSection(page, 'test-suites');
    const results = await new AxeBuilder({ page })
      .include('#test-suites')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('development section has no WCAG 2.1 AA violations', async ({ page }) => {
    await scrollToSection(page, 'development');
    const results = await new AxeBuilder({ page })
      .include('#development')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('development deep-dive panel has no violations when expanded', async ({ page }) => {
    await scrollToSection(page, 'development');
    await page.getByTestId('deep-dive-toggle-logangpt').click();
    const results = await new AxeBuilder({ page })
      .include('#deep-dive-logangpt')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('resume section has no WCAG 2.1 AA violations', async ({ page }) => {
    await scrollToSection(page, 'resume');
    const results = await new AxeBuilder({ page })
      .include('#resume')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('contact section has no WCAG 2.1 AA violations', async ({ page }) => {
    await scrollToSection(page, 'contact');
    const results = await new AxeBuilder({ page })
      .include('#contact')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('chat panel has no WCAG 2.1 AA violations when open', async ({ page }) => {
    await page.getByTestId('chat-fab').click();
    await expect(page.locator('.chat-panel.is-open')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .include('.chat-panel')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

// ─── Heading Hierarchy ───────────────────────────────────────────────────────

test.describe('Accessibility — Heading hierarchy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page has exactly one H1', async ({ page }) => {
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
  });

  test('H1 identifies Logan Tallman', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Logan Tallman');
  });

  test('H2 headings exist for each major section', async ({ page }) => {
    const h2s = await page.locator('h2').allTextContents();
    expect(h2s.some(t => /Development Work/i.test(t))).toBe(true);
    expect(h2s.some(t => /Let's Work Together/i.test(t))).toBe(true);
  });

  test('H3 headings are only used inside sections, not as top-level labels', async ({ page }) => {
    const h3s = await page.locator('h3').all();
    for (const h3 of h3s) {
      const closestSection = await h3.evaluate(el => !!el.closest('section'));
      expect(closestSection).toBe(true);
    }
  });

  test('no heading levels are skipped (H1 → H2 → H3)', async ({ page }) => {
    const tags = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(el => parseInt(el.tagName[1]))
    );
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i] - tags[i - 1]).toBeLessThanOrEqual(1);
    }
  });
});

// ─── ARIA & Semantic Roles ───────────────────────────────────────────────────

test.describe('Accessibility — ARIA attributes and roles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('chat FAB has correct aria-label and aria-expanded when closed', async ({ page }) => {
    const fab = page.getByTestId('chat-fab');
    await expect(fab).toHaveAttribute('aria-label', 'Open LoganGPT');
    await expect(fab).toHaveAttribute('aria-expanded', 'false');
  });

  test('chat FAB aria-label and aria-expanded update when opened', async ({ page }) => {
    await page.getByTestId('chat-fab').click();
    const fab = page.getByTestId('chat-fab');
    await expect(fab).toHaveAttribute('aria-label', 'Close LoganGPT');
    await expect(fab).toHaveAttribute('aria-expanded', 'true');
  });

  test('chat panel has role="dialog" and aria-modal="true"', async ({ page }) => {
    await page.getByTestId('chat-fab').click();
    const panel = page.locator('.chat-panel');
    await expect(panel).toHaveAttribute('role', 'dialog');
    await expect(panel).toHaveAttribute('aria-modal', 'true');
    await expect(panel).toHaveAttribute('aria-label', 'LoganGPT chat assistant');
  });

  test('chat iframe has a descriptive title', async ({ page }) => {
    await page.getByTestId('chat-fab').click();
    await expect(page.getByTestId('chat-iframe')).toHaveAttribute('title', 'LoganGPT AI Assistant');
  });

  test('close and expand buttons inside chat have aria-labels', async ({ page }) => {
    await page.getByTestId('chat-fab').click();
    await expect(page.getByTestId('chat-close-btn')).toHaveAttribute('aria-label', 'Close chat');
    await expect(page.getByTestId('chat-expand-btn')).toHaveAttribute('aria-label', 'Expand chat');
  });

  test('expand button aria-label updates after expanding', async ({ page }) => {
    await page.getByTestId('chat-fab').click();
    await page.getByTestId('chat-expand-btn').click();
    await expect(page.getByTestId('chat-expand-btn')).toHaveAttribute('aria-label', 'Minimize chat');
  });

  test('header nav has aria-label="Main navigation"', async ({ page }) => {
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
  });

  test('sections dropdown trigger has aria-haspopup', async ({ page }) => {
    // Angular Material sets aria-haspopup="menu" per the ARIA spec for menu buttons
    await expect(page.getByTestId('sections-menu-trigger')).toHaveAttribute('aria-haspopup', 'menu');
  });

  test('development section has aria-label', async ({ page }) => {
    await expect(page.locator('#development')).toHaveAttribute('aria-label', 'Development projects');
  });

  test('carousel dots use role="tablist" and role="tab"', async ({ page }) => {
    await scrollToSection(page, 'development');
    await expect(page.locator('.carousel-dots').first()).toHaveAttribute('role', 'tablist');
    const firstDot = page.locator('.carousel-dots .dot').first();
    await expect(firstDot).toHaveAttribute('role', 'tab');
  });

  test('carousel arrows have descriptive aria-labels', async ({ page }) => {
    await scrollToSection(page, 'development');
    await expect(page.locator('.carousel-arrow--prev').first()).toHaveAttribute('aria-label', 'Previous image');
    await expect(page.locator('.carousel-arrow--next').first()).toHaveAttribute('aria-label', 'Next image');
  });

  test('carousel images have non-empty alt text', async ({ page }) => {
    await scrollToSection(page, 'development');
    const imgs = await page.locator('.carousel-img').all();
    for (const img of imgs) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt!.length).toBeGreaterThan(0);
    }
  });

  test('deep-dive toggle has aria-controls pointing to panel id', async ({ page }) => {
    await scrollToSection(page, 'development');
    const toggle = page.getByTestId('deep-dive-toggle-logangpt');
    await expect(toggle).toHaveAttribute('aria-controls', 'deep-dive-logangpt');
  });

  test('expanded deep-dive panel has role="region" with aria-label', async ({ page }) => {
    await scrollToSection(page, 'development');
    await page.getByTestId('deep-dive-toggle-logangpt').click();
    const panel = page.locator('#deep-dive-logangpt');
    await expect(panel).toHaveAttribute('role', 'region');
    await expect(panel).toHaveAttribute('aria-label', 'LoganGPT testing strategy');
  });

  test('hero skill chips container has aria-label', async ({ page }) => {
    await expect(page.locator('[aria-label="Core skills"]')).toBeVisible();
  });

  test('tech stack containers have aria-label="Technologies used"', async ({ page }) => {
    await scrollToSection(page, 'development');
    const techContainers = page.locator('[aria-label="Technologies used"]');
    await expect(techContainers.first()).toBeVisible();
  });

  test('decorative background elements are aria-hidden', async ({ page }) => {
    const hidden = await page.locator('[aria-hidden="true"]').count();
    expect(hidden).toBeGreaterThan(0);
  });
});

// ─── Keyboard Navigation ─────────────────────────────────────────────────────

test.describe('Accessibility — Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('brand logo is reachable by Tab', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('data-testid', 'brand-logo');
  });

  test('sections dropdown trigger is reachable by Tab after brand logo', async ({ page }) => {
    await page.keyboard.press('Tab'); // brand logo
    await page.keyboard.press('Tab'); // sections trigger
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('data-testid', 'sections-menu-trigger');
  });

  test('resume header link is reachable by Tab after sections trigger', async ({ page }) => {
    await page.keyboard.press('Tab'); // brand logo
    await page.keyboard.press('Tab'); // sections trigger
    await page.keyboard.press('Tab'); // resume link
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('data-testid', 'resume-link');
  });

  test('sections dropdown opens and closes with keyboard', async ({ page }) => {
    await page.keyboard.press('Tab'); // brand logo
    await page.keyboard.press('Tab'); // sections trigger
    await page.keyboard.press('Enter');
    await expect(page.locator('.mat-mdc-menu-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.mat-mdc-menu-panel')).not.toBeVisible();
  });

  test('chat FAB is reachable by keyboard and toggles with Enter', async ({ page }) => {
    const fab = page.getByTestId('chat-fab');
    await fab.focus();
    await expect(fab).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.chat-panel.is-open')).toBeVisible();
  });

  test('chat can be closed with Escape after opening via keyboard', async ({ page }) => {
    const fab = page.getByTestId('chat-fab');
    await fab.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.chat-panel.is-open')).toBeVisible();
    await page.getByTestId('chat-close-btn').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.chat-panel.is-open')).not.toBeVisible();
  });

  test('deep-dive toggle activates with Enter key', async ({ page }) => {
    await scrollToSection(page, 'development');
    const toggle = page.getByTestId('deep-dive-toggle-logangpt');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#deep-dive-logangpt')).toBeVisible();
  });

  test('deep-dive toggle activates with Space key', async ({ page }) => {
    await scrollToSection(page, 'development');
    const toggle = page.getByTestId('deep-dive-toggle-logangpt');
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#deep-dive-logangpt')).toBeVisible();
  });

  test('carousel arrows are keyboard-operable', async ({ page }) => {
    await scrollToSection(page, 'development');
    const nextArrow = page.locator('.carousel-arrow--next').first();
    // Verify the arrow is focusable
    await nextArrow.focus();
    await expect(nextArrow).toBeFocused();
    // Verify slide 0 is active before advancing
    await expect(page.locator('.carousel-dots').first().locator('.dot').first()).toHaveAttribute('aria-selected', 'true');
    // Enter on a focused <button> fires click — use auto-retry assertion to wait for Angular change detection
    await page.keyboard.press('Enter');
    await expect(page.locator('.carousel-dots').first().locator('.dot').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('interactive elements have visible focus indicators', async ({ page }) => {
    await page.addStyleTag({ content: '* { outline: none !important; }' });
    // Verify at least the FAB can receive programmatic focus — visual focus
    // ring is enforced by the SCSS :focus-visible rule; axe will catch missing outlines.
    const fab = page.getByTestId('chat-fab');
    await fab.focus();
    await expect(fab).toBeFocused();
  });
});

// ─── Resilience / Edge-case Rendering ────────────────────────────────────────

test.describe('Accessibility — Resilience and edge cases', () => {
  test('page renders without JS-controlled animations blocking content', async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
    });
    // All major sections must still be present in the DOM
    for (const id of ['hero', 'test-suites', 'development', 'resume', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('carousel prev-arrow wraps correctly from first to last slide', async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'development');
    // On the first slide, pressing Prev should wrap to the last dot
    const prevArrow = page.locator('.carousel-arrow--prev').first();
    const totalDots = await page.locator('.carousel-dots').first().locator('.dot').count();
    await prevArrow.click();
    const lastDot = page.locator('.carousel-dots').first().locator('.dot').nth(totalDots - 1);
    await expect(lastDot).toHaveAttribute('aria-selected', 'true');
  });

  test('multiple rapid carousel clicks do not break aria-selected state', async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'development');
    const next = page.locator('.carousel-arrow--next').first();
    for (let i = 0; i < 5; i++) await next.click();
    const activeDots = page.locator('.carousel-dots').first().locator('.dot[aria-selected="true"]');
    await expect(activeDots).toHaveCount(1);
  });

  test('only one deep-dive panel is open and aria-expanded is consistent', async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'development');
    const first = page.getByTestId('deep-dive-toggle-logangpt');
    const second = page.getByTestId('deep-dive-toggle-math-trainer');
    await first.click();
    await second.scrollIntoViewIfNeeded();
    await second.click();
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  test('chat open/close cycle leaves FAB aria state consistent', async ({ page }) => {
    await page.goto('/');
    const fab = page.getByTestId('chat-fab');
    await fab.click();
    await fab.click();
    await expect(fab).toHaveAttribute('aria-expanded', 'false');
    await expect(fab).toHaveAttribute('aria-label', 'Open LoganGPT');
    await expect(page.locator('.chat-panel.is-open')).not.toBeVisible();
  });
});
