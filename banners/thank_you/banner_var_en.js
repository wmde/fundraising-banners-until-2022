// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

import * as formatters from '../../shared/number_formatter/en';
import { createCampaignParameters } from '../../shared/campaign_parameters';
import { createTrackingData } from '../../shared/tracking_data';
import { getTrackingIds } from '../../shared/tracking_ids';
import { getSkinAdjuster } from '../../shared/skin';
import translations from './translations_en';

import { Banner } from './components/Banner';
import { BannerType } from '../../shared/BannerType';
import BannerPresenter from '../../shared/banner_presenter';
import { LocalImpressionCount } from '../../shared/local_impression_count';
import { createCampaignProjection } from '../../shared/campaign_projection';
import MembershipMoreInfo from './components/MembershipMoreInfo';
import CallToAction from './components/CallToAction';
import BannerText from './content/BannerText_en';
import Benefits from './content/Benefits_en';

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
		bannerText: BannerText,
		benefits: Benefits,
		skinAdjuster: getSkinAdjuster(),
		bannerType: BannerType.VAR,
		formActionProps: { locale: 'en_GB' }
	}
);
