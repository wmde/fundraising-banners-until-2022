export function getTrackingIds( element ) {
	// banners on wp.de rely on the wpde_loader to inject global variables with the tracking IDs
	if ( window.BannerName && window.CampaignName ) {
		return {
			campaignName: window.CampaignName,
			bannerName: window.BannerName
		};
	}
	// banners on wp.org have a wrapper DOM element with data attributes
	return {
		campaignName: element.dataset.campaignTracking || '',
		bannerName: element.dataset.tracking || ''
	};
}
