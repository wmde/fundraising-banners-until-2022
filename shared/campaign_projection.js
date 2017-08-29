function CampaignProjection( campaignStartDate, campaignEndDate, baseDonationSum, donationAmountPerMinute,
							 donorsBase, donorsPerMinute, digitGroupingCharacter, randomFactor ) {
	this.campaignStartDate = campaignStartDate;
	this.campaignEndDate = campaignEndDate;
	this.baseDonationSum = baseDonationSum;
	this.donationAmountPerMinute = donationAmountPerMinute;
	this.donorsBase = donorsBase;
	this.donorsPerMinute = donorsPerMinute;
	this.digitGroupingCharacter = digitGroupingCharacter;
	this.randomFactor = randomFactor || Math.floor( ( Math.random() ) + 0.5 - 0.2 );
}

CampaignProjection.prototype.getSecondsSinceCampaignStart = function () {
	const maxSecs = Math.floor( ( this.campaignEndDate.getTime() - this.campaignStartDate.getTime() ) / 1000 ),
		secsPassed = Math.floor( ( new Date().getTime() - this.campaignStartDate.getTime() ) / 1000 );

	return Math.max( 0, Math.min( maxSecs, secsPassed ) );
};

CampaignProjection.prototype.getProjectedDonationSum = function ( randomDeviation ) {
	return this.formatNumber(
		this.calculateProjection( this.baseDonationSum, this.donationAmountPerMinute, randomDeviation ? this.randomFactor : 0 ),
		this.digitGroupingCharacter
	);
};

CampaignProjection.prototype.getProjectedNumberOfDonors = function ( randomDeviation ) {
	return this.formatNumber(
		this.calculateProjection( this.donorsBase, this.donorsPerMinute, randomDeviation ? this.randomFactor : 0 ),
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

function floorF( num ) {
	return Math.floor( num * 100 ) / 100;
}

module.exports = CampaignProjection;
