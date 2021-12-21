import CampaignDays, { endOfDay, startOfDay } from './campaign_days';

/**
 * @param {CampaignDays} campaignDays
 * @param {number} base
 * @param {number} increasePerMinute
 * @return {number}
 */
function calculateProjection( campaignDays, base, increasePerMinute ) {
	if ( !campaignDays.campaignHasStarted() ) {
		return 0;
	}
	if ( campaignDays.campaignHasEnded() ) {
		return base + ( campaignDays.getSecondsBetweenStartAndEndOfCampaign() / 60 ) * increasePerMinute;
	}
	return base + ( campaignDays.getSecondsSinceCampaignStart() / 60 ) * increasePerMinute;
}

/**
 * @param {CampaignDays} campaignDays
 * @param {Object} options
 * @constructor
 */
export function CampaignProjection( campaignDays, options ) {
	this.campaignDays = campaignDays;
	this.baseDonationSum = options.baseDonationSum || 0;
	this.donationAmountPerMinute = options.donationAmountPerMinute || 0;
	this.donorsBase = options.donorsBase || 0;
	this.donorsPerMinute = options.donorsPerMinute || 0;
	this.goalDonationSum = options.goalDonationSum || 0;
	this.averageAmountPerDonation = options.averageAmountPerDonation || 21; // a very rough value based on past campaigns
}

CampaignProjection.prototype.getProjectedDonationSum = function () {
	return calculateProjection( this.campaignDays, this.baseDonationSum, this.donationAmountPerMinute );
};

CampaignProjection.prototype.getProjectedRemainingDonationSum = function () {
	let remainingAmount = this.goalDonationSum - this.getProjectedDonationSum();
	return Math.round( remainingAmount / 100000 ) * 100000;
};

CampaignProjection.prototype.getProjectedNumberOfDonors = function () {
	return calculateProjection( this.campaignDays, this.donorsBase, this.donorsPerMinute );
};

CampaignProjection.prototype.getRemainingDays = function () {
	return this.campaignDays.getNumberOfDaysUntilCampaignEnd();
};

CampaignProjection.prototype.getRemainingDonorsNeeded = function () {
	return Math.round( this.getProjectedRemainingDonationSum() / this.averageAmountPerDonation );
};

export function createCampaignProjection( campaignParameters ) {
	return new CampaignProjection(
		new CampaignDays(
			startOfDay( campaignParameters.donationProjection.baseDate ),
			endOfDay( campaignParameters.endDate )
		),
		campaignParameters.donationProjection
	);
}
