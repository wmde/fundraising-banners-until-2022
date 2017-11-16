require( './css/styles.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 180;
const sizeIssueTrackRatio = 1;
const LANGUAGE = 'de';
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
// END Banner-Specific configuration

import TrackingEvents from '../shared/tracking_events';
import SizeIssueIndicator from '../shared/track_size_issues';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const Translations = {}; // will only be needed for English banner, German defaults are in DesktopBanner
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const campaignDaySentence = new CampaignDaySentence(
	new CampaignDays(
		startOfDay( GlobalBannerSettings[ 'campaign-start-date' ] ),
		endOfDay( GlobalBannerSettings[ 'campaign-end-date' ] )
	),
	LANGUAGE
);
const getCustomDayName = require( '../shared/custom_day_name' );
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

const bannerTemplate = require( './templates/banner_html.hbs' );

const $ = require( 'jquery' );
require( '../shared/wlightbox.js' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const customDayName = getCustomDayName( BannerFunctions.getCurrentGermanDay, LANGUAGE );
const currentDayName = BannerFunctions.getCurrentGermanDay();
const weekdayPrepPhrase = customDayName === currentDayName ? 'an diesem' : 'am heutigen';
const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );
const ProgressBar = require( '../shared/progress_bar/progress_bar' );
const progressBar = new ProgressBar( GlobalBannerSettings, campaignProjection, {} );

$bannerContainer.html( bannerTemplate( {
	amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	customDayName: customDayName,
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressBar: progressBar.render()
} ) );

// BEGIN form init code

const trackingEvents = new TrackingEvents( trackingBaseUrl, BannerName, $( '.click-tracking__pixel' ) );

function setupValidationEventHandling() {
	var banner = $( '#WMDE_Banner' );
	banner.on( 'validation:amount:ok', function () {
		$( '#WMDE_Banner-amounts-error-text' ).hide();
		$( '#WMDE_Banner-amounts' ).removeClass( 'select-group--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:amount:error', function ( evt, text ) {
		$( '#WMDE_Banner-amounts-error-text' ).text( text ).show();
		$( '#WMDE_Banner-amounts' ).addClass( 'select-group--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:period:ok', function () {
		$( '#WMDE_Banner-frequency-error-text' ).hide();
		$( '#WMDE_Banner-frequency' ).removeClass( 'select-group--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:period:error', function ( evt, text ) {
		$( '#WMDE_Banner-frequency-error-text' ).text( text ).show();
		$( '#WMDE_Banner-frequency' ).addClass( 'select-group--with-error' );
		addSpaceInstantly();
	} );
}

function setupAmountEventHandling() {
	var banner = $( '#WMDE_Banner' );
	// using delegated events with empty selector to be markup-independent and still have corrent value for event.target
	banner.on( 'amount:selected', null, function () {
		$( '#amount-other-input' ).val( '' );
		$( '#WMDE_Banner' ).trigger( 'validation:amount:ok' );
	} );

	banner.on( 'amount:custom', null, function () {
		$( '#WMDE_Banner-amounts .select-group__input' ).prop( 'checked', false );
		$( '#WMDE_Banner' ).trigger( 'validation:amount:ok' );
	} );
}

function validateAndSetPeriod() {
	var selectedInterval = $( '#WMDE_Banner-frequency input[type=radio]:checked' ).val();
	if ( typeof selectedInterval === 'undefined' ) {
		BannerFunctions.showFrequencyError( 'Bitte wählen Sie zuerst ein Zahlungsintervall.' );
		return false;
	}
	$( '#intervalType' ).val( selectedInterval > 0 ? '1' : '0' );
	$( '#periode' ).val( selectedInterval );
	BannerFunctions.hideFrequencyError();
	return true;
}

$( '#WMDE_Banner-payment button' ).click( function ( e ) {
	$( '#zahlweise' ).val( $( this ).data( 'payment-type' ) );
	if ( !validateAndSetPeriod() || !BannerFunctions.validateAmount( BannerFunctions.getAmount() ) ) {
		e.preventDefault();
		return false;
	}
} );

/* Convert browser events to custom events */
$( '#WMDE_Banner-amounts' ).find( 'label' ).click( function () {
	$( this ).trigger( 'amount:selected' );
} );

$( '#amount-other-input' ).change( function () {
	$( this ).trigger( 'amount:custom' );
} );

$( '#WMDE_Banner-frequency label' ).on( 'click', function () {
	BannerFunctions.hideFrequencyError();
} );

BannerFunctions.initializeBannerEvents();

// END form init code

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

	setupValidationEventHandling();
	setupAmountEventHandling();

	$( 'body' ).prepend( $( '#centralNotice' ) );

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
trackingEvents.trackClickEvent( $( '#application-of-funds-link' ), 'application-of-funds-lightbox-opened' );
trackingEvents.trackClickEvent( $( '#link-wmf-annual-plan' ), 'wmf-annual-plan' );
trackingEvents.trackClickEvent( $( '#link-wmde-annual-plan' ), 'wmde-annual-plan' );
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
		setTimeout( displayBanner, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 7500 );
	}
} );
