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
	trackSizeIssueEvent( dimensionData, trackingRatio ) {
		if ( typeof trackingRatio === 'undefined' ) {
			trackingRatio = 1;
		}

		if ( Math.random() < trackingRatio ) {
			mw.track( 'event.WMDEBannerSizeIssue', {
				bannerName: this.bannerName,
				viewportWidth: parseInt( dimensionData.window.width, 10 ),
				viewportHeight: parseInt( dimensionData.window.height, 10 ),
				bannerHeight: parseInt( dimensionData.bannerHeight, 10 ),
				eventRate: trackingRatio
			} );
		}
	}

	/**
	 * Generate a tracking function
	 *
	 * @param {string} actionName Name of the action to be tracked
	 * @param {number} trackingRatio The probability of the event being tracked (between 0 and 1)
	 * @return {function}
	 */
	createTrackHandler( actionName, trackingRatio ) {
		if ( typeof trackingRatio === 'undefined' ) {
			trackingRatio = 1;
		}

		return () => {
			this.track( actionName, trackingRatio, 0, 0 );
		};
	}

	track( actionName, trackingRatio, slidesShown, finalSlide ) {
		if ( Math.random() < trackingRatio ) {
			mw.track( 'event.WMDEBannerEvents', {
				bannerName: this.bannerName,
				bannerAction: actionName,
				eventRate: trackingRatio,
				slidesShown: slidesShown,
				finalSlide: finalSlide
			} );
		}
	}
}
