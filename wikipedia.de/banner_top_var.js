require( './css/styles_top.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// For A/B testing different styles, load
// require( './css/styles_top_var.pcss' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const LANGUAGE = 'de';
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
// END Banner-Specific configuration

import TrackingEvents from '../shared/tracking_events';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import DayName from '../shared/day_name';

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
import Translations from '../shared/messages/de';
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const campaignDays = new CampaignDays(
	startOfDay( GlobalBannerSettings[ 'campaign-start-date' ] ),
	endOfDay( GlobalBannerSettings[ 'campaign-end-date' ] )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE, 14 );
const animateHighlight = require( '../shared/animate_highlight' );
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

// const bannerTemplate = require( './templates/banner_html_top.hbs' );
// For A/B testing different text or markup, load
const bannerTemplate = require( './templates/banner_html_top_var.hbs' );

const $ = require( 'jquery' );
require( '../shared/wlightbox.js' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const ProgressBar = require( '../shared/progress_bar/progress_bar' );
const numberOfDaysUntilCampaignEnd = campaignDays.getNumberOfDaysUntilCampaignEnd();
const progressBarTextInnerLeft = [
	Translations[ 'prefix-days-left' ],
	numberOfDaysUntilCampaignEnd,
	numberOfDaysUntilCampaignEnd > 1 ? Translations[ 'day-plural' ] : Translations[ 'day-singular' ],
	Translations[ 'suffix-days-left' ]
].join( ' ' );
const progressBar = new ProgressBar( GlobalBannerSettings, campaignProjection, {
	textInnerLeft: progressBarTextInnerLeft
} );

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
		$( '.select-group__custom-input' ).removeClass( 'select-group__custom-input--value-entered' );
		BannerFunctions.hideAmountError();
	} );

	banner.on( 'amount:custom', null, function () {
		$( '#WMDE_Banner-amounts .select-group__input' ).prop( 'checked', false );
		$( '.select-group__custom-input' ).addClass( 'select-group__custom-input--value-entered' );
		BannerFunctions.hideAmountError();
	} );
}

function validateAndSetPeriod() {
	var selectedInterval = $( '#WMDE_Banner-frequency input[type=radio]:checked' ).val();
	if ( typeof selectedInterval === 'undefined' ) {
		BannerFunctions.showFrequencyError( Translations[ 'no-interval-message' ] );
		return false;
	}
	$( '#intervalType' ).val( selectedInterval > 0 ? '1' : '0' );
	$( '#periode' ).val( selectedInterval );
	BannerFunctions.hideFrequencyError();
	return true;
}

function validateForm() {
	return validateAndSetPeriod() &&
		BannerFunctions.validateAmount( BannerFunctions.getAmount() );
}

$( '.WMDE-Banner-payment button' ).click( function () {
	$( '#zahlweise' ).val( $( this ).data( 'payment-type' ) );
	return validateForm();
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
	addSpaceInstantly();
	bannerElement.css( { top: 0 } );
	setTimeout( function () { progressBar.animate(); }, 1000 );
	setTimeout( function () { animateHighlight( $( '.text__highlight' ), 'text__highlighted-character', 10 ); }, 4000 );

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
	container: $( 'body' ),
	right: ( $( 'body' ).width() - 750 ) / 2 + 'px',
	top: function () {
		return ( $( '#WMDE_Banner' ).height() + 20 ) + 'px';
	}
} );

$( '#application-of-funds-link' ).click( function () {
	// Lightbox position is relative to banner position
	window.scrollTo( 0, 0 );
} );

// record banner impression
trackingEvents.recordBannerImpression();

// track lightbox link clicking and banner closing
trackingEvents.trackClickEvent( $( '#application-of-funds-link' ), 'application-of-funds-lightbox-opened' );
trackingEvents.trackClickEvent( $( '#link-wmf-annual-plan' ), 'wmf-annual-plan' );
trackingEvents.trackClickEvent( $( '#link-wmde-annual-plan' ), 'wmde-annual-plan' );
trackingEvents.trackClickEvent( $( '#WMDE_Banner .close__link' ), 'banner-closed', bannerCloseTrackRatio );

// BEGIN Banner close functions
$( '#WMDE_Banner .close__link' ).click( function () {
	$( '#WMDE_Banner' ).hide();
	removeBannerSpace();

	return false;
} );
// END Banner close functions

// Display banner on load
$( function () {
	displayBanner();
} );
