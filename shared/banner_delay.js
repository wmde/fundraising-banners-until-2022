export default class BannerDelay {

	constructor( bannerContainer ) {
		this.bannerContainer = bannerContainer;
	}

	getBannerDelay( delayValue ) {
		const url = window.location.href;
		const parameters = url.split( '?' )[ 1 ];

		if ( parameters.includes( '&noDelay' ) ) {
			return 1;
		}

		if ( this.bannerContainer.dataset.delay ) {
			return this.bannerContainer.dataset.delay;
		}

		return delayValue;
	}
}
