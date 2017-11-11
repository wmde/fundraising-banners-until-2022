/* eslint no-alert: 1 */

require( './css/styles.pcss' );
require( './css/styles_var.pcss' );
require( './css/styles_mini.pcss' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const LANGUAGE = 'de';
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
// END Banner-Specific configuration

import TrackingEvents from '../shared/tracking_events';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const Translations = {}; // will only be needed for English banner, German defaults are in DesktopBanner
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const campaignDaySentence = new CampaignDaySentence( new CampaignDays(
	startOfDay( GlobalBannerSettings[ 'campaign-start-date' ] ),
	endOfDay( GlobalBannerSettings[ 'campaign-end-date' ] )
), LANGUAGE );
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

const getCustomDayName = require( '../shared/custom_day_name' );
const animateHighlight = require( '../shared/animate_highlight' );

const bannerTemplate = require( './templates/banner_html_var.hbs' );

const $ = require( 'jquery' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const customDayName = getCustomDayName( BannerFunctions.getCurrentGermanDay, LANGUAGE );
const currentDayName = BannerFunctions.getCurrentGermanDay();
const weekdayPrepPhrase = customDayName === currentDayName ? 'an diesem' : 'am heutigen';
const ProgressBar = require( '../shared/progress_bar/progress_bar' );
const progressBar = new ProgressBar( GlobalBannerSettings, campaignProjection, {} );

$bannerContainer.html( bannerTemplate( {
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	customDayName: customDayName,
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressBar: progressBar.render()
} ) );

const trackingEvents = new TrackingEvents( trackingBaseUrl, BannerName, $( '.banner-tracking' ) );
trackingEvents.trackClickEvent( $( '.mini-banner' ), 'banner-expanded' );
trackingEvents.trackClickEvent( $( '.mini-banner__close-button' ), 'banner-closed', bannerCloseTrackRatio );

// BEGIN form initialization
$( '#impCount' ).val( BannerFunctions.increaseImpCount() );
$( '#bImpCount' ).val( BannerFunctions.increaseBannerImpCount( BannerName ) );

$( '.send' ).click( function () {
	return validateForm();
} );

// Reset "other box" if they click a different amount
$( '#amount1, #amount2, #amount3, #amount4, #amount5' ).click( function () {
	$( '#input_amount_other_box' ).val( '' );
} );

$( '#btn-ppl' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if ( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'PPL' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );

$( '#btn-cc' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if ( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'MCP' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );

$( '#btn-ueb' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if ( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'UEB' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );

$( '#btn-bez' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if ( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'BEZ' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );

$( '#btn-sofort' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if ( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'SUB' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );

// END form initialization

function addBannerSpace() {

	var bannerHeight = $( '.mini-banner' ).height();
	$( '.mini-banner' ).css( 'top', 0 - bannerHeight ).show();

	$( '.mini-banner' ).animate( {
		top: 0
	}, 1000 );

	$( '#mw-mf-viewport' ).animate( {
		marginTop: bannerHeight
	}, 1000 );

	$( 'head' ).append( '<style>#mw-mf-viewport .overlay.media-viewer { margin-top: ' + ( 0 - bannerHeight ) + 'px }</style>' );
}

$( document ).ready( function () {
	$( 'body' ).prepend( $( '#centralNotice' ) );

	setTimeout( addBannerSpace, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 5000 );

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

	$( '.mini-banner' ).click( function () {
		window.scrollTo( 0, 0 );
		$( '#mw-mf-viewport' ).css( { marginTop: 0 } );
		$( '#frbanner' ).show();
		$( '.mini-banner' ).slideToggle();

		progressBar.animate();
		window.setTimeout( function () {
			animateHighlight( $( '#to-highlight' ), 'highlight', 10 );
		}, 3000 );
	} );
} );

function validateForm() {
	var form = document.donationForm;
	var error = false;

	if ( $( '#interval_multiple' ).attr( 'checked' ) === 'checked' ) {
		if ( $( 'input[name=interval]:checked', form ).length !== 1 ) {
			alert( 'Es wurde kein Zahlungsintervall ausgewählt.' );
			return false;
		} else {
			$( '#intervalType' ).val( '1' );
			$( '#periode' ).val( $( 'input[name=interval]:checked', form ).val() );
		}
	} else {
		$( '#periode' ).val( '0' );
	}

	// Get amount selection
	var amount = null;
	for ( var i = 0; i < form.betrag_auswahl.length; i++ ) {
		if ( form.betrag_auswahl[ i ].checked ) {
			amount = form.betrag_auswahl[ i ].value;
			break;
		}
	}
	// Check amount is a real number
	error = ( amount === null || isNaN( amount ) || amount.value <= 0 );
	// Check amount is at least the minimum
	if ( amount < 1 || error ) {

		return false;
	} else if ( amount > 99999 ) {

		return false;
	}
	return !error;
}
