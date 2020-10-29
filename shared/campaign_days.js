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

	getNumberOfDaysUntilCampaignEnd() {
		return Math.ceil( this.getSecondsUntilCampaignEnds() / 60 / 60 / 24 );
	}

	getNumberOfDaysSinceCampaignStart() {
		return Math.floor( this.getSecondsSinceCampaignStart() / 60 / 60 / 24 );
	}

}

/**
 *
 * @param {string} dateStr
 * @return {Array}
 */
function getDateParts( dateStr ) {
	const result = dateStr.match( /^(\d{4})-(\d{2})-(\d{2})$/ );
	if ( result === null ) {
		throw Error( 'Wrong date string format' );
	}
	result.shift();
	return result;
}

/**
 * Return date object for the given date, with the time set to 0:00:00
 *
 * @param {string} dateStr Date in format YYYY-MM-DD
 * @return {Date}
 */
export function startOfDay( dateStr ) {
	const [ year, month, day ] = getDateParts( dateStr );
	return new Date( year, month - 1, day, 0, 0, 0 );
}

/**
 * Return date object for the given date, with the time set to 23:59:59
 *
 * @param {string} dateStr Date in format YYYY-MM-DD
 * @return {Date}
 */
export function endOfDay( dateStr ) {
	const [ year, month, day ] = getDateParts( dateStr );
	return new Date( year, month - 1, day, 23, 59, 59 );
}
