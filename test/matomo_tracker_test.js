import assert from 'assert';
import sinon from 'sinon';
import MatomoTracker from '../shared/matomo_tracker';

describe( 'MatomoTracker', function () {

	const TRACK_RATIO_ALWAYS = 1;

	beforeEach( () => {
		global.window = { TestTracker: undefined };
	} );

	it( 'records impressions', () => {
		window.TestTracker = {
			trackContentImpression: sinon.spy()
		};
		const tracker = new MatomoTracker( 'TestTracker', 'TestBanner05' );

		tracker.recordBannerImpression();

		assert.ok( window.TestTracker.trackContentImpression.calledWith( 'Banners', 'banner-shown', 'TestBanner05' ) );
	} );

	it( 'tracks events', () => {
		window.TestTracker = {
			trackEvent: sinon.spy()
		};
		const tracker = new MatomoTracker( 'TestTracker', 'TestBanner05' );

		tracker.trackEvent( 'some-action', TRACK_RATIO_ALWAYS );

		assert.ok( window.TestTracker.trackEvent.calledWith( 'Banners', 'some-action', 'TestBanner05' ) );
	} );

	it( 'collects tracking events until the tracker becomes available', ( done ) => {
		const retryInterval = 5;
		const simulatedLoadTime = 10;
		const scheduleRetry = tracker => {
			setTimeout( tracker.waitForTrackerToInit.bind( tracker ), retryInterval );
		};
		const tracker = new MatomoTracker( 'TestTracker', 'TestBanner05', scheduleRetry );
		tracker.recordBannerImpression();
		tracker.trackEvent( 'some-action', TRACK_RATIO_ALWAYS );

		setTimeout( () => {
			window.TestTracker = {
				trackContentImpression: sinon.spy(),
				trackEvent: sinon.spy()
			};
		}, simulatedLoadTime );

		setTimeout( () => {
			assert.ok( window.TestTracker.trackContentImpression.calledWith( 'Banners', 'banner-shown', 'TestBanner05' ) );
			assert.ok( window.TestTracker.trackEvent.calledWith( 'Banners', 'some-action', 'TestBanner05' ) );
			done();
		}, retryInterval + simulatedLoadTime + 1 );
	} );

	it( 'aborts trying to find the tracker after 10 tries', () => {
		// An immediate scheduler
		const scheduleRetry = tracker => {
			tracker.waitForTrackerToInit();
		};
		const tracker = new MatomoTracker( 'TestTracker', 'TestBanner05', scheduleRetry );

		assert.strictEqual( tracker.trackerFindCounter, 10 );
	} );

} );
