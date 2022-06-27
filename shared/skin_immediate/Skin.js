'use strict';

// eslint-disable-next-line no-unused-vars
import $ from 'jquery';

export default class Skin {

	/**
	 * Children must implement this
	 *
	 * @param {number} bannerHeight
	 */
	addSpaceInstantly( bannerHeight ) { // eslint-disable-line no-unused-vars
	}

	/**
	 * Children might implement this if they have an absolutely-positioned sidebar element
	 *
	 * @param {number} bannerHeight
	 */
	addSpaceToSidebarInstantly( bannerHeight ) { // eslint-disable-line no-unused-vars
	}

	/**
	 * Children might implement this
	 */
	removeSpace() {
	}

	/**
	 * Children might implement this
	 */
	moveBannerContainerToTopOfDom() {
	}

	/**
	 * Some Children must implement this, if their search ui interferes with the banner
	 *
	 * @param {Function} onSearchFocusWhenBannerIsLoading
	 * @param {Function} onSearchFocusWhenBannerIsVisible
	 */
	addSearchObserver( onSearchFocusWhenBannerIsLoading, onSearchFocusWhenBannerIsVisible ) { // eslint-disable-line no-unused-vars
	}

	/**
	 * close banner when editor is activated
	 *
	 * @param {Function} onEdit
	 */
	addEditorObserver( onEdit ) { // eslint-disable-line no-unused-vars
	}

	getName() {
		throw new Error( 'Subclasses must implement skin name!' );
	}

	getSizeIssueThreshold() {
		return 0;
	}
}
