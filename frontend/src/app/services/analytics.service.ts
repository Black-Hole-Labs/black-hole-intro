import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window { gtag?: (...args: any[]) => void; }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  init(id: string) {
    if (!this.isBrowser) {
      return;
    }

    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        window.gtag?.('event', 'page_view', {
          send_to: id,
          page_path: event.urlAfterRedirects,
          page_title: document.title,
          page_location: window.location.href,
        });
      });
  }
}
