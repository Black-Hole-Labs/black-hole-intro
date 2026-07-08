import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { DevelopersComponent } from './developers/developers.component';
import { CommunityComponent } from './community/community.component';
import { MediakitComponent } from './mediakit/mediakit.component';
import { HowComponent } from './how it works/how.component';
import { LegalDocumentComponent } from './legal-document/legal-document.component';
import seoRoutesConfig from './seo.routes.json';

interface SeoRouteMetadata {
  canonicalPath: string;
  description: string;
  image: string;
  ogType?: string;
  robots?: string;
  title: string;
}

const routeSeo = seoRoutesConfig.routes satisfies Record<string, SeoRouteMetadata>;

function routeData(route: SeoRouteMetadata): Omit<SeoRouteMetadata, 'title'> {
  const { title: _title, ...data } = route;
  return data;
}

export const routes: Routes = [
  {
    path: '',
    component: IntroComponent,
    title: routeSeo.home.title,
    data: routeData(routeSeo.home)
  },
  {
    path: 'developers',
    component: DevelopersComponent,
    title: routeSeo.developers.title,
    data: routeData(routeSeo.developers)
  },
  {
    path: 'community',
    component: CommunityComponent,
    title: routeSeo.community.title,
    data: routeData(routeSeo.community)
  },
	{
		path: 'mediakit',
		component: MediakitComponent,
		title: routeSeo.mediakit.title,
		data: routeData(routeSeo.mediakit)
	},
	{
		path: 'terms-of-service',
		component: LegalDocumentComponent,
		title: routeSeo.terms.title,
		data: {
			asset: 'delora_terms_of_service_final_june_1_2026.md',
			...routeData(routeSeo.terms),
			tag: 'Terms of Service',
			title: 'Terms of Service'
		}
	},
	{
		path: 'privacy-notice',
		component: LegalDocumentComponent,
		title: routeSeo.privacy.title,
		data: {
			asset: 'delora_privacy_notice_final_june_1_2026.md',
			...routeData(routeSeo.privacy),
			tag: 'Privacy Notice',
			title: 'Privacy Notice'
		}
	},
	{
		path: 'developer-license-agreement',
		component: LegalDocumentComponent,
		title: routeSeo.developerLicense.title,
		data: {
			asset: 'delora_developer_license_agreement_final_june_1_2026.md',
			...routeData(routeSeo.developerLicense),
			tag: 'Developer License',
			title: 'Developer License Agreement'
		}
	},
	{
		path: 'execution',
		component: HowComponent,
		title: routeSeo.execution.title,
		data: routeData(routeSeo.execution)
	},
  { path: '**', redirectTo: '' }
];
