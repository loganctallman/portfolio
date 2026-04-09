import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import {
  LucideAngularModule,
  Download,
  ArrowDown,
  Sparkles,
  Github,
  Linkedin,
} from 'lucide-angular';

@Component({
  selector: 'app-hero',
  imports: [MatButtonModule, MatChipsModule, LucideAngularModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit {
  readonly Download  = Download;
  readonly ArrowDown = ArrowDown;
  readonly Sparkles  = Sparkles;
  readonly Github    = Github;
  readonly Linkedin  = Linkedin;

  private destroyRef = inject(DestroyRef);

  readonly tags = [
    'QA Automation',
    'Playwright',
    'Cypress',
    'Angular',
    'CI/CD',
    'API Testing',
    'Performance',
  ];

  // ─── Themed badge skill lists ──────────────────────────────────────────────
  private readonly topSkills = [
    '500+ Tests Written',
    'Playwright',
    'Cypress',
    'Selenium',
    'JUnit',
    'Postman',
    'JMeter',
    'TestRail',
    'End-to-End Testing',
    'Regression Testing',
    'Smoke Testing',
    'Performance Testing',
    'UI Testing',
    'Test Planning',
    'Defect Triage',
    'QA Automation',
  ];

  private readonly bottomSkills = [
    'CI/CD Pipelines',
    'QA Team Leader',
    'Automation Architect',
    'Agile Methodology',
    'Waterfall Methodology',
    'AI-driven Tools',
    'Angular',
    'React',
    'Visual Studio Code',
    'Java',
    'JavaScript',
    'MySQL',
    'Database Management',
    'Digital Asset Management',
    'Sprint Reporting',
    'AWS',
  ];

  topBadge  = signal(this.topSkills[0]);
  bottomBadge = signal(this.bottomSkills[0]);
  // Flip signals force Angular to recreate the DOM node, triggering CSS entry animation
  topFlip    = signal(false);
  bottomFlip = signal(false);

  // ─── Profile image carousel ───────────────────────────────────────────────
  readonly captions = [
    'Human Developer. Curious & Confident',
    'Cyborg SDET. Precision Engineered',
  ] as const;

  activeImage    = signal<0 | 1>(0);
  isFlipped      = signal(false);
  carouselDone   = signal(false);

  private carouselTimeout: ReturnType<typeof setTimeout> | null = null;

  private runCarousel(): void {
    this.activeImage.set(0);
    this.carouselDone.set(false);
    if (this.carouselTimeout) clearTimeout(this.carouselTimeout);
    this.carouselTimeout = setTimeout(() => {
      this.activeImage.set(1);
      this.carouselDone.set(true);
      this.carouselTimeout = null;
    }, 4500);
  }

  replayCarousel(): void {
    this.runCarousel();
  }

  ngOnInit(): void {
    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.runCarousel();
      this.destroyRef.onDestroy(() => {
        if (this.carouselTimeout) clearTimeout(this.carouselTimeout);
      });
    }

    let topI = 0;
    const topInterval = setInterval(() => {
      topI = (topI + 1) % this.topSkills.length;
      this.topBadge.set(this.topSkills[topI]);
      this.topFlip.update(v => !v);
    }, 3000);
    this.destroyRef.onDestroy(() => clearInterval(topInterval));

    // Stagger bottom badge by 1.5s so both don't change simultaneously
    const bottomDelay = setTimeout(() => {
      let bottomI = 0;
      const bottomInterval = setInterval(() => {
        bottomI = (bottomI + 1) % this.bottomSkills.length;
        this.bottomBadge.set(this.bottomSkills[bottomI]);
        this.bottomFlip.update(v => !v);
      }, 3000);
      this.destroyRef.onDestroy(() => clearInterval(bottomInterval));
    }, 1500);
    this.destroyRef.onDestroy(() => clearTimeout(bottomDelay));
  }

  flipEnter(): void { this.isFlipped.set(true); }
  flipLeave(): void { this.isFlipped.set(false); }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
