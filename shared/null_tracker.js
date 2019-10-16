export default class NullTracker {

	constructor( bannerName ) {
		this.bannerName = bannerName;
		console.log( 'Nulltracker created with:', this.bannerName );
	}

	/**
	 * Generate a tracking function
	 *
	 * @param {string} actionName Name of the action to be tracked
	 * @param {number} trackRatio The probability of the event being tracked (between 0 and 1)
	 */
	trackEvent( actionName, trackRatio ) {
		console.log( 'Nulltracker tracked:', actionName, trackRatio );
	}

	recordBannerImpression() {
		console.log( 'Nulltracker tracked content impression:', this.bannerName );
	}

}