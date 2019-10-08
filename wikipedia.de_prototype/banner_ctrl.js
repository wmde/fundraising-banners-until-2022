import Banner from './banner_ctrl.svelte';
import Translations from '../shared/messages/de';
import DayName from '../shared/day_name';

const DevGlobalBannerSettings = require( '../shared/global_banner_settings' );
// TODO const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const GlobalBannerSettings = DevGlobalBannerSettings;
const BannerFunctions = require( '../shared/banner_functions' )( GlobalBannerSettings, Translations );
const trackingBaseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';

const LANGUAGE = 'de';
import CampaignDays, { startOfDay, endOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import { createCampaignParameters } from '../shared/campaign_parameters';
const dayName = new DayName( new Date() );
const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
const weekdayPrepPhrase = dayName.isSpecialDayName() ? Translations[ 'day-name-prefix-todays' ] : Translations[ 'day-name-prefix-this' ];
const CampaignParameters = createCampaignParameters();
const campaignDays = new CampaignDays(
	startOfDay( CampaignParameters.startDate ),
	endOfDay( CampaignParameters.endDate )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, LANGUAGE );
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

const ProgressBar = require( '../shared/progress_bar/progress_bar' );

const progressBar = new ProgressBar(
	{ goalDonationSum: CampaignParameters.donationProjection.goalDonationSum },
	campaignProjection,
	{}
);

/* These globals are compiled into the banner through the WrapperPlugin, see webpack.common.js */
/* global CampaignName */
/* global BannerName */

// eslint-disable-next-line no-new
new Banner( {
	target: document.getElementById( 'WMDE-Banner-Container' ),
	props: {
		amountBannerImpressionsInMillion: GlobalBannerSettings[ 'impressions-per-day-in-million' ],
		numberOfDonors: donorFormatter( campaignProjection.getProjectedNumberOfDonors() ),
		currentDayName: currentDayName,
		weekdayPrepPhrase: weekdayPrepPhrase,
		campaignDaySentence: campaignDaySentence.getSentence(),
		campaignName: CampaignName,
		bannerName: BannerName,
		progressBar: progressBar.render()
	}
} );

setTimeout( function () { progressBar.animate(); }, 1000 );
