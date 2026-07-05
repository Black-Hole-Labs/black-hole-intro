import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { DevelopersComponent } from './developers/developers.component';
import { CommunityComponent } from './community/community.component';
import { MediakitComponent } from './mediakit/mediakit.component';
import { HowComponent } from './how it works/how.component';
import { LegalDocumentComponent } from './legal-document/legal-document.component';

const defaultSeoImage = '/img/brand-logo.png';

const routeDescriptions = {
  home:
    'Embed multi-chain swaps and bridges with Delora execution layer. Give wallets, agents and dApps access to global onchain liquidity through one API',
  developers:
    'Integrate Delora to build secure cross-chain execution into wallets, agents and dApps with API, widget and developer-first tooling.',
  community:
    'Follow Delora community updates, partner resources, social channels, and ecosystem news in one place.',
  mediakit:
    'Access Delora brand assets, logo files, media kit downloads, and visual usage guidance for partners and press.',
  execution:
    'See how Delora finds routes across DEXs, bridges and solvers, then returns execution-ready transaction data for secure multi-chain swaps.',
  terms:
    'Read Delora Terms of Service for the website, APIs, developer tools, and related platform services.',
  privacy:
    'Review Delora Privacy Notice to understand what data we collect, how it is used, and your privacy rights.',
  developerLicense:
    'Read Delora Developer License Agreement for APIs, SDKs, widgets, documentation, and developer services.'
} as const;

const routeSeo = {
  home: {
    canonicalPath: '/',
    description: routeDescriptions.home,
    image: defaultSeoImage
  },
  developers: {
    canonicalPath: '/developers',
    description: routeDescriptions.developers,
    image: defaultSeoImage
  },
  community: {
    canonicalPath: '/community',
    description: routeDescriptions.community,
    image: defaultSeoImage
  },
  mediakit: {
    canonicalPath: '/mediakit',
    description: routeDescriptions.mediakit,
    image: defaultSeoImage
  },
  execution: {
    canonicalPath: '/execution',
    description: routeDescriptions.execution,
    image: defaultSeoImage
  },
  terms: {
    canonicalPath: '/terms-of-service',
    description: routeDescriptions.terms,
    image: defaultSeoImage
  },
  privacy: {
    canonicalPath: '/privacy-notice',
    description: routeDescriptions.privacy,
    image: defaultSeoImage
  },
  developerLicense: {
    canonicalPath: '/developer-license-agreement',
    description: routeDescriptions.developerLicense,
    image: defaultSeoImage
  }
} as const;

export const routes: Routes = [
  {
    path: '',
    component: IntroComponent,
    title: 'Delora | Cross-Chain Execution Layer for Onchain Apps',
    data: routeSeo.home
  },
  {
    path: 'developers',
    component: DevelopersComponent,
    title: 'Delora for Developers | Build Cross-Chain Swaps Faster',
    data: routeSeo.developers
  },
  {
    path: 'community',
    component: CommunityComponent,
    title: 'Community | Delora',
    data: routeSeo.community
  },
	{
		path: 'mediakit',
		component: MediakitComponent,
		title: 'Media Kit | Delora',
		data: routeSeo.mediakit
	},
	{
		path: 'terms-of-service',
		component: LegalDocumentComponent,
		title: 'Terms of Service | Delora',
		data: {
			asset: 'delora_terms_of_service_final_june_1_2026.md',
			...routeSeo.terms,
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
			...routeSeo.privacy,
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
			...routeSeo.developerLicense,
			tag: 'Developer License',
			title: 'Developer License Agreement'
		}
	},
	{
		path: 'execution',
		component: HowComponent,
		title: 'Cross-Chain Execution Flow | How Delora Works',
		data: routeSeo.execution
	},
  { path: '**', redirectTo: '' }
];
