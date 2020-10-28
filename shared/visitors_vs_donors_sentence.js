'use strict';

export default class VisitorsVsDonorsSentence {

	/**
	 * @param {CampaignParameters} campaignParameters
	 * @param {CampaignProjection} campaignProjection
	 * @param {CampaignDays} campaignDays
	 * @param {Object} translations
	 */
	constructor( campaignParameters, campaignProjection, campaignDays, translations ) {
		this.campaignParameters = campaignParameters;
		this.campaignProjection = campaignProjection;
		this.campaignDays = campaignDays;
		this.translations = translations;
	}

	getSentence() {
		if ( this.campaignDays.getDaysSinceCampaignStart() >= 2 ) {
			return this.translations[ 'visitors-vs-donors-sentence' ]
				.replace( '{{millionImpressionsPerDay}}', this.campaignParameters.millionImpressionsPerDay )
				.replace( '{{totalNumberOfDonors}}', Math.floor( this.campaignProjection.getProjectedNumberOfDonors() ) );
		} else {
			return '';
		}
	}

}
