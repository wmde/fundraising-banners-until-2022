// eslint-disable-next-line no-unused-vars
import style from './styles_var/styles.pcss';

import { createTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';

import { Banner, BannerType } from './components_var/Banner';
import BannerPresenter from '../shared/banner_presenter';
import Translations from '../shared/messages/de';
import LocalTranslations from './translations';
import useOfFundsText from '../node_modules/fundraising-frontend-content/i18n/de_DE/data/use_of_funds_content.json';
import { LocalImpressionCount } from '../shared/local_impression_count';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );
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
		useOfFundsText,
		translations: Object.assign( Translations, LocalTranslations ),
		bannerType: BannerType.VAR
	}
);
