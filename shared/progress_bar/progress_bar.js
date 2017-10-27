require('./style.pcss');

/**
 * Display a progress bar
 *
 * Next refactoring steps:
 * - Do "inner" and "outer" display of .progress_bar__donation_remaining with CSS instead of JavaScript:
 *      create --outer and --inner modifiers for the root progress bar element and change the styling of
 *      ._progress_bar__wrapper and .progress_bar__donation_remaining accordingly. This will also make
 *      the getFillWidth method more slim/obsolete
 * - Change width of .progress_bar__donation_fill to a percentage calculated from dCollected/dTarget. You can then
 *      get rid of the resize function.
 * - Set "--inner" and "--outer" modifier depending on the space the "inner" element would need vs the remaining free
 *      space inside the progress bar. The percentage-based display from the previous step will keep the
 *      .progress_bar__donation_fill in the right size.
 * - Convert to ES2015 class
 *
 * @param {object} GlobalBannerSettings
 * @param {CampaignProjection} campaignProjection
 * @constructor
 */
function ProgressBar( GlobalBannerSettings, campaignProjection ) {
	this.GlobalBannerSettings = GlobalBannerSettings;
	this.campaignProjection = campaignProjection;

	this.positionNeededSum = 'inner';
	this.minFillWidth = 100;

	this.neededSumInner = (this.positionNeededSum === 'inner');
	this.neededSumOuter = (this.positionNeededSum !== 'inner');
}

ProgressBar.prototype.getBarWidth = function () {
	return $( '.progress_bar__donation_meter' ).width();
};

ProgressBar.prototype.animate = function () {
	var self = this,
		donationFillElement = $( '.progress_bar__donation_fill' ),
		daysLeftElement = $( '.progress_bar__days_left' ),
		donationValueElement = $( '#donationValue' ),
		remainingValueElement = $( '#valRem' ),
		preFillValue = 0,
		barWidth, dTarget, dCollected, dRemaining, fWidth, widthToFill,
		donationSumNeededElementWidth = this.neededSumOuter ? $( '.progress_bar__donation_remaining--outer' ).width() : 0,
		wrapperRightMargin = parseInt( $( '.progress_bar__wrapper' ).css( 'marginRight' ) );

	$( '.progress_bar__wrapper' ).css( { marginRight: donationSumNeededElementWidth + 10 + wrapperRightMargin } );
	$( '.progress_bar__donation_remaining--outer' ).css( { right: 0 - donationSumNeededElementWidth + 10 } );

	donationFillElement.clearQueue();
	donationFillElement.stop();
	donationFillElement.width( preFillValue + 'px' );

	daysLeftElement.hide();

	barWidth = this.getBarWidth();

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
			$( '.progress_bar__donation_text' ).show();
			if ( self.neededSumOuter ) {
				$( '.progress_bar__donation_remaining--outer' ).show();
			} else {
				$( '.progress_bar__donation_remaining--inner' ).show();
			}
			daysLeftElement.show();
		}
	} );
};

// called on window resize
ProgressBar.prototype.resize = function () {
	var donationFillElement = $( '.progress_bar__donation_fill' ),
		barWidth, dCollected;
	barWidth = this.getBarWidth();
	dCollected = this.campaignProjection.getProjectedDonationSum();
	donationFillElement.width( this.getFillWidth( barWidth, this.GlobalBannerSettings.goalSum, dCollected ) + 'px' );
};

ProgressBar.prototype.getFillWidth = function ( donationBarWidth, donationTarget, donationsCollected ) {
	var widthToFill,
		maxFillWidth = donationBarWidth - 16,
		fWidth = donationsCollected / donationTarget * donationBarWidth;

	if ( this.neededSumInner ) {
		maxFillWidth = maxFillWidth - $( '.progress_bar__donation_remaining--inner' ).width();
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
