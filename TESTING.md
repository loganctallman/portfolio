# Testing Strategy

This document describes the test philosophy, architecture, and execution model for the Logan Tallman portfolio — an Angular 21 SPA hosted on Vercel.

---

## Philosophy

The goal of this suite is not coverage for its own sake. Every layer was added to answer a specific question that a lower layer cannot answer reliably:

- **Unit tests** answer: _does this component render correctly and respond to its inputs?_
- **E2E tests** answer: _does the full user journey work end-to-end in a real browser?_
- **Accessibility tests** answer: _can every user interact with this interface, not just the happy-path mouse user?_
- **Performance budgets** answer: _are we shipping bloat or a regression in Core Web Vitals?_
- **Resilience tests** answer: _what happens when things outside our control go wrong?_

Tests that blur these responsibilities are a liability, not an asset. A unit test that reaches into the DOM via heavy mocking is doing E2E work badly. An E2E test that asserts on implementation details is fragile and expensive to maintain.

---

## Test inventory

| Layer | Tool | Tests | Scope |
|---|---|---|---|
| Unit | Vitest + Angular TestBed | 66 | Component rendering, signal state, data binding |
| E2E — feature | Playwright | 120 (per browser) | Full user journeys, cross-browser |
| E2E — accessibility | axe-core/playwright | 45 (per browser) | WCAG 2.1 AA, keyboard nav, ARIA |
| E2E — resilience | Playwright | 34 (per browser) | Iframe failure, reduced motion, viewport extremes, chaos |
| Performance | Lighthouse CI | 1 run (2 audits) | Core Web Vitals, bundle size |
| **Total E2E** | Playwright × 3 browsers | **495** | Chromium, Firefox, Mobile Chrome |
| **Grand total** | — | **561** | — |

---

## Quick start

```bash
# Install dependencies
npm ci
npx playwright install --with-deps

# Unit tests (watch mode)
npm test

# Unit tests with coverage report
npm run test:coverage

# E2E tests (all browsers)
npm run e2e

# E2E tests (single browser, faster during development)
npx playwright test --project=chromium

# E2E tests (single spec)
npx playwright test e2e/accessibility.spec.ts --project=chromium

# Performance audit (requires a production build first)
npm run build && npm run lighthouse

# View Playwright HTML report
npm run e2e:report
```

---

## Layer 1 — Unit tests (Vitest)

**Location:** `src/**/*.spec.ts`

**Runner:** Vitest via `@angular/build:unit-test`. Angular 21's zoneless architecture means there is no `fakeAsync` / `tick` ceremony — signals trigger change detection synchronously, which makes unit tests simpler and faster.

**What is tested:**
- Component creation and lifecycle
- Signal-driven state (carousel index, expand/collapse, chat open/closed)
- Data binding — correct HTML rendered from component data
- DOM structure via `data-testid` attributes

**What is deliberately not tested at this layer:**
- User journeys that cross component boundaries → E2E
- Routing, scroll behaviour → E2E
- Accessibility tree → dedicated accessibility suite
- External API responses → no APIs exist in the production SPA

**Coverage thresholds** (enforced in CI via `vitest.config.ts`):

| Metric | Threshold | Current |
|---|---|---|
| Statements | 85% | 87.6% |
| Branches | 78% | 82.9% |
| Functions | 45% | 50% |
| Lines | 87% | 89.7% |

The function threshold is set conservatively at 45% because Angular's compiler emits many generated factory functions that are never invoked directly in unit tests — these inflate the denominator without representing untested authored logic.

---

## Layer 2 — E2E tests (Playwright)

**Location:** `e2e/*.spec.ts`

**Browsers:** Chromium, Firefox, Mobile Chrome (Pixel 5 viewport)

**Architecture — Page Object Model:**

All specs use a Page Object Model defined in `e2e/pages/`. The motivation is separation of concerns: specs express user intent (`dev.expandProject('logangpt')`), not selector implementation (`page.getByTestId('deep-dive-toggle-logangpt').click()`). When a `data-testid` changes, it is updated in one POM file, not hunted across seven specs.

```
e2e/
├── pages/
│   ├── BasePage.ts          goto(), scrollToSection(), freezeAnimations()
│   ├── HeaderPage.ts        brand logo, nav menu, resume link
│   ├── HeroPage.ts          headline, CTAs, badges, social links
│   ├── DevelopmentPage.ts   project cards, deep-dive panels, carousels
│   ├── ContactPage.ts       email, social rows, source link
│   ├── TestSuitesPage.ts    tool cards, docs links, carousel dots
│   ├── ChatPage.ts          FAB, panel, close/expand actions
│   └── index.ts             barrel export
├── navigation.spec.ts
├── hero.spec.ts
├── development.spec.ts
├── contact.spec.ts
├── mobile.spec.ts
├── test-suites.spec.ts
├── accessibility.spec.ts
└── resilience.spec.ts
```

**Adding a new test:**

```typescript
import { test, expect } from '@playwright/test';
import { DevelopmentPage } from './pages';

test('my new scenario', async ({ page }) => {
  const dev = new DevelopmentPage(page);
  await dev.goto();
  await dev.scrollToSection();
  await dev.expandProject('logangpt');
  await expect(dev.deepDivePanel('logangpt')).toBeVisible();
});
```

**Adding a new POM method:**

Add the method to the relevant class in `e2e/pages/`. Keep properties as `Locator` declarations in the constructor; expose complex multi-step interactions as `async` methods.

---

## Layer 3 — Accessibility tests (axe-core/playwright)

**Location:** `e2e/accessibility.spec.ts`

**Standard:** WCAG 2.1 AA (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` rule tags)

**Groups:**

| Group | Tests | What it catches |
|---|---|---|
| axe-core audits | 8 | Colour contrast, landmark roles, ARIA violations — per section |
| Heading hierarchy | 5 | Single H1, no skipped levels (H1→H2→H3) |
| ARIA attributes | 17 | `aria-label`, `aria-expanded`, `aria-controls`, `role`, `aria-modal` |
| Keyboard navigation | 11 | Tab order, Enter/Space activation, Escape to dismiss |
| Resilience | 4 | ARIA state consistency after rapid interactions, animation-frozen audits |

**Key decisions:**

- axe audits run **per section** (not full-page) so failures are localised. A colour contrast failure in the contact footer does not block the hero section audit.
- Animation-freezing CSS is injected before each axe audit via `freezeAnimations()` to prevent mid-opacity crossfade states from generating false-positive contrast failures.
- Keyboard tests assert on `data-testid` focus targets rather than raw `:focus` selectors, which are fragile across browser focus models.

**Real bugs found during suite development:**

- `aria-label="View test suites"` on the "View My Work" button (label/visible-text mismatch)
- `.social-url` colour contrast 2.34:1 on `#111827` background (needed 4.5:1)
- `.footer-note` link with no `text-decoration` (failed `link-in-text-block` rule)
- Brand logo `<a>` without `tabindex` or `href` — not reachable by keyboard

---

## Layer 4 — Performance budgets

**Two enforcement points:**

### Angular build budgets (`angular.json`)

Fail the build before tests even run:

| Budget | Warning | Error | Current |
|---|---|---|---|
| Initial bundle | 600 kB | 750 kB | 547 kB |
| Any component style | 8 kB | 10 kB | 7.97 kB max |

### Lighthouse CI (`.lighthouserc.json`)

Runs against the production build (`staticDistDir`), desktop preset, 2 audit passes:

| Assertion | Threshold | Severity | Current |
|---|---|---|---|
| Performance score | ≥ 80 | error | 85–86 |
| Accessibility score | ≥ 95 | error | 97 |
| Best Practices score | ≥ 90 | error | 100 |
| SEO score | ≥ 90 | error | 91 |
| Largest Contentful Paint | ≤ 4 000 ms | error | ~2 500 ms |
| Cumulative Layout Shift | ≤ 0.1 | error | 0 |
| First Contentful Paint | ≤ 2 000 ms | warn | ~787 ms |
| Total Blocking Time | ≤ 300 ms | warn | ~20 ms |
| Speed Index | ≤ 2 500 ms | warn | ~800 ms |

**Why desktop preset:** this is a developer portfolio viewed primarily on desktop. Mobile Lighthouse applies 4× CPU throttling, which produces LCP values of 10–14 s on a local static file server — noise that would require thresholds too loose to be meaningful.

**Deployment is blocked** if any `error`-severity assertion fails.

---

## Layer 5 — Resilience / chaos tests

**Location:** `e2e/resilience.spec.ts`

**Technique:** Playwright's `page.route()` for network interception and `page.emulateMedia()` for environment simulation — no mock servers, no test doubles. Failures are real infrastructure conditions.

| Group | Scenario | Technique |
|---|---|---|
| Iframe failure | Block `logangptapp.vercel.app` | `route.abort()` |
| Reduced motion | `prefers-reduced-motion: reduce` | `page.emulateMedia({ reducedMotion: 'reduce' })` |
| Viewport: 320 px | iPhone SE minimum width | `test.use({ viewport })` |
| Viewport: 2560 px | 4K / ultrawide | `test.use({ viewport })` |
| Rapid interactions | Chat FAB spam, toggle spam, multi-project expand | Tight click loops |
| Broken images | Abort all `*.jpg` requests | `route.abort()` on glob pattern |

**What the iframe tests prove:** if LoganGPT (a separate Vercel deployment) is down, the portfolio does not crash, display broken UI, or throw uncaught JS errors. The chat button still opens and closes correctly. The rest of the page is unaffected.

**What the broken-image tests prove:** the carousel does not collapse to zero height, overflow the viewport, or lose navigation controls when all project screenshots fail to load.

---

## CI/CD gate

All four test jobs must pass before Vercel accepts a deployment:

```
push to main
    │
    ├── unit-tests       npm run test:coverage
    │     └── coverage thresholds enforced (vitest.config.ts)
    │     └── HTML + lcov report uploaded as artifact (14 days)
    │
    ├── e2e              npm run e2e
    │     └── Chromium, Firefox, Mobile Chrome
    │     └── HTML report uploaded as artifact (14 days)
    │
    ├── performance      npm run build && npm run lighthouse
    │     └── Angular build budgets enforced at build time
    │     └── Lighthouse CI assertions enforced post-build
    │     └── HTML report uploaded as artifact (14 days)
    │
    └── deploy (only on main push, needs all three above)
          └── vercel build --prod && vercel deploy --prebuilt
```

PRs run all three test jobs but do not deploy.

---

## Known tradeoffs

**Visual regression testing is not implemented.** Screenshot diffing (Percy, Chromatic, Playwright snapshots) would catch unintended CSS changes but requires a baseline-management workflow and is noisy under font-rendering differences across OS/browser combinations. The axe-core colour contrast audits catch the subset of visual regressions that matter most for quality.

**No JUnit XML output.** GitHub's test summary natively reads Playwright's `github` reporter (already configured). JUnit XML would add CI dashboard integration but duplicates what the HTML artifact already provides for this project's scale.

**Function coverage at 50%.** Angular's compiler generates many internal factory and initialisation functions that are unreachable in unit tests. The 45% threshold is deliberately set below the measured 50% to give room for new components before the gate trips. The statements and lines metrics (87–88%) are the meaningful signal here.

**Lighthouse runs against `staticDistDir`, not a live URL.** This means CDN edge caching, Vercel's compression, and real network latency are not measured. The trade-off is determinism: a live-URL audit introduces network variance that would require higher run counts and wider thresholds. Build-time performance (bundle size, LCP from served files) is what the budgets enforce.
