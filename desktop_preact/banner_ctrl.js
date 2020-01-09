// eslint-disable-next-line no-unused-vars
import style from './styles/styles_ctrl.pcss';

import * as formatters from '../shared/number_formatter/de';
import { createCampaignParameters } from '../shared/campaign_parameters';
import { getTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';

import Banner from './Banner';
import EventLoggingTracker from '../shared/event_logging_tracker';
import BannerPresenter from '../shared/banner_presenter';
import Translations from '../shared/messages/de';
import BannerText from './components/BannerText';
import fundsModalData from '../node_modules/fundraising-frontend-content/i18n/de_DE/data/useOfFunds.json';
import { CampaignProjection } from '../shared/campaign_projection';
import CampaignDays, { endOfDay, startOfDay } from '../shared/campaign_days';
import { createFormItems } from './form_items';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );

const campaignParameters = createCampaignParameters();
const trackingIds = getTrackingIds( bannerContainer );
const trackingEvents = new EventLoggingTracker( trackingIds.bannerName );
const bannerPresenter = new BannerPresenter( trackingEvents, 1, bannerContainer.dataset.delay || 7500 );

const campaignProjection = new CampaignProjection(
	new CampaignDays(
		startOfDay( campaignParameters.donationProjection.baseDate ),
		endOfDay( campaignParameters.endDate )
	),
	campaignParameters.donationProjection
);

bannerPresenter.present(
	Banner,
	bannerContainer,
	{
		...trackingIds,
		campaignParameters,
		campaignProjection,
		bannerText: BannerText,
		translations: Translations,
		formatters,
		trackingData: getTrackingData( trackingIds.bannerName ),
		fundsModalData,
		formItems: createFormItems( Translations, formatters.amountInputFormatter )
	}
);
