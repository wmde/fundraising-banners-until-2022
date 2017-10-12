function TrackingEvents( bannerName, trackingImage ) {
    this.bannerName = bannerName;
    this.trackingImage = trackingImage;
    this.baseUrl = 'https://tracking.wikimedia.de/piwik.php?idsite=1&rec=1&url=https://spenden.wikimedia.de';
}

TrackingEvents.prototype.trackClickEvent = function ( trackedElement, actionName, trackRatio ) {
    const self = this;
    if ( typeof trackRatio === 'undefined' ) {
        trackRatio = 1;
    }
    trackedElement.click( function () {
        if ( Math.random() < trackRatio ) {
            self.trackingImage.attr( 'src', self.getTrackingURL( actionName ) );
        }
    } );
};

TrackingEvents.prototype.trackSizeIssueEvent = function ( trackingData, trackingRatio ) {
	const self = this;

	if ( typeof trackingRatio === 'undefined' ) {
		trackingRatio = 1;
	}
	
	if ( Math.random() < trackingRatio ) {
		self.trackingImage.attr( 'src', self.getTrackingURL( 'banner-size-issue', trackingData ) );
	}
};

/**
 * @param {string} actionName
 * @param {string} data Possible additional data to append
 * @return {string} Tracking URL
 */
TrackingEvents.prototype.getTrackingURL = function ( actionName, data ) {
    return [
        this.baseUrl,
        actionName,
        this.bannerName,
        data || ''
    ].filter( function ( value ) {
        return value.length > 0;
    } ).join( '/' );

};

module.exports = TrackingEvents;
