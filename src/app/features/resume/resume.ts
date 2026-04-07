import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule, Download, FileText, ExternalLink } from 'lucide-angular';

@Component({
  selector: 'app-resume',
  imports: [MatButtonModule, LucideAngularModule],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeComponent {
  readonly Download     = Download;
  readonly FileText     = FileText;
  readonly ExternalLink = ExternalLink;

  private sanitizer = inject(DomSanitizer);

  readonly resumePath     = 'resume.pdf';
  readonly resumeSafeUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(this.resumePath);
}
