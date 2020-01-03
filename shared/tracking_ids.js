export function getTrackingIds( element ) {
	// banners on wp.de rely on the WrapperPlugin to inject global variables
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
