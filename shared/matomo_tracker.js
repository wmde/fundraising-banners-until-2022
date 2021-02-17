function scheduleRetryWithBackoff( tracker ) {
	const RETRY_INTERVAL = 100;
	setTimeout(
		tracker.waitForTrackerToInit.bind( tracker ),
		Math.max( RETRY_INTERVAL, RETRY_INTERVAL * tracker.trackerFindCounter )
	);
}

export default class MatomoTracker {

	constructor( trackerName, bannerName, scheduleRetry = scheduleRetryWithBackoff ) {
		this.bannerName = bannerName;
		this.scheduleRetry = scheduleRetry;
		this.accumulatedTracking = [];
		this.tracker = null;
		this.trackerName = trackerName;
		this.trackerFindCounter = 0;
		if ( !this.trackerLibraryIsLoaded( trackerName ) ) {
			scheduleRetry( this );
			return;
		}
		this.tracker = window[ trackerName ];
	}

	/**
	 * @private
	 * @param {Function} trackFn
	 */
	trackOrStore( trackFn ) {
		if ( !this.tracker ) {
			this.accumulatedTracking.push( trackFn );
			return;
		}
		trackFn( this.tracker );
	}

	trackerLibraryIsLoaded( trackerName ) {
		return typeof window[ trackerName ] !== 'undefined' && window[ trackerName ] !== null;
	}

	waitForTrackerToInit() {
		if ( !this.trackerLibraryIsLoaded( this.trackerName ) ) {
			this.trackerFindCounter++;
			if ( this.trackerFindCounter < 10 ) {
				this.scheduleRetry( this );
			}
			return;
		}
		this.tracker = window[ this.trackerName ];
		this.accumulatedTracking.forEach( trackFn => trackFn( this.tracker ) );
		this.accumulatedTracking = [];
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
			this.trackOrStore( tracker => tracker.trackEvent( 'Banners', actionName, this.bannerName ) );
		}
	}

	/**
	 * Emulate EventTracker interface
	 *
	 * @param {string} actionName
	 * @param {number} slidesShown
	 * @param {number} finalSlide
	 * @param {number} trackingRatio
	 * @return {boolean} Returns true if client was tracked
	 */
	trackBannerEvent( actionName, slidesShown, finalSlide, trackingRatio = 0.01 ) {
		this.trackEvent( actionName, trackingRatio );
		return true;
	}

	// eslint-disable-next-line no-unused-vars
	trackBannerEventWithViewport( actionName, slidesShown, finalSlide, trackingRatio = 0.01, dimensionData = {} ) {
		this.trackBannerEvent( actionName, slidesShown, finalSlide, trackingRatio );
	}

	recordBannerImpression() {
		this.trackOrStore( tracker => tracker.trackContentImpression( 'Banners', this.bannerName ) );
	}

	trackViewPortDimensions() {}
	trackSizeIssueEvent() {}
}
