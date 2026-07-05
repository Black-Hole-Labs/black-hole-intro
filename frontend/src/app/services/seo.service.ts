import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, TitleStrategy } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly defaultDescription =
    'Delora powers cross-chain execution for builders, partners, and communities across modern blockchain ecosystems.';
  private initialized = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
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
        map((route) => ({
          description: route.snapshot.data['description'] as string | undefined,
          title: this.titleStrategy.buildTitle(this.router.routerState.snapshot) ?? 'Delora'
        })),
        distinctUntilChanged(
          (previous, current) =>
            previous.description === current.description && previous.title === current.title
        )
      )
      .subscribe(({ description, title }) => {
        const resolvedDescription = description ?? this.defaultDescription;

        this.title.setTitle(title);
        this.meta.updateTag({ name: 'description', content: resolvedDescription });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: resolvedDescription });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: resolvedDescription });
      });
  }

  private findPrimaryRoute(route: ActivatedRoute): ActivatedRoute {
    let currentRoute = route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute;
  }
}
