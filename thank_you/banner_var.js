// eslint-disable-next-line no-unused-vars
import style from './styles/styles_var.pcss';

import { integerFormatter, millionFormatter } from '../shared/number_formatter/de';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { showBanner } from './src/show_banner';
import { createTrackingData } from '../shared/tracking_data';
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
		numberOfDonors: integerFormatter( CampaignParameters.donationProjection.donorsBase ),
		numberOfMembers: integerFormatter( CampaignParameters.numberOfMembers ),
		goalDonationSum: millionFormatter( CampaignParameters.donationProjection.goalDonationSum / 1000000 ),
		trackingData: createTrackingData( trackingIds.bannerName ),
		expandText: 'Lesen Sie unsere Dankesbotschaft',
		moreInfo: MembershipMoreInfo,
		skinFunctions: getSkinAdjuster()
	}
);
