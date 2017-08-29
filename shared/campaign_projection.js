function CampaignProjection( campaignStartDate, campaignEndDate, baseDonationSum, donationAmountPerMinute, randomFactor ) {
	this.campaignStartDate = campaignStartDate;
	this.campaignEndDate = campaignEndDate;
	this.baseDonationSum = baseDonationSum;
	this.donationAmountPerMinute = donationAmountPerMinute;
	this.randomFactor = randomFactor || Math.floor( ( Math.random() ) + 0.5 - 0.2 );
}

CampaignProjection.prototype.getSecondsSinceCampaignStart = function () {
	const maxSecs = Math.floor( ( this.campaignEndDate.getTime() - this.campaignStartDate.getTime() ) / 1000 ),
		secsPassed = Math.floor( ( new Date().getTime() - this.campaignStartDate.getTime() ) / 1000 );

	return Math.max( 0, Math.min( maxSecs, secsPassed ) );
};

CampaignProjection.prototype.getProjectedDonationSum = function ( randomDeviation ) {
	const minutesPassed = this.getSecondsSinceCampaignStart() / 60,
		increasePerMinute = this.donationAmountPerMinute * ( 100 + ( randomDeviation ? this.randomFactor : 0 ) ) / 100;

	return minutesPassed * increasePerMinute + this.baseDonationSum;
};

function getApprDonatorsRaw( rand ) {
	var startDonators = donorsBase,
		secsPast = getSecsPassed();

	return startDonators + getApprDonatorsFor( secsPast, rand );
}

function getApprDonatorsFor( secsPast, rand ) {
	var apprDonatorsMinute = donorsPerMinApproximation,
		randFactor = 0;

	if ( rand === true ) {
		randFactor = Math.floor( ( Math.random() ) + 0.5 - 0.2 );
	}

	return ( secsPast / 60 * ( apprDonatorsMinute * ( 100 + randFactor ) ) / 100 );
}

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
