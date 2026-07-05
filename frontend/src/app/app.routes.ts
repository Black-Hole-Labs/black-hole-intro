import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { DevelopersComponent } from './developers/developers.component';
import { CommunityComponent } from './community/community.component';
import { MediakitComponent } from './mediakit/mediakit.component';
import { HowComponent } from './how it works/how.component';
import { LegalDocumentComponent } from './legal-document/legal-document.component';

const routeDescriptions = {
  home:
    'Delora powers cross-chain execution for builders, partners, and communities across modern blockchain ecosystems.',
  developers:
    'Explore Delora developer resources, APIs, architecture, integrations, and support for cross-chain execution.',
  community:
    'Follow Delora community updates, partner resources, social channels, and ecosystem news in one place.',
  mediakit:
    'Access Delora brand assets, logo files, media kit downloads, and visual usage guidance for partners and press.',
  execution:
    'Learn how Delora handles cross-chain execution, infrastructure, and protocol flows across supported networks.',
  terms:
    'Read Delora Terms of Service for the website, APIs, developer tools, and related platform services.',
  privacy:
    'Review Delora Privacy Notice to understand what data we collect, how it is used, and your privacy rights.',
  developerLicense:
    'Read Delora Developer License Agreement for APIs, SDKs, widgets, documentation, and developer services.'
} as const;

export const routes: Routes = [
  {
    path: '',
    component: IntroComponent,
    title: 'Home | Delora',
    data: { description: routeDescriptions.home }
  },
  {
    path: 'developers',
    component: DevelopersComponent,
    title: 'Developers | Delora',
    data: { description: routeDescriptions.developers }
  },
  {
    path: 'community',
    component: CommunityComponent,
    title: 'Community | Delora',
    data: { description: routeDescriptions.community }
  },
	{
		path: 'mediakit',
		component: MediakitComponent,
		title: 'Media Kit | Delora',
		data: { description: routeDescriptions.mediakit }
	},
	{
		path: 'terms-of-service',
		component: LegalDocumentComponent,
		title: 'Terms of Service | Delora',
		data: {
			asset: 'delora_terms_of_service_final_june_1_2026.md',
			description: routeDescriptions.terms,
			tag: 'Terms of Service',
			title: 'Terms of Service'
		}
	},
	{
		path: 'privacy-notice',
		component: LegalDocumentComponent,
		title: 'Privacy Notice | Delora',
		data: {
			asset: 'delora_privacy_notice_final_june_1_2026.md',
			description: routeDescriptions.privacy,
			tag: 'Privacy Notice',
			title: 'Privacy Notice'
		}
	},
	{
		path: 'developer-license-agreement',
		component: LegalDocumentComponent,
		title: 'Developer License Agreement | Delora',
		data: {
			asset: 'delora_developer_license_agreement_final_june_1_2026.md',
			description: routeDescriptions.developerLicense,
			tag: 'Developer License',
			title: 'Developer License Agreement'
		}
	},
	{
		path: 'execution',
		component: HowComponent,
		title: 'How it works | Delora',
		data: { description: routeDescriptions.execution }
	},
  { path: '**', redirectTo: '' }
];
