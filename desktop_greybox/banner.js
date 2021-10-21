// eslint-disable-next-line no-unused-vars
import style from './styles/styles.pcss';

import { createTrackingData } from '../shared/tracking_data';
import { getTrackingIds } from '../shared/tracking_ids';

import { Banner } from './components/Banner';
import BannerPresenter from '../shared/banner_presenter';
import { LocalImpressionCount } from '../shared/local_impression_count';

const bannerContainer = document.getElementById( 'WMDE-Banner-Container' );
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
	bannerContainer
);
