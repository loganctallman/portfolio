import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero';

function mockMatchMedia(prefersReducedMotion: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: prefersReducedMotion,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  function createComponent(): void {
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockMatchMedia(false); // motion OK by default
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  // ─── Existing tests ───────────────────────────────────────────────────────────
  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should have hero section with correct id', () => {
    createComponent();
    const section = fixture.nativeElement.querySelector('#hero');
    expect(section).toBeTruthy();
  });

  it('should render resume download button', () => {
    createComponent();
    const btn = fixture.nativeElement.querySelector('[data-testid="hero-resume-btn"]');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('href')).toBe('/resume.pdf');
  });

  it('should render view-work button', () => {
    createComponent();
    const btn = fixture.nativeElement.querySelector('[data-testid="hero-view-work-btn"]');
    expect(btn).toBeTruthy();
  });

  it('should render GitHub and LinkedIn social links', () => {
    createComponent();
    const gh = fixture.nativeElement.querySelector('[data-testid="hero-github-link"]');
    const li = fixture.nativeElement.querySelector('[data-testid="hero-linkedin-link"]');
    expect(gh).toBeTruthy();
    expect(li).toBeTruthy();
  });

  it('should render skill chips', () => {
    createComponent();
    expect(component.tags.length).toBeGreaterThan(0);
    const chips = fixture.nativeElement.querySelectorAll('.skill-chip');
    expect(chips.length).toBe(component.tags.length);
  });

  // ─── Image carousel ───────────────────────────────────────────────────────────
  describe('image carousel', () => {
    it('activeImage starts at 0 — circ.png shown first', () => {
      createComponent();
      expect(component.activeImage()).toBe(0);
    });

    it('carouselDone starts as false', () => {
      createComponent();
      expect(component.carouselDone()).toBe(false);
    });

    it('captions array has 2 entries', () => {
      createComponent();
      expect(component.captions.length).toBe(2);
    });

    it('advances to image 1 and sets carouselDone after 4500ms', () => {
      vi.useFakeTimers();
      createComponent();
      expect(component.activeImage()).toBe(0);
      vi.advanceTimersByTime(4500);
      expect(component.activeImage()).toBe(1);
      expect(component.carouselDone()).toBe(true);
      vi.useRealTimers();
    });

    it('replayCarousel immediately resets activeImage to 0 and carouselDone to false', () => {
      vi.useFakeTimers();
      createComponent();
      vi.advanceTimersByTime(4500);
      expect(component.activeImage()).toBe(1);
      expect(component.carouselDone()).toBe(true);
      component.replayCarousel();
      expect(component.activeImage()).toBe(0);
      expect(component.carouselDone()).toBe(false);
      vi.useRealTimers();
    });

    it('does not start carousel when prefers-reduced-motion is set', () => {
      vi.useFakeTimers();
      mockMatchMedia(true);
      createComponent();
      vi.advanceTimersByTime(4500);
      expect(component.activeImage()).toBe(0);
      expect(component.carouselDone()).toBe(false);
      vi.useRealTimers();
    });
  });

  // ─── Flip interactions ────────────────────────────────────────────────────────
  describe('flip interactions', () => {
    beforeEach(() => createComponent());

    it('isFlipped starts as false', () => {
      expect(component.isFlipped()).toBe(false);
    });

    it('flipEnter sets isFlipped to true', () => {
      component.flipEnter();
      expect(component.isFlipped()).toBe(true);
    });

    it('flipLeave sets isFlipped to false', () => {
      component.flipEnter();
      component.flipLeave();
      expect(component.isFlipped()).toBe(false);
    });
  });

  // ─── DOM rendering ────────────────────────────────────────────────────────────
  describe('DOM rendering', () => {
    beforeEach(() => createComponent());

    it('renders two avatar images inside the carousel', () => {
      const imgs = fixture.nativeElement.querySelectorAll('.avatar-img');
      expect(imgs.length).toBeGreaterThanOrEqual(2);
    });

    it('renders two caption text spans', () => {
      const captions = fixture.nativeElement.querySelectorAll('.caption-text');
      expect(captions.length).toBe(2);
    });

    it('bio-title renders and contains role text', () => {
      const title = fixture.nativeElement.querySelector('.bio-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('SDET');
    });

    it('bio-body renders supporting text', () => {
      const body = fixture.nativeElement.querySelector('.bio-body');
      expect(body).toBeTruthy();
      expect(body.textContent).toContain('automation');
    });
  });
});
