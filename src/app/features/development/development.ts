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
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { LucideAngularModule, ExternalLink, Github, ChevronDown, FlaskConical, Code2 } from 'lucide-angular';

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
export class DevelopmentComponent implements OnInit {
  readonly ExternalLink = ExternalLink;
  readonly Github       = Github;
  readonly ChevronDown  = ChevronDown;
  readonly FlaskConical = FlaskConical;
  readonly Code2        = Code2;

  private destroyRef = inject(DestroyRef);

  expandedProject = signal<string | null>(null);

  readonly projects: Project[] = [
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
          'Full testing pyramid from isolated service mocks to full E2E chat flow validation.',
        layers: [
          {
            label: 'Unit Tests (Jasmine)',
            detail: 'ChatService and StateService tested with mocked HttpClient. 90%+ coverage on business logic.',
          },
          {
            label: 'Component Tests (Cypress)',
            detail: 'ChatInputComponent and MessageListComponent tested in isolation with mount().',
          },
          {
            label: 'E2E Tests (Playwright)',
            detail: 'Full user journey: open chat → send message → receive streamed response → verify history persists.',
          },
          {
            label: 'API Contract (Postman)',
            detail: 'Newman collection validates OpenAI proxy endpoint schema, error handling, and rate-limit responses.',
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
      ],
      testingStrategy: {
        summary: 'This math skills testing tool is itself "thoroughly tested", built for reliability and backed by a comprehensive three-tier testing strategy.',
        layers: [
          {
            label: 'Unit & Integration Tests (JUnit 5)',
            detail: 'Maintained a strict testing standard throughout development, ensuring every feature component includes a dedicated spec file with at least 3 test cases for 100% logic coverage.',
          },
          {
            label: 'Load & Performance Testing (JMeter)',
            detail: 'Validated system stability under a load of 500 concurrent users with a 60s ramp-up. Achieved a p99 latency < 300ms, verified through both local and CI-integrated stress tests.',
          },
          {
            label: 'Automated E2E Regression Suite (Playwright)',
            detail: 'Architected a robust CI/CD pipeline using GitHub Actions and Playwright, executing 60 automated E2E tests to validate critical math logic and UI workflows across multiple browser engines.',
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
      testingStrategy: {
        summary: 'Every component is independently testable by design, with data-testid hooks on all interactive elements.',
        layers: [
          {
            label: 'Unit Tests (Vitest)',
            detail: 'Each feature component has a spec file with ≥3 tests covering rendering, interaction, and data binding.',
          },
          {
            label: 'E2E Tests (Playwright)',
            detail: 'Smoke tests verify nav scroll, chat toggle, PDF viewer load, and contact form email trigger.',
          },
          {
            label: 'CI Workflow (GitHub Actions)',
            detail: 'Lint → build → unit tests → E2E on every PR. Deployment blocked on any failure.',
          },
        ],
      },
    },
  ];

  // One signal per project: 0 = placeholder, 1..n = images[index-1]
  slideIndices: WritableSignal<number>[] = [];

  ngOnInit(): void {
    this.slideIndices = this.projects.map(() => signal(0));

    this.projects.forEach((project, i) => {
      if (!project.images?.length) return; // no images = static placeholder

      const total = 1 + project.images.length;
      const delay = i * 800;

      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          this.slideIndices[i].update(curr => (curr + 1) % total);
        }, 5000);
        this.destroyRef.onDestroy(() => clearInterval(interval));
      }, delay);

      this.destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }

  getSlideIndex(projectIndex: number): number {
    return this.slideIndices[projectIndex]?.() ?? 0;
  }

  totalSlides(project: Project): number {
    return 1 + (project.images?.length ?? 0);
  }

  goToSlide(projectIndex: number, slideIndex: number): void {
    this.slideIndices[projectIndex]?.set(slideIndex);
  }

  toggleExpand(id: string): void {
    this.expandedProject.update(curr => (curr === id ? null : id));
  }

  isExpanded(id: string): boolean {
    return this.expandedProject() === id;
  }
}
