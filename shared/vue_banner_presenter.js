import {getSkinAdjuster} from "./skin";

export class BannerPresenter {
	constructor( trackingData, appearanceDelay ) {
		this.trackingData = trackingData;
		this.appearanceDelay = appearanceDelay;
	}

	present( Banner, bannerContainer, props ) {
		mw.loader.using( [ 'vue' ] ).then(
			async ( require ) => {
				const Vue = require( 'vue' );
				// eslint-disable-next-line no-new
				new Vue( {
					el: bannerContainer,
					render: h => h( Banner ),
					components: { Banner },
					props,
					provide: {
						skinAdjuster: getSkinAdjuster()
					}
				} );
			} );
	}
}
