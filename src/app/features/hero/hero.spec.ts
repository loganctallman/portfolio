import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have hero section with correct id', () => {
    const section = fixture.nativeElement.querySelector('#hero');
    expect(section).toBeTruthy();
  });

  it('should render resume download button', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="hero-resume-btn"]');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('href')).toBe('assets/resume.pdf');
  });

  it('should render view-work button', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="hero-view-work-btn"]');
    expect(btn).toBeTruthy();
  });

  it('should render GitHub and LinkedIn social links', () => {
    const gh = fixture.nativeElement.querySelector('[data-testid="hero-github-link"]');
    const li = fixture.nativeElement.querySelector('[data-testid="hero-linkedin-link"]');
    expect(gh).toBeTruthy();
    expect(li).toBeTruthy();
  });

  it('should render skill chips', () => {
    expect(component.tags.length).toBeGreaterThan(0);
    const chips = fixture.nativeElement.querySelectorAll('.skill-chip');
    expect(chips.length).toBe(component.tags.length);
  });

});
