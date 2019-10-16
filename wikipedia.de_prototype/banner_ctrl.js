import { render, createElement } from 'preact';
import Banner from './banners/Banner';
import DesktopBanner from './banners/DesktopBanner';
import Translations from '../shared/messages/de';
import DayName from '../shared/day_name';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import { createCampaignParameters } from '../shared/campaign_parameters';
import MatomoTracker from '../shared/matomo_tracker';
import NullTracker from '../shared/null_tracker';
import { CampaignProjection } from '../shared/campaign_projection';
import * as DevGlobalBannerSettings from '../shared/global_banner_settings'
import ProgressBar from '../shared/progress_bar/progress_bar';

/* These globals are compiled into the banner through the WrapperPlugin, see webpack.common.js */
/* global CampaignName */
/* global BannerName */
/* global _paq */

const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const bannerClickTrackRatio = 1; // TODO FOR TESTING
const bannerCloseTrackRatio = 1; // TODO FOR TESTING
let eventTracker;
if ( typeof _paq === 'undefined' ) {
	eventTracker = new NullTracker( BannerName );
} else {
	eventTracker = new MatomoTracker( _paq, BannerName );
}
const trackingData = {
	eventTracker: eventTracker,
	bannerClickTrackRatio: bannerClickTrackRatio,
	bannerCloseTrackRatio: bannerCloseTrackRatio
};

const LANGUAGE = 'de';
const dayName = new DayName( new Date() );
const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
const weekdayPrepPhrase = dayName.isSpecialDayName() ? Translations[ 'day-name-prefix-todays' ] : Translations[ 'day-name-prefix-this' ];
const CampaignParameters = createCampaignParameters();
const campaignDays = new CampaignDays(
	startOfDay( CampaignParameters.startDate ),
	endOfDay( CampaignParameters.endDate )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE );

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
/*
// TODO integrate into banner
const progressBar = new ProgressBar(
	{ goalDonationSum: CampaignParameters.donationProjection.goalDonationSum },
	campaignProjection,
	{}
);

*/

render(
	createElement( DesktopBanner, {
		amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
		numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
		currentDayName: currentDayName,
		weekdayPrepPhrase: weekdayPrepPhrase,
		campaignDaySentence: campaignDaySentence.getSentence(),
		campaignName: CampaignName,
		bannerName: BannerName,
		// TODO research how to embed HTML in react component
		// progressBar: progressBar.render(),
		trackingData: trackingData,
		showBanner: '', // TODO use state to generate empty string or 'is-hidden'
		closeBanner: () => { console.log('TODO: set closed state') }
	}),
	document.getElementById('WMDE-Banner-Container'));

/*
// TODO use when we have a progress bar
setTimeout( function () { progressBar.animate(); }, 1000 );
 */
