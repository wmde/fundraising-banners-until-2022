// eslint-disable-next-line no-unused-vars
import style from './styles/styles_ctrl.pcss';

import * as formatters from '../shared/number_formatter/en';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { createTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';
import { getSkinAdjuster } from '../shared/skin';
import translations from './translations_en';

import { Banner, BannerType } from './components/Banner';
import BannerPresenter from '../shared/banner_presenter';
import { LocalImpressionCount } from '../shared/local_impression_count';
import { createCampaignProjection } from '../shared/campaign_projection';
import MembershipMoreInfo from './components/MembershipMoreInfo_en';
import CallToAction from './components/CallToAction';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );
const campaignParameters = createCampaignParameters();
const campaignProjection = createCampaignProjection( campaignParameters );
const trackingIds = getTrackingIds( bannerContainer );
const trackingData = createTrackingData( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter(
	trackingData,
	bannerContainer.dataset.delay || 0,
	new LocalImpressionCount( trackingIds.bannerName )
);

bannerPresenter.present(
	Banner,
	bannerContainer,
	{
		...trackingIds,
		campaignParameters,
		campaignProjection,
		formatters,
		translations,
		moreInfo: MembershipMoreInfo,
		moreInfoCallToAction: CallToAction,
		skinAdjuster: getSkinAdjuster(),
		bannerType: BannerType.CTRL
	}
);
