// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

import { BannerLoader } from '../shared/vue_banner_loader';
import { createTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';
import Translations from '../shared/messages/de';
import Banner from './components/Banner.vue';

import { LocalImpressionCount } from '../shared/local_impression_count';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );

const trackingIds = getTrackingIds( bannerContainer );
const trackingData = createTrackingData( trackingIds.bannerName );
const bannerPresenter = new BannerLoader(
	trackingData,
	bannerContainer.dataset.delay || 7500,
	new LocalImpressionCount( trackingIds.bannerName )
);

bannerPresenter.load(
	Banner,
	bannerContainer,
	Translations,
	{}
);
