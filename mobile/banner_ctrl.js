require( './css/styles.pcss' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 1;
const LANGUAGE = 'de';
const PROJECTION_DEVIATION = true;
// END Banner-Specific configuration

const fundraisingBanner = {};

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const Translations = {}; // will only be needed for English banner, German defaults are in DesktopBanner
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const CampaignProjection = require( '../shared/campaign_projection' );
const campaignProjection = new CampaignProjection( {
	campaignStartDate: new Date( GlobalBannerSettings['campaign-start-date'] ),
	campaignEndDate: new Date( GlobalBannerSettings['campaign-end-date'] ),
	baseDonationSum: GlobalBannerSettings['donations-collected-base'],
	donationAmountPerMinute: GlobalBannerSettings['appr-donations-per-minute'],
	donorsBase: GlobalBannerSettings['donators-base'],
	donorsPerMinute: GlobalBannerSettings['appr-donators-per-minute']
} );

const numeral = require( 'numeral' );
numeral.register( 'locale', 'de-alternative', { delimiters: { thousands: '.', decimal: ',' } } );
numeral.locale( 'de-alternative' );

const getCampaignDaySentence = require( '../shared/count_campaign_days' )( GlobalBannerSettings[ 'campaign-start-date' ], GlobalBannerSettings[ 'campaign-end-date' ] );
const getCustomDayName = require( '../shared/custom_day_name' );
const animateHighlight = require( '../shared/animate_highlight' );
const TrackingEvents = require( '../shared/tracking_events' );

const bannerTemplate = require('./templates/banner_html.hbs');

const $ = require( 'jquery' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const numberOfDonors = numeral( campaignProjection.getProjectedNumberOfDonors( PROJECTION_DEVIATION ) ).format( '0,0' );
const customDayName = getCustomDayName( BannerFunctions.getCurrentGermanDay, LANGUAGE );
const currentDayName = BannerFunctions.getCurrentGermanDay();
const weekdayPrepPhrase = customDayName === currentDayName ? 'an diesem' : 'am heutigen';

$bannerContainer.html( bannerTemplate( {
	numberOfDonors: numberOfDonors,
	customDayName: customDayName,
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: getCampaignDaySentence( LANGUAGE ),
	daysRemaining: BannerFunctions.getDaysRemaining( LANGUAGE ),
	CampaignName: CampaignName,
	BannerName: BannerName
} ) );

const trackingLinkGenerator = new TrackingEvents( BannerName, $( '.banner-tracking' ) );
trackingLinkGenerator.trackClickEvent( $( '#frbanner2' ), 'banner-expanded' );
trackingLinkGenerator.trackClickEvent( $( '#frbanner2-close' ), 'banner-closed', bannerCloseTrackRatio );

// BEGIN form initialization
$( '#impCount' ).val( BannerFunctions.increaseImpCount() );
$( '#bImpCount' ).val( BannerFunctions.increaseBannerImpCount( BannerName ) );

$( '.send' ).click( function( e ) {
	return validateForm();
} );

// Reset "other box" if they click a different amount
$( '#amount1, #amount2, #amount3, #amount4, #amount5' ).click( function () {
	$( '#input_amount_other_box' ).val( '' );
} );

$( '#btn-ppl' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'PPL' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );

$( '#btn-cc' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'MCP' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );

$( '#btn-ueb' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'UEB' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );

$( '#btn-bez' ).click( function () {
	var $checkedAmountElement = $( 'input[name=betrag_auswahl]:checked' );
	if( $checkedAmountElement.length > 0 ) {
		$( '#zahlweise' ).val( 'BEZ' );
		$( '#betrag' ).val( $checkedAmountElement.val() );
		$( '#form' ).submit();
	} else {
		alert( 'Bitte wählen Sie einen Spendenbetrag aus.' );
	}
} );
// END form initialization

function debounce( func, wait, immediate ) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if ( !immediate ) func.apply( context, args );
		};
		var callNow = immediate && !timeout;
		clearTimeout( timeout );
		timeout = setTimeout( later, wait );
		if ( callNow ) func.apply( context, args );
	};
};

var lazyResize = debounce( function() {
	animateProgressBar();
}, 100 );
$( window ).on( 'orientationchange', lazyResize );

function addBannerSpace() {

	var bannerHeight = $( '#frbanner2' ).height();
	$( '#frbanner2' ).css( 'top', 0 - bannerHeight ).show();

	$( '#frbanner2' ).animate( {
		top: 0
	}, 1000 );

	$( '#mw-mf-viewport' ).animate( {
		marginTop: bannerHeight
	}, 1000 );

	$( 'head' ).append( '<style>#mw-mf-viewport .overlay.media-viewer { margin-top: ' + ( 0 - bannerHeight ) + 'px }</style>' );
}

function initializeDynamicPlaceholderValues() {

	$("span.donorsValue").html( addPointsToNum( getApprDonatorsRaw() ) );
	$( 'span#weekday' ).text( getCustomDayName( getCurrentGermanDay ) );
	if ( getCustomDayName( getCurrentGermanDay ) !== getCurrentGermanDay() ) {
		$( '#weekdayPrepPhrase' ).text( 'am heutigen' );
	}
	$( 'span#campaignDaySentence' ).text( getCampaignDaySentence() );
	$( 'span#numDaysLeft').text( getDaysRemaining() );
	$( '.bannerImpressions').text( GlobalBannerSettings[ 'milion-impressions-per-day' ] );

}

$(document).ready(function() {
	$('body').prepend($('#centralNotice'));

	initializeDynamicPlaceholderValues();

	setTimeout( addBannerSpace, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 5000 );

	$("#frbanner-close").click(function() {
		// Close only the full-screen
		$("#frbanner").hide();
	});

	$("#frbanner2-close").click(function() {
		$( '#frbanner2' ).hide();
		BannerFunctions.removeBannerSpace();

		if ( BannerFunctions.onMediaWiki() ) {
			mw.centralNotice.hideBanner();
		}

		return false;
	});

	$("#frbanner2").click(function() {
		window.scrollTo(0,0);
		$( '#mw-mf-viewport' ).css( { marginTop: 0 } );
		$("#frbanner").show();
		$("#frbanner2").slideToggle();

		animateProgressBar();
		window.setTimeout( function () {
			animateHighlight( $( '#to-highlight' ), 'highlight', 10 );
		}, 3000 );
	});

	// Show page 2 in preview
	var forced = location.search.match(/\bforce=1/);
	if (forced) {
		// Fullscreen banner
		window.scrollTo(0,0);
		$("#frbanner").show();

		animateProgressBar();
		window.setTimeout( function () {
			animateHighlight( $( '#to-highlight' ), 'highlight', 10 );
		}, 3000 );
	}
});



function animateProgressBar() {
	var donationFillElement = $( "#donationFill" );
	donationFillElement.width( '0px' );

	$( 'div#daysLeft' ).hide();

	var barWidth = $( '#donationMeter' ).width();
	var dTarget = parseInt( GlobalBannerSettings['goalSum'] );
	var dCollected = campaignProjection.getProjectedDonationSum();
	if( dCollected > ( dTarget ) ) {
		dCollected = dTarget;
	}
	var dRemaining = dTarget - dCollected;
	var widthToFill = (dCollected / dTarget * barWidth) - 3;

	donationFillElement.animate( { width: widthToFill + 'px' }, {
		duration: 2500,
		complete: function () {
			$( 'div#daysLeft' ).show();

			var fillWidth = $( 'div#donationFill' ).width();
			var tooltipWidth = $( 'div#donationTooltip' ).width();
			var tooltipMaxLeft = $('#donationMeterWrapper').outerWidth() - tooltipWidth - 5;

			$( '#sumDonations' ).text( addPointsToNum( dRemaining ) );

			$( 'div#donationTooltip' ).css( 'left', Math.min( ( fillWidth - tooltipWidth / 2 ), tooltipMaxLeft ) + 'px' ).show();
			$( 'div#donationTooltipArrow' ).css( 'left', ( fillWidth - 11 ) + 'px' ).show();

			var dFill = donationFillElement.width();
			var pFill = dFill / barWidth;
			var vRem = dRemaining / 1000000;

			vRem = vRem.toFixed( 1 );
			vRem = vRem.replace( ".", "," );

			$( "#valRem" ).html( vRem );
		}
	} );
}

function validateForm() {
	var form = document.donationForm;
	var error = false;

	if($('#interval_multiple').attr('checked') === 'checked') {
		if($('input[name=interval]:checked', form).length !== 1) {
			alert("Es wurde kein Zahlungsintervall ausgewählt.");
			return false;
		} else {
			$('#intervalType').val( "1" );
			$('#periode').val($('input[name=interval]:checked', form).val());
		}
	} else {
		$('#periode').val("0");
	}

	// Get amount selection
	var amount = null;
	for ( var i = 0; i < form.betrag_auswahl.length; i++ ) {
		if ( form.betrag_auswahl[i].checked ) {
			amount = form.betrag_auswahl[i].value;
			break;
		}
	}
	// Check amount is a real number
	error = ( amount == null || isNaN( amount ) || amount.value <= 0 );
	// Check amount is at least the minimum
	if ( amount < 1 || error ) {

		return false;
	} else if ( amount > 99999 ) {

		return false;
	}
	return !error;
}
