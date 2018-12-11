const VIEWPORT_TRACKING_IDENTIFIER = 'viewport_tracking';
const VIEWPORT_TRACKING_CLOSED_EVENT_IDENTIFIER = 'vtc';

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
		this.trackViewportData( this.bannerName, dimensionData, trackingRatio );
	}

	/**
	 * Track the dimensions of the user viewport for statistical purposes
	 *
	 * @param {object} dimensionData
	 * @param {number} trackingRatio The probability of the event being tracked (between 0 and 1)
	 */
	trackViewPortDimensions( dimensionData, trackingRatio = 1 ) {
		this.trackViewportData( VIEWPORT_TRACKING_IDENTIFIER, dimensionData, trackingRatio );
	}

	/**
	 * Track the dimensions of the user viewport at the time of the banner closing for statistical purposes
	 *
	 * @param {jQuery} $trackedElement
	 * @param {function} dimensionCallback
	 * @param {number} slidesShown
	 * @param {number} finalSlide
	 * @param {number} trackingRatio The probability of the event being tracked (between 0 and 1)
	 */
	trackCloseEventViewPortDimensions( $trackedElement, dimensionCallback, slidesShown, finalSlide, trackingRatio = 0.01 ) {
		$trackedElement.click( function () {
			if ( this.trackBannerEvent( 'banner-closed', slidesShown, finalSlide, trackingRatio ) ) {
				// 10% chance to also track viewport dimensions on top of recording the banner closed event.
				this.trackViewportData( VIEWPORT_TRACKING_CLOSED_EVENT_IDENTIFIER + '-' + this.bannerName, dimensionCallback(), 0.1 );
			}
		}.bind( this ) );
	}

	/**
	 * Track dimension data depending on tracking ratio
	 *
	 * @param {string} bannerName
	 * @param {object} dimensionData
	 * @param {number} trackingRatio
	 * @private
	 */
	trackViewportData( bannerName, dimensionData, trackingRatio = 0.01 ) {
		if ( Math.random() < trackingRatio ) {
			mw.track( 'event.WMDEBannerSizeIssue', {
				bannerName: bannerName,
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
	createTrackHandler( actionName, trackingRatio = 0.01 ) {
		return () => {
			this.trackBannerEvent( actionName, 0, 0, trackingRatio );
		};
	}

	/**
	 * Track banner event data
	 * @param {string} actionName
	 * @param {number} slidesShown
	 * @param {number} finalSlide
	 * @param {number} trackingRatio
	 * @return {boolean} Returns true if client was tracked
	 */
	trackBannerEvent( actionName, slidesShown, finalSlide, trackingRatio = 0.01 ) {
		if ( Math.random() < trackingRatio ) {
			mw.track( 'event.WMDEBannerEvents', {
				bannerName: this.bannerName,
				bannerAction: actionName,
				eventRate: trackingRatio,
				slidesShown: slidesShown,
				finalSlide: finalSlide
			} );
			return true;
		}
		return false;
	}
}
