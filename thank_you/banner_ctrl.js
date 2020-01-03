// eslint-disable-next-line no-unused-vars
import style from './styles/styles_ctrl.pcss';

import { donorFormatter, millionFormatter } from './src/formatters';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { showBanner } from './src/show_banner';
import { getTrackingData } from './src/tracking_data';
import { getTrackingIds } from './src/tracking_ids';
import { getSkin } from '../shared/skin';

import Banner from './banners/Banner';
import MembershipMoreInfo from './components/MembershipMoreInfo';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );

const CampaignParameters = createCampaignParameters();
const trackingIds = getTrackingIds( bannerContainer );

showBanner(
	Banner,
	bannerContainer,
	{
		...trackingIds,
		numberOfDonors: donorFormatter( CampaignParameters.donationProjection.donorsBase ),
		numberOfMembers: donorFormatter( CampaignParameters.numberOfMembers ),
		goalDonationSum: millionFormatter( CampaignParameters.donationProjection.goalDonationSum / 1000000 ),
		trackingData: getTrackingData( trackingIds.bannerName ),
		expandText: 'Dankestext lesen',
		moreInfo: MembershipMoreInfo,
		skinFunctions: getSkin()
	}
);
