import { render, createElement } from 'preact';


import * as DevGlobalBannerSettings from '../shared/global_banner_settings';

// eslint-disable-next-line no-unused-vars
// import style from './styles/banner_ctrl.pcss';

import style from './styles/styles_ctrl.pcss';

import FundsModal from '../shared/components/ui/FundsModal';
import fundsModalData from '../node_modules/fundraising-frontend-content/i18n/de_DE/data/useOfFunds.json';

import * as formatters from '../shared/number_formatter/de';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { createTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';
import BannerPresenter from '../shared/banner_presenter';
import Translations from '../shared/messages/de';

import Banner from './Banner';
import Slides from './components/Slides';
import BannerText from './components/BannerText';

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
		slides: Slides,
		sliderAutoPlaySpeed: 5000,
		translations: Object.assign( Translations ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter )
	},
	0
);
