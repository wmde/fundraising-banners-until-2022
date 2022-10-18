'use strict';

export default class VisitorsVsDonorsSentence {

	/**
	 * @param {number} millionImpressionsPerDay
	 * @param {string} projectedNumberOfDonors
	 * @param {string} text
	 * @param {string} textNoImpressions
	 */
	constructor( millionImpressionsPerDay, projectedNumberOfDonors, text, textNoImpressions ) {
		this.millionImpressionsPerDay = millionImpressionsPerDay;
		this.projectedNumberOfDonors = projectedNumberOfDonors;
		this.text = text;
		this.textNoImpressions = textNoImpressions;
	}

	getSentence() {
		const text = this.millionImpressionsPerDay === 0 ? this.textNoImpressions : this.text;
		return text
			.replace( '{{millionImpressionsPerDay}}', this.millionImpressionsPerDay.toString() )
			.replace( '{{totalNumberOfDonors}}', this.projectedNumberOfDonors );
	}

}
