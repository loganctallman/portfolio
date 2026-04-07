import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './core/header/header';
import { ChatComponent } from './core/chat/chat';
import { HeroComponent } from './features/hero/hero';
import { TestSuitesComponent } from './features/test-suites/test-suites';
import { DevelopmentComponent } from './features/development/development';
import { ResumeComponent } from './features/resume/resume';
import { ContactComponent } from './features/contact/contact';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    ChatComponent,
    HeroComponent,
    TestSuitesComponent,
    DevelopmentComponent,
    ResumeComponent,
    ContactComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
