"use strict";

export default class CampaignDays {
	/**
	 *
	 * @param {Date} startDate
	 * @param {Date} endDate
	 * @param {Date} now
	 */
	constructor ( startDate, endDate, now = new Date() ) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.now = now;
	}

	campaignHasStarted() {
		return this.getSecondsSinceCampaignStart() > 0;
	}

	campaignHasEnded() {
		return this.endDate.getTime() - this.now.getTime() < 0;
	}

	getSecondsSinceCampaignStart() {
		console.log("now", this.now)
		console.log("start", this.startDate)
		return Math.floor( ( this.now.getTime() - this.startDate.getTime() ) / 1000 );
	}

}

