/**
 * This entry point is for development only
 */

const url = require( 'url' );
const $ = require( 'jquery' );
const CampaignConfig = require( './campaign_config' );
const bannerSelectionListTemplate = require( './banner_selection_list.hbs' );

const currentUrl = url.parse( window.location.href, true );
const MW_PROTOTYPE_BANNER = 'B17WMDE_webpack_prototype';
const container = $( '#WMDE-Banner-Container' );

function getMediawikiBannerLinks() {
	let bannerlist = [];
	Object.keys( CAMPAIGNS ).forEach( function ( campaign ) {
		Object.keys( CAMPAIGNS[ campaign ].banners ).forEach( function ( banner ) {
			let u = url.parse( url.format( currentUrl ) );
			u.pathname = '/wiki/Wikipedia:Hauptseite';
			u.query = u.query || {};
			u.query.devbanner = CAMPAIGNS[ campaign ].banners[ banner ].pagename;
			u.query.banner = MW_PROTOTYPE_BANNER;
			if ( CAMPAIGNS[ campaign ].preview_skin ) {
				u.query.useskin = CAMPAIGNS[ campaign ].preview_skin;
			}
			delete u.search;
			bannerlist.push( {
				url: url.format( u ),
				name: CAMPAIGNS[ campaign ].banners[ banner ].pagename
			} );
		} );
	} );
	return bannerlist;
}

if ( !currentUrl.query.banner ) {
	$( 'body' ).html( bannerSelectionListTemplate( { banners: getMediawikiBannerLinks() } ) );
} else if ( currentUrl.query.banner === MW_PROTOTYPE_BANNER && !currentUrl.query.devbanner ) {
	container.html( bannerSelectionListTemplate( { banners: getMediawikiBannerLinks() } ) );
}

// inject tracking data for current banner.
// In a compiled banner, the tracking data is baked into the data attribute of the container div.
if ( currentUrl.query.devbanner ) {
	const campaigns = new CampaignConfig( CAMPAIGNS );
	const pages = campaigns.getConfigForPages();
	const currentBanner = currentUrl.query.devbanner;
	if ( pages[ currentBanner ] ) {
		console.log( 'current banner', currentBanner, pages[ currentBanner ].tracking, pages[ currentBanner ].campaign_tracking );
		container.data( 'tracking', pages[ currentBanner ].tracking );
		container.data( 'campaign-tracking', pages[ currentBanner ].campaign_tracking );
	}
}

// TODO banner loading functions for non-proxied development (with `localbanner` param)

