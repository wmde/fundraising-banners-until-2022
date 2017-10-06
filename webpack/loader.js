/**
 * This entry point is for development only
 */

const url = require( 'url' );
const $ = require( 'jquery' );
const CampaignConfig = require( './campaign_config' );
const bannerSelectionListTemplate = require( './banner_selection_list.hbs' );

const currentUrl = url.parse( window.location.href, true );

const Handlebars = require('handlebars/runtime');
Handlebars.registerHelper('bannerlink', function( campaign, bannername ) {
	return campaign.preview_link.replace( '{{banner}}', bannername );
});

if ( !currentUrl.query.banner && !currentUrl.query.bannertest ) {	// different wikipedia.org & wikipedia.de banner params
	$( 'body' ).html( bannerSelectionListTemplate( { campaigns: CAMPAIGNS } ) );
}

// inject tracking data for current banner.
// In a compiled banner, the tracking data is baked into the data attribute of the container div.
if ( currentUrl.query.devbanner ) {
	const campaigns = new CampaignConfig( CAMPAIGNS );
	const pages = campaigns.getConfigForPages();
	const currentBanner = currentUrl.query.devbanner;
	const container = $( '#WMDE-Banner-Container' );
	if ( pages[ currentBanner ] ) {
		console.log( 'current banner', currentBanner, pages[ currentBanner ].tracking, pages[ currentBanner ].campaign_tracking );
		container.data( 'tracking', pages[ currentBanner ].tracking );
		container.data( 'campaign-tracking', pages[ currentBanner ].campaign_tracking );
	}
}

// TODO banner loading functions for non-proxied development (with `localbanner` param)
