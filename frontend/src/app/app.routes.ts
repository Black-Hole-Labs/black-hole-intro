import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { DevelopersComponent } from './developers/developers.component';
import { CommunityComponent } from './community/community.component';
import { MediakitComponent } from './mediakit/mediakit.component';
import { HowComponent } from './how it works/how.component';
import { LegalDocumentComponent } from './legal-document/legal-document.component';

export const routes: Routes = [
  { path: '', component: IntroComponent, title: 'Home | Delora' },
  { path: 'developers', component: DevelopersComponent, title: 'Developers | Delora' },
  { path: 'community', component: CommunityComponent, title: 'Community | Delora' },
	{ path: 'mediakit', component: MediakitComponent, title: 'Media Kit | Delora' },
	{
		path: 'terms-of-service',
		component: LegalDocumentComponent,
		title: 'Terms of Service | Delora',
		data: {
			asset: 'delora_terms_of_service_final_june_1_2026.md',
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
			tag: 'Developer License',
			title: 'Developer License Agreement'
		}
	},
	{ path: 'execution', component: HowComponent, title: 'How it works | Delora' },
  { path: '**', redirectTo: '' }
];
