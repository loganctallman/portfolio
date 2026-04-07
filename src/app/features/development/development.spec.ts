import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevelopmentComponent } from './development';

describe('DevelopmentComponent', () => {
  let component: DevelopmentComponent;
  let fixture: ComponentFixture<DevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevelopmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have section id="development"', () => {
    const section = fixture.nativeElement.querySelector('#development');
    expect(section).toBeTruthy();
  });

  it('should render a card for each project', () => {
    expect(component.projects.length).toBeGreaterThan(0);
    const cards = fixture.nativeElement.querySelectorAll('[data-testid^="project-card-"]');
    expect(cards.length).toBe(component.projects.length);
  });

  it('should render live and repo links for each project', () => {
    component.projects.forEach(project => {
      const live = fixture.nativeElement.querySelector(`[data-testid="project-live-${project.id}"]`);
      const repo = fixture.nativeElement.querySelector(`[data-testid="project-repo-${project.id}"]`);
      expect(live).toBeTruthy();
      expect(repo).toBeTruthy();
    });
  });

  it('should start with no expanded project', () => {
    expect(component.expandedProject()).toBeNull();
  });

  it('should expand and collapse a project on toggleExpand', () => {
    const id = component.projects[0].id;
    component.toggleExpand(id);
    expect(component.isExpanded(id)).toBe(true);
    component.toggleExpand(id);
    expect(component.isExpanded(id)).toBe(false);
  });

  it('should show deep-dive panel only for expanded project', () => {
    const id = component.projects[0].id;
    component.toggleExpand(id);
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector(`#deep-dive-${id}`);
    expect(panel).toBeTruthy();
    const otherPanel = fixture.nativeElement.querySelector(`#deep-dive-${component.projects[1].id}`);
    expect(otherPanel).toBeNull();
  });

  it('should render deep-dive toggle buttons with correct testids', () => {
    component.projects.forEach(project => {
      const btn = fixture.nativeElement.querySelector(`[data-testid="deep-dive-toggle-${project.id}"]`);
      expect(btn).toBeTruthy();
    });
  });
});
