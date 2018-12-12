require( './css/styles_var.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

/* global CampaignName */
/* global BannerName */

// For A/B testing different styles, load
// require( './css/styles_top_var.pcss' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const LANGUAGE = 'de';
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
// END Banner-Specific configuration

import UrlTracker from '../shared/url_tracker';
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
const Handlebars = require( 'handlebars/runtime' );
Handlebars.registerHelper( 'capitalizeFirstLetter', function ( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
} );
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

const bannerTemplate = require( './templates/banner_html_var.hbs' );

const $ = require( 'jquery' );
require( '../shared/wlightbox.js' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const ProgressBar = require( '../shared/progress_bar/progress_bar' );
const progressBar = new ProgressBar( GlobalBannerSettings, campaignProjection );

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

const trackingEvents = new UrlTracker( trackingBaseUrl, BannerName, $( '.click-tracking__pixel' ) );

function setupValidationEventHandling() {
	var banner = $( '#WMDE_Banner' );
	banner.on( 'validation:amount:ok', function () {
		var errorText = $( '#WMDE_Banner-amounts-error-text' );
		errorText.hide();
		errorText.removeClass( 'select-group--with-error' );
	} );
	banner.on( 'validation:amount:error', function ( evt, text ) {
		var errorText = $( '#WMDE_Banner-amounts-error-text' );
		errorText.text( text ).show();
		errorText.addClass( 'select-group--with-error' );
	} );
	banner.on( 'validation:period:ok', function () {
		$( '#WMDE_Banner-frequency-error-text' ).hide();
		$( '#WMDE_Banner-frequency' ).removeClass( 'select-group--with-error' );
	} );
	banner.on( 'validation:period:error', function ( evt, text ) {
		$( '#WMDE_Banner-frequency-error-text' ).text( text ).show();
		$( '#WMDE_Banner-frequency' ).addClass( 'select-group--with-error' );
	} );
	banner.on( 'validation:paymenttype:ok', function () {
		$( '#WMDE_Banner-payment-type-error-text' ).hide();
		$( '#WMDE_Banner-payment-type' ).parent().removeClass( 'select-group-container--with-error' );
	} );
	banner.on( 'validation:paymenttype:error', function ( evt, text ) {
		$( '#WMDE_Banner-payment-type-error-text' ).text( text ).show();
		$( '#WMDE_Banner-payment-type' ).parent().addClass( 'select-group-container--with-error' );
	} );
}

function appendEuroSign( field ) {
	if ( $( field ).val() !== '' &&
		!/^.*(€)$/.test( $( field ).val() ) ) {
		$( field ).val( $( field ).val() + ' €' );
	}
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
		var input = $( '.select-group__custom-input' );
		input.addClass( 'select-group__custom-input--value-entered' );
		BannerFunctions.hideAmountError();
		appendEuroSign( input );
	} );

	banner.on( 'paymenttype:selected', null, function () {
		$( '#WMDE_Banner' ).trigger( 'validation:paymenttype:ok' );
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
		BannerFunctions.validateAmount( BannerFunctions.getAmount() ) &&
		BannerFunctions.validatePaymentType();
}

$( '.WMDE-Banner-submit button' ).click( function () {
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

$( '#WMDE_Banner-payment-type label' ).on( 'click', function () {
	$( this ).trigger( 'paymenttype:selected' );
} );

BannerFunctions.initializeBannerEvents();

// END form init code

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
	bannerElement.css( { top: 0 } );
	setTimeout( function () { progressBar.animate(); }, 1000 );
	setTimeout( function () { animateHighlight( $( '.text__highlight' ), 'text__highlighted-character', 10 ); }, 4000 );

	$( window ).resize( function () {
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
