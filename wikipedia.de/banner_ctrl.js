import { render, createElement } from 'preact';
import Banner from './banners/Banner';
import Translations from '../shared/messages/de';
import DayName from '../shared/day_name';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import { createCampaignParameters } from '../shared/campaign_parameters';
import MatomoTracker from '../shared/matomo_tracker';
import NullTracker from '../shared/null_tracker';
import { CampaignProjection } from '../shared/campaign_projection';
import * as DevGlobalBannerSettings from '../shared/global_banner_settings';
import formatNumber from 'format-number';

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

const LOCALE = 'de';
const dayName = new DayName( new Date() );
const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
const weekdayPrepPhrase = dayName.isSpecialDayName() ? Translations[ 'day-name-prefix-todays' ] : Translations[ 'day-name-prefix-this' ];
const CampaignParameters = createCampaignParameters();
const campaignDays = new CampaignDays(
	startOfDay( CampaignParameters.startDate ),
	endOfDay( CampaignParameters.endDate )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LOCALE );

const campaignProjection = new CampaignProjection(
	campaignDays,
	{
		baseDonationSum: GlobalBannerSettings[ 'donations-collected-base' ],
		donationAmountPerMinute: GlobalBannerSettings[ 'appr-donations-per-minute' ],
		donorsBase: GlobalBannerSettings[ 'donators-base' ],
		donorsPerMinute: GlobalBannerSettings[ 'appr-donators-per-minute' ],
		goalDonationSum: GlobalBannerSettings.goalDonationSum
	}
);

const donorFormatter = formatNumber( { round: 0, integerSeparator: '.' } );

render(
	createElement( Banner, {
		amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
		numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
		currentDayName: currentDayName, // TODO Move to Infobox
		weekdayPrepPhrase: weekdayPrepPhrase, // TODO Move to Infobox
		campaignDaySentence: campaignDaySentence.getSentence(), // TODO replace with campaignDays, move campaignDaySentence to Infobox
		campaignName: CampaignName,
		bannerName: BannerName,
		trackingData: trackingData,
		translations: Translations,
		locale: LOCALE,
		campaignProjection
	} ),
	document.getElementById( 'WMDE-Banner-Container' ) );
