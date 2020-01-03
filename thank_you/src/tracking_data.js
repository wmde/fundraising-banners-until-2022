import EventLoggingTracker from '../../shared/event_logging_tracker';
import MatomoTracker from '../../shared/matomo_tracker';
import { onMediaWiki } from '../../shared/mediawiki_checks';

function getTracker( bannerName ) {
	if ( onMediaWiki() ) {
		return new EventLoggingTracker( bannerName );
	} else {
		return new MatomoTracker( 'FundraisingTracker', bannerName );
	}
}

export function getTrackingData( bannerName, bannerClickTrackRatio = 1, bannerCloseTrackRatio = 1 ) {
	return {
		eventTracker: getTracker( bannerName ),
		bannerClickTrackRatio: bannerClickTrackRatio,
		bannerCloseTrackRatio: bannerCloseTrackRatio
	};

}
