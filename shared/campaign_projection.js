function CampaignProjection( options ) {
	this.campaignStartDate = options.campaignStartDate || new Date();
	this.campaignEndDate = options.campaignEndDate || new Date();
	this.baseDonationSum = options.baseDonationSum || 0;
	this.donationAmountPerMinute = options.donationAmountPerMinute || 0;
	this.donorsBase = options.donorsBase || 0;
	this.donorsPerMinute = options.donorsPerMinute || 0;
	this.digitGroupingCharacter = options.digitGroupingCharacter || '.';
	this.deviation = options.deviation || Math.floor( ( Math.random() ) + 0.5 - 0.2 );
}

CampaignProjection.prototype.getSecondsSinceCampaignStart = function () {
	const maxSecs = Math.floor( ( this.campaignEndDate.getTime() - this.campaignStartDate.getTime() ) / 1000 ),
		secsPassed = Math.floor( ( new Date().getTime() - this.campaignStartDate.getTime() ) / 1000 );

	return Math.max( 0, Math.min( maxSecs, secsPassed ) );
};

CampaignProjection.prototype.getProjectedDonationSum = function ( randomDeviation ) {
	return this.formatNumber(
		this.calculateProjection( this.baseDonationSum, this.donationAmountPerMinute, randomDeviation ? this.deviation : 0 ),
		this.digitGroupingCharacter
	);
};

CampaignProjection.prototype.getProjectedNumberOfDonors = function ( randomDeviation ) {
	return this.formatNumber(
		this.calculateProjection( this.donorsBase, this.donorsPerMinute, randomDeviation ? this.deviation : 0 ),
		this.digitGroupingCharacter
	);
};

CampaignProjection.prototype.calculateProjection = function ( baseValue, increasePerMinute, randomFactor ) {
	const minutesPassed = this.getSecondsSinceCampaignStart() / 60,
		increase = increasePerMinute * ( 100 + randomFactor ) / 100;
	return minutesPassed * increase + baseValue;
};

CampaignProjection.prototype.formatNumber = function ( number ) {
	return parseInt( number ).toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + this.digitGroupingCharacter );
};

module.exports = CampaignProjection;
