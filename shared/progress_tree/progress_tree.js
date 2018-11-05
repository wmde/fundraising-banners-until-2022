require( './style.pcss' );

/**
 * Display a progress tree
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
function ProgressTree( GlobalBannerSettings, campaignProjection, options ) {
	this.GlobalBannerSettings = GlobalBannerSettings;
	this.campaignProjection = campaignProjection;
	this.options = Object.assign( {
		minSpace: 90
	}, options || {} );
}

ProgressTree.prototype.animate = function () {
	var donationFillElement = $( '.tree__fill' ),
		donationValueElement = $( '.js-donation_value' ),
		remainingValueElement = $( '.js-value_remaining' ),
		donationTarget, donationsCollected, donationsRemaining;

	donationFillElement.clearQueue();
	donationFillElement.stop();

	donationTarget = this.GlobalBannerSettings.goalDonationSum;
	donationsCollected = this.campaignProjection.getProjectedDonationSum();

	if ( donationsCollected > donationTarget ) {
		donationsCollected = donationTarget;
	}
	donationsRemaining = donationTarget - donationsCollected;

	donationFillElement.animate(
		{
			height: this.getSpaceToFill( donationsCollected, donationTarget, donationFillElement.parent().height() )
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
 * @param {Number} containerSpace
 * @return {string} Min space in pixel or fill space in percent
 */
ProgressTree.prototype.getSpaceToFill = function ( donationsCollected, donationsTarget, containerSpace ) {
	var spaceToFill = 100 - ( donationsCollected / donationsTarget ) * 100,
		barFilled = containerSpace * ( donationsCollected / donationsTarget );
	return barFilled > this.options.minSpace ? spaceToFill + '%' : this.options.minSpace + 'px';
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

ProgressTree.prototype.render = function () {
	const template = require( './template.hbs' );

	return template( {
		donated: '<span class="js-donation_value">0,0</span> Mio. €',
		missing: '<span class="js-value_remaining">1,2</span> Mio. €'
	} );
};

module.exports = ProgressTree;
