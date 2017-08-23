require( './css/styles.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueTrackRatio = 1;
const LANGUAGE = 'de';

// END Banner-Specific configuration

const fundraisingBanner = {};

const DevGlobalBannerSettings = require( './GlobalBannerSettings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const Translations = {}; // will only be needed for English banner, German defaults are in DesktopBanner
const BannerFunctions = require( './js/banner_functions' )( GlobalBannerSettings, Translations );
const SizeIssues = require( './js/track_size_issues' );
const getCampaignDaySentence = require( './js/count_campaign_days' )( GlobalBannerSettings[ 'campaign-start-date' ], GlobalBannerSettings[ 'campaign-end-date' ] );
const getCustomDayName = require( './js/custom_day_name' );
const TrackingEvents = require( './js/tracking_events' );

const bannerTemplate = require('./templates/banner_html.hbs');

const $ = require( 'jquery' );
require( './js/wlightbox.js' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const customDayName = getCustomDayName( BannerFunctions.getCurrentGermanDay, LANGUAGE );
const currentDayName = BannerFunctions.getCurrentGermanDay();
const weekdayPrepPhrase = customDayName === currentDayName ? 'an diesem' : 'am heutigen';

$bannerContainer.html( bannerTemplate( {
    // TODO approx. donors
    customDayName: customDayName,
    currentDayName: currentDayName,
    weekdayPrepPhrase: weekdayPrepPhrase,
    campaignDaySentence: getCampaignDaySentence( LANGUAGE ),
    daysRemaining: BannerFunctions.getDaysRemaining( LANGUAGE ),
    CampaignName: CampaignName,
    BannerName: BannerName
} ) );

// BEGIN form init code

const trackingLinkGenerator = new TrackingEvents( BannerName, $( '#WMDE_Banner-close-ct' ) );

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
      banner.on( 'amount:selected', null, function( evt ) {
          $( '#amount-other-input' ).val( '' );
          $( '#WMDE_Banner' ).trigger( 'validation:amount:ok' );
      } );

      banner.on( 'amount:custom', null, function( evt ) {
          $( '#WMDE_Banner-amounts .select-group__input' ).prop( 'checked', false );
          $( '#WMDE_Banner' ).trigger( 'validation:amount:ok' );
      } );
}

function validateAndSetPeriod() {
    var selectedInterval = $( '#WMDE_Banner-frequency input[type=radio]:checked' ).val();
    if ( typeof selectedInterval === 'undefined' ) {
        BannerFunctions.showFrequencyError( 'Bitte wählen Sie zuerst ein Zahlungsintervall.' );
        return false;
    }
    $( '#intervalType' ).val( selectedInterval > 0 ? '1' : '0' );
    $( '#periode' ).val( selectedInterval );
	BannerFunctions.hideFrequencyError();
	return true;
}

$( '#WMDE_Banner-payment button' ).click( function( e ) {
    $( '#zahlweise' ).val( $( this ).data( 'payment-type' ) );
  if ( !validateAndSetPeriod() || !BannerFunctions.validateAmount( BannerFunctions.getAmount() ) ) {
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
}  );

BannerFunctions.initializeBannerEvents();


// END form init code

function addSpace() {
  if ( !$( '#WMDE_Banner' ).is( ':visible' ) ) {
    return;
  }
  var bannerHeight = $( 'div#WMDE_Banner' ).height(),
      skin = BannerFunctions.getSkin(),
	  cssForBannerOffset = {
		  top: bannerHeight,
		  transition: 'top 1s linear'
	  };

  switch ( skin ) {
      case 'vector':
      SizeIssues.trackSizeIssues(
          $( 'div#WMDE_Banner' ),
          trackingLinkGenerator.getTrackingURL( 'banner-size-issue' ),
          sizeIssueTrackRatio
      );
      $( '#mw-panel' ).css( cssForBannerOffset );
      $( '#mw-head' ).css( cssForBannerOffset );
      $( '#mw-page-base' ).css( {
          paddingTop: bannerHeight,
		  transition: 'padding-top 1s linear'
      } );
    case 'minerva':
      $( '#mw-mf-viewport' ).css( cssForBannerOffset );
      break;
  }
}

function addSpaceInstantly() {
  if ( !$( '#WMDE_Banner' ).is( ':visible' ) ) {
    return;
  }
  var bannerHeight = $( 'div#WMDE_Banner' ).height(),
      skin = BannerFunctions.getSkin(),
	  cssForBannerOffset = {
		  top: bannerHeight,
		  transition: 'none'
	  };

  switch ( skin ) {
    case 'vector':
		$( '#mw-panel' ).css( cssForBannerOffset );
		$( '#mw-head' ).css( cssForBannerOffset );
		$( '#mw-page-base' ).css( {
            paddingTop: bannerHeight,
			transition: 'none'
        } );
	  case 'minerva':
	    $( '#mw-mf-viewport' ).css( cssForBannerOffset );
		break;
  }
}

function removeBannerSpace() {
	var skin = BannerFunctions.getSkin();
	switch ( skin ) {
        case 'vector':
			$( '#mw-panel' ).css( { top: 0, transition: 'none' } );
			$( '#mw-head' ).css( { top: 0, transition: 'none' } );
			$( '#mw-page-base' ).css( { paddingTop: 0, transition: 'none' } );
			break;
		case 'minerva':
			$( '#mw-mf-viewport' ).css( { top: 0, transition: 'none' } );
			$( '#mw-mf-page-center, #mw-mf-page-left' ).css( 'top', 0 );
			break;
		case 'monobook':
			$( '#globalWrapper' ).css( 'position', 'relative' );
			$( '#globalWrapper' ).css( 'top', 0 );
			break;
	}
}

function displayBanner() {
  var bannerElement = $( '#WMDE_Banner' ),
      bannerHeight = bannerElement.height();

  setupValidationEventHandling();
  setupAmountEventHandling();

	$( 'body' ).prepend( $( '#centralNotice' ) );
	bannerElement.css( {
		top: -bannerHeight,
		display: 'block'
	} );
	addSpace();
	bannerElement.css( {
		top: 0,
		transition: 'top 1s linear'
	} );

  $( window ).resize( function () {
    addSpaceInstantly();
    calculateLightboxPosition();
  } );
}

function calculateLightboxPosition() {
    $( '#wlightbox' ).css( {
        right: ( $('body').width() - 750 ) / 2 + 'px',
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
    right: ( $('body').width() - 750 ) / 2 + 'px',
    top: function() {
        return ( $( '#WMDE_Banner' ).height() + 20 ) + 'px';
    }
} );

$( '#application-of-funds-link' ).click( function () {
    // Lightbox position is relative to banner position
    window.scrollTo(0,0);
} );

// track lightbox link clicking and banner closing
trackingLinkGenerator.trackClickEvent( $( '#application-of-funds-link' ), 'application-of-funds-lightbox-opened' );
trackingLinkGenerator.trackClickEvent( $( '#link-wmf-annual-plan' ), 'wmf-annual-plan' );
trackingLinkGenerator.trackClickEvent( $( '#link-wmde-annual-plan' ), 'wmde-annual-plan' );
trackingLinkGenerator.trackClickEvent( $( '#WMDE_Banner .close__link' ), 'banner-closed', bannerCloseTrackRatio );

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
  if ( BannerFunctions.onMediaWiki() && window.mw.config.get( 'wgAction' ) !== "view" ) {
    return;
  }
  setTimeout( displayBanner, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 7500 );
} );
