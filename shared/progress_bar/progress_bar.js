require( './style.pcss' );

/**
 * Display a progress bar
 *
 * Next refactoring steps:
 * - Set "--lateprogress" modifier depending on the space the "inner" element would need vs the remaining free
 *      space inside the progress bar.
 * - Use campaign_days.js from https://github.com/wmde/fundraising-banners/pull/27 to calculate remaining days
 * - Convert to ES2015 class
 *
 * @param {object} GlobalBannerSettings
 * @param {CampaignProjection} campaignProjection
 * @param {object} options
 * @constructor
 */
function ProgressBar( GlobalBannerSettings, campaignProjection, options ) {
	this.GlobalBannerSettings = GlobalBannerSettings;
	this.campaignProjection = campaignProjection;
	this.options = Object.assign( {
		minWidth: 90,
		textRight: 'es fehlen <span class="js-value_remaining">1,2</span> Mio. €',
		textInnerLeft: ''
	}, options || {} );
}

ProgressBar.prototype.animate = function () {
	var donationFillElement = $( '.progress_bar__donation_fill' ),
		donationValueElement = $( '.js-donation_value' ),
		remainingValueElement = $( '.js-value_remaining' ),
		donationTarget, donationsCollected, donationsRemaining;

	donationFillElement.clearQueue();
	donationFillElement.stop();

	donationTarget = this.GlobalBannerSettings.goalSum;
	donationsCollected = this.campaignProjection.getProjectedDonationSum();

	if ( donationsCollected > donationTarget ) {
		donationsCollected = donationTarget;
	}
	donationsRemaining = donationTarget - donationsCollected;

	donationFillElement.animate(
		{
			width: this.getWidthToFill( donationsCollected, donationTarget, donationFillElement.parent().width() )
		},
		{
			duration: 3000,
			progress: function ( animation, progress ) {
				var aCollected = donationsCollected * progress,
					aRemaining = donationTarget - aCollected;
				remainingValueElement.html( formatMillion( aRemaining ) );
				donationValueElement.html( formatMillion( aCollected ) );
			},
			complete: function () {
				remainingValueElement.html( formatMillion( donationsRemaining ) );
				donationValueElement.html( formatMillion( donationsCollected ) );
				$( '.progress_bar' ).addClass( 'progress_bar--finished' );
			}
		}
	);
};

/**
 *
 * @param {Number} donationsCollected
 * @param {Number} donationsTarget
 * @param {Number} containerWidth
 * @return {string} Min width in pixel or fill width in percent
 */
ProgressBar.prototype.getWidthToFill = function ( donationsCollected, donationsTarget, containerWidth ) {
	var widthToFill = ( donationsCollected / donationsTarget ) * 100,
		barFilled = containerWidth * ( donationsCollected / donationsTarget );
	return barFilled > this.options.minWidth ? widthToFill + '%' : this.options.minWidth + 'px';
};

function formatMillion( value ) {
	return ( value / 1000000 ).toFixed( 1 ).replace( '.', getDecimalSeparator );
}

function getDecimalSeparator() {
	switch ( mw.config.get( 'wgContentLanguage' ) ) {
		case 'de':
			return ',';
		case 'en':
			return '.';
		default:
			return ',';
	}
}

ProgressBar.prototype.render = function () {
	const template = require( './template.hbs' );

	return template( {
		'text-inner-right': '<span class="js-donation_value">0,0</span> Mio. €',
		'text-inner-left': this.options.textInnerLeft,
		'text-right': this.options.textRight
	} );
};

module.exports = ProgressBar;
