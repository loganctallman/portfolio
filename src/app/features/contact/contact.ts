import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  LucideAngularModule,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Send,
  MapPin,
} from 'lucide-angular';

type LucideIconNode = readonly [string, Record<string, string | number>];
type LucideIconData = readonly LucideIconNode[];

export interface SocialLink {
  label: string;
  url: string;
  icon: LucideIconData;
  color: string;
  testId: string;
}

@Component({
  selector: 'app-contact',
  imports: [MatButtonModule, LucideAngularModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  readonly Mail    = Mail;
  readonly Send    = Send;
  readonly MapPin  = MapPin;
  readonly Github  = Github;
  readonly Linkedin = Linkedin;

  readonly email = 'loganctallman@gmail.com';

  readonly socials: SocialLink[] = [
    {
      label: 'GitHub',
      url: 'https://github.com/loganctallman',
      icon: Github,
      color: '#e2e8f0',
      testId: 'contact-github',
    },
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/logan-tallman-9245583b4/',
      icon: Linkedin,
      color: '#0A66C2',
      testId: 'contact-linkedin',
    },
    {
      label: 'Twitter / X',
      url: 'https://twitter.com/loganctallman',
      icon: Twitter,
      color: '#1DA1F2',
      testId: 'contact-twitter',
    },
  ];

  triggerEmail(): void {
    window.location.href = `mailto:${this.email}?subject=Portfolio%20Inquiry`;
  }
}
