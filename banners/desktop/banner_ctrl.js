// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

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
import TranslationsAlreadyDonated from '../../components/AlreadyDonatedModal/translations/de';
import DonationForm from '../../components/DonationForm/BegYearlyRecurringDonation3StepForm';
import DonationFormStep2 from '../../components/DonationForm/BegYearlyRecurringDonationFormStep2';
import DonationFormStep3 from '../../components/DonationForm/BegYearlyRecurringDonationFormStep3CustomAmount';
import Footer from '../../components/Footer/FooterAlreadyDonated';
import BannerText from './content/BannerText';
import Slides from './content/Slides';
import AlreadyDonated from './content/AlreadyDonated';
import useOfFundsText from 'fundraising-frontend-content/i18n/de_DE/data/use_of_funds_content.json';
import { createCampaignProjection } from '../../shared/campaign_projection';
import { createFormItems } from './form_items';
import { LocalImpressionCount } from '../../shared/local_impression_count';
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
		useOfFundsText,
		donationForm: DonationForm,
		donationFormStep2: DonationFormStep2,
		donationFormStep3: DonationFormStep3,
		footer: Footer,
		bannerText: BannerText,
		slides: Slides,
		alreadyDonatedContent: AlreadyDonated,
		translations: Object.assign( Translations, TranslationsSoftClose, TranslationsAlreadyDonated, LocalTranslations ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.CTRL,
		showCookieBanner: '0',
		initialBannerWidth: window.innerWidth
	}
);
