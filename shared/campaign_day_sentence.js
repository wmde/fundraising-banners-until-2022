const SENTENCES = {
	de: {
		before_campaign: 'Heute bitten wir Sie um Ihre Unterstützung.',
		first_day: 'Heute beginnt unsere Spendenkampagne.',
		nth_day: 'Heute ist der {{days}}. Tag unserer Spendenkampagne.',
		only_n_days: 'Es bleiben nur noch {{days}} Tage, um Wikipedia in diesem Jahr zu unterstützen.',
		last_day: 'Es bleibt nur noch ein Tag, um Wikipedia in diesem Jahr zu unterstützen.',
	},
	en: {
		last_day: 'Today is the final day of our donation campaign.',
		only_n_days: 'This is the last week of our donation campaign.',
	}
};

function trans( language, msgId ) {
	if ( typeof SENTENCES[language] === 'undefined' || SENTENCES[language][msgId] === 'undefined' ) {
		return '';
	}
	return SENTENCES[language][msgId];
}

export default class CampaignDaySentence {

	/**
	 * @param {CampaignDays} campaignDays
	 * @param {string} language
	 */
	constructor( campaignDays, language = 'de' ) {
		this.campaignDays = campaignDays;
		this.language = language;
	}

	getSentence() {
		if ( !this.campaignDays.campaignHasStarted() ) {
			return trans( this.language, 'before_campaign' );
		}
		if ( this.campaignDays.campaignHasEnded() ) {
			return '';
		}
		const daysUntilCampaignEnds =  Math.ceil( this.campaignDays.getSecondsUntilCampaignEnds() / 86400 );
		const daysSinceCampaignStart = Math.ceil( this.campaignDays.getSecondsSinceCampaignStart() / 86400 );

		if ( daysUntilCampaignEnds === 1 ) {
			return trans( this.language, 'last_day' );
		} else if ( daysUntilCampaignEnds <= 7 ) {
			return trans( this.language, 'only_n_days' ).replace( '{{days}}', daysUntilCampaignEnds );
		}

		if(  daysSinceCampaignStart === 1 ) {
			return trans( this.language, 'first_day' );
		} else {
			return trans( this.language, 'nth_day' ).replace( '{{days}}', daysSinceCampaignStart );
		}
	}
}