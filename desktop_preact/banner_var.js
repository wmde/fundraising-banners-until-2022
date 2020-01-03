// eslint-disable-next-line no-unused-vars
import style from './styles/styles_ctrl.pcss';

import { donorFormatter, millionFormatter } from '../shared/formatters';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { getTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';
import { getSkinAdjuster } from '../shared/skin';

import Banner from './Banner';
import EventLoggingTracker from '../shared/event_logging_tracker';
import BannerPresenter from '../shared/banner_presenter';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );

const CampaignParameters = createCampaignParameters();
const trackingIds = getTrackingIds( bannerContainer );
const trackingEvents = new EventLoggingTracker( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter( trackingEvents, 1 );

bannerPresenter.present(
	Banner,
	bannerContainer,
	{
		...trackingIds,
		numberOfDonors: donorFormatter( CampaignParameters.donationProjection.donorsBase ),
		numberOfMembers: donorFormatter( CampaignParameters.numberOfMembers ),
		goalDonationSum: millionFormatter( CampaignParameters.donationProjection.goalDonationSum / 1000000 ),
		trackingData: getTrackingData( trackingIds.bannerName ),
		expandText: 'Dankestext lesen',
		skinFunctions: getSkinAdjuster()
	}
);
