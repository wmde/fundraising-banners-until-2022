const $ = require( 'jquery' );

function SizeIssueIndicator( thresholdInPixels ) {
	this.thresholdInPixels = thresholdInPixels;
}

/**
 * Get number of pixels remaining in viewport after the banner height was subtracted.
 * @param {jQuery} $bannerElement
 * @return {number}
 */
function getVisibleWikipedia( $bannerElement ) {
	return $( window ).height() - $bannerElement.height();
}

/**
 * Get banner height and screen/window dimensions as a concatenated string
 * @param {number} bannerHeight
 * @return {string} tracking data
 */
SizeIssueIndicator.prototype.generateTrackingData = function( bannerHeight ) {
	return [
		bannerHeight,
		$( window ).width() + 'x' + $( window ).height(),
		screen.width + 'x' + screen.height,
		window.outerWidth + 'x' + window.outerHeight
	].join( '--' )
};

/**
 * Check if Banner takes too much screen space and track the incident
 * @param {jQuery} $bannerElement
 * @param {string} trackingLink
 * @param {number} trackRatio
 */
SizeIssueIndicator.prototype.trackSizeIssues = function( $bannerElement, trackingLink, trackRatio ) {
	if ( getVisibleWikipedia( $bannerElement ) > this.thresholdInPixels ) {
		return;
	}
	if ( Math.random() > trackRatio ) {
		return;
	}
	// Avoid multiple tracking when trackSpaceIssues is called multiple times
	if ( $( '#WMDE_Banner-track-sizes', $bannerElement ).length > 0 ) {
		return;
	}

	var trackUrl = trackingLink.replace( /\/$/, '' ) + '/' + this.generateTrackingData( $bannerElement.height() );
	bannerElement.append( $( '<img id="WMDE_Banner-track-sizes" width="1" height="1">' ).attr( 'src', trackUrl ) );
};

module.exports = SizeIssueIndicator;
