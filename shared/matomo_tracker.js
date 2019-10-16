export default class MatomoTracker {

	constructor( tracker, bannerName ) {
		this.tracker = tracker;
		this.bannerName = bannerName;
	}

	/**
	 * Generate a tracking function
	 *
	 * @param {string} actionName Name of the action to be tracked
	 * @param {number} trackRatio The probability of the event being tracked (between 0 and 1)
	 */
	trackEvent( actionName, trackRatio ) {
		if ( typeof trackRatio === 'undefined' ) {
			trackRatio = 1;
		}
		if ( Math.random() < trackRatio ) {
			this.tracker.trackEvent( 'Banners', actionName, this.bannerName );
		}
	}

	recordBannerImpression() {
		this.tracker.trackContentImpression( 'Banners', 'banner-shown', this.bannerName );
	}

}
