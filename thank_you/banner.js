require( './css/styles.pcss' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 160;
const sizeIssueTrackRatio = 0.01;
const LANGUAGE = 'de';
// END Banner-Specific configuration

import EventLoggingTracker from '../shared/event_logging_tracker';
import SizeIssueIndicator from '../shared/track_size_issues';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import DayName from '../shared/day_name';
import Translations from '../shared/messages/en';
import { createCampaignParameters } from '../shared/campaign_parameters';

const Handlebars = require( 'handlebars/runtime' );
Handlebars.registerHelper( 'capitalizeFirstLetter', function ( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
} );

const CampaignParameters = createCampaignParameters();
const BannerFunctions = require( '../shared/banner_functions' )( null, Translations );
const campaignDays = new CampaignDays(
	startOfDay( CampaignParameters.startDate ),
	endOfDay( CampaignParameters.endDate )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE, 20 );
const CampaignProjection = require( '../shared/campaign_projection' );
const campaignProjection = new CampaignProjection(
	new CampaignDays(
		startOfDay( CampaignParameters.donationProjection.baseDate ),
		endOfDay( CampaignParameters.endDate )
	),
	CampaignParameters.donationProjection
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
const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	amountBannerImpressionsInMillion: CampaignParameters.millionImpressionsPerDay,
	numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
	amountNeeded: donorFormatter( campaignProjection.getProjectedRemainingDonationSum() ),
	currentDayName: currentDayName,
	weekdayPrepPhrase: weekdayPrepPhrase,
	campaignDaySentence: campaignDaySentence.getSentence(),
	CampaignName: CampaignName,
	BannerName: BannerName
} ) );

// BEGIN form init code

const trackingEvents = new EventLoggingTracker( BannerName );

BannerFunctions.initializeBannerEvents();

// END form init code

function addSpace() {
	var $bannerElement = $( '#WMDE_Banner' ),
		$languageInfoElement = $( '#langInfo' );

	if ( !$bannerElement.is( ':visible' ) ) {
		return;
	}

	BannerFunctions.getSkin().addSpace(
		$bannerElement.height() +
		( $languageInfoElement.is( ':visible' ) ? $languageInfoElement.height() : 0 )
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

	bannerHeight = bannerElement.height();
	bannerElement.css( 'top', -bannerHeight );
	bannerElement.css( 'display', 'block' );
	addSpace();
	bannerElement.animate( { top: 0 }, 1000 );

	$( window ).resize( function () {
		addSpaceInstantly();
	} );
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

	$( '.expand_button' ).click( function () {
		$( '.banner__expanded' ).css( 'display', 'flex' );
	} );
	$( '.collapse_button' ).click( function () {
		$( '.banner__expanded' ).css( 'display', 'none' );
	} );

	// hide banner when the visual editor is initialized
	$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( function () {
		$( '#WMDE_Banner' ).hide();
		removeBannerSpace();
	} );

	// END Banner close functions
} );
