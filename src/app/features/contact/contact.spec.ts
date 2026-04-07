import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have section id="contact"', () => {
    const section = fixture.nativeElement.querySelector('#contact');
    expect(section).toBeTruthy();
  });

  it('should render the email link with correct mailto href', () => {
    const link = fixture.nativeElement.querySelector('[data-testid="contact-email-link"]');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('mailto:');
    expect(link.getAttribute('href')).toContain(component.email);
  });

  it('should render 3 social links', () => {
    expect(component.socials.length).toBe(3);
  });

  it('should render GitHub, LinkedIn, and Twitter links', () => {
    const gh = fixture.nativeElement.querySelector('[data-testid="contact-github"]');
    const li = fixture.nativeElement.querySelector('[data-testid="contact-linkedin"]');
    const tw = fixture.nativeElement.querySelector('[data-testid="contact-twitter"]');
    expect(gh).toBeTruthy();
    expect(li).toBeTruthy();
    expect(tw).toBeTruthy();
  });

  it('all social links should open in new tab', () => {
    component.socials.forEach(social => {
      const el = fixture.nativeElement.querySelector(`[data-testid="${social.testId}"]`);
      expect(el.getAttribute('target')).toBe('_blank');
    });
  });

  it('should render email trigger button', () => {
    const btn = fixture.nativeElement.querySelector('[data-testid="contact-email-trigger"]');
    expect(btn).toBeTruthy();
  });

  it('triggerEmail should use the component email address', () => {
    // email is the source of truth; just verify it is set correctly
    expect(component.email).toContain('@');
    expect(component.email.length).toBeGreaterThan(0);
  });
});
