require( './css/styles.pcss' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 160;
const sizeIssueTrackRatio = 0.01;
// END Banner-Specific configuration

import EventLoggingTracker from '../shared/event_logging_tracker';
import SizeIssueIndicator from '../shared/track_size_issues';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import Translations from '../shared/messages/en';
import AnimatedCounter from '../shared/animated_counter';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { BannerFunctions as BannerFunctionsFactory } from '../shared/banner_functions';
import { CampaignProjection } from '../shared/campaign_projection';

const Handlebars = require( 'handlebars/runtime' );
Handlebars.registerHelper( 'capitalizeFirstLetter', function ( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
} );

const CampaignParameters = createCampaignParameters();
const BannerFunctions = BannerFunctionsFactory( null, Translations );
const campaignProjection = new CampaignProjection(
	new CampaignDays(
		startOfDay( CampaignParameters.donationProjection.baseDate ),
		endOfDay( CampaignParameters.endDate )
	),
	CampaignParameters.donationProjection
);
const formatNumber = require( 'format-number' );
const donorFormatter = formatNumber( { round: 0, integerSeparator: '.' } );
const donationFormatter = formatNumber( { round: 1, decimal: ',' } );

const bannerTemplate = require( './templates/banner_html_var.hbs' );

const $ = require( 'jquery' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	amountBannerImpressionsInMillion: CampaignParameters.millionImpressionsPerDay,
	numberOfDonors: donorFormatter( CampaignParameters.donationProjection.donorsBase ),
	amountNeeded: donorFormatter( campaignProjection.getProjectedRemainingDonationSum() ),
	goalDonationSum: CampaignParameters.donationProjection.goalDonationSum / 1000000,
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

function initializeDonorCounter() {
	const donorElement = document.getElementById( 'wmde-number-of-donors' );
	const donorCounter = new AnimatedCounter(
		function ( numDonors ) {
			donorElement.textContent = donorFormatter( numDonors );
		},
		0,
		CampaignParameters.donationProjection.donorsBase,
		3000
	);
	donorCounter.start();
}

function initializeDonationCounter() {
	const donationElement = document.getElementById( 'progress_bar__sum' );
	const donationCounter = new AnimatedCounter(
		function ( numDonors ) {
			donationElement.textContent = donationFormatter( numDonors / 1000000 );
		},
		0,
		CampaignParameters.donationProjection.goalDonationSum,
		3000
	);
	donationCounter.start();
}

function displayBanner() {
	var bannerElement = $( '#WMDE_Banner' ),
		bannerHeight;

	bannerHeight = bannerElement.height();
	bannerElement.css( 'top', -bannerHeight );
	bannerElement.css( 'display', 'block' );
	// banner doesn't stick to the top
	bannerElement.css( 'position', 'absolute' );
	addSpace();
	bannerElement.animate( { top: 0 }, 1000 );
	window.setTimeout( initializeDonorCounter, 1000 );
	window.setTimeout( initializeDonationCounter, 1000 );

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
		bannerDisplayTimeout.run( displayBanner, 0 );
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
		addSpaceInstantly();
	} );

	// hide banner when the visual editor is initialized
	$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( function () {
		$( '#WMDE_Banner' ).hide();
		removeBannerSpace();
	} );

	// END Banner close functions
} );
