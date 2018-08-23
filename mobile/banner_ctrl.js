/* eslint no-alert: 1 */

require( './css/styles.pcss' );
require( './css/styles_mini.pcss' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const searchBoxTrackRatio = 0.01;
const LANGUAGE = 'de';
// END Banner-Specific configuration

import EventLoggingTracker from '../shared/event_logging_tracker';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import InterruptibleTimeout from '../shared/interruptible_timeout';
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

const animateHighlight = require( '../shared/animate_highlight' );

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

const trackingEvents = new EventLoggingTracker( BannerName );
trackingEvents.trackClickEvent( $( '.mini-banner' ), 'mobile-mini-banner-expanded' );
trackingEvents.trackClickEvent( $( '.mini-banner__close-button' ), 'banner-closed', bannerCloseTrackRatio );

// BEGIN form initialization
$( '#impCount' ).val( BannerFunctions.increaseImpCount() );
$( '#bImpCount' ).val( BannerFunctions.increaseBannerImpCount( BannerName ) );

// Reset "other box" if they click a different amount
$( '#amount1, #amount2, #amount3, #amount4, #amount5' ).click( function () {
	$( '#input_amount_other_box' ).val( '' );
} );

$( '.button-group__container button' ).click( function ( event ) {
	return submitForm( event );
} );
// END form initialization

function submitForm( event ) {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' ).val();
	if ( isValidForm( $checkedAmountElement ) ) {
		setParameters( event, $checkedAmountElement );
		return true;
	} else {
		return false;
	}
}

function setParameters( event, amount ) {
	$( '#zahlweise' ).val( $( event.target ).data( 'payment-type' ) );
	$( '#betrag' ).val( amount );
}

function isValidForm( amount ) {
	if ( !isValidAmount( amount ) ) {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
		return false;
	} else {
		return true;
	}
}
function isValidAmount( amount ) {
	return amount > 0;
}

function displayMiniBanner() {

	const miniBanner = $( '.mini-banner' );
	const bannerHeight = miniBanner.height();
	miniBanner.css( 'top', 0 - bannerHeight ).show();

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
	$( '#mw-mf-viewport' ).css( { marginTop: 0 } );
	$( '#frbanner' ).show();
	$( '.mini-banner' ).slideToggle();

	progressBar.animate();
	window.setTimeout( function () {
		animateHighlight( $( '#to-highlight' ), 'highlight', 10 );
	}, 3000 );
}

$( document ).ready( function () {
	$( 'body' ).prepend( $( '#centralNotice' ) );

	bannerDisplayTimeout.run( displayMiniBanner, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 5000 );

	$( '#frbanner-close' ).click( function () {
		// Close only the full-screen
		$( '#frbanner' ).hide();
	} );

	$( '.mini-banner__close-button' ).click( function () {
		$( '.mini-banner' ).hide();
		BannerFunctions.removeBannerSpace();

		if ( BannerFunctions.onMediaWiki() ) {
			mw.centralNotice.hideBanner();
		}

		return false;
	} );

	$( '.mini-banner' ).click( displayFullBanner );

	BannerFunctions.getSkin().addSearchObserver( function () {
		bannerDisplayTimeout.cancel();
		$( '.mini-banner' ).hide();
		BannerFunctions.removeBannerSpace();
		trackingEvents.createTrackHandler( 'search-box-used', searchBoxTrackRatio )();
	} );

} );
