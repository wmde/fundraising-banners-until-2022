import { EventLoggingTracker } from './event_logging_tracker';
import MatomoTracker from './matomo_tracker';
import { onMediaWiki } from './mediawiki_checks';

function getTracker( bannerName ) {
	if ( onMediaWiki() ) {
		return new EventLoggingTracker( bannerName, mw, Math.random );
	} else {
		return new MatomoTracker( 'FundraisingTracker', bannerName );
	}
}

export function createTrackingData( bannerName, bannerClickTrackRatio = 1, bannerCloseTrackRatio = 1, sizeTrackRatio = 0.1 ) {
	return {
		tracker: getTracker( bannerName ),
		bannerClickTrackRatio: bannerClickTrackRatio,
		bannerCloseTrackRatio: bannerCloseTrackRatio,
		sizeTrackRatio: sizeTrackRatio
	};

}
