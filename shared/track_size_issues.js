const $ = require( 'jquery' );

function SizeIssueIndicator( thresholdInPixels ) {
	this.thresholdInPixels = thresholdInPixels;
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
 * @return {boolean} whether or not the remaining viewport height is below the threshold
 */
SizeIssueIndicator.prototype.hasSizeIssues = function( $bannerElement ) {
	return ( $( window ).height() - $bannerElement.height() ) < this.thresholdInPixels;
};

module.exports = SizeIssueIndicator;
