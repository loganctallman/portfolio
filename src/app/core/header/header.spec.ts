import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render brand logo with testid', () => {
    const brand = fixture.nativeElement.querySelector('[data-testid="brand-logo"]');
    expect(brand).toBeTruthy();
  });

  it('should render 5 nav sections in sections array', () => {
    expect(component.sections.length).toBe(5);
    const ids = component.sections.map(s => s.id);
    expect(ids).toContain('hero');
    expect(ids).toContain('test-suites');
    expect(ids).toContain('development');
    expect(ids).toContain('resume');
    expect(ids).toContain('contact');
  });

  it('should have resume link with correct testid', () => {
    const link = fixture.nativeElement.querySelector('[data-testid="resume-link"]');
    expect(link).toBeTruthy();
  });

  it('should set isScrolled to true when window scrollY > 20', () => {
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    component.onScroll();
    expect(component.isScrolled()).toBe(true);
  });

  it('should set isScrolled to false when window scrollY <= 20', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    component.onScroll();
    expect(component.isScrolled()).toBe(false);
  });
});
