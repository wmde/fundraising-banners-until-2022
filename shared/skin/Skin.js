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

	getName() {
		return this.constructor.name.toLowerCase();
	}
};
