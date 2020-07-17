// eslint-disable-next-line no-unused-vars
import style from './styles/styles_ctrl.pcss';

import * as formatters from '../shared/number_formatter/de';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { createTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';

import { Banner, BannerType } from './Banner';
import BannerPresenter from '../shared/banner_presenter';
import Translations from '../shared/messages/de';
import BannerText from './components/BannerText';
import fundsModalData from '../node_modules/fundraising-frontend-content/i18n/de_DE/data/useOfFunds.json';
import { createCampaignProjection } from '../shared/campaign_projection';
import { createFormItems } from './form_items';
import { LocalImpressionCount } from '../shared/local_impression_count';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );
const campaignParameters = createCampaignParameters();
const campaignProjection = createCampaignProjection( campaignParameters );
const trackingIds = getTrackingIds( bannerContainer );
const trackingData = createTrackingData( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter(
	trackingData,
	bannerContainer.dataset.delay || 7500,
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
		fundsModalData,
		bannerText: BannerText,
		translations: Translations,
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.VAR
	}
);
