import EventLoggingTracker from '../shared/legacy_event_logging_tracker';
import SizeIssueIndicator from '../shared/track_size_issues';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import DayName from '../shared/day_name';
import ProgressBar from '../shared/progress_bar/progress_bar';
import Translations from '../shared/messages/en';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { BannerFunctions as BannerFunctionsFactory } from '../shared/banner_functions';
import { CampaignProjection } from '../shared/campaign_projection';
import { amountInputFormatter, integerFormatter } from '../shared/number_formatter/en';
import { parseAmount } from '../shared/parse_amount';
import CssTransition from '../shared/css_transition';

require( './css/styles.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 160;
const sizeIssueTrackRatio = 0.01;
const LANGUAGE = 'en';
// END Banner-Specific configuration

const Handlebars = require( 'handlebars/runtime' );
Handlebars.registerHelper( 'capitalizeFirstLetter', function ( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
} );

const CampaignParameters = createCampaignParameters();
const BannerFunctions = BannerFunctionsFactory( null, Translations );
const campaignDays = new CampaignDays(
	startOfDay( CampaignParameters.startDate ),
	endOfDay( CampaignParameters.endDate )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE, 20 );
const campaignProjection = new CampaignProjection(
	new CampaignDays(
		startOfDay( CampaignParameters.donationProjection.baseDate ),
		endOfDay( CampaignParameters.endDate )
	),
	CampaignParameters.donationProjection
);

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
const numberOfDaysUntilCampaignEnd = campaignDays.getNumberOfDaysUntilCampaignEnd();
const progressBarTextRight = 'Still missing: € <span class="js-value_remaining"></span>M';
const progressBarTextInnerRight = '€ <span class="js-donation_value"></span>M';
const progressBarTextInnerLeft = [
	Translations[ 'prefix-days-left' ],
	numberOfDaysUntilCampaignEnd,
	numberOfDaysUntilCampaignEnd > 1 ? Translations[ 'day-plural' ] : Translations[ 'day-singular' ],
	Translations[ 'suffix-days-left' ] + '.'
].join( ' ' );
const progressBar = new ProgressBar(
	{ goalDonationSum: CampaignParameters.donationProjection.goalDonationSum },
	campaignProjection,
	{
		textInnerLeft: progressBarTextInnerLeft,
		textRight: progressBarTextRight,
		textInnerRight: progressBarTextInnerRight,
		decimalSeparator: '.',
		modifier: 'progress_bar--lateprogress'
	}
);
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	amountBannerImpressionsInMillion: CampaignParameters.millionImpressionsPerDay,
	numberOfDonors: integerFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	amountNeeded: integerFormatter( campaignProjection.getProjectedRemainingDonationSum() ),
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressBar: progressBar.render()
} ) );

// BEGIN form init code

const trackingEvents = new EventLoggingTracker( BannerName );

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
	banner.on( 'validation:paymenttype:ok', function () {
		$( '#WMDE_Banner-payment-type-error-text' ).hide();
		$( '#WMDE_Banner-payment-type' ).removeClass( 'select-group--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:paymenttype:error', function ( evt, text ) {
		$( '#WMDE_Banner-payment-type-error-text' ).text( text ).show();
		$( '#WMDE_Banner-payment-type' ).addClass( 'select-group--with-error' );
		addSpaceInstantly();
	} );
}

function setupAmountEventHandling() {
	var banner = $( '#WMDE_Banner' );
	// using delegated events with empty selector to be markup-independent and still have current value for event.target
	banner.on( 'amount:selected', null, function () {
		$( '#amount-other-input' ).val( '' );
		$( '.select-group__custom-input' ).removeClass( 'select-group__custom-input--value-entered' );
		banner.trigger( 'validation:amount:ok' );
	} );

	banner.on( 'amount:custom', null, function () {
		$( '#WMDE_Banner-amounts .select-group__input' ).prop( 'checked', false );
		var input = $( '#WMDE_Banner-amounts .select-group__custom-input' );
		input.addClass( 'select-group__custom-input--value-entered' );
		banner.trigger( 'validation:amount:ok' );
		input.val( amountInputFormatter( parseAmount( input.val() ) ) );
	} );

	banner.on( 'paymenttype:selected', null, function () {
		$( '#WMDE_Banner' ).trigger( 'validation:paymenttype:ok' );
	} );
}

function validateAndSetPeriod() {
	var selectedInterval = $( '#WMDE_Banner-frequency input[type=radio]:checked' ).val(),
		banner = $( '#WMDE_Banner' );
	if ( typeof selectedInterval === 'undefined' ) {
		banner.trigger( 'validation:period:error', Translations[ 'no-interval-message' ] );
		return false;
	}
	$( '#intervalType' ).val( selectedInterval > 0 ? '1' : '0' );
	$( '#periode' ).val( selectedInterval );
	banner.trigger( 'validation:period:ok' );
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
	var $bannerElement = $( '#WMDE_Banner' ),
		$languageInfoElement = $( '#langInfo' );

	if ( !$bannerElement.is( ':visible' ) ) {
		return;
	}

	BannerFunctions.getSkin().addSpace(
		$bannerElement.height() + ( $languageInfoElement.is( ':visible' ) ? $languageInfoElement.height() : 0 ),
		new CssTransition()
	);
}

function addSpaceInstantly() {
	var $bannerElement = $( '#WMDE_Banner' ),
		$languageInfoElement = $( '#langInfo' );

	if ( !$bannerElement.is( ':visible' ) ) {
		return;
	}

	BannerFunctions.getSkin().addSpaceInstantly(
		$bannerElement.height() +
		( $languageInfoElement.is( ':visible' ) ? $languageInfoElement.height() : 0 )
	);
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
		positionLanguageInfoBox();
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

function showLanguageInfoBox() {
	positionLanguageInfoBox();
	$( '#langInfo' ).show();
}

function positionLanguageInfoBox() {
	var langInfoElement = $( '#langInfo' ),
		formWidth = $( '#WMDE_Banner-form' ).width() - 20,
		bannerHeight = $( '#WMDE_Banner' ).outerHeight();
	langInfoElement.css( 'top', bannerHeight );
	langInfoElement.css( 'width', formWidth );
}

var impCount = BannerFunctions.increaseImpCount();
$( '#impCount' ).val( impCount );
var bannerImpCount = BannerFunctions.increaseBannerImpCount( BannerName );
$( '#bImpCount' ).val( bannerImpCount );

// END Banner close functions

// Display banner on load
$( function () {
	var $bannerElement = $( '#WMDE_Banner' );
	var closeLink = $( '#WMDE_Banner .close__link' );

	$( 'body' ).prepend( $( '#centralNotice' ) );

	if ( BannerFunctions.onMediaWiki() && window.mw.config.get( 'wgAction' ) !== 'view' ) {
		return;
	}

	// track lightbox link clicking and banner closing
	trackingEvents.trackClickEvent( $( '#application-of-funds-link' ), 'application-of-funds-shown', 1 );
	trackingEvents.trackCloseEventViewPortDimensions( closeLink,
		function () { return sizeIssueIndicator.getDimensions( $bannerElement.height() ); },
		0,
		0,
		bannerCloseTrackRatio
	);

	trackingEvents.trackViewPortDimensions(
		sizeIssueIndicator.getDimensions( $bannerElement.height() ),
		sizeIssueTrackRatio
	);

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

	$( '.select-group__option, .button-group__button' ).click( function () {
		showLanguageInfoBox();
		addSpaceInstantly();
	} );

	// BEGIN Banner close functions
	// NOTE: These functions need to stay at the end for the correct order of click events

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
} );
