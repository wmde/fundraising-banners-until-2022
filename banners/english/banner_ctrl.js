// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

import * as formatters from '../../shared/number_formatter/en';
import { createCampaignParameters } from '../../shared/campaign_parameters';
import { createTrackingData } from '../../shared/tracking_data';
import { getTrackingIds } from '../../shared/tracking_ids';

import { Banner } from './components/Banner';
import { BannerType } from '../../shared/BannerType';
import BannerPresenter from '../../shared/banner_presenter';
import Translations from '../../shared/messages/en';
import LocalTranslations from './translations';
import TranslationsSoftClose from '../../components/SoftClose/translations/en';
import DonationForm from '../../components/DonationForm/BegYearlyRecurringDonation3StepForm';
import DonationFormStep2 from '../../components/DonationForm/BegYearlyRecurringDonationFormStep2';
import DonationFormStep3 from '../../components/DonationForm/BegYearlyRecurringDonationFormStep3CustomAmount';
import Footer from '../../components/Footer/Footer';
import BannerText from './content/BannerText';
import Slides from './content/Slides';
import useOfFundsText from 'fundraising-frontend-content/i18n/en_GB/data/use_of_funds_content.json';
import { createCampaignProjection } from '../../shared/campaign_projection';
import { createFormItems } from './form_items';
import { LocalImpressionCount } from '../../shared/local_impression_count';
import overrideUseOfFundsFigures from '../../shared/override_use_of_funds_figures';
import getBannerDelay from '../../shared/banner_delay';

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
		useOfFundsText: overrideUseOfFundsFigures( useOfFundsText, campaignParameters.useOfFundsFigures ),
		donationForm: DonationForm,
		donationFormStep2: DonationFormStep2,
		donationFormStep3: DonationFormStep3,
		footer: Footer,
		bannerText: BannerText,
		slides: Slides,
		translations: Object.assign( Translations, LocalTranslations, TranslationsSoftClose ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.CTRL,
		initialBannerWidth: window.innerWidth,
		formActionProps: { locale: 'en_GB' }
	}
);
