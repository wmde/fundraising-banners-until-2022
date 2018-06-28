export default class EventLoggingTracker {

	constructor( bannerName ) {
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
	 * @param {object} dimensionData
	 * @param {number} trackingRatio The probability of the event being tracked (between 0 and 1)
	 */
	// trackSizeIssueEvent( dimensionData, trackingRatio ) {
	// TODO Currently not decided on how size issues are tracked
	// }

	/**
	 * Generate a tracking function
	 *
	 * @param {string} actionName Name of the action to be tracked
	 * @param {number} trackRatio The probability of the event being tracked (between 0 and 1)
	 * @return {function}
	 */
	createTrackHandler( actionName, trackRatio ) {
		if ( typeof trackRatio === 'undefined' ) {
			trackRatio = 1;
		}

		return () => {
			if ( Math.random() < trackRatio ) {
				mw.eventLog.logEvent( 'WMDEBannerEvents', { bannerName: this.bannerName, bannerAction: actionName } );
			}
		};
	}
}
