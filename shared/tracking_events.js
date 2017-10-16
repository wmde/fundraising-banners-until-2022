function generateTrackingData( dimensions ) {
	return [
		dimensions.bannerHeight,
		dimensions.window.width + 'x' + dimensions.window.height,
		dimensions.screen.width + 'x' + dimensions.screen.height,
		dimensions.windowOuter.width + 'x' + dimensions.windowOuter.height
	].join( '--' );
}

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

function TrackingEvents( baseUrl, bannerName, trackingImage ) {
	this.baseUrl = baseUrl;
	this.bannerName = bannerName;
	this.trackingImage = trackingImage;
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
				getTrackingURL( self.baseUrl, actionName, self.bannerName, '' )
			);
		}
	} );
};

/**
 * Track the event of a banner being too large for a user's viewport
 *
 * @param {object} dimensionData
 * @param {number} trackingRatio The probability of the event being tracked (between 0 and 1)
 */
TrackingEvents.prototype.trackSizeIssueEvent = function ( dimensionData, trackingRatio ) {
	const self = this;

	if ( typeof trackingRatio === 'undefined' ) {
		trackingRatio = 1;
	}
	
	if ( Math.random() < trackingRatio ) {
		self.trackingImage.attr(
			'src',
			getTrackingURL( this.baseUrl, 'banner-size-issue', this.bannerName, generateTrackingData( dimensionData ) )
		);
	}
};

module.exports = TrackingEvents;
