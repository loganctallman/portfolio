import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule, ExternalLink, FlaskConical, ChevronLeft, ChevronRight } from 'lucide-angular';

export interface TestTool {
  id: string;
  name: string;
  category: string;
  color: string;
  accentColor: string;
  description: string;
  highlights: string[];
  screenshotAlt: string;
  link: string;
  links?: { label: string; url: string; color: string }[];
  images: string[]; // paths relative to public root
}

@Component({
  selector: 'app-test-suites',
  imports: [MatCardModule, MatChipsModule, MatButtonModule, LucideAngularModule],
  templateUrl: './test-suites.html',
  styleUrl: './test-suites.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestSuitesComponent {
  readonly ExternalLink  = ExternalLink;
  readonly FlaskConical  = FlaskConical;
  readonly ChevronLeft   = ChevronLeft;
  readonly ChevronRight  = ChevronRight;

  readonly tools: TestTool[] = [
    {
      id: 'playwright',
      name: 'Playwright',
      category: 'E2E Testing',
      color: '#2EAD33',
      accentColor: 'rgba(46,173,51,0.12)',
      description:
        'Cross-browser end-to-end test suite covering critical user journeys. Implements Page Object Model with auto-waiting assertions and visual regression snapshots.',
      highlights: ['Cross-browser', 'Visual Regression', 'POM Pattern', 'CI Integration'],
      screenshotAlt: 'Playwright test run results screenshot',
      link: 'https://playwright.dev',
      images: [
        'playwright/playwright1.jpg',
        'playwright/playwright2.jpg',
        'playwright/playwright3.jpg',
        'playwright/playwright4.jpg',
        'playwright/playwright5.jpg',
        'playwright/playwright6.jpg',
        'playwright/playwright7.jpg',
        'playwright/playwright8.jpg',
      ],
    },
    {
      id: 'cypress',
      name: 'Cypress',
      category: 'E2E + Component',
      color: '#04C38E',
      accentColor: 'rgba(4,195,142,0.12)',
      description:
        'Comprehensive Cypress suite for Angular apps with real-time browser interaction, custom commands, and intercept stubs for API mocking.',
      highlights: ['Angular Support', 'Custom Commands', 'Network Intercept', 'Component Tests'],
      screenshotAlt: 'Cypress test suite screenshot',
      link: 'https://cypress.io',
      images: [
        'cypress/cypress1.jpg',
        'cypress/cypress2.jpg',
        'cypress/cypress3.jpg',
        'cypress/cypress4.jpg',
        'cypress/cypress5.jpg',
        'cypress/cypress6.jpg',
      ],
    },
    {
      id: 'junit',
      name: 'JUnit 5 / Vitest',
      category: 'Unit / Integration',
      color: '#C71A36',
      accentColor: 'rgba(199,26,54,0.12)',
      description:
        'Unit and integration testing across Java and TypeScript stacks. JUnit 5 with Mockito covers Spring Boot service logic and repository interactions; Vitest handles fast, ESM-native component and utility testing in modern frontend projects.',
      highlights: ['Mockito Mocks', 'Parameterized Tests', 'Spring Boot', 'ESM-Native', 'Component Testing', 'Coverage Reports'],
      screenshotAlt: 'JUnit 5 and Vitest test results screenshot',
      link: 'https://junit.org',
      links: [
        { label: 'JUnit 5 Docs', url: 'https://junit.org/junit5/docs/current/user-guide/', color: '#C71A36' },
        { label: 'Vitest Docs',  url: 'https://vitest.dev/guide/',                         color: '#729B1B' },
      ],
      images: [
        'junit%205/junit1.jpg',
        'junit%205/junit2.jpg',
        'junit%205/junit3.jpg',
        'junit%205/junit4.jpg',
        'junit%205/junit5.jpg',
      ],
    },
    {
      id: 'postman',
      name: 'Postman / Newman',
      category: 'API Testing',
      color: '#FF6C37',
      accentColor: 'rgba(255,108,55,0.12)',
      description:
        'REST and GraphQL API test collections with environment-based configuration, pre-request scripts, and automated CI runs via Newman CLI.',
      highlights: ['REST & GraphQL', 'Newman CLI', 'Environments', 'Schema Validation'],
      screenshotAlt: 'Postman collection run screenshot',
      link: 'https://postman.com',
      images: [
        'postman/postman1.jpg',
        'postman/postman2.jpg',
        'postman/postman3.jpg',
        'postman/postman4.jpg',
      ],
    },
    {
      id: 'jmeter',
      name: 'JMeter',
      category: 'Performance',
      color: '#D22128',
      accentColor: 'rgba(210,33,40,0.12)',
      description:
        'Load and stress test plans simulating concurrent users against API endpoints. Generates HTML reports with throughput, latency percentiles, and error rates.',
      highlights: ['Load Testing', 'Stress Tests', 'HTML Reports', 'Thread Groups'],
      screenshotAlt: 'JMeter performance report screenshot',
      link: 'https://jmeter.apache.org',
      images: [
        'jmeter/jmeter1.jpg',
        'jmeter/jmeter2.jpg',
      ],
    },
    {
      id: 'github-actions',
      name: 'GitHub Actions',
      category: 'CI/CD',
      color: '#2088FF',
      accentColor: 'rgba(32,136,255,0.12)',
      description:
        'Multi-stage CI/CD workflows: lint → unit test → E2E → deploy. Matrix builds across Node versions with artifact caching and test result publishing.',
      highlights: ['Matrix Builds', 'Artifact Cache', 'Auto Deploy', 'PR Checks'],
      screenshotAlt: 'GitHub Actions workflow screenshot',
      link: 'https://github.com/features/actions',
      images: [
        'githubactions/git1.jpg',
        'githubactions/git2.jpg',
        'githubactions/git3.jpg',
        'githubactions/git4.jpg',
        'githubactions/git5.jpg',
        'githubactions/git6.jpg',
        'githubactions/git7.jpg',
        'githubactions/git8.jpg',
      ],
    },
  ];

  // One signal per tool: index into tool.images[]
  slideIndices: WritableSignal<number>[] = this.tools.map(() => signal(0));

  zoomedImage = signal<string | null>(null);

  getSlideIndex(toolIndex: number): number {
    return this.slideIndices[toolIndex]?.() ?? 0;
  }

  totalSlides(tool: TestTool): number {
    return tool.images.length;
  }

  goToSlide(toolIndex: number, slideIndex: number): void {
    this.slideIndices[toolIndex]?.set(slideIndex);
  }

  openZoom(img: string): void  { this.zoomedImage.set(img); }
  closeZoom(): void            { this.zoomedImage.set(null); }

  nextSlide(toolIndex: number): void {
    const total = this.tools[toolIndex].images.length;
    if (total < 2) return;
    this.slideIndices[toolIndex]?.update(curr => (curr + 1) % total);
  }

  prevSlide(toolIndex: number): void {
    const total = this.tools[toolIndex].images.length;
    if (total < 2) return;
    this.slideIndices[toolIndex]?.update(curr => (curr - 1 + total) % total);
  }
}
