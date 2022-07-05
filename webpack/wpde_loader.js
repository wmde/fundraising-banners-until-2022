const CampaignConfig = require( './campaign_config' );

/**
 * This webpack loader injects the tracking IDs for the current banner into the entry point of the banner.
 * This loader should be used only for the entry point JavaScript files of the WPDE banners,
 * where we don't have a DOM element that contains the tracking IDs
 *
 * @param {string} source
 * @return {string}
 */
module.exports = function ( source ) {
	const options = this.getOptions();
	if ( !options.campaigns || !( options.campaigns instanceof CampaignConfig ) ) {
		throw new Error( 'You must pass a CampaignConfig instance to the wpde_loader options' );
	}
	const campaigns = options.campaigns;
	const trackingData = campaigns.getCampaignTrackingForEntryPoint( this.resourcePath );
	return `
		/* Tracking data inserted by wpde_loader on ${new Date().toISOString().replace( 'T', ' ' ).replace( /\.\d+Z$/, '' )} */
		window.BannerName = '${trackingData.bannerTracking}';
		window.CampaignName = '${trackingData.campaignTracking}';
		/* End inserted code */
		${source}
	`;
};
