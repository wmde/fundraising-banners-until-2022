require( './css/styles.pcss' );
require( './css/icons.css' );
require( './css/wlightbox.css' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueThreshold = 180;
const sizeIssueTrackRatio = 0.01;
const searchBoxTrackRatio = 0.01;
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
// END Banner-Specific configuration

import TrackingEvents from '../shared/tracking_events';
import SizeIssueIndicator from '../shared/track_size_issues';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import InterruptibleTimeout from '../shared/interruptible_timeout';
import Translations from '../shared/messages/de';

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
GlobalBannerSettings[ 'appr-donations-per-minute' ] = 200;
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
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
		donorsPerMinute: GlobalBannerSettings[ 'appr-donators-per-minute' ],
		goalDonationSum: GlobalBannerSettings.goalSum
	}
);
const formatNumber = require( 'format-number' );
const donorFormatter = formatNumber( { round: 0, integerSeparator: '.' } );

const bannerTemplate = require( './templates/banner_html.hbs' );

const $ = require( 'jquery' );

const $bannerContainer = $( '#WMDE-Banner-Container' );
const CampaignName = $bannerContainer.data( 'campaign-tracking' );
const BannerName = $bannerContainer.data( 'tracking' );
const sizeIssueIndicator = new SizeIssueIndicator( sizeIssueThreshold );
const ProgressBar = require( '../shared/progress_bar/progress_bar' );
const progressBar = new ProgressBar( GlobalBannerSettings, campaignProjection, {
	textRight: '',
	textInnerRight: 'Geschafft: <span class="js-donation_value">0,0</span> Mio. Euro'
} );
const bannerDisplayTimeout = new InterruptibleTimeout();

$bannerContainer.html( bannerTemplate( {
	numberOfDonors: donorFormatter( 359444 ),
	CampaignName: CampaignName,
	BannerName: BannerName,
	progressBar: progressBar.render(),
	numberOfNewMembersLastYear: '64.596',
	becomeMemberLink: 'https://spenden.wikimedia.de/apply-for-membership?skin=10h16&type=sustaining&' +
		'piwik_campaign=' + CampaignName + '&piwik_kwd=' + BannerName
} ) );

const trackingEvents = new TrackingEvents( trackingBaseUrl, BannerName, $( '.click-tracking__pixel' ) );

$( '.expand_button' ).on( 'click', function ( e ) {
	e.preventDefault();
	$( 'div#WMDE_Banner .banner' ).toggleClass( 'expanded' );
	addSpaceInstantly();
} );

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

	bannerHeight = bannerElement.height();
	bannerElement.css( 'top', -bannerHeight );
	bannerElement.css( 'display', 'block' );
	addSpace();
	bannerElement.animate( { top: 0 }, 1000 );
	setTimeout( function () { progressBar.animate(); }, 1000 );

	var $numberOfDonors = $( '.infobox .mobile-only .number_of_donors' );
	$( { Counter: 0 } ).animate(
		{ Counter: 359444 },
		{
			duration: 3000,
			easing: 'swing',
			step: function () {
				$numberOfDonors.text( donorFormatter( Math.ceil( this.Counter ) ) );
			}
		}
	);

	$( window ).resize( function () {
		addSpaceInstantly();
	} );
}

// track banner expansion and closing
trackingEvents.trackClickEvent( $( '.expand_button' ), 'banner-expanded', 1 );
trackingEvents.trackClickEvent( $( '#WMDE_Banner .close__link' ), 'banner-closed', bannerCloseTrackRatio );

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

// Display banner on load
$( function () {
	var $bannerElement = $( '#WMDE_Banner' );

	$( 'body' ).prepend( $( '#centralNotice' ) );

	if ( BannerFunctions.onMediaWiki() && window.mw.config.get( 'wgAction' ) !== 'view' ) {
		return;
	}

	if ( sizeIssueIndicator.hasSizeIssues( $bannerElement ) ) {
		if ( BannerFunctions.onMediaWiki() ) {
			mw.centralNotice.setBannerLoadedButHidden();
		}
		trackingEvents.trackSizeIssueEvent(
			sizeIssueIndicator.getDimensions( $bannerElement.height() ),
			sizeIssueTrackRatio
		);
	} else {
		bannerDisplayTimeout.run( displayBanner, $( '#WMDE-Banner-Container' ).data( 'delay' ) || 0 );
	}

	BannerFunctions.getSkin().addSearchObserver( function () {
		trackingEvents.createTrackHandler( 'search-box-used', searchBoxTrackRatio )();
		bannerDisplayTimeout.cancel();
	} );
} );
