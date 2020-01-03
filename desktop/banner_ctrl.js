import EventLoggingTracker from '../shared/event_logging_tracker';
import SizeIssueIndicator from '../shared/track_size_issues';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import DayName from '../shared/day_name';
import ProgressBar from '../shared/progress_bar/progress_bar';
import Translations from '../shared/messages/de';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { BannerFunctions as BannerFunctionsFactory } from '../shared/banner_functions';
import { CampaignProjection } from '../shared/campaign_projection';
import { parseAmount } from '../shared/parse_amount';
import { amountInputFormatter, amountForServerFormatter, donorFormatter } from '../shared/number_formatter/de';
import { render, createElement } from 'preact';
import FundsModal from '../shared/components/FundsModal';
import fundsModalData from '../node_modules/fundraising-frontend-content/i18n/de_DE/data/useOfFunds.json';

require( './css/styles.pcss' );
require( '../shared/components/FundsModal.pcss' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 160;
const sizeIssueTrackRatio = 0.01;
const submitTrackingRatio = 1;
const LANGUAGE = 'de';
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
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE );
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

const bannerTemplate = require( './templates/banner_html.hbs' );

const $ = require( 'jquery' );
require( '../shared/wlightbox.js' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );

const progressBarTextRight = 'Es fehlen: <span class="js-value_remaining">1.2</span> Mio. €';
const progressBarTextInnerRight = '<span class="js-donation_value">1.2</span> Mio. €';
const numberOfDaysUntilCampaignEnd = campaignDays.getNumberOfDaysUntilCampaignEnd();
const progressBarTextInnerLeft = [
	Translations[ 'prefix-days-left' ],
	numberOfDaysUntilCampaignEnd,
	numberOfDaysUntilCampaignEnd > 1 ? Translations[ 'day-plural' ] : Translations[ 'day-singular' ],
	Translations[ 'suffix-days-left' ]
].join( ' ' );
const progressBar = new ProgressBar(
	{ goalDonationSum: CampaignParameters.donationProjection.goalDonationSum },
	campaignProjection,
	{
		textRight: progressBarTextRight,
		textInnerRight: progressBarTextInnerRight,
		textInnerLeft: progressBarTextInnerLeft,
		decimalSeparator: ',',
		modifier: 'progress_bar--lateprogress'
	}
);
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	amountBannerImpressionsInMillion: CampaignParameters.millionImpressionsPerDay,
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	amountNeeded: donorFormatter( campaignProjection.getProjectedRemainingDonationSum() ),
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressBar: progressBar.render()
} ) );

// BEGIN form init code

let isUseOfFundsModalVisible = false;

let fundsModal = createElement( FundsModal, {
	locale: LANGUAGE,
	fundsModalData: fundsModalData,
	isFundsModalVisible: isUseOfFundsModalVisible,
	setToggleFundsModal: toggleUseOfFundsVisibility
} );

function toggleUseOfFundsVisibility() {
	fundsModal.props.isFundsModalVisible = !fundsModal.props.isFundsModalVisible;
	render(
		fundsModal,
		document.getElementById( 'modal_wrapper' )
	);

}

const trackingEvents = new EventLoggingTracker( BannerName );

function setupValidationEventHandling() {
	var banner = $( '#WMDE_Banner' );
	banner.on( 'validation:amount:ok', function () {
		$( '#WMDE_Banner-amounts-error-wrapper' ).hide();
		$( '#WMDE_Banner-amounts' ).parent().removeClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:amount:error', function ( evt, text ) {
		$( '#WMDE_Banner-amounts-error-text' ).text( text );
		$( '#WMDE_Banner-amounts-error-wrapper' ).show();
		$( '#WMDE_Banner-amounts' ).parent().addClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:period:ok', function () {
		$( '#WMDE_Banner-frequency-error-wrapper' ).hide();
		$( '#WMDE_Banner-frequency' ).parent().removeClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:period:error', function ( evt, text ) {
		$( '#WMDE_Banner-frequency-error-text' ).text( text );
		$( '#WMDE_Banner-frequency-error-wrapper' ).show();
		$( '#WMDE_Banner-frequency' ).parent().addClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:paymenttype:ok', function () {
		$( '#WMDE_Banner-payment-type-error-wrapper' ).hide();
		$( '#WMDE_Banner-payment-type' ).parent().removeClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
	banner.on( 'validation:paymenttype:error', function ( evt, text ) {
		$( '#WMDE_Banner-payment-type-error-text' ).text( text );
		$( '#WMDE_Banner-payment-type-error-wrapper' ).show();
		$( '#WMDE_Banner-payment-type' ).parent().addClass( 'select-group-container--with-error' );
		addSpaceInstantly();
	} );
}

function setupAmountEventHandling() {
	var banner = $( '#WMDE_Banner' );
	// using delegated events with empty selector to be markup-independent and still have corrent value for event.target
	banner.on( 'amount:selected', null, function ( evt ) {
		const label = $( evt.target );
		if ( label.hasClass( 'select-group__option-amount-other-input' ) ) {

			label.find( '#field-amount_total_custom' ).prop( 'checked', true );
			label.find( '.select-group__custom-input' ).focus();
			return;
		}
		$( '#amount-other-input' ).val( '' );
		$( '.select-group__custom-input' ).removeClass( 'select-group__custom-input--value-entered' );
		BannerFunctions.hideAmountError();
	} );

	banner.on( 'amount:custom', null, function () {
		var input = $( '.select-group__custom-input' );
		input.addClass( 'select-group__custom-input--value-entered' );
		const customAmountValue = parseAmount( input.val() );
		// put input field value in radio button because otherwise
		// the FundraisingFrontend will prefer the empty radio value over the custom value
		// In the CTRL banner, the code would unset the radio buttons
		$( '#field-amount_total_custom' ).val( amountForServerFormatter( customAmountValue ) );
		BannerFunctions.hideAmountError();
		input.val( amountInputFormatter( customAmountValue ) );
	} );

	banner.on( 'paymenttype:selected', null, function () {
		$( '#WMDE_Banner' ).trigger( 'validation:paymenttype:ok' );
	} );

	banner.trigger( 'validation:init', banner.data( 'validation-event-handling' ) );
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
	if ( validateForm() ) {
		trackingEvents.trackViewPortDimensionsOnEvent(
			sizeIssueIndicator.getDimensions( $( '#WMDE_Banner' ).height() ),
			'submit',
			submitTrackingRatio
		);
		return true;
	}
	return false;
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
	bannerElement.css( 'left', 0 );
	bannerElement.css( 'display', 'block' );
	addSpace();
	bannerElement.animate( { top: 0 }, 1000 );
	setTimeout( function () { progressBar.animate(); }, 1000 );

	$( window ).resize( function () {
		addSpaceInstantly();
		calculateLightboxPosition();
	} );
	$( '#application-of-funds-link' ).click( toggleUseOfFundsVisibility );
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

// Display banner on load
$( function () {
	var $bannerElement = $( '#WMDE_Banner' );

	$( 'body' ).prepend( $( '#centralNotice' ) );

	if ( BannerFunctions.onMediaWiki() && window.mw.config.get( 'wgAction' ) !== 'view' ) {
		return;
	}

	// track lightbox link clicking and banner closing
	trackingEvents.trackClickEvent( $( '.application-of-funds-link' ), 'application-of-funds-shown', 1 );
	trackingEvents.trackCloseEventViewPortDimensions( $( '#WMDE_Banner .close__link' ),
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
