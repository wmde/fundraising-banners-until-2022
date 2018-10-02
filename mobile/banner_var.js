/* eslint no-alert: 1 */

require( './css/styles_var.pcss' );

import EventLoggingTracker from '../shared/event_logging_tracker';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import DayName from '../shared/day_name';
import Translations from '../shared/messages/de';
import { Slider } from './banner_var_slider';

const $ = require( 'jquery' );
const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const formatNumber = require( 'format-number' );
const CampaignProjection = require( '../shared/campaign_projection' );
const bannerTemplate = require( './templates/banner_html_var.hbs' );

// BEGIN Banner-Specific configuration
const bannerClickTrackRatio = 0.01;
const bannerCloseTrackRatio = 0.01;
const searchBoxTrackRatio = 0.01;
const LANGUAGE = 'de';
const fullscreenBannerSlideInSpeed = 1250;
// END Banner-Specific configuration

/**
 * Slider wrapper object holding a Flickity-based slider
 * @type {Slider}
 */
const bannerSlider = new Slider();

const campaignDays = new CampaignDays(
	startOfDay( GlobalBannerSettings[ 'campaign-start-date' ] ),
	endOfDay( GlobalBannerSettings[ 'campaign-end-date' ] )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE, 14 );
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

const donorFormatter = formatNumber( { round: 0, integerSeparator: '.' } );

const dayName = new DayName( new Date() );
const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
const weekdayPrepPhrase = dayName.isSpecialDayName() ? Translations[ 'day-name-prefix-todays' ] : Translations[ 'day-name-prefix-this' ];

const animateHighlight = require( '../shared/animate_highlight' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );

const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
	CampaignName: CampaignName,
	BannerName: BannerName
} ) );

const trackingEvents = new EventLoggingTracker( BannerName );
trackingEvents.trackClickEvent( $( '#mini-banner-close-button' ), 'banner-closed', bannerCloseTrackRatio );

// BEGIN form initialization

$( '#impCount' ).val( BannerFunctions.increaseImpCount() );
$( '#bImpCount' ).val( BannerFunctions.increaseBannerImpCount( BannerName ) );

$( '.select-group__option' ).click( function () {
	$( '#betrag' ).val( $( 'input[name=betrag_auswahl]:checked' ).val() );
} );

// Disable Sofort-Überweisung payment option if chosen interval is not 'one time'
$( 'input[name=interval]' ).click( function () {
	const subPaymentButton = $( 'button[data-payment-type=SUB]' );
	if ( $( this ).attr( 'id' ) !== 'interval_onetime' ) {
		// Reset payment method selection when Sofortüberweisung was previously selected
		if ( subPaymentButton.hasClass( 'selected-option' ) ) {
			$( '#zahlweise' ).val( '' );
		}
		subPaymentButton.removeClass( 'selected-option' );
		subPaymentButton.attr( 'disabled', true );
	} else {
		subPaymentButton.attr( 'disabled', false );
	}
} );

$( '.interval-selection input' ).click( function ( event ) {
	$( '.interval-selection .selected-option' ).removeClass( 'selected-option' );
	$( event.target ).addClass( 'selected-option' );
	$( '#periode' ).val( $( 'input[name=interval]:checked' ).val() );
} );

$( '.amount-selection button' ).click( function ( event ) {
	$( '.amount-selection .selected-option' ).removeClass( 'selected-option' );
	$( event.target ).addClass( 'selected-option' );
	$( '#betrag' ).val( $( 'input[name=betrag_auswahl]:checked' ).val() );
} );

$( '.payment-selection button' ).click( function ( event ) {
	event.preventDefault();
	$( '.payment-selection .selected-option' ).removeClass( 'selected-option' );
	$( event.target ).addClass( 'selected-option' );
	$( '#zahlweise' ).val( $( event.target ).data( 'payment-type' ) );
} );

$( '#banner-form-submit' ).click( function () {
	if ( !$( '#periode' ).val() || $( '.interval-selection .selected-option' ).length === 0 ) {
		alert( 'Bitte wählen Sie ein Zahlungsinterval aus.' );
		return false;
	}
	if ( !$( '#betrag' ).val() ) {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
		return false;
	}
	if ( !$( '#zahlweise' ).val() ) {
		alert( 'Bitte wählen Sie ein Zahlungsmittel aus.' );
		return false;
	}
	return true;
} );

// END form initialization

function displayMiniBanner() {

	const miniBanner = $( '.mini-banner' );
	const bannerHeight = miniBanner.outerHeight() + 40;

	// Banner starts in far off screen and needs to be reset, workaround to get sliders to work
	miniBanner.css( 'top', -bannerHeight );
	miniBanner.animate( { top: 0 }, 1000 );

	$( '#mw-mf-viewport' ).animate( { marginTop: bannerHeight }, 1000 );

	$( 'head' ).append( '<style>#mw-mf-viewport .overlay.media-viewer { margin-top: ' + ( 0 - bannerHeight ) + 'px }</style>' );
}

/**
 * Hides mini banner and slides down full-screen banner
 * Animation is split into two parts:
 * First it slides to the viewport, next it pushes the viewport further down along with the fullscreen banner
 */
function displayFullBanner() {
	trackingEvents.track(
		'mobile-mini-banner-expanded',
		bannerClickTrackRatio,
		bannerSlider.getViewedSlides(),
		bannerSlider.getCurrentSlide()
	);

	$( '.mini-banner' ).hide();
	window.scrollTo( 0, 0 );

	const viewport = $( '#mw-mf-viewport' );
	const viewportOffset = viewport.css( 'margin-top' ).slice( 0, -2 );
	const fullscreenBanner = $( '.frbanner-window' );
	const bannerHeight = fullscreenBanner.outerHeight();

	// Placing fullscreen banner above of the page
	fullscreenBanner.css( 'top', -bannerHeight );

	// Calculating the percentage which the viewport was already pushed by the mini-banner
	const viewPortOffsetFactor = viewportOffset / bannerHeight;

	// Calculating the time that is needed to reach the previous mini-banner viewport offset without affecting the perceived speed of the banner
	const initialSlideTime = fullscreenBannerSlideInSpeed * viewPortOffsetFactor;

	// Pushing the fullscreen banner to where the mini banner previously was, aligning it with the viewport
	fullscreenBanner.animate( { top: viewportOffset - bannerHeight },
		initialSlideTime, 'linear' ).queue( function () {

		// Calculating the remaining time at which the banner has to finish the slide to match the speed of the previous animation
		const remainingSlideTime = fullscreenBannerSlideInSpeed * ( 1 - viewPortOffsetFactor );

		// Now that the viewport and banner are aligned, both of them are pushed further down simultaneously
		viewport.animate( { marginTop: bannerHeight }, remainingSlideTime, 'linear' );
		fullscreenBanner.dequeue();
		fullscreenBanner.animate( { top: 0 }, remainingSlideTime, 'linear' ).queue( function () {
			// Once fullscreen banner is fully shown, the contents are animated
			setTimeout( function () {
				animateHighlight( $( '#to-highlight' ), 'highlight', 10 );
			}, 500 );
		} );

	} );
}

$( document ).ready( function () {
	$( 'body' ).prepend( $( '#centralNotice' ) );

	$( '#frbanner-close' ).click( function () {
		$( '#mw-mf-viewport' ).css( { marginTop: 0 } );
		$( '#frbanner' ).hide();
	} );

	$( '#mini-banner-close-button' ).click( function () {
		$( '.mini-banner' ).hide();
		BannerFunctions.removeBannerSpace();
		if ( BannerFunctions.onMediaWiki() ) {
			mw.centralNotice.hideBanner();
		}
		return false;
	} );

	bannerSlider.initialize();

	BannerFunctions.getSkin().addSearchObserver( function () {
		bannerDisplayTimeout.cancel();
		$( '.mini-banner' ).hide();
		BannerFunctions.removeBannerSpace();
		trackingEvents.createTrackHandler( 'search-box-used', searchBoxTrackRatio )();
	} );

	const bannerDelay = $( '#WMDE-Banner-Container' ).data( 'delay' ) || 5000;
	bannerDisplayTimeout.run( displayMiniBanner, bannerDelay );

	const clickableBannerArea = $( '.mini-banner-tab, .mini-banner .banner-headline' );

	clickableBannerArea.click( displayFullBanner );
} );
