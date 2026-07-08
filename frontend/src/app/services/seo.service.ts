import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, TitleStrategy } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import seoRoutesConfig from '../seo.routes.json';

interface SeoState {
  canonicalUrl: string;
  description: string;
  imageUrl: string;
  robots: string;
  title: string;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly defaultImagePath = seoRoutesConfig.site.defaultImagePath;
  private readonly defaultDescription = seoRoutesConfig.site.defaultDescription;
  private readonly imageAlt = seoRoutesConfig.site.imageAlt;
  private readonly sameAs = seoRoutesConfig.site.sameAs;
  private readonly siteName = seoRoutesConfig.site.name;
  private readonly siteUrl = seoRoutesConfig.site.url;
  private readonly socialHandle = seoRoutesConfig.site.socialHandle;
  private initialized = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly meta: Meta,
    private readonly router: Router,
    private readonly title: Title,
    private readonly titleStrategy: TitleStrategy
  ) {}

  init(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
        map(() => this.findPrimaryRoute(this.activatedRoute)),
        map((route) => this.resolveSeoState(route)),
        distinctUntilChanged(
          (previous, current) =>
            previous.canonicalUrl === current.canonicalUrl &&
            previous.description === current.description &&
            previous.imageUrl === current.imageUrl &&
            previous.robots === current.robots &&
            previous.title === current.title &&
            previous.type === current.type
        )
      )
      .subscribe((seoState) => this.applySeoState(seoState));
  }

  private findPrimaryRoute(route: ActivatedRoute): ActivatedRoute {
    let currentRoute = route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute;
  }

  private resolveSeoState(route: ActivatedRoute): SeoState {
    const data = route.snapshot.data;
    const canonicalPath = (data['canonicalPath'] as string | undefined) ?? this.currentPath();
    const description = (data['description'] as string | undefined) ?? this.defaultDescription;
    const imagePath = (data['image'] as string | undefined) ?? this.defaultImagePath;
    const robots = (data['robots'] as string | undefined) ?? 'index, follow';
    const type = (data['ogType'] as string | undefined) ?? 'website';

    return {
      canonicalUrl: this.absoluteUrl(canonicalPath),
      description,
      imageUrl: this.absoluteUrl(imagePath),
      robots,
      title: this.titleStrategy.buildTitle(this.router.routerState.snapshot) ?? this.siteName,
      type
    };
  }

  private applySeoState(seoState: SeoState): void {
    this.title.setTitle(seoState.title);
    this.updateCanonical(seoState.canonicalUrl);

    this.meta.updateTag({ name: 'description', content: seoState.description });
    this.meta.updateTag({ name: 'robots', content: seoState.robots });

    this.meta.updateTag({ property: 'og:title', content: seoState.title });
    this.meta.updateTag({ property: 'og:description', content: seoState.description });
    this.meta.updateTag({ property: 'og:type', content: seoState.type });
    this.meta.updateTag({ property: 'og:url', content: seoState.canonicalUrl });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:image', content: seoState.imageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: this.imageAlt });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: this.socialHandle });
    this.meta.updateTag({ name: 'twitter:title', content: seoState.title });
    this.meta.updateTag({ name: 'twitter:description', content: seoState.description });
    this.meta.updateTag({ name: 'twitter:image', content: seoState.imageUrl });
    this.meta.updateTag({ name: 'twitter:image:alt', content: this.imageAlt });

    this.updateStructuredData(seoState);
  }

  private absoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }

    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${this.siteUrl}${path}`;
  }

  private currentPath(): string {
    return this.router.url.split(/[?#]/)[0] || '/';
  }

  private updateCanonical(url: string): void {
    let canonicalLink = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', url);
  }

  private updateStructuredData(seoState: SeoState): void {
    let schemaScript = this.document.querySelector<HTMLScriptElement>('#seo-structured-data');

    if (!schemaScript) {
      schemaScript = this.document.createElement('script');
      schemaScript.id = 'seo-structured-data';
      schemaScript.type = 'application/ld+json';
      this.document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@id': `${this.siteUrl}/#organization`,
          '@type': 'Organization',
          name: this.siteName,
          url: `${this.siteUrl}/`,
          logo: this.absoluteUrl('/img/logo.png'),
          sameAs: this.sameAs
        },
        {
          '@id': `${this.siteUrl}/#website`,
          '@type': 'WebSite',
          name: this.siteName,
          publisher: { '@id': `${this.siteUrl}/#organization` },
          url: `${this.siteUrl}/`
        },
        {
          '@id': `${seoState.canonicalUrl}#webpage`,
          '@type': 'WebPage',
          description: seoState.description,
          image: seoState.imageUrl,
          isPartOf: { '@id': `${this.siteUrl}/#website` },
          name: seoState.title,
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: seoState.imageUrl
          },
          url: seoState.canonicalUrl
        }
      ]
    });
  }
}
