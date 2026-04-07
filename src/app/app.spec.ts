import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header', () => {
    const header = fixture.nativeElement.querySelector('app-header');
    expect(header).toBeTruthy();
  });

  it('should render all five section components', () => {
    expect(fixture.nativeElement.querySelector('app-hero')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-test-suites')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-development')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-resume')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-contact')).toBeTruthy();
  });

  it('should render the chat FAB component', () => {
    const chat = fixture.nativeElement.querySelector('app-chat');
    expect(chat).toBeTruthy();
  });

  it('should have a main element with id="main-content"', () => {
    const main = fixture.nativeElement.querySelector('main#main-content');
    expect(main).toBeTruthy();
  });
});
