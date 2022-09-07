'use strict';

// TODO move to shared if we want to use this in other banners
export default class DonorsNeededSentence {
	/**
	 * @param {string} donorsNeeded
	 * @param {string} text
	 */
	constructor( donorsNeeded, text ) {
		this.donorsNeeded = donorsNeeded;
		this.text = text;
	}

	getSentence() {
		if ( this.donorsNeeded <= 0 ) {
			return '';
		}
		return this.text
			.replace( '{{donorsNeeded}}', this.donorsNeeded );
	}
}
