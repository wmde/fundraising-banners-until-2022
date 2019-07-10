'use strict';

module.exports = class Skin {
	/**
	 * Children must implement this
	 *
	 * @param {number} bannerHeight
	 */
	addSpace( bannerHeight ) { // eslint-disable-line no-unused-vars
	}

	/**
	 * Children must implement this
	 *
	 * @param {number} bannerHeight
	 */
	addSpaceInstantly( bannerHeight ) { // eslint-disable-line no-unused-vars
	}

	/**
	 * Children must implement this
	 */
	removeSpace() {
	}

	/**
	 * Some Children must implement this, if their search UI interferes with the banner
	 * @param {Function} onSearchFocus
	 */
	addSearchObserver( onSearchFocus ) { // eslint-disable-line no-unused-vars
	}

	getName() {
		return this.constructor.name.toLowerCase();
	}
};
