import { getSkinAdjuster } from './skin';
import { getBannerLoaderPlatform } from './platform';

export class BannerLoader {
	constructor( trackingData, appearanceDelay ) {
		this.trackingData = trackingData;
		this.appearanceDelay = appearanceDelay;
	}

	load( Banner, bannerContainer, translations, props ) {
		mw.loader.using( [ 'vue' ] ).then(
			async ( require ) => {
				const Vue = require( 'vue' );
				Vue.prototype.$translations = translations;
				// eslint-disable-next-line no-new
				new Vue( {
					el: bannerContainer,
					render: h => h( Banner ),
					components: { Banner },
					props,
					provide: {
						skinAdjuster: getSkinAdjuster(),
						bannerLoaderPlatform: getBannerLoaderPlatform(),
						trackingService: this.trackingData
					}
				} );
			} );
	}
}
