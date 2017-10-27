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
 * @constructor
 */
function ProgressBar( GlobalBannerSettings, campaignProjection ) {
	this.GlobalBannerSettings = GlobalBannerSettings;
	this.campaignProjection = campaignProjection;
}

ProgressBar.prototype.animate = function () {
	var donationFillElement = $( '.progress_bar__donation_fill' ),
		donationValueElement = $( '.js-donation_value' ),
		remainingValueElement = $( '.js-value_remaining' ),
		dTarget, dCollected, dRemaining, widthToFill;

	donationFillElement.clearQueue();
	donationFillElement.stop();

	dTarget = this.GlobalBannerSettings.goalSum;
	dCollected = this.campaignProjection.getProjectedDonationSum();

	if ( dCollected > dTarget ) {
		dCollected = dTarget;
	}
	dRemaining = dTarget - dCollected;
	widthToFill = ( dCollected / dTarget ) * 100;

	donationFillElement.animate( { width: widthToFill + '%' }, {
		duration: 3000,
		progress: function ( animation, progress ) {
			var aCollected = dCollected * progress,
				aRemaining = dTarget - aCollected;
			remainingValueElement.html( formatMillion( aRemaining ) );
			donationValueElement.html( formatMillion( aCollected ) );
		},
		complete: function () {
			remainingValueElement.html( formatMillion( dRemaining ) );
			donationValueElement.html( formatMillion( dCollected ) );
			$( '.progress_bar' ).addClass( 'progress_bar--finished' );
		}
	} );
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
		'text-inner-left': 'Nur noch <span class="numDaysLeft">1 Tag</span>',
		'text-right': 'es fehlen <span class="js-value_remaining">1,2</span> Mio. €'
	} );
};

module.exports = ProgressBar;
