import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

interface LegalDocumentConfig {
  asset: string;
  tag: string;
  title: string;
}

@Component({
  selector: 'app-legal-document',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './legal-document.component.html',
  styleUrl: './legal-document.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LegalDocumentComponent implements OnInit, OnDestroy {
  config!: LegalDocumentConfig;
  documentHtml = '';
  isLoading = true;
  loadError = false;

  private readonly abortController = new AbortController();

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.config = this.route.snapshot.data as LegalDocumentConfig;
    void this.loadDocument();
    window.scrollTo({ top: 0 });
  }

  ngOnDestroy(): void {
    this.abortController.abort();
    document.body.style.overflow = '';
  }

  private async loadDocument(): Promise<void> {
    try {
      const response = await fetch(`/legal/${this.config.asset}`, {
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`Failed to load legal document: ${response.status}`);
      }

      this.documentHtml = this.renderMarkdown(await response.text());
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        this.loadError = true;
      }
    } finally {
      this.isLoading = false;
    }
  }

  private renderMarkdown(markdown: string): string {
    const html: string[] = [];
    let listOpen = false;
    let sectionOpen = false;
    let preambleOpen = false;

    const closeList = () => {
      if (listOpen) {
        html.push('</ul>');
        listOpen = false;
      }
    };

    const closeContainer = () => {
      closeList();
      if (sectionOpen || preambleOpen) {
        html.push('</section>');
        sectionOpen = false;
        preambleOpen = false;
      }
    };

    const ensurePreamble = () => {
      if (!sectionOpen && !preambleOpen) {
        html.push('<section class="legal-preamble">');
        preambleOpen = true;
      }
    };

    for (const sourceLine of markdown.replace(/\r/g, '').split('\n')) {
      const line = sourceLine.trim();

      if (!line) {
        closeList();
        continue;
      }

      if (line.startsWith('# ')) {
        continue;
      }

      const section = line.match(/^(\d+)\.\s+(.+)$/);
      if (section) {
        closeContainer();
        html.push(
          '<section class="legal-section">',
          '<div class="legal-heading">',
          `<span>${section[1].padStart(2, '0')}/</span>`,
          `<h2>${this.inlineMarkdown(section[2])}</h2>`,
          '</div>'
        );
        sectionOpen = true;
        continue;
      }

      const subsection = line.match(/^(\d+\.\d+)\s+(.+)$/);
      if (subsection) {
        closeList();
        ensurePreamble();
        html.push(`<h3><span>${subsection[1]}</span> ${this.inlineMarkdown(subsection[2])}</h3>`);
        continue;
      }

      if (line.startsWith('* ')) {
        ensurePreamble();
        if (!listOpen) {
          html.push('<ul>');
          listOpen = true;
        }
        html.push(`<li>${this.inlineMarkdown(line.slice(2))}</li>`);
        continue;
      }

      closeList();
      ensurePreamble();

      const fullBold = line.match(/^\*\*(.+)\*\*$/);
      if (fullBold) {
        html.push(`<p class="document-meta"><strong>${this.inlineMarkdown(fullBold[1])}</strong></p>`);
      } else if (this.isStandaloneHeading(line)) {
        html.push(`<h3 class="standalone-heading">${this.inlineMarkdown(line)}</h3>`);
      } else {
        const className = line.startsWith('Important notice') ? ' class="notice"' : '';
        html.push(`<p${className}>${this.inlineMarkdown(line)}</p>`);
      }
    }

    closeContainer();
    return html.join('');
  }

  private isStandaloneHeading(line: string): boolean {
    return line.length <= 80
      && /^[A-Z]/.test(line)
      && !/[.!?:;]$/.test(line)
      && !line.includes('[');
  }

  private inlineMarkdown(text: string): string {
    return this.escapeHtml(text)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
        const normalizedHref = this.normalizeHref(href);
        const externalAttributes = normalizedHref.startsWith('http')
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';

        return `<a href="${this.escapeAttribute(normalizedHref)}"${externalAttributes}>${label}</a>`;
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  private normalizeHref(href: string): string {
    const internalUrl = href.match(
      /^https:\/\/delora\.build(\/(?:terms-of-service|privacy-notice|developer-license-agreement))\/?$/
    );

    if (internalUrl) {
      return internalUrl[1];
    }

    return /^(https?:\/\/|mailto:|\/)/.test(href) ? href : '#';
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private escapeAttribute(value: string): string {
    return this.escapeHtml(value);
  }
}
