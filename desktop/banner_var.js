require( './css/styles.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// For A/B testing different styles, load
// require( './styles_var.pcss' );

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

// For A/B testing different text or markup, load
// const bannerTemplate = require('./banner_var.hbs');
const bannerTemplate = require('./templates/banner_html_var.hbs');

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

const trackingLinkGenerator = new TrackingEvents( BannerName, $( '.click-tracking__pixel' ) );

const periodAmounts = {
    0: [ 5, 15, 25, 50, 75, 100, 250 ],
	1: [ 1, 2, 3, 5, 10, 15, 25 ],
	3: [ 5, 10, 15, 20, 25, 30, 50 ],
    6: [ 5, 10, 15, 20, 25, 50, 100 ],
    12: [ 5, 10, 15, 20, 25, 50, 100 ]
};

function setPeriodDependentAmounts( period ) {
    // Just to be sure, should never happen
    if ( typeof periodAmounts[ period ] === 'undefined' ) {
        return;
    }
    let amounts = periodAmounts[ period ].slice( 0 );
    $( '#WMDE_Banner-amounts .select-group__option' ).each( function () {
        const option = $( this );
        if ( amounts.length == 0 || !option.has( '.select-group__input' ) ) {
            return;
        }
        $( '.select-group__input', option ).prop( 'checked', false ).val( amounts[ 0 ] );
		$( '.select-group__state', option ).text( amounts[ 0 ] + ' €' );
		amounts.shift();
	})
    
}

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

function setupPeriodEventHandling() {
	const banner = $( '#WMDE_Banner' );
	banner.on( 'period:selected', null, function( evt ) {
        setPeriodDependentAmounts( $( 'input', evt.target ).val() );
        BannerFunctions.hideFrequencyError();
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
  $( this ).trigger( 'period:selected' );
} );

BannerFunctions.initializeBannerEvents();


// END form init code

function addSpace() {
  if ( !$( '#WMDE_Banner' ).is( ':visible' ) ) {
    return;
  }
  var bannerHeight = $( 'div#WMDE_Banner' ).height(),
      skin = BannerFunctions.getSkin();

  switch ( skin ) {
    case 'vector':
      SizeIssues.trackSizeIssues(
          $( 'div#WMDE_Banner' ),
          trackingLinkGenerator.getTrackingURL( 'banner-size-issue' ),
          sizeIssueTrackRatio
      );
      $( '#mw-panel' ).animate( { 'top': bannerHeight }, 1000 );
      $( '#mw-head' ).animate( { 'top': bannerHeight }, 1000 );
      $( '#mw-page-base' ).animate( { 'padding-top': bannerHeight }, 1000);
    case 'minerva':
      $( '#mw-mf-viewport' ).animate( { 'top': bannerHeight}, 1000 );
      break;
  }
}

function addSpaceInstantly() {
  if ( !$( '#WMDE_Banner' ).is( ':visible' ) ) {
    return;
  }
  var bannerHeight = $( 'div#WMDE_Banner' ).height(),
      skin = BannerFunctions.getSkin();

  switch ( skin ) {
    case 'vector':
      $( '#mw-panel' ).css( { top: bannerHeight } );
      $( '#mw-head' ).css( { top: bannerHeight } );
      $( '#mw-page-base' ).css( { paddingTop: bannerHeight } );
    case 'minerva':
      $( '#mw-mf-viewport' ).css( { top: bannerHeight } );
      break;
  }
}

function removeBannerSpace() {
	var skin = BannerFunctions.getSkin();
	switch ( skin ) {
		case 'vector':
			$( '#mw-panel' ).css( 'top', 0 );
			$( '#mw-head' ).css( 'top', 0 );
			$( '#mw-page-base' ).css( 'padding-top', 0 );
			break;
		case 'minerva':
			$( '#mw-mf-viewport' ).css( 'top', 0 );
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
      bannerHeight;

  setupValidationEventHandling();
  setupAmountEventHandling();
  setupPeriodEventHandling();

  $( 'body' ).prepend( $( '#centralNotice' ) );

  bannerHeight = bannerElement.height();
  bannerElement.css( 'top', -bannerHeight );
  bannerElement.css( 'display', 'block' );
  addSpace();
  bannerElement.animate( { top: 0 }, 1000 );

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
