require( './css/styles.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 180;
const sizeIssueTrackRatio = 0.01;
const LANGUAGE = 'de';
// END Banner-Specific configuration

import EventLoggingTracker from '../shared/event_logging_tracker';
import SizeIssueIndicator from '../shared/track_size_issues';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import DayName from '../shared/day_name';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import Translations from '../shared/messages/de';

const Handlebars = require( 'handlebars/runtime' );
Handlebars.registerHelper( 'capitalizeFirstLetter', function ( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
} );

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
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
		donorsPerMinute: GlobalBannerSettings[ 'appr-donators-per-minute' ],
		goalDonationSum: GlobalBannerSettings.goalSum
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
const progressBar = new ProgressBar( GlobalBannerSettings, campaignProjection, {
	textInnerLeft: progressBarTextInnerLeft,
	modifier: 'progress_bar--lateprogress'
} );
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	amountNeeded: donorFormatter( campaignProjection.getProjectedRemainingDonationSum() ),
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressBar: progressBar.render()
} ) );

const $bannerForm = $( '#WMDE_Banner-form' );

// BEGIN form init code

const trackingEvents = new EventLoggingTracker( BannerName );

function setupValidationEventHandling() {
	var banner = $( '#WMDE_Banner' );
	banner.on( 'validation:amount:ok', function () {
		$( '#WMDE_Banner-amounts-error-text' ).hide();
		$( '#WMDE_Banner-amounts' ).parent().removeClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:amount:error', function ( evt, text ) {
		$( '#WMDE_Banner-amounts-error-text' ).text( text ).show();
		$( '#WMDE_Banner-amounts' ).parent().addClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:period:ok', function () {
		$( '#WMDE_Banner-frequency-error-text' ).hide();
		$( '#WMDE_Banner-frequency' ).parent().removeClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:period:error', function ( evt, text ) {
		$( '#WMDE_Banner-frequency-error-text' ).text( text ).show();
		$( '#WMDE_Banner-frequency' ).parent().addClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:paymenttype:ok', function () {
		$( '#WMDE_Banner-payment-type-error-text' ).hide();
		$( '#WMDE_Banner-payment-type' ).parent().removeClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:paymenttype:error', function ( evt, text ) {
		$( '#WMDE_Banner-payment-type-error-text' ).text( text ).show();
		$( '#WMDE_Banner-payment-type' ).parent().addClass( 'select-group-container--with-error' );
		addSpaceInstantly();
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
		$( '#betrag' ).val( BannerFunctions.getAmount() );
		BannerFunctions.hideAmountError();
	} );

	banner.on( 'amount:custom', null, function () {
		$( '#WMDE_Banner-amounts .select-group__input' ).prop( 'checked', false );
		var input = $( '.select-group__custom-input' );
		input.addClass( 'select-group__custom-input--value-entered' );
		BannerFunctions.hideAmountError();
		$( '#betrag' ).val( BannerFunctions.getAmount() );
		appendEuroSign( input );
	} );

	banner.on( 'paymenttype:selected', null, function () {
		let bannerAction = $bannerForm.data( 'main-action' );
		if ( $( 'input[name=zahlweise]:checked', document.donationForm ).val() === 'BEZ' ) {
			bannerAction = $bannerForm.data( 'fallback-action' );
		}
		$bannerForm.attr( 'action', bannerAction );
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
trackingEvents.trackClickEvent( $( '#application-of-funds-link' ), 'application-of-funds-shown', 1 );
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
		bannerDisplayTimeout.cancel();
	} );
} );
