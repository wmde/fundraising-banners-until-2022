export const VIEWPORT_TRACKING_IDENTIFIER = 'viewport_tracking';
export const NAMESPACE_TRACKING_IDENTIFIER = 'namespace_tracking';
export const VIEWPORT_TRACKING_CLOSED_EVENT_IDENTIFIER = 'vtc';
export const VIEWPORT_TRACKING_SUBMITTED_EVENT_IDENTIFIER = 'submit';

export const EVENT_SCHEMA = 'event.WMDEBannerEvents';
export const BANNER_SIZE_SCHEMA = 'event.WMDEBannerSizeIssue';

export const ALWAYS_TRACK = 1;

export class EventLoggingTracker {
	bannerName;
	trackingService;
	randomNumber;

	constructor( bannerName, trackingService, randomNumber ) {
		this.bannerName = bannerName;
		this.trackingService = trackingService;
		this.randomNumber = randomNumber;
	}

	trackViewPortDimensions( trackingIdentifier, dimensionData, trackingRatio = 1 ) {
		this.trackViewportData( trackingIdentifier + '-' + this.bannerName, dimensionData, trackingRatio );
	}

	trackBannerEvent( actionName, slidesShown, finalSlide, trackingRatio = 0.01 ) {
		if ( this.randomNumber() < trackingRatio ) {
			this.trackingService.track( EVENT_SCHEMA, {
				bannerName: this.bannerName,
				bannerAction: actionName,
				eventRate: trackingRatio,
				slidesShown: slidesShown,
				finalSlide: finalSlide
			} );
			return true;
		}
		return false;
	}

	trackBannerEventWithViewport( actionName, slidesShown, finalSlide, trackingRatio = 0.01, dimensionData = {} ) {
		if ( this.trackBannerEvent( actionName, slidesShown, finalSlide, trackingRatio ) ) {
			this.trackViewportData( VIEWPORT_TRACKING_CLOSED_EVENT_IDENTIFIER + '-' + this.bannerName, dimensionData, ALWAYS_TRACK );
		}
	}

	trackSizeIssueEvent( dimensionData, trackingRatio ) {
		this.trackViewportData( this.bannerName, dimensionData, trackingRatio );
	}

	trackDisallowedNamespaceEvent( dimensionData, trackingRatio = 1 ) {
		this.trackViewportData( NAMESPACE_TRACKING_IDENTIFIER + '-' + this.bannerName, dimensionData, trackingRatio );
	}

	trackViewportData( bannerName, dimensionData, trackingRatio = 0.01 ) {
		if ( this.randomNumber() < trackingRatio ) {
			this.trackingService.track( BANNER_SIZE_SCHEMA, {
				bannerName: bannerName,
				viewportWidth: parseInt( dimensionData.window.width, 10 ),
				viewportHeight: parseInt( dimensionData.window.height, 10 ),
				bannerHeight: parseInt( dimensionData.bannerHeight, 10 ),
				eventRate: trackingRatio
			} );
		}
	}

	recordBannerImpression() {
		// Do nothing, on wp.org we're using trackViewPortDimensions
		// TODO move call to trackViewPortDimensions from bannerPresenter (lines 87-91) to here & test if it has the same effect.
		//      This will unify tracking more on wp.de and wp.org
	}
}
