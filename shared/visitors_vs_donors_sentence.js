'use strict';

export default class VisitorsVsDonorsSentence {

	/**
	 * @param {number} millionImpressionsPerDay
	 * @param {string} projectedNumberOfDonors
	 * @param {number} daysSinceCampaignStart
	 * @param {string} text
	 */
	constructor( millionImpressionsPerDay, projectedNumberOfDonors, daysSinceCampaignStart, text ) {
		this.millionImpressionsPerDay = millionImpressionsPerDay;
		this.projectedNumberOfDonors = projectedNumberOfDonors;
		this.daysSinceCampaignStart = daysSinceCampaignStart;
		this.text = text;
	}

	getSentence() {
		if ( this.daysSinceCampaignStart >= 1 ) {
			return this.text
				.replace( '{{millionImpressionsPerDay}}', this.millionImpressionsPerDay.toString() )
				.replace( '{{totalNumberOfDonors}}', this.projectedNumberOfDonors );
		}
		return '';

	}

}
