'use strict';

export default class VisitorsVsDonorsSentence {

	/**
	 * @param {number} millionImpressionsPerDay
	 * @param {number} projectedNumberOfDonors
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
		if ( this.daysSinceCampaignStart >= 2 ) {
			return this.text
				.replace( '{{millionImpressionsPerDay}}', this.millionImpressionsPerDay )
				.replace( '{{totalNumberOfDonors}}', String( Math.floor( this.projectedNumberOfDonors ) ) );
		} else {
			return '';
		}
	}

}
