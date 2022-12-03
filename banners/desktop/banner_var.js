// eslint-disable-next-line no-unused-vars
import style from './styles/styles_var.pcss';

import * as formatters from '../../shared/number_formatter/de';
import { createCampaignParameters } from '../../shared/campaign_parameters';
import { createTrackingData } from '../../shared/tracking_data';
import { getTrackingIds } from '../../shared/tracking_ids';

import { Banner } from './components/Banner';
import { BannerType } from '../../shared/BannerType';
import BannerPresenter from '../../shared/banner_presenter';
import Translations from '../../shared/messages/de';
import LocalTranslations from './translations';
import TranslationsSoftClose from '../../components/SoftClose/translations/de';
import TranslationsSubscriptionsForm from '../../components/SubscriptionForm/translations/de';
import DonationForm from '../../components/MultistepDonationForm/MultistepDonationForm';
import Donation from '../../components/MultistepDonationForm/forms/Donation';
import UpgradeToYearly from '../../components/MultistepDonationForm/forms/UpgradeToYearly';
import CustomAmount from '../../components/MultistepDonationForm/forms/CustomAmount';
import AddressType from '../../components/MultistepDonationForm/forms/AddressType';
import Footer from '../../components/Footer/Footer';
import BannerText from './content/BannerText';
import Slides from './content/Slides';
import useOfFundsText from 'fundraising-frontend-content/i18n/de_DE/data/use_of_funds_content.json';
import { createCampaignProjection } from '../../shared/campaign_projection';
import { createFormItems } from './form_items_var';
import { LocalImpressionCount } from '../../shared/local_impression_count';
import createFormController from './FormController_var';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );
const campaignParameters = createCampaignParameters();
const campaignProjection = createCampaignProjection( campaignParameters );
const trackingIds = getTrackingIds( bannerContainer );
const trackingData = createTrackingData( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter(
	trackingData,
	bannerContainer.dataset.delay || 7500,
	new LocalImpressionCount( trackingIds.bannerName ),
	mw.centralNotice.internal.hide.setHideWithCloseButtonCookies
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
		donationForm: DonationForm,
		donationForms: [ Donation, UpgradeToYearly, CustomAmount, AddressType ],
		createFormController: createFormController,
		footer: Footer,
		bannerText: BannerText,
		slides: Slides,
		translations: Object.assign( Translations, TranslationsSoftClose, TranslationsSubscriptionsForm, LocalTranslations ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.VAR,
		showCookieBanner: '0',
		initialBannerWidth: window.innerWidth,
		formActionProps: { ast: 1 }
	}
);
