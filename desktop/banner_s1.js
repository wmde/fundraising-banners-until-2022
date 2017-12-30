require( './css/styles_s1.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 180;
const sizeIssueTrackRatio = 0.01;
const searchBoxTrackRatio = 0.01;
const LANGUAGE = 'de';
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
// END Banner-Specific configuration

import TrackingEvents from '../shared/tracking_events';
import SizeIssueIndicator from '../shared/track_size_issues';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import DayName from '../shared/day_name';
import InterruptibleTimeout from '../shared/interruptible_timeout';

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
import Translations from '../shared/messages/de';
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const campaignDays = new CampaignDays(
	startOfDay( GlobalBannerSettings[ 'campaign-start-date' ] ),
	endOfDay( GlobalBannerSettings[ 'campaign-end-date' ] )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE, 22 );
const CampaignProjection = require( '../shared/campaign_projection' );
const campaignProjection = new CampaignProjection(
	new CampaignDays(
		startOfDay( GlobalBannerSettings[ 'donations-date-base' ] ),
		endOfDay( GlobalBannerSettings[ 'campaign-end-date' ] )
	),
	{
		baseDonationSum: GlobalBannerSettings[ 'donations-collected-base' ],
		donationAmountPerMinute: GlobalBannerSettings[ 'appr-donations-per-minute' ],
		donorsBase: GlobalBannerSettings[ 'donators-base' ],
		donorsPerMinute: GlobalBannerSettings[ 'appr-donators-per-minute' ]
	}
);
const formatNumber = require( 'format-number' );
const donorFormatter = formatNumber( { round: 0, integerSeparator: '.' } );

const dayName = new DayName( new Date() );
const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
const weekdayPrepPhrase = dayName.isSpecialDayName() ? Translations[ 'day-name-prefix-todays' ] : Translations[ 'day-name-prefix-this' ];

const bannerTemplate = require( './templates/banner_html_s1.hbs' );

const $ = require( 'jquery' );
require( '../shared/wlightbox.js' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );
const ProgressBar = require( '../shared/progress_bar/progress_bar' );
const numberOfDaysUntilCampaignEnd = campaignDays.getNumberOfDaysUntilCampaignEnd();
const progressBarTextInnerLeft = [
	Translations[ 'prefix-days-left' ],
	numberOfDaysUntilCampaignEnd,
	numberOfDaysUntilCampaignEnd > 1 ? Translations[ 'day-plural' ] : Translations[ 'day-singular' ],
	Translations[ 'suffix-days-left' ]
].join( ' ' );
const progressBar = new ProgressBar( GlobalBannerSettings, campaignProjection, { textInnerLeft: progressBarTextInnerLeft } );
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressBar: progressBar.render()
} ) );

// BEGIN form init code

const trackingEvents = new TrackingEvents( trackingBaseUrl, BannerName, $( '.click-tracking__pixel' ) );

BannerFunctions.initializeBannerEvents();

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
	setTimeout( function () { progressBar.animate(); }, 1000 );

	$( window ).resize( function () {
		addSpaceInstantly();
		calculateLightboxPosition();
	} );
}

function calculateLightboxPosition() {
	$( '#wlightbox' ).css( {
		right: ( $( 'body' ).width() - 750 ) / 2 + 'px',
		top: ( $( '#WMDE_Banner' ).height() + 20 ) + 'px'
	} );
}

var impCount = BannerFunctions.increaseImpCount();
$( '#impCount' ).val( impCount );
var bannerImpCount = BannerFunctions.increaseBannerImpCount( BannerName );
$( '#bImpCount' ).val( bannerImpCount );

// Lightbox
$( '#application-of-funds-link' ).wlightbox( {
	container: $( '#mw-page-base' ),
	right: ( $( 'body' ).width() - 750 ) / 2 + 'px',
	top: function () {
		return ( $( '#WMDE_Banner' ).height() + 20 ) + 'px';
	}
} );

$( '#application-of-funds-link' ).click( function () {
	// Lightbox position is relative to banner position
	window.scrollTo( 0, 0 );
} );

// track lightbox link clicking and banner closing
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

	if ( BannerFunctions.onMediaWiki() && window.mw.config.get( 'wgAction' ) !== 'view' ) {
		return;
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
		bannerDisplayTimeout.run( displayBanner, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 7500 );
	}

	BannerFunctions.getSkin().addSearchObserver( function () {
		trackingEvents.createTrackHandler( 'search-box-used', searchBoxTrackRatio )();
		bannerDisplayTimeout.cancel();
	} );
} );
