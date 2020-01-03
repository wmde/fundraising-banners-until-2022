// eslint-disable-next-line no-unused-vars
import style from './styles/styles_var.pcss';

import { donorFormatter, millionFormatter } from '../shared/formatters';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { showBanner } from './src/show_banner';
import { getTrackingData } from '../shared/tracking_data';
import { getSkinAdjuster } from '../shared/skin';

import { getTrackingIds } from '../shared/tracking_ids';
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
		expandText: 'Lesen Sie unsere Dankesbotschaft',
		moreInfo: MembershipMoreInfo,
		skinFunctions: getSkinAdjuster()
	}
);
