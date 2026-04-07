import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the FAB with correct data-testid', () => {
    const fab = fixture.nativeElement.querySelector('[data-testid="chat-fab"]');
    expect(fab).toBeTruthy();
  });

  it('should start closed', () => {
    expect(component.isOpen()).toBe(false);
    const panel = fixture.nativeElement.querySelector('.chat-panel');
    expect(panel.classList.contains('is-open')).toBe(false);
  });

  it('should open the chat panel on toggle()', () => {
    component.toggle();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
    const panel = fixture.nativeElement.querySelector('.chat-panel');
    expect(panel.classList.contains('is-open')).toBe(true);
  });

  it('should close the chat panel on close()', () => {
    component.isOpen.set(true);
    component.close();
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle expanded state', () => {
    expect(component.isExpanded()).toBe(false);
    component.toggleExpand();
    expect(component.isExpanded()).toBe(true);
    component.toggleExpand();
    expect(component.isExpanded()).toBe(false);
  });

  it('should show iframe only when panel is open', () => {
    let iframe = fixture.nativeElement.querySelector('[data-testid="chat-iframe"]');
    expect(iframe).toBeNull();

    component.isOpen.set(true);
    fixture.detectChanges();
    iframe = fixture.nativeElement.querySelector('[data-testid="chat-iframe"]');
    expect(iframe).toBeTruthy();
  });

  it('should point iframe to the correct LoganGPT URL', () => {
    expect(component.CHAT_URL).toBe('https://logangptapp.vercel.app/');
  });
});
