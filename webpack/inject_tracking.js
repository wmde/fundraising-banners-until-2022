// Entry point for injecting tracking data for currently shown banner in the development environment.
// In a compiled banner, the tracking data is baked into the data attribute of the container div.

import CampaignConfig from './campaign_config';

// eslint-disable-next-line no-undef
const campaigns = new CampaignConfig( CAMPAIGNS );
const pages = campaigns.getConfigForPages();
const currentUrl = new URL( window.location.href );
const currentBanner = currentUrl.searchParams.get( 'devbanner' );
const container = document.getElementById( 'WMDE-Banner-Container' );
if ( pages[ currentBanner ] ) {
	container.dataset.tracking = pages[ currentBanner ].tracking;
	container.dataset.campaignTracking = pages[ currentBanner ].campaign_tracking;
} else {
	console.log( `Banner "${currentBanner}" not found in campaign configuration, can't inject tracking` );
}
