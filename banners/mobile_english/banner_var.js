// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

import * as formatters from '../../shared/number_formatter/en';
import { createCampaignParameters } from '../../shared/campaign_parameters';
import { createTrackingData } from '../../shared/tracking_data';
import { getTrackingIds } from '../../shared/tracking_ids';
import BannerPresenter from '../../shared/banner_presenter';
import Translations from '../../shared/messages/en';
import LocalTranslations from './translations';
import useOfFundsText from '../../node_modules/fundraising-frontend-content/i18n/en_GB/data/use_of_funds_content.json';
import DonationForm from '../../components/DonationForm/DonationForm';
import BannerText from './content/BannerText_var';
import Slides from './content/Slides_var';

import Banner from './components/Banner';

import { createCampaignProjection } from '../../shared/campaign_projection';
import { createFormItems } from './form_items';
import { LocalImpressionCount } from '../../shared/local_impression_count';
import { BannerType } from '../../shared/BannerType';
import overrideUseOfFundsFigures from '../../shared/override_use_of_funds_figures';
import getBannerDelay from '../../shared/banner_delay';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );
const campaignParameters = createCampaignParameters();
const campaignProjection = createCampaignProjection( campaignParameters );
const trackingIds = getTrackingIds( bannerContainer );
const trackingData = createTrackingData( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter(
	trackingData,
	getBannerDelay( 5000 ),
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
		useOfFundsText: overrideUseOfFundsFigures( useOfFundsText, campaignParameters.useOfFundsFigures ),
		sliderAutoPlaySpeed: 5000,
		translations: Object.assign( Translations, LocalTranslations ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.VAR,
		donationForm: DonationForm,
		bannerText: BannerText,
		slides: Slides,
		formActionProps: { locale: 'en_GB' }
	},
	95
);
