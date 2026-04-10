import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule, ChevronDown, ExternalLink, FileText } from 'lucide-angular';

export interface NavSection {
  label: string;
  id: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    LucideAngularModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly ChevronDown = ChevronDown;
  readonly ExternalLink = ExternalLink;
  readonly FileText = FileText;

  isScrolled = signal(false);

  readonly sections: NavSection[] = [
    { label: 'Profile',      id: 'hero',        icon: 'person'  },
    { label: 'Development',  id: 'development', icon: 'code'    },
    { label: 'Test Suites',  id: 'test-suites', icon: 'science' },
    { label: 'Resume',       id: 'resume',      icon: 'description' },
    { label: 'Contact',      id: 'contact',     icon: 'mail'    },
  ];

  constructor(private scroller: ViewportScroller) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
