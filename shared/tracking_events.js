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

/**
 * @param {string} actionName
 * @return {string} Tracking URL
 */
TrackingEvents.prototype.getTrackingURL = function ( actionName ) {
    return [
                this.baseUrl,
                actionName,
                this.bannerName
            ].join( '/' );

};

module.exports = TrackingEvents;
