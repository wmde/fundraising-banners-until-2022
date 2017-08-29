function CampaignProjection( campaignStartDate, campaignEndDate, baseDonationSum, donationAmountPerMinute,
							 donorsBase, donorsPerMinute, randomFactor ) {
	this.campaignStartDate = campaignStartDate;
	this.campaignEndDate = campaignEndDate;
	this.baseDonationSum = baseDonationSum;
	this.donationAmountPerMinute = donationAmountPerMinute;
	this.donorsBase = donorsBase;
	this.donorsPerMinute = donorsPerMinute;
	this.randomFactor = randomFactor || Math.floor( ( Math.random() ) + 0.5 - 0.2 );
}

CampaignProjection.prototype.getSecondsSinceCampaignStart = function () {
	const maxSecs = Math.floor( ( this.campaignEndDate.getTime() - this.campaignStartDate.getTime() ) / 1000 ),
		secsPassed = Math.floor( ( new Date().getTime() - this.campaignStartDate.getTime() ) / 1000 );

	return Math.max( 0, Math.min( maxSecs, secsPassed ) );
};

CampaignProjection.prototype.getProjectedDonationSum = function ( randomDeviation ) {
	return this.calculateProjection( this.baseDonationSum, this.donationAmountPerMinute, randomDeviation ? this.randomFactor : 0 );
};

CampaignProjection.prototype.getProjectedNumberOfDonors = function ( randomDeviation ) {
	return this.calculateProjection( this.donorsBase, this.donorsPerMinute, randomDeviation ? this.randomFactor : 0 );
};

CampaignProjection.prototype.calculateProjection = function ( baseValue, increasePerMinute, randomFactor ) {
	const minutesPassed = this.getSecondsSinceCampaignStart() / 60,
		increase = increasePerMinute * ( 100 + randomFactor ) / 100;
	return minutesPassed * increase + baseValue;
};

function getDigitGroupingCharacter() {
	switch ( mw.config.get( 'wgContentLanguage' ) ) {
		case 'de':
			return '.';
		case 'en':
			return ',';
		default:
			return '.';
	}
}

function addPointsToNum( num ) {
	// jscs:disable disallowImplicitTypeConversion
	num = parseInt( num, 10 ) + '';
	// jscs:enable disallowImplicitTypeConversion
	num = num.replace( /\./g, ',' );
	return num.replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + getDigitGroupingCharacter() );
}

function floorF( num ) {
	return Math.floor( num * 100 ) / 100;
}

module.exports = CampaignProjection;
