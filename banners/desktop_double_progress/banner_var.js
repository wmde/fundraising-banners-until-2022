// eslint-disable-next-line no-unused-vars
import style from './styles/styles_var.pcss';

import * as formatters from '../../shared/number_formatter/de';
import { createCampaignParameters } from '../../shared/campaign_parameters';
import { createTrackingData } from '../../shared/tracking_data';
import { getTrackingIds } from '../../shared/tracking_ids';

import { Banner } from './components/Banner_var';
import { BannerType } from '../../shared/BannerType';
import BannerPresenter from '../../shared/banner_presenter';
import Translations from '../../shared/messages/de';
import LocalTranslations from './translations';
import TranslationsSoftClose from '../../components/SoftClose/translations/de';
import TranslationsAlreadyDonated from '../../components/AlreadyDonatedModal/translations/de';
import TranslationsDoubleProgress from '../../components/ProgressBar/translations/de_double_progress_bar';
import DonationForm from '../../components/MultistepDonationForm/MultistepDonationForm';
import Donation from '../../components/MultistepDonationForm/forms/Donation';
import UpgradeToYearly from '../../components/MultistepDonationForm/forms/UpgradeToYearly';
import CustomAmount from '../../components/MultistepDonationForm/forms/CustomAmount';
import Footer from '../../components/Footer/FooterAlreadyDonated';
import BannerText from './content/BannerText_var';
import Slides from './content/Slides_var';
import AlreadyDonated from './content/AlreadyDonated';
import useOfFundsText from 'fundraising-frontend-content/i18n/de_DE/data/use_of_funds_content.json';
import { createCampaignProjection } from '../../shared/campaign_projection';
import { createFormItems } from './form_items';
import { LocalImpressionCount } from '../../shared/local_impression_count';
import createFormController from './FormController';
import getBannerDelay from '../../shared/banner_delay';
import ProgressBar from '../../components/ProgressBar/DoubleProgressBar';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );
const campaignParameters = createCampaignParameters();
const campaignProjection = createCampaignProjection( campaignParameters );
const trackingIds = getTrackingIds( bannerContainer );
const trackingData = createTrackingData( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter(
	trackingData,
	getBannerDelay( 7500 ),
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
		donationForms: [ Donation, UpgradeToYearly, CustomAmount ],
		createFormController: createFormController,
		progressBar: ProgressBar,
		footer: Footer,
		bannerText: BannerText,
		slides: Slides,
		alreadyDonatedContent: AlreadyDonated,
		translations: Object.assign(
			Translations,
			TranslationsSoftClose,
			TranslationsAlreadyDonated,
			TranslationsDoubleProgress,
			LocalTranslations
		),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.VAR,
		showCookieBanner: '0',
		initialBannerWidth: window.innerWidth
	}
);
