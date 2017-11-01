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

function CampaignProjection( campaignDays, options ) {
	this.campaignDays = campaignDays;
	this.baseDonationSum = options.baseDonationSum || 0;
	this.donationAmountPerMinute = options.donationAmountPerMinute || 0;
	this.donorsBase = options.donorsBase || 0;
	this.donorsPerMinute = options.donorsPerMinute || 0;
}

CampaignProjection.prototype.getProjectedDonationSum = function () {

	return calculateProjection( this.campaignDays, this.baseDonationSum, this.donationAmountPerMinute );
};

CampaignProjection.prototype.getProjectedNumberOfDonors = function () {
	return calculateProjection( this.campaignDays, this.donorsBase, this.donorsPerMinute );
};

module.exports = CampaignProjection;
