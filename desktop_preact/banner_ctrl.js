// eslint-disable-next-line no-unused-vars
import style from './styles/styles_ctrl.pcss';

import { donorFormatter, millionFormatter } from '../shared/formatters';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { getTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';

import Banner from './Banner';
import EventLoggingTracker from '../shared/event_logging_tracker';
import BannerPresenter from '../shared/banner_presenter';
import DayName from '../shared/day_name';
import Translations from '../shared/messages/de';
import CampaignDays, { endOfDay, startOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import { CampaignProjection } from '../shared/campaign_projection';
import fundsModalData from '../node_modules/fundraising-frontend-content/i18n/de_DE/data/useOfFunds.json';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );

const campaignParameters = createCampaignParameters();
const trackingIds = getTrackingIds( bannerContainer );
const trackingEvents = new EventLoggingTracker( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter( trackingEvents, 1, bannerContainer.dataset.delay || 7500 );

const locale = 'de';
const dayName = new DayName( new Date() );
const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
const weekdayPrepPhrase = dayName.isSpecialDayName() ? Translations[ 'day-name-prefix-todays' ] : Translations[ 'day-name-prefix-this' ];
const campaignDays = new CampaignDays(
	startOfDay( campaignParameters.startDate ),
	endOfDay( campaignParameters.endDate )
);
const campaignDaySentence = new CampaignDaySentence( campaignDays, locale );

const campaignProjection = new CampaignProjection(
	new CampaignDays(
		startOfDay( campaignParameters.donationProjection.baseDate ),
		endOfDay( campaignParameters.endDate )
	),
	{
		baseDonationSum: campaignParameters.donationProjection.baseDonationSum,
		donationAmountPerMinute: campaignParameters.donationProjection.donationAmountPerMinute,
		donorsBase: campaignParameters.donationProjection.donorsBase,
		donorsPerMinute: campaignParameters.donationProjection.donationAmountPerMinute,
		goalDonationSum: campaignParameters.donationProjection.goalDonationSum
	}
);

bannerPresenter.present(
	Banner,
	bannerContainer,
	{
		//TODO maybe remove some unused props
		...trackingIds,
		campaignParameters,

		//TODO eine zentrale property fuer formatters

		numberOfDonors: donorFormatter( campaignParameters.donationProjection.donorsBase ),
		numberOfMembers: donorFormatter( campaignParameters.numberOfMembers ),
		goalDonationSum: millionFormatter( campaignParameters.donationProjection.goalDonationSum / 1000000 ),
		trackingData: getTrackingData( trackingIds.bannerName ),
		campaignProjection,
		campaignDays,
		campaignDaySentence,
		weekdayPrepPhrase,
		currentDayName,
		locale,
		fundsModalData
	}
);
