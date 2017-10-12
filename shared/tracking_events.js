function getTrackingURL( baseUrl, actionName, bannerName, data ) {
	return [
		baseUrl,
		actionName,
		bannerName,
		data || ''
	].filter( function ( value ) {
		return value.length > 0;
	} ).join( '/' );
}

function TrackingEvents( bannerName, trackingImage ) {
    this.bannerName = bannerName;
    this.trackingImage = trackingImage;
    this.baseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
}

/**
 * Track a click event on a given element
 *
 * @param {jQuery} $trackedElement The element to bind the click event to
 * @param {string} actionName Name of the action to be tracked
 * @param {number} trackRatio The probability of the event being tracked (between 0 and 1)
 */
TrackingEvents.prototype.trackClickEvent = function ( $trackedElement, actionName, trackRatio ) {
    const self = this;
    if ( typeof trackRatio === 'undefined' ) {
        trackRatio = 1;
    }

	$trackedElement.click( function () {
		if ( Math.random() < trackRatio ) {
			self.trackingImage.attr(
				'src',
				getTrackingURL( this.baseUrl, actionName, this.bannerName, '' )
			);
		}
	} );
};

/**
 * Track the event of a banner being too large for a user's viewport
 *
 * @param {jQuery} trackingData Additional data to be provided to the tracker
 * @param {string} trackingRatio The probability of the event being tracked (between 0 and 1)
 */
TrackingEvents.prototype.trackSizeIssueEvent = function ( trackingData, trackingRatio ) {
	const self = this;

	if ( typeof trackingRatio === 'undefined' ) {
		trackingRatio = 1;
	}
	
	if ( Math.random() < trackingRatio ) {
		self.trackingImage.attr(
			'src',
			getTrackingURL( this.baseUrl, 'banner-size-issue', this.bannerName, trackingData )
		);
	}
};

module.exports = TrackingEvents;
