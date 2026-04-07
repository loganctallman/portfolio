import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule, ExternalLink, FlaskConical } from 'lucide-angular';

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
  images: string[]; // paths relative to public root
}

@Component({
  selector: 'app-test-suites',
  imports: [MatCardModule, MatChipsModule, MatButtonModule, LucideAngularModule],
  templateUrl: './test-suites.html',
  styleUrl: './test-suites.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestSuitesComponent implements OnInit {
  readonly ExternalLink = ExternalLink;
  readonly FlaskConical = FlaskConical;

  private destroyRef = inject(DestroyRef);

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
      name: 'JUnit 5',
      category: 'Unit / Integration',
      color: '#C71A36',
      accentColor: 'rgba(199,26,54,0.12)',
      description:
        'Java unit and integration tests using JUnit 5 with Mockito for mock injection. Covers service layer logic, repository interactions, and edge cases.',
      highlights: ['Mockito Mocks', 'Parameterized', 'Spring Boot', 'Coverage Reports'],
      screenshotAlt: 'JUnit 5 test results screenshot',
      link: 'https://junit.org',
      images: [
        'junit%205/junit1.jpg',
        'junit%205/junit2.jpg',
        'junit%205/junit3.jpg',
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

  // One signal per tool: 0 = placeholder, 1..n = images[index-1]
  slideIndices: WritableSignal<number>[] = [];

  ngOnInit(): void {
    this.slideIndices = this.tools.map(() => signal(0));

    // Stagger each card's start time so they don't all flip simultaneously
    this.tools.forEach((tool, i) => {
      const total = 1 + tool.images.length;
      const delay = i * 600; // 600ms stagger between cards

      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          this.slideIndices[i].update(curr => (curr + 1) % total);
        }, 5000);

        this.destroyRef.onDestroy(() => clearInterval(interval));
      }, delay);

      this.destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }

  getSlideIndex(toolIndex: number): number {
    return this.slideIndices[toolIndex]?.() ?? 0;
  }

  // Total slides = 1 placeholder + images
  totalSlides(tool: TestTool): number {
    return 1 + tool.images.length;
  }

  goToSlide(toolIndex: number, slideIndex: number): void {
    this.slideIndices[toolIndex]?.set(slideIndex);
  }
}
