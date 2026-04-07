import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestSuitesComponent } from './test-suites';

describe('TestSuitesComponent', () => {
  let component: TestSuitesComponent;
  let fixture: ComponentFixture<TestSuitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSuitesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have section id="test-suites"', () => {
    const section = fixture.nativeElement.querySelector('#test-suites');
    expect(section).toBeTruthy();
  });

  it('should render exactly 6 tool cards', () => {
    expect(component.tools.length).toBe(6);
    const cards = fixture.nativeElement.querySelectorAll('[data-testid^="tool-card-"]');
    expect(cards.length).toBe(6);
  });

  it('should include Playwright, Cypress, JUnit, Postman, JMeter, GitHub Actions', () => {
    const ids = component.tools.map(t => t.id);
    expect(ids).toContain('playwright');
    expect(ids).toContain('cypress');
    expect(ids).toContain('junit');
    expect(ids).toContain('postman');
    expect(ids).toContain('jmeter');
    expect(ids).toContain('github-actions');
  });

  it('should render a docs link for each tool', () => {
    const links = fixture.nativeElement.querySelectorAll('[data-testid^="tool-link-"]');
    expect(links.length).toBe(6);
    links.forEach((link: HTMLAnchorElement) => {
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('each tool should have at least one highlight', () => {
    component.tools.forEach(tool => {
      expect(tool.highlights.length).toBeGreaterThan(0);
    });
  });
});
