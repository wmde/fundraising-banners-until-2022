require('./style.pcss');

function ProgressBar( GlobalBannerSettings, campaignProjection ) {
	this.GlobalBannerSettings = GlobalBannerSettings;
	this.campaignProjection = campaignProjection;

	this.positionNeededSum = 'outer';
	this.minFillWidth = 100;

	this.neededSumInner = (this.positionNeededSum === 'inner');
	this.neededSumOuter = (this.positionNeededSum !== 'inner');
}

ProgressBar.prototype.animateProgressBar = function () {
	var self = this,
		donationFillElement = $( '#donationFill' ),
		daysLeftElement = $( '#daysLeft' ),
		donationValueElement = $( '#donationValue' ),
		remainingValueElement = $( '#valRem' ),
		preFillValue = 0,
		barWidth, dTarget, dCollected, dRemaining, fWidth, widthToFill,
		donationSumNeededElementWidth = $( '#donationRemainingOuter' ).width();

	$( '#donationMeterWrapper' ).css( { marginRight: donationSumNeededElementWidth + 10 } );
	$( '#donationRemainingOuter' ).css( { right: 0 - donationSumNeededElementWidth + 10 } );

	donationFillElement.clearQueue();
	donationFillElement.stop();
	donationFillElement.width( preFillValue + 'px' );

	daysLeftElement.hide();

	barWidth = $( '#donationMeter' ).width();

	dTarget = this.GlobalBannerSettings.goalSum;

	dCollected = this.campaignProjection.getProjectedDonationSum();

	if ( dCollected > dTarget ) {
		dCollected  = dTarget;
	}
	dRemaining = dTarget - dCollected;
	fWidth = dCollected / dTarget * barWidth;
	widthToFill = this.getFillWidth( barWidth, dTarget, dCollected );

	donationFillElement.animate( { width: widthToFill + 'px' }, {
		duration: 3000,
		progress: function () {
			var dFill = donationFillElement.width() / widthToFill * fWidth,
				pFill = dFill / barWidth;

			remainingValueElement.html( self._formatMillion( dTarget - ( dTarget * pFill ) ) );
			donationValueElement.html( self._formatMillion( dTarget * pFill ) );
		},
		complete: function () {
			remainingValueElement.html( self._formatMillion( dRemaining ) );
			donationValueElement.html( self._formatMillion( dCollected ) );
			$( '#donationText' ).show();
			if ( self.neededSumOuter ) {
				$( '#donationRemainingOuter' ).show();
			} else {
				$( '#donationRemaining' ).show();
			}
			daysLeftElement.show();
		}
	} );
};

// called on window resize
ProgressBar.prototype.setProgressBarSize = function () {
	var donationFillElement = $( '#donationFill' ),
		barWidth, dCollected;
	barWidth = $( '#donationMeter' ).width();
	dCollected = this.campaignProjection.getProjectedDonationSum();
	donationFillElement.width( this.getFillWidth( barWidth, this.GlobalBannerSettings.goalSum, dCollected ) + 'px' );
};

ProgressBar.prototype.getFillWidth = function ( donationBarWidth, donationTarget, donationsCollected ) {
	var widthToFill,
		maxFillWidth = donationBarWidth - 16,
		fWidth = donationsCollected / donationTarget * donationBarWidth;

	if ( this.neededSumInner ) {
		maxFillWidth = maxFillWidth - $( '#donationRemaining' ).width();
	}

	widthToFill = Math.min( maxFillWidth, fWidth );
	// Fill at least 100px or 15% (in case 15% fill is lower than 100px)
	widthToFill = Math.max( this.minFillWidth, /*0.15 * donationBarWidth,*/ widthToFill );
	return widthToFill;
};

ProgressBar.prototype._formatMillion = function( value ) {
	return ( value / 1000000 ).toFixed( 1 ).replace( '.', this._getDecimalSeparator );
};

ProgressBar.prototype._getDecimalSeparator = function () {
	switch ( mw.config.get( 'wgContentLanguage' ) ) {
		case 'de':
			return ',';
		case 'en':
			return '.';
		default:
			return ',';
	}
};

ProgressBar.prototype.render = function () {
	const template = require('./template.hbs');

	return template( {
		'text-inner-right': '<span id="donationValue">0,0</span> Mio. €',
		'text-inner-left': 'Nur noch <span class="numDaysLeft">1 Tag</span>',
		'text-right': 'es fehlen <span id="valRem">1,2</span> Mio. €',
		'needed-sum-inner': this.neededSumInner,
		'needed-sum-outer': this.neededSumOuter
	} );
};

module.exports = ProgressBar;
