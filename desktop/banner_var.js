// eslint-disable-next-line no-unused-vars
import style from './styles_var/styles.pcss';

import * as formatters from '../shared/number_formatter/de';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { createTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';

import { Banner, BannerType } from './components_var/Banner';
import BannerPresenter from '../shared/banner_presenter';
import Translations from '../shared/messages/de';
import LocalTranslations from './translations';
import DonationForm from './components_var/ui/form/DonationForm';
import BannerText from './components_var/BannerText';
import fundsModalData from '../node_modules/fundraising-frontend-content/i18n/de_DE/data/useOfFunds.json';
import { createCampaignProjection } from '../shared/campaign_projection';
import { createFormItems } from './form_items_var';
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
		donationForm: DonationForm,
		bannerText: BannerText,
		sliderAutoPlaySpeed: 5000,
		translations: Object.assign( Translations, LocalTranslations ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.VAR
	}
);
