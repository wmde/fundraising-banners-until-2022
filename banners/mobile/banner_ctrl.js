// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

import * as formatters from '../../shared/number_formatter/de';
import { createCampaignParameters } from '../../shared/campaign_parameters';
import { createTrackingData } from '../../shared/tracking_data';
import { getTrackingIds } from '../../shared/tracking_ids';
import BannerPresenter from '../../shared/banner_presenter';
import Translations from '../../shared/messages/de';
import LocalTranslations from './translations';
import TranslationsSoftClose from './translations_soft_close';
import useOfFundsText from '../../node_modules/fundraising-frontend-content/i18n/de_DE/data/use_of_funds_content.json';
import DonationForm from '../../components/MultistepDonationForm/MultistepDonationForm';
import Donation from '../../components/MultistepDonationForm/forms/Donation';
import UpgradeToYearly from '../../components/MultistepDonationForm/forms/UpgradeToYearlyButtons';
import BannerText from './content/BannerText';
import Slides from './content/Slides';
import SoftClose from '../../components/SoftClose/SoftClose';

import Banner from './components/Banner';

import { createCampaignProjection } from '../../shared/campaign_projection';
import { createFormItems } from './form_items';
import { LocalImpressionCount } from '../../shared/local_impression_count';
import { BannerType } from '../../shared/BannerType';
import createFormController from './FormController';
import getBannerDelay from '../../shared/banner_delay';
import useFormModel from '../../components/MultistepDonationForm/hooks/use_form_model_with_custom';

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
		useOfFundsText,
		sliderAutoPlaySpeed: 5000,
		translations: Object.assign( Translations, TranslationsSoftClose, LocalTranslations ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.CTRL,
		donationForm: DonationForm,
		donationForms: [ Donation, UpgradeToYearly ],
		createFormController: createFormController,
		useFormModel: useFormModel,
		bannerText: BannerText,
		slides: Slides,
		softClose: SoftClose,
		formActionProps: { ast: 0 }
	},
	0
);
