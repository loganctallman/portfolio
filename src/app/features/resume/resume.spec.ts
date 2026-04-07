import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumeComponent } from './resume';

describe('ResumeComponent', () => {
  let component: ResumeComponent;
  let fixture: ComponentFixture<ResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have section id="resume"', () => {
    const section = fixture.nativeElement.querySelector('#resume');
    expect(section).toBeTruthy();
  });

  it('should render the PDF viewer using <object> tag', () => {
    const obj = fixture.nativeElement.querySelector('[data-testid="resume-pdf-viewer"]');
    expect(obj).toBeTruthy();
    expect(obj.tagName.toLowerCase()).toBe('object');
    expect(obj.getAttribute('type')).toBe('application/pdf');
  });

  it('should point the PDF object to the correct asset path', () => {
    const obj = fixture.nativeElement.querySelector('[data-testid="resume-pdf-viewer"]');
    expect(obj.getAttribute('data')).toContain('resume.pdf');
  });

  it('should render download button with correct href', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="resume-download-btn"]');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('href')).toContain('resume.pdf');
  });

  it('should render open-in-new-tab button targeting _blank', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="resume-open-btn"]');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('target')).toBe('_blank');
  });
});
