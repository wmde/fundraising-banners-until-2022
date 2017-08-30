function getSecondsSinceCampaignStart( that ) {
	const maxSecs = Math.floor( ( that.campaignEndDate.getTime() - that.campaignStartDate.getTime() ) / 1000 ),
		secsPassed = Math.floor( ( new Date().getTime() - that.campaignStartDate.getTime() ) / 1000 );

	return Math.max( 0, Math.min( maxSecs, secsPassed ) );
}

function calculateProjection( that, baseValue, increasePerMinute, randomFactor ) {
	const minutesPassed = getSecondsSinceCampaignStart( that ) / 60,
		increase = increasePerMinute * ( 100 + randomFactor ) / 100;
	return minutesPassed * increase + baseValue;
}

function formatNumber( that, number ) {
	return parseInt( number ).toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + that.digitGroupingCharacter );
}

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

CampaignProjection.prototype.getProjectedDonationSum = function ( randomDeviation ) {
	return formatNumber(
		this,
		calculateProjection( this, this.baseDonationSum, this.donationAmountPerMinute, randomDeviation ? this.deviation : 0 )
	);
};

CampaignProjection.prototype.getProjectedNumberOfDonors = function ( randomDeviation ) {
	return formatNumber(
		this,
		calculateProjection( this, this.donorsBase, this.donorsPerMinute, randomDeviation ? this.deviation : 0 )
	);
};

module.exports = CampaignProjection;
