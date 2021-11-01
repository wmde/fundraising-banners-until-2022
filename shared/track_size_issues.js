import $ from 'jquery';

export default class SizeIssueIndicator {

	constructor( minimumHeight, minimumWidth = 0 ) {
		this.minimumHeight = minimumHeight;
		this.minimumWidth = minimumWidth;
	}

	/**
	 * Get banner height and screen/window dimensions as a concatenated string
	 *
	 * @param {number} bannerHeight
	 * @return {Object} screen, window and banner dimensions
	 */
	getDimensions( bannerHeight ) {
		return {
			bannerHeight: bannerHeight,
			screen: {
				width: screen.width,
				height: screen.height
			},
			window: {
				width: $( window ).width(),
				height: $( window ).height()
			},
			windowOuter: {
				width: window.outerWidth,
				height: window.outerHeight
			}
		};
	}

	/**
	 * Check if Banner takes too much screen space and track the incident
	 *
	 * @param {HTMLElement} bannerElement
	 * @return {boolean} whether or not the remaining viewport height is below the threshold
	 */
	hasSizeIssues( bannerElement ) {
		if ( ( $( window ).height() - $( bannerElement ).height() ) < this.minimumHeight ) {
			return true;
		}
		if ( $( window ).width() < this.minimumWidth ) {
			return true;
		}
		return false;
	}

}
