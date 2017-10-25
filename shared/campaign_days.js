'use strict';

export default class CampaignDays {
	/**
	 *
	 * @param {Date} startDate
	 * @param {Date} endDate
	 * @param {Date} now
	 */
	constructor( startDate, endDate, now = new Date() ) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.now = now;
	}

	campaignHasStarted() {
		return this.getSecondsSinceCampaignStart() > 0;
	}

	campaignHasEnded() {
		return this.getSecondsUntilCampaignEnds() < 0;
	}

	getSecondsSinceCampaignStart() {
		return Math.floor( ( this.now.getTime() - this.startDate.getTime() ) / 1000 );
	}

	getSecondsUntilCampaignEnds() {
		return Math.floor( ( this.endDate.getTime() - this.now.getTime() ) / 1000 );
	}

	getSecondsBetweenStartAndEndOfCampaign() {
		return Math.floor( ( this.endDate.getTime() - this.startDate.getTime() ) / 1000 );
	}

}
