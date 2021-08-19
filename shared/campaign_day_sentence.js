import CampaignDays from './campaign_days';

export default class CampaignDaySentence {

	/**
	 * @param {CampaignDays} campaignDays
	 * @param {Object} translations
	 * @param {number} urgencyThreshold
	 */
	constructor( campaignDays, translations, urgencyThreshold = 10 ) {
		this.campaignDays = campaignDays;
		this.translations = translations;
		this.urgencyThreshold = urgencyThreshold;
	}

	getSentence() {
		if ( !this.campaignDays.campaignHasStarted() ) {
			return this.translations[ 'campaign-day-before-campaign' ];
		}
		if ( this.campaignDays.campaignHasEnded() ) {
			return '';
		}
		let daysUntilCampaignEnds = Math.ceil( this.campaignDays.getSecondsUntilCampaignEnds() / 86400 );
		let daysSinceCampaignStart = Math.ceil( this.campaignDays.getSecondsSinceCampaignStart() / 86400 );

		if ( daysUntilCampaignEnds === 1 ) {
			return this.translations[ 'campaign-day-last-day' ];
		} else if ( daysUntilCampaignEnds <= this.urgencyThreshold ) {
			return this.translations[ 'campaign-day-only-n-days' ].replace( '{{days}}', daysUntilCampaignEnds );
		}

		if ( daysSinceCampaignStart === 1 ) {
			return this.translations[ 'campaign-day-first-day' ];
		}
		if ( this.translations.LANGUAGE === 'en' ) {
			daysSinceCampaignStart = this.getEnglishOrdinalSuffixOf( daysSinceCampaignStart );
		}
		return this.translations[ 'campaign-day-nth-day' ].replace( '{{days}}', daysSinceCampaignStart );

	}

	getEnglishOrdinalSuffixOf( i ) {
		let j = i % 10,
			k = i % 100;
		if ( j === 1 && k !== 11 ) {
			return i + 'st';
		}
		if ( j === 2 && k !== 12 ) {
			return i + 'nd';
		}
		if ( j === 3 && k !== 13 ) {
			return i + 'rd';
		}
		return i + 'th';
	}
}
