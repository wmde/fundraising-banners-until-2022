// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

import * as formatters from '../shared/number_formatter/de';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { createTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';

import { Banner } from './components/Banner';
import { BannerType } from './BannerType';
import BannerPresenter from '../shared/banner_presenter';
import Translations from '../shared/messages/de';
import LocalTranslations from './translations';
import DonationForm from './components/ui/form/DonationForm';
import Footer from '../shared/components/ui/EasySelectFooter';
import BannerText from './components/BannerText_var';
import useOfFundsText from '../node_modules/fundraising-frontend-content/i18n/de_DE/data/use_of_funds_content.json';
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
		footer: Footer,
		bannerText: BannerText,
		translations: Object.assign( Translations, LocalTranslations ),
		formItems: createFormItems( Translations, formatters.amountInputFormatter ),
		bannerType: BannerType.VAR,
		showCookieBanner: '0'
	}
);
