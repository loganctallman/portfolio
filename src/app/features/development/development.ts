import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { LucideAngularModule, ExternalLink, Github, ChevronDown, FlaskConical, Code2, ChevronLeft, ChevronRight } from 'lucide-angular';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
  screenshotAlt: string;
  images?: string[]; // real screenshots; omit to show placeholder only
  testingStrategy: {
    summary: string;
    layers: { label: string; detail: string }[];
  };
}

@Component({
  selector: 'app-development',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    LucideAngularModule,
  ],
  templateUrl: './development.html',
  styleUrl: './development.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent {
  readonly ExternalLink  = ExternalLink;
  readonly Github        = Github;
  readonly ChevronDown   = ChevronDown;
  readonly FlaskConical  = FlaskConical;
  readonly Code2         = Code2;
  readonly ChevronLeft   = ChevronLeft;
  readonly ChevronRight  = ChevronRight;

  expandedProject = signal<string | null>(null);

  readonly projects: Project[] = [
    {
      id: 'mytop50',
      title: 'My Top 50',
      subtitle: 'Svelte PWA · Film Tracker',
      description:
        'My Top 50 is a client-side Svelte PWA that tracks your 50 favorite films and alerts you when they hit streaming — with localStorage as the entire data layer and a Vercel serverless proxy bridging the TMDB API. The app\'s core logic — a 50-film cap with TMDB ID deduplication, a 24-hour TTL cache system, and a notification engine that crosses three independent localStorage keys — is a set of pure, deterministic functions engineered for deep test coverage across both online and offline modes.',
      techStack: ['Svelte', 'Vite', 'PWA', 'Vitest', 'Playwright', 'TMDB API', 'Vercel', 'GitHub Actions'],
      liveUrl: 'https://top50films.vercel.app',
      repoUrl: 'https://github.com/loganctallman/Top50Films',
      screenshotAlt: 'My Top 50 application screenshot',
      images: [
        'mytop50/1.jpg',
        'mytop50/2.jpg',
        'mytop50/3.jpg',
        'mytop50/4.jpg',
        'mytop50/5.jpg',
        'mytop50/6.jpg',
        'mytop50/7.jpg',
        'mytop50/8.jpg',
        'mytop50/9.jpg',
      ],
      testingStrategy: {
        summary:
          '311 tests across Vitest (199) and Playwright (112) validate every layer of the stack — from pure business-logic functions to full user journeys — with CI blocking deployment and Claude-powered QA agents analysing every failure and PR.',
        layers: [
          {
            label: 'Unit & Logic Tests (Vitest — 199)',
            detail: 'The suite targets the app\'s deterministic core: the 50-film cap with TMDB ID deduplication, a 24-hour TTL cache invalidation system, and the notification match engine that crosses three independent localStorage keys all have dedicated spec files with injected mock storage for 100% branch coverage. API proxy routes (genre browsing, search, providers, person lookup, suggestions) and Svelte component rendering — including streaming badges, modal lifecycle, and add/remove events — complete the unit layer.',
          },
          {
            label: 'E2E Tests (Playwright — 112)',
            detail: 'Full user lifecycle coverage from PWA onboarding through film discovery (genre browse, text search, director/actor mode, streaming filter), list management, streaming notifications, settings and provider persistence, and service worker cache behaviour — validating both fresh/stale cache logic and a full offline degradation path across five dedicated specs.',
          },
          {
            label: 'Accessibility & Chaos Testing',
            detail: 'axe-playwright runs WCAG 2.1 AA audits across every major page with animations frozen to prevent mid-opacity false positives. Chaos tests validate graceful degradation against 500s from all API endpoints, localStorage quota exhaustion, malformed TMDB responses, and rapid route navigation — the app must never crash regardless of infrastructure conditions.',
          },
          {
            label: 'CI/CD Gate + AI QA Agents (GitHub Actions)',
            detail: 'Unit and E2E jobs gate every push and PR; Vercel deployment is blocked until both pass. Claude-powered agents auto-post root-cause analysis as GitHub issues on CI failures, and leave severity-rated coverage gap reviews (CRITICAL / MODERATE / LOW) as PR comments whenever source, API, or test files change.',
          },
        ],
      },
    },
    {
      id: 'logangpt',
      title: 'LoganGPT',
      subtitle: 'AI Chat Assistant',
      description:
        'A production-ready AI chat application built with Next.js and the OpenAI API. Features streaming responses, conversation starting prompts, and a sleek, animated UI.',
      techStack: ['Next.js', 'TypeScript', 'OpenAI API', 'Vercel', 'SCSS'],
      liveUrl: 'https://logangptapp.vercel.app',
      repoUrl: 'https://github.com/loganctallman/logangpt',
      screenshotAlt: 'LoganGPT application screenshot',
      images: [
        'logangpt/lgpt.jpg',
        'logangpt/lgpt2.jpg',
      ],
      testingStrategy: {
        summary:
          'Every push to the repository must pass 139 tests across three suites before Vercel will accept a deployment.',
        layers: [
          {
            label: 'Unit Tests (Vitest - 55)',
            detail: 'Vitest unit tests cover the core chat logic, API proxy handling, and state management. All 55 must pass on every push.',
          },
          {
            label: 'API Integration Tests (Vitest - 14)',
            detail: 'Route handlers for /api/health (3 tests) and /api/chat (11 tests) are called directly with fs, ai, and @ai-sdk/openai mocked — no server required, full suite runs in under a second. Covers response schema, SSE content-type and Vercel AI data-stream headers, multi-turn message handling, conversation pruning to ≤10 messages, rate limiting (20 req limit, 429 on the 21st, independent IP tracking), and error handling including x-real-ip header fallback.',
          },
          {
            label: 'E2E Tests (Playwright — 70)',
            detail: 'Full user journey coverage: open chat → send message → receive streamed response → verify conversation history persists across sessions.',
          },
          {
            label: 'CI/CD Gate (GitHub Actions → Vercel)',
            detail: 'GitHub Actions runs the full test suite on every push. Deployment to Vercel is blocked unless all 139 tests pass — no exceptions.',
          },
        ],
      },
    },
    {
      id: 'math-trainer',
      title: 'Math Trainer',
      subtitle: 'Next.js Math Training App',
      description:
        'A responsive Next.js application featuring dynamic equation generation and client-side state management. It leverages custom parameters for arithmetic challenges and utilizes local storage for low-latency session history and performance analytics.',
      techStack: ['Next.js', 'React', 'Tailwind CSS', 'Lucide React', 'Vercel', 'Playwright', 'JUnit 5', 'JMeter'],
      liveUrl: 'https://fastmathhelper.vercel.app',
      repoUrl: 'https://github.com/loganctallman/mathapp',
      screenshotAlt: 'Math Trainer application screenshot',
      images: [
        'mathtrainer/mathtrainer.jpg',
        'mathtrainer/mt1.jpg',
        'mathtrainer/mt2.jpg',
        'mathtrainer/mt3.jpg',
        'mathtrainer/mt4.jpg',
        'mathtrainer/mt5.jpg',
        'mathtrainer/mt6.jpg',
      ],
      testingStrategy: {
        summary: 'This math skills testing tool is itself "thoroughly tested", built for reliability and backed by a comprehensive three-tier testing strategy with Lint → build → unit tests → E2E on every PR.',
        layers: [
          {
            label: 'Unit & Integration Tests (Vitest - 72)',
            detail: 'Maintained a strict testing standard throughout development, ensuring every feature component includes a dedicated spec file with ≥3 test cases for 100% logic coverage.',
          },
          {
            label: 'Load & Performance Testing (JMeter)',
            detail: 'Validated system stability under a load of 500 concurrent users with a 60s ramp-up. Achieved a p99 latency < 300ms, verified through both local and CI-integrated stress tests.',
          },
          {
            label: 'Automated E2E Regression Suite (Playwright - 54)',
            detail: 'Architected a robust CI/CD pipeline using GitHub Actions, Vitest and Playwright, executing 72 Unit tests and 54 automated E2E tests to validate critical math logic and UI workflows across multiple browser engines.',
          },
        ],
      },
    },
    {
      id: 'xrshots',
      title: 'XR Shots',
      subtitle: 'Lead QA Engineer · Extreme Reach',
      description:
        'XR Shots is a high-performance Digital Asset Management platform built on a cloud-native Content Engine that automates video transcoding and frame extraction. Its core features a metadata-driven relational database mapping complex industry credits, an Elasticsearch-style discovery engine spanning half a million assets, and an API-first front-end delivered via global CDN for low-latency, high-resolution video playback.',
      techStack: ['TestRail', 'Jira', 'Playwright', 'Cypress', 'Selenium', 'JMeter', 'Agile', 'Waterfall'],
      liveUrl: 'https://products.shots.net/vault',
      repoUrl: 'https://github.com/loganctallman',
      screenshotAlt: 'XR Shots DAM platform screenshot',
      images: [
        'shots/shots1.jpg',
        'shots/shots2.jpg',
        'shots/shots3.jpg',
        'shots/shots4.jpg',
      ],
      testingStrategy: {
        summary:
          'Led a 16-person cross-functional QA team across Agile and Waterfall workflows, introducing structured automation and reporting to reduce regression risk at scale.',
        layers: [
          {
            label: 'Team Leadership & Process',
            detail: 'Prioritized testing backlogs and managed resource allocation across sprint cycles. Designed a ticketing workflow integrated with TestRail and Jira to improve defect traceability and accelerate resolution.',
          },
          {
            label: 'Automation (Playwright / Cypress / Selenium)',
            detail: 'Developed SOPs and introduced Playwright automation for repeatable E2E test suites, significantly reducing manual regression effort and increasing repeatable coverage across releases.',
          },
          {
            label: 'Performance & Load Testing (JMeter)',
            detail: 'Executed load and stress tests against the CDN-backed video delivery pipeline to validate stability under high-concurrency asset requests.',
          },
          {
            label: 'AI-Assisted Credit Ingestion',
            detail: 'Architected logic and training inputs for an AI-driven credit ingestion tool to normalize multiple file layouts and accurately map credit/name values to the production database.',
          },
          {
            label: 'Stakeholder Reporting',
            detail: 'Prepared concise biweekly QA reports highlighting critical regressions, release risks, and recommended actions, coordinating with DB managers and engineers to deploy urgent live fixes.',
          },
        ],
      },
    },
    {
      id: 'sourcecreative',
      title: 'Source Creative',
      subtitle: 'DB Manager & Lead QA · Source Creative',
      description:
        'Source Creative is a cloud-native Digital Asset Management platform utilizing an automated media pipeline for real-time video transcoding and high-resolution frame extraction. It relies on a highly indexed relational database to map complex industry credits, paired with a search-optimized backend and global CDN for seamless, high-bandwidth content delivery to agency clients.',
      techStack: ['MySQL', 'Manual Testing', 'Regression Testing', 'Smoke Testing', '4D Database', 'QC'],
      liveUrl: 'https://www.sourcecreative.com/spotlight',
      repoUrl: 'https://github.com/loganctallman',
      screenshotAlt: 'Source Creative DAM platform screenshot',
      images: [
        'source/source1.jpg',
        'source/source2.jpg',
        'source/source3.jpg',
        'source/source4.jpg',
      ],
      testingStrategy: {
        summary:
          'Maintained product stability across a bi-monthly release cadence by owning QA from bug triage through post-merger data migration validation.',
        layers: [
          {
            label: 'Database QC & Management',
            detail: 'Managed and QC\'d a large-scale multimedia research database handling high-volume daily user submissions and multi-platform integrations, ensuring data integrity across every release.',
          },
          {
            label: 'Regression & Smoke Testing',
            detail: 'Executed structured regression and smoke testing suites to support a reliable bi-monthly release cadence and catch regressions before they reached production.',
          },
          {
            label: 'Bug Triage & Root Cause Analysis',
            detail: 'Investigated customer and client bug reports, synthesized findings, assessed severity and priority, and coordinated fixes between client-facing teams and development.',
          },
          {
            label: 'Post-Merger Database Migration',
            detail: 'Led QC efforts to integrate a legacy 4D MySQL client database into the web platform, validating full data parity and preventing regressions across the merged dataset.',
          },
          {
            label: 'Product Collaboration',
            detail: 'Collaborated with product and UI teams to scope and deliver client-requested enhancements, improving usability and product value across platform iterations.',
          },
        ],
      },
    },
    {
      id: 'portfolio',
      title: 'This Portfolio',
      subtitle: 'Angular Showcase',
      description:
        'A high-performance single-page portfolio demonstrating clean Angular architecture, OnPush change detection, SCSS design systems, and built-in testability.',
      techStack: ['Angular 21', 'SCSS', 'Angular Material', 'Lucide', 'Vercel'],
      liveUrl: 'https://logansportfolio.vercel.app',
      repoUrl: 'https://github.com/loganctallman/portfolio',
      screenshotAlt: 'Portfolio app screenshot',
      images: [
        'circ.png',
        'circbot.png',
      ],
      testingStrategy: {
        summary: '561 tests across 5 layers — unit, E2E, accessibility, performance, and resilience — gate every deployment. The full strategy is documented in TESTING.md on GitHub.',
        layers: [
          {
            label: 'Unit Tests (Vitest — 66)',
            detail: 'Every feature component has a dedicated spec file covering rendering, signal-driven state, and data binding. Coverage thresholds are enforced in CI: 85% statements, 78% branches, 87% lines. Angular\'s zoneless architecture means no fakeAsync ceremony — signals trigger change detection synchronously, keeping tests fast and straightforward.',
          },
          {
            label: 'E2E Tests (Playwright — 120 tests × 3 browsers)',
            detail: 'Full user journeys across Chromium, Firefox, and Mobile Chrome via a Page Object Model in e2e/pages/. POMs separate intent from selector implementation — specs read as dev.expandProject(\'logangpt\') rather than raw locator chains. When a data-testid changes, it\'s updated in one POM file, not hunted across seven specs.',
          },
          {
            label: 'Accessibility (axe-core — 45 tests × 3 browsers)',
            detail: 'WCAG 2.1 AA audits scoped per section so failures are localised, with animations frozen before each scan to eliminate mid-opacity false positives. Additional tests cover heading hierarchy (single H1, no skipped levels), ARIA attributes (aria-expanded, aria-controls, aria-modal), and full keyboard navigation — Tab order, Enter/Space activation, Escape to dismiss.',
          },
          {
            label: 'Performance Budgets (Lighthouse CI + Angular build budgets)',
            detail: 'Angular build budgets fail the build if the initial bundle exceeds 750 kB (current: 547 kB). Lighthouse CI then asserts a ≥80 performance score, ≥95 accessibility score, LCP ≤ 4 s, and CLS ≤ 0.1 against the production build — deployment is blocked on any error-severity failure.',
          },
          {
            label: 'Resilience / Chaos (Playwright — 34 tests × 3 browsers)',
            detail: 'Six scenario groups exercise conditions outside the happy path: LoganGPT iframe origin blocked via route.abort() (the portfolio must never crash if a dependent service is down), prefers-reduced-motion media emulation, viewport extremes at 320 px and 2560 px, rapid FAB and deep-dive toggle spam, and all carousel image requests aborted to prove the layout never collapses.',
          },
          {
            label: 'CI/CD Gate (GitHub Actions)',
            detail: 'Three parallel jobs — unit-tests, e2e, and performance — must all pass before the deploy job runs. PRs execute the full suite but never deploy. Playwright browsers are cached by package-lock hash so re-runs skip the install step. Test artifacts (coverage HTML, Playwright report, Lighthouse report) are retained for 14 days.',
          },
        ],
      },
    },
  ];

  // One signal per project: index into project.images[]
  slideIndices: WritableSignal<number>[] = this.projects.map(() => signal(0));

  getSlideIndex(projectIndex: number): number {
    return this.slideIndices[projectIndex]?.() ?? 0;
  }

  totalSlides(project: Project): number {
    return project.images?.length ?? 0;
  }

  goToSlide(projectIndex: number, slideIndex: number): void {
    this.slideIndices[projectIndex]?.set(slideIndex);
  }

  nextSlide(projectIndex: number): void {
    const total = this.projects[projectIndex].images?.length ?? 0;
    if (total < 2) return;
    this.slideIndices[projectIndex]?.update(curr => (curr + 1) % total);
  }

  prevSlide(projectIndex: number): void {
    const total = this.projects[projectIndex].images?.length ?? 0;
    if (total < 2) return;
    this.slideIndices[projectIndex]?.update(curr => (curr - 1 + total) % total);
  }

  toggleExpand(id: string): void {
    this.expandedProject.update(curr => (curr === id ? null : id));
  }

  isExpanded(id: string): boolean {
    return this.expandedProject() === id;
  }
}
