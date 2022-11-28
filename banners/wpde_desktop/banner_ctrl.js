// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

import * as formatters from '../../shared/number_formatter/de';

import { createCampaignParameters } from '../../shared/campaign_parameters';
import { getTrackingIds } from '../../shared/tracking_ids';

import { Banner } from './components/Banner';
import DonationForm from '../../components/DonationForm/BegYearlyRecurringDonationForm';
import FormStep2 from '../../components/DonationForm/BegYearlyRecurringDonationFormStep2';
import { BannerType } from '../../shared/BannerType';
import BannerPresenter from '../../shared/banner_presenter';
import Translations from '../../shared/messages/de';
import localTranslations from './translations';
import useOfFundsText from 'fundraising-frontend-content/i18n/de_DE/data/use_of_funds_content.json';
import { createCampaignProjection } from '../../shared/campaign_projection';
import { createFormItems } from './form_items';
import { LocalImpressionCount } from '../../shared/local_impression_count';
import { createTrackingData } from '../../shared/tracking_data';
import BannerText from './content/BannerText';
import Slides from './content/Slides';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );
const campaignParameters = createCampaignParameters();
const campaignProjection = createCampaignProjection( campaignParameters );
const trackingIds = getTrackingIds( bannerContainer );

const trackingData = createTrackingData( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter(
	trackingData,
	0,
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
		bannerText: BannerText,
		slides: Slides,
		donationForm: DonationForm,
		donationFormStep2: FormStep2,
		translations: Object.assign( Translations, localTranslations ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.CTRL,
		initialBannerWidth: window.innerWidth
	}
);
