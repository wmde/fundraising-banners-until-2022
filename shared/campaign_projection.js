/**
 * @param {Date} campaignStartDate
 * @param {Date} campaignEndDate
 * @returns {number}
 */
function getSecondsSinceCampaignStart( campaignStartDate, campaignEndDate ) {
	const maxSecs = Math.floor( ( campaignEndDate.getTime() - campaignStartDate.getTime() ) / 1000 ),
		secsPassed = Math.floor( ( new Date().getTime() - campaignStartDate.getTime() ) / 1000 );

	return Math.max( 0, Math.min( maxSecs, secsPassed ) );
}

/**
 * @param {Date} campaignStartDate
 * @param {Date} campaignEndDate
 * @param {number} base
 * @param {number} increasePerMinute
 * @returns {number}
 */
function calculateProjection( campaignStartDate, campaignEndDate, base, increasePerMinute ) {
	const minutesPassed = getSecondsSinceCampaignStart( campaignStartDate, campaignEndDate ) / 60;
	if ( minutesPassed === 0 ) {
		return 0;
	}

	return base + minutesPassed * increasePerMinute;
}

function CampaignProjection( options ) {
	this.campaignStartDate = options.campaignStartDate || new Date();
	this.campaignEndDate = options.campaignEndDate || new Date();
	this.baseDonationSum = options.baseDonationSum || 0;
	this.donationAmountPerMinute = options.donationAmountPerMinute || 0;
	this.donorsBase = options.donorsBase || 0;
	this.donorsPerMinute = options.donorsPerMinute || 0;
}

CampaignProjection.prototype.getProjectedDonationSum = function () {
	return calculateProjection( this.campaignStartDate, this.campaignEndDate, this.baseDonationSum, this.donationAmountPerMinute );
};

CampaignProjection.prototype.getProjectedNumberOfDonors = function () {
	return calculateProjection( this.campaignStartDate, this.campaignEndDate, this.donorsBase, this.donorsPerMinute );
};

module.exports = CampaignProjection;
