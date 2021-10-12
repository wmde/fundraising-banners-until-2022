import CampaignDays from './campaign_days';
import getEnglishOrdinalSuffixOf from './english_ordinal';

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
			daysSinceCampaignStart = getEnglishOrdinalSuffixOf( daysSinceCampaignStart );
		}
		return this.translations[ 'campaign-day-nth-day' ].replace( '{{days}}', daysSinceCampaignStart );

	}
}
