import { EventLoggingTracker } from './event_logging_tracker';
import MatomoTracker from './matomo_tracker';
import { onMediaWiki } from './mediawiki_checks';

function getTracker( bannerName ) {
	if ( onMediaWiki() ) {
		return new EventLoggingTracker( bannerName, mw, Math.random );
	}
	return new MatomoTracker( 'FundraisingTracker', bannerName );

}

export function createTrackingData(
	bannerName,
	bannerClickTrackRatio = 1,
	bannerCloseTrackRatio = 0.1,
	viewportDimensionsTrackRatio = 0.1,
	sizeIssueTrackRatio = 1 ) {
	return {
		tracker: getTracker( bannerName ),
		bannerClickTrackRatio: bannerClickTrackRatio,
		bannerCloseTrackRatio: bannerCloseTrackRatio,
		sizeIssueTrackRatio: sizeIssueTrackRatio,
		viewportDimensionsTrackRatio: viewportDimensionsTrackRatio
	};

}
