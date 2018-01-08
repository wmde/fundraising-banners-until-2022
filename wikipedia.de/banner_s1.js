require( './css/styles_s1.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 180;
const sizeIssueTrackRatio = 0.01;
const searchBoxTrackRatio = 0.01;
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
// END Banner-Specific configuration

import TrackingEvents from '../shared/tracking_events';
import SizeIssueIndicator from '../shared/track_size_issues';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import Translations from '../shared/messages/de';

const Handlebars = require( 'handlebars/runtime' );
Handlebars.registerHelper( 'capitalizeFirstLetter', function ( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
} );

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const formatNumber = require( 'format-number' );
const donorFormatter = formatNumber( { round: 0, integerSeparator: '.' } );

const bannerTemplate = require( './templates/banner_html_s1.hbs' );

const $ = require( 'jquery' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	numberOfDonors: donorFormatter( 359444 ),
	CampaignName: CampaignName,
	BannerName: BannerName
} ) );

// BEGIN form init code

const trackingEvents = new TrackingEvents( trackingBaseUrl, BannerName, $( '.click-tracking__pixel' ) );

// END form init code

$( '.show-beef', $bannerContainer ).click( function () {
	$( '.banner', $bannerContainer ).toggleClass( 'enabled' );
	addSpaceInstantly();
} );

$( '.close__beef', $bannerContainer ).click( function () {
	$( '.banner', $bannerContainer ).removeClass( 'enabled' );
	addSpaceInstantly();
} );

function addSpace() {
	var $bannerElement = $( 'div#WMDE_Banner' );
	if ( !$bannerElement.is( ':visible' ) ) {
		return;
	}

	BannerFunctions.getSkin().addSpace( $bannerElement.height() );
}

function addSpaceInstantly() {
	if ( !$( '#WMDE_Banner' ).is( ':visible' ) ) {
		return;
	}

	BannerFunctions.getSkin().addSpaceInstantly( $( 'div#WMDE_Banner' ).height() );
}

function removeBannerSpace() {
	BannerFunctions.getSkin().removeSpace();
}

function displayBanner() {
	var bannerElement = $( '#WMDE_Banner' ),
		bannerHeight;

	bannerHeight = bannerElement.height();
	bannerElement.css( 'top', -bannerHeight );
	bannerElement.css( 'display', 'block' );
	addSpace();
	bannerElement.animate( { top: 0 }, 1000 );

	$( window ).resize( function () {
		addSpaceInstantly();
	} );
}

// track banner expansion and closing
trackingEvents.trackClickEvent( $( 'thankyou-message__call-to-action' ), 'banner-expanded', 1 );
trackingEvents.trackClickEvent( $( '#WMDE_Banner .close__link' ), 'banner-closed', bannerCloseTrackRatio );

// BEGIN Banner close functions
$( '#WMDE_Banner .close__link' ).click( function () {
	$( '#WMDE_Banner' ).hide();
	if ( BannerFunctions.onMediaWiki() ) {
		mw.centralNotice.hideBanner();
	}
	removeBannerSpace();

	return false;
} );

// hide banner when the visual editor is initialized
$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( function () {
	$( '#WMDE_Banner' ).hide();
	removeBannerSpace();
} );

// END Banner close functions

// Display banner on load
$( function () {
	var $bannerElement = $( '#WMDE_Banner' );

	$( 'body' ).prepend( $( '#centralNotice' ) );

	if ( BannerFunctions.onMediaWiki() ) {
		if ( window.mw.config.get( 'wgAction' ) !== 'view' ) {
			return;
		}
	} else {
		trackingEvents.recordBannerImpression();
	}

	if ( sizeIssueIndicator.hasSizeIssues( $bannerElement ) ) {
		if ( BannerFunctions.onMediaWiki() ) {
			mw.centralNotice.setBannerLoadedButHidden();
		}
		trackingEvents.trackSizeIssueEvent(
			sizeIssueIndicator.getDimensions( $bannerElement.height() ),
			sizeIssueTrackRatio
		);
	} else {
		bannerDisplayTimeout.run( displayBanner, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 0 );
	}

	BannerFunctions.getSkin().addSearchObserver( function () {
		trackingEvents.createTrackHandler( 'search-box-used', searchBoxTrackRatio )();
		bannerDisplayTimeout.cancel();
	} );
} );
