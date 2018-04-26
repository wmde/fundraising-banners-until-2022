/* eslint no-alert: 1 */

require( './css/styles.pcss' );

// BEGIN Banner-Specific configuration
const bannerClickTrackRatio = 1;
const bannerCloseTrackRatio = 0.01;
const searchBoxTrackRatio = 0.01;
const LANGUAGE = 'de';
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
// END Banner-Specific configuration

import TrackingEvents from '../shared/tracking_events';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import DayName from '../shared/day_name';
import Flickity from 'flickity';

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );

const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
import Translations from '../shared/messages/de';
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const campaignDays = new CampaignDays(
	startOfDay( GlobalBannerSettings[ 'campaign-start-date' ] ),
	endOfDay( GlobalBannerSettings[ 'campaign-end-date' ] )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE, 14 );
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

const bannerTemplate = require( './templates/banner_html.hbs' );

const $ = require( 'jquery' );

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
	textInnerLeft: progressBarTextInnerLeft,
	modifier: 'progress_bar--lateprogress'
} );
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressBar: progressBar.render()
} ) );

const trackingEvents = new TrackingEvents( trackingBaseUrl, BannerName, $( '.banner-tracking' ) );
trackingEvents.trackClickEvent( $( '.mini-banner-tab' ), 'banner-expanded', bannerClickTrackRatio );
trackingEvents.trackClickEvent( $( '.mini-banner-close-button' ), 'banner-closed', bannerCloseTrackRatio );

// BEGIN form initialization
$( '#impCount' ).val( BannerFunctions.increaseImpCount() );
$( '#bImpCount' ).val( BannerFunctions.increaseBannerImpCount( BannerName ) );

// Reset "other box" if they click a different amount
$( '#amount1, #amount2, #amount3, #amount4, #amount5' ).click( function () {
	$( '#input_amount_other_box' ).val( '' );
} );

$( '.button-group__container button' ).click( function ( event ) {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if ( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( $( event.target ).data( 'payment-type' ) );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		return true;
	}

	alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	return false;
} );
// END form initialization

function displayMiniBanner() {

	const miniBanner = $( '.mini-banner' );
	const bannerHeight = miniBanner.outerHeight() + 37;

	// Banner starts in far off screen and needs to be reset, workaround to get sliders to work
	miniBanner.css( 'top', -bannerHeight );
	miniBanner.animate( {
		top: 0
	}, 1000 );

	$( '#mw-mf-viewport' ).animate( {
		marginTop: bannerHeight
	}, 1000 );

	$( 'head' ).append( '<style>#mw-mf-viewport .overlay.media-viewer { margin-top: ' + ( 0 - bannerHeight ) + 'px }</style>' );
}

function displayFullBanner() {
	window.scrollTo( 0, 0 );
	$( '.mini-banner' ).hide();
	const viewport = $( '#mw-mf-viewport' );

	const viewportOffset = viewport.css( 'margin-top' ).slice( 0, -2 );
	const overlay = $( '.frbanner-window' );
	const bannerHeight = overlay.outerHeight();

	// Resetting overlay to the top of the page and aligning animation with previous viewport offset for smooth "pushing" animation
	overlay.css( 'top', -( bannerHeight ) );
	const viewPortOffsetFactor = viewportOffset / bannerHeight;
	const baseSpeed = 1250;
	const slideSpeed = baseSpeed * ( 1 - viewPortOffsetFactor );

	overlay.animate( {
		top: viewportOffset - bannerHeight
	}, baseSpeed * viewPortOffsetFactor, 'linear' ).queue( function () {
		viewport.animate( {
			marginTop: bannerHeight
		}, slideSpeed, 'linear' );
		overlay.dequeue();
		overlay.animate( {
			top: 0
		}, slideSpeed, 'linear' );
		window.setTimeout( function () {
			progressBar.animate();
		}, slideSpeed );
	} );
}

$( document ).ready( function () {
	$( 'body' ).prepend( $( '#centralNotice' ) );

	bannerDisplayTimeout.run( displayMiniBanner, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 5000 );

	$( '#frbanner-close' ).click( function () {
		// Close only the full-screen
		$( '#mw-mf-viewport' ).css( { marginTop: 0 } );
		$( '#frbanner' ).hide();
	} );

	$( '.mini-banner-close-button' ).click( function () {
		$( '.mini-banner' ).hide();
		BannerFunctions.removeBannerSpace();
		if ( BannerFunctions.onMediaWiki() ) {
			mw.centralNotice.hideBanner();
		}
		return false;
	} );

	BannerFunctions.getSkin().addSearchObserver( function () {
		bannerDisplayTimeout.cancel();
		$( '.mini-banner' ).hide();
		BannerFunctions.removeBannerSpace();
		trackingEvents.createTrackHandler( 'search-box-used', searchBoxTrackRatio )();
	} );

	const slider = new Flickity( document.querySelector( '.mini-banner-carousel' ), {
		wrapAround: true,
		autoPlay: 2000,
		prevNextButtons: false
	} );

	let slidesCount = $( '.mini-banner-carousel .carousel-cell' ).length;
	let autoplayCount = 0;

	slider.on( 'select', onSelect );

	function onSelect() {
		if ( slider.player.state !== 'playing' ) {
			disableAutoplay();
			return;
		}
		autoplayCount++;
		if ( autoplayCount >= slidesCount - 1 ) {
			disableAutoplay();
		}
	}

	function disableAutoplay() {
		slider.stopPlayer();
		slider.off( 'select', onSelect );
	}

	$( '.mini-banner-tab' ).click( displayFullBanner );
} );
