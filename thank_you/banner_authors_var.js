// eslint-disable-next-line no-unused-vars
import style from './styles/styles_authors.pcss';

import { donorFormatter, millionFormatter } from './src/formatters';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { showBanner } from './src/show_banner';
import { getTrackingData } from './src/tracking_data';
import { getTrackingIds } from './src/tracking_ids';
import { getSkin } from '../shared/skin';

import Banner from './banners/Banner';
import AuthorsMoreInfo from './components/AuthorsMoreInfo';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );

const CampaignParameters = createCampaignParameters();
const trackingIds = getTrackingIds( bannerContainer );

showBanner(
	Banner,
	bannerContainer,
	{
		...trackingIds,
		numberOfDonors: donorFormatter( CampaignParameters.donationProjection.donorsBase ),
		goalDonationSum: millionFormatter( CampaignParameters.donationProjection.goalDonationSum / 1000000 ),
		trackingData: getTrackingData( trackingIds.bannerName ),
		expandText: 'Dankestext lesen',
		showSteps: false,
		moreInfo: AuthorsMoreInfo,
		skinFunctions: getSkin()
	}
);
