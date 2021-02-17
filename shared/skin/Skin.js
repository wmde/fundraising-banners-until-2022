'use strict';

// eslint-disable-next-line no-unused-vars
import $ from 'jquery';
import CssTransition from '../css_transition';

export default class Skin {
	/**
	 * Children must implement this
	 *
	 * @param {number} bannerHeight
	 * @param {CssTransition} transition
	 */
	addSpace( bannerHeight, transition ) { // eslint-disable-line no-unused-vars
	}

	/**
	 * Children must implement this
	 *
	 * @param {number} bannerHeight
	 */
	addSpaceInstantly( bannerHeight ) { // eslint-disable-line no-unused-vars
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
	 * @param {Function} onSearchFocus
	 */
	addSearchObserver( onSearchFocus ) { // eslint-disable-line no-unused-vars
	}

	/**
	 * close banner when editor is activated
	 *
	 * @param {Function} onEdit
	 */
	addEditorObserver( onEdit ) { // eslint-disable-line no-unused-vars
	}

	getName() {
		return this.constructor.name.toLowerCase();
	}

	getSizeIssueThreshold() {
		return 0;
	}
}
