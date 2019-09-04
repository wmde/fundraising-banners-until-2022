export default class MatomoTracker {

	constructor( tracker, bannerName ) {
		this.tracker = tracker;
		this.bannerName = bannerName;
	}

	/**
	 * Track a click event on a given element
	 *
	 * @param {jQuery} $trackedElement The element to bind the click event to
	 * @param {string} actionName Name of the action to be tracked
	 * @param {number} trackRatio The probability of the event being tracked (between 0 and 1)
	 */
	trackClickEvent( $trackedElement, actionName, trackRatio ) {
		$trackedElement.click( this.createTrackHandler( actionName, trackRatio ) );
	}

	/**
	 * Track the event of a banner being too large for a user's viewport
	 *
	 * @param {Object} dimensionData
	 * @param {number} trackingRatio The probability of the event being tracked (between 0 and 1)
	 *
	 */ // eslint-disable-next-line no-unused-vars
	trackSizeIssueEvent( dimensionData, trackingRatio ) {
		throw new Error( 'Size issue event not implemented.' );
	}

	/**
	 * Generate a tracking function
	 *
	 * @param {string} actionName Name of the action to be tracked
	 * @param {number} trackRatio The probability of the event being tracked (between 0 and 1)
	 * @return {Function}
	 */
	createTrackHandler( actionName, trackRatio ) {
		const self = this;
		if ( typeof trackRatio === 'undefined' ) {
			trackRatio = 1;
		}

		return function () {
			if ( Math.random() < trackRatio ) {
				self.tracker.trackEvent( 'Banners', actionName, this.bannerName );
			}
		};
	}

	recordBannerImpression() {
		self.tracker.trackContentImpression( 'Banners', 'banner-shown', this.bannerName );
	}

}
