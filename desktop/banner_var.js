require( './css/styles.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// For A/B testing different styles, load
// require( './css/styles_var.pcss' );

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

const bannerTemplate = require( './templates/banner_html_var.hbs' );

const $ = require( 'jquery' );
require( '../shared/wlightbox.js' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );
const ProgressTree = require( '../shared/progress_tree/progress_tree' );
const progressTree = new ProgressTree( GlobalBannerSettings, campaignProjection, {} );
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressTree: progressTree.render()
} ) );

// BEGIN form init code

const trackingEvents = new TrackingEvents( trackingBaseUrl, BannerName, $( '.click-tracking__pixel' ) );

function setupValidationEventHandling() {
	var banner = $( '#WMDE_Banner' );
	banner.on( 'validation:amount:ok', function () {
		$( '#WMDE_Banner-amounts-error-text' ).hide();
		$( '#WMDE_Banner-amounts' ).removeClass( 'select-group--with-error' );
		if ( $( '.select-group--with-error' ).length === 0 ) {
			$( '#WMDE_Banner-form' ).removeClass( 'form--with-error' );
		}
		addSpaceInstantly();
	} );
	banner.on( 'validation:amount:error', function ( evt, text ) {
		$( '#WMDE_Banner-amounts-error-text' ).text( text ).show();
		$( '#WMDE_Banner-amounts' ).addClass( 'select-group--with-error' );
		$( '#WMDE_Banner-form' ).addClass( 'form--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:period:ok', function () {
		$( '#WMDE_Banner-frequency-error-text' ).hide();
		$( '#WMDE_Banner-frequency' ).removeClass( 'select-group--with-error' );
		if ( $( '.select-group--with-error' ).length === 0 ) {
			$( '#WMDE_Banner-form' ).removeClass( 'form--with-error' );
		}
		addSpaceInstantly();
	} );
	banner.on( 'validation:period:error', function ( evt, text ) {
		$( '#WMDE_Banner-frequency-error-text' ).text( text ).show();
		$( '#WMDE_Banner-frequency' ).addClass( 'select-group--with-error' );
		$( '#WMDE_Banner-form' ).addClass( 'form--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:paymenttype:ok', function () {
		$( '#WMDE_Banner-payment-type-error-text' ).hide();
		$( '#WMDE_Banner-payment-type' ).removeClass( 'select-group--with-error' );
		if ( $( '.select-group--with-error' ).length === 0 ) {
			$( '#WMDE_Banner-form' ).removeClass( 'form--with-error' );
		}
		addSpaceInstantly();
	} );
	banner.on( 'validation:paymenttype:error', function ( evt, text ) {
		$( '#WMDE_Banner-payment-type-error-text' ).text( text ).show();
		$( '#WMDE_Banner-payment-type' ).addClass( 'select-group--with-error' );
		$( '#WMDE_Banner-form' ).addClass( 'form--with-error' );
		addSpaceInstantly();
	} );
}

function setupAmountEventHandling() {
	var banner = $( '#WMDE_Banner' );
	// using delegated events with empty selector to be markup-independent and still have corrent value for event.target
	banner.on( 'amount:selected', null, function () {
		// $( '#amount-other-input' ).val( '' );
		$( '#WMDE_Banner' ).trigger( 'validation:amount:ok' );
	} );

	banner.on( 'amount:custom', null, function () {
		$( '#WMDE_Banner-amounts .select-group__input' ).prop( 'checked', false );
		$( '.select-group__custom-input' ).addClass( 'select-group__custom-input--value-entered' );
		BannerFunctions.hideAmountError();
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

$( '#WMDE_Banner-form' ).on( 'submit', function ( e ) {
	if ( !validateForm() ) {
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
	setTimeout( function () { progressTree.animate(); }, 1000 );

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

// BEGIN Presents code

function resetPresents() {
	$( '#WMDE_Banner' ).find( '.present' ).each( function () {
		var $present = $( this ),
			$input = $present.find( 'input' );

		$present.removeClass( 'active' );
		$present.find( '.present__amount' ).text(
			Number( $input.attr( 'step' ) ) + ' €'
		);
		$input.val( 0 );
	} );
}

function increasePresentAmount( $present ) {
	var $input = $present.find( 'input' ),
		$otherAmount = $( '#amount-other-input' ),
		stepSize = Number( $input.attr( 'step' ) ),
		newPresentAmount = Number( $input.val() ) + stepSize;

	$input.val( newPresentAmount );
	$otherAmount.val( Number( $otherAmount.val() ) + stepSize );

	if ( newPresentAmount > stepSize ) {
		$present.find( '.present__amount' ).text( newPresentAmount + ' €' );
	}

	$present.addClass( 'active' );
}

function decreasePresentAmount( $present ) {
	var $input = $present.find( 'input' ),
		$otherAmount = $( '#amount-other-input' ),
		stepSize = Number( $input.attr( 'step' ) ),
		newPresentAmount = Number( $input.val() ) - stepSize,
		newOtherAmount = Number( $otherAmount.val() ) - stepSize;

	if ( newPresentAmount < 0 ) {
		return;
	}

	if ( newOtherAmount < 0 ) {
		resetPresents();
		$otherAmount.val( '' );
		return;
	}

	$input.val( newPresentAmount );
	$otherAmount.val( newOtherAmount );

	if ( newPresentAmount >= stepSize ) {
		$present.find( '.present__amount' ).text( newPresentAmount + ' €' );
	}

	if ( newPresentAmount === 0 ) {
		$present.removeClass( 'active' );
	}
}

$( function () {
	var $presents = $( '#WMDE_Banner' ).find( '.presents' ),
		$presentsHoverGroup = $presents.find( '.present_image, .present_button' );

	$presentsHoverGroup.on( 'mouseenter', function () {
		$( this ).parent().addClass( 'hovered' );
	} );

	$presentsHoverGroup.on( 'mouseleave', function () {
		$( this ).parent().removeClass( 'hovered' );
	} );

	$presents.find( '.present_image' ).click( function () {
		increasePresentAmount( $( this ).parent() );
	} );

	$presents.find( '.increase__amount' ).click( function () {
		increasePresentAmount( $( this ).parent().parent() );
	} );

	$presents.find( '.reduce__amount' ).click( function () {
		decreasePresentAmount( $( this ).parent().parent() );
	} );
} );

// END Presents code

// BEGIN tree banner viewport code

// get window width compatible with CSS media queries
function getAccurateWindowWidth() {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

const smallScreenSize = 960; // this is 15px less from the CSS probably related to the scrollbar size
var	smallScreenMode = getAccurateWindowWidth() <= smallScreenSize;
function sizeOtherAmountFromScreenWidth( screenWidth ) {
	if ( screenWidth > smallScreenSize ) {
		$( '#amount-other-input' ).attr( 'placeholder', 'Betrag eingeben' )
			.parent().removeClass( 'select-group__option--thirdwidth select-group__custom--small' )
			.addClass( 'select-group__option--fullwidth select-group__custom--big' );
		smallScreenMode = false;
	}
	if ( screenWidth <= smallScreenSize ) {
		$( '#amount-other-input' ).attr( 'placeholder', 'anderes' )
			.parent().addClass( 'select-group__option--thirdwidth select-group__custom--small' )
			.removeClass( 'select-group__option--fullwidth select-group__custom--big' );
		smallScreenMode = true;
	}
}

$( function () {
// init other amount button size
	sizeOtherAmountFromScreenWidth( $( window ).width() );

	$( window ).resize( function () {
		var newScreenSize = getAccurateWindowWidth();

		if ( newScreenSize > 960 && !smallScreenMode ||
			newScreenSize <= 960 && smallScreenMode ) {
			return;
		}

		sizeOtherAmountFromScreenWidth( newScreenSize );
	} );
} );

// END tree banner viewport code

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
