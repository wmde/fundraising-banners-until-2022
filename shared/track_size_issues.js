const $ = require( 'jquery' );

/**
 * Get number of pixels remaining in viewport after the banner height was subtracted.
 * @param {jQuery} bannerElement
 * @return {number}
 */
const getVisibleWikipedia = function ( bannerElement ) {
	return $( window ).height() - bannerElement.height();
};

/**
 * Check if Banner takes too much screen space and track the incident
 * @param {jQuery} bannerElement
 * @param {string} trackingLink
 * @param {number} trackRatio
 */
const trackSizeIssues = function( bannerElement, trackingLink, trackRatio ) {
	var bannerHeight = bannerElement.height(),
		viewportHeight = $( window ).height(),
		viewportWidth = $( window ).width(),
		threshold = 180, // Pixels
		resolutions = '';
	
	if ( getVisibleWikipedia( bannerElement ) > threshold ) {
		return;
	}
	if ( Math.random() > trackRatio ) {
		return;
	}
	// Avoid multiple tracking when trackSpaceIssues is called multiple times
	if ( $( '#WMDE_Banner-track-sizes', bannerElement ).length > 0 ) {
		return;
	}
	resolutions = [
		bannerHeight,
		viewportWidth + 'x' + viewportHeight,
		screen.width + 'x' + screen.height,
		window.outerWidth + 'x' + window.outerHeight
	].join( '--' );
	
	var trackUrl = trackingLink.replace( /\/$/, '' ) + '/' + resolutions;
	bannerElement.append( $( '<img id="WMDE_Banner-track-sizes" width="1" height="1">' ).attr( 'src', trackUrl ) );
};

module.exports = {
	trackSizeIssues: trackSizeIssues,
	getVisibleWikipedia: getVisibleWikipedia
};
