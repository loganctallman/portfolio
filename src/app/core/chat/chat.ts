import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  LucideAngularModule,
  Bot,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-angular';

@Component({
  selector: 'app-chat',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LucideAngularModule,
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  readonly Bot       = Bot;
  readonly X         = X;
  readonly Maximize2 = Maximize2;
  readonly Minimize2 = Minimize2;

  readonly CHAT_URL = 'https://logangptapp.vercel.app/';

  private sanitizer = inject(DomSanitizer);
  readonly chatSafeUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(this.CHAT_URL);

  isOpen     = signal(false);
  isExpanded = signal(false);

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggleExpand(): void {
    this.isExpanded.update(v => !v);
  }
}
