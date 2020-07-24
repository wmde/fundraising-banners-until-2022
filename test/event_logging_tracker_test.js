import assert from 'assert';
import sinon from 'sinon';
import { EVENT_SCHEMA, BANNER_SIZE_SCHEMA, ALWAYS_TRACK, EventLoggingTracker } from '../shared/event_logging_tracker';

import { VIEWPORT_TRACKING_CLOSED_EVENT_IDENTIFIER, VIEWPORT_TRACKING_SUBMITTED_EVENT_IDENTIFIER, VIEWPORT_TRACKING_IDENTIFIER } from '../shared/event_logging_tracker';

const BANNER_NAME = 'TestTracker';
const DIMENSION_DATA = {
	window: {
		width: 10,
		height: 10
	},
	bannerHeight: 10
};
const RANDOM_ALWAYS_ZERO = () => 0;
const TEST_RANGE = [
	{ random: 0, ratio: 1, shouldFire: true },
	{ random: 0, ratio: 0, shouldFire: false },
	{ random: 1, ratio: 0, shouldFire: false },
	{ random: 0.01, ratio: 0, shouldFire: false },
	{ random: 0.01, ratio: 0.02, shouldFire: true },
	{ random: 0.5, ratio: 0.49, shouldFire: false },
	{ random: 0.5, ratio: 0.51, shouldFire: true },
	{ random: 0.99, ratio: 1, shouldFire: true },
	{ random: 0.99, ratio: 0.98, shouldFire: false }
];

describe( 'EventLoggingTracker', function () {

	it( 'contains all required methods', () => {
		const tracker = new EventLoggingTracker( BANNER_NAME, { track: sinon.spy() }, RANDOM_ALWAYS_ZERO );

		assert.equal( typeof tracker.trackBannerEvent, 'function' );
		assert.equal( typeof tracker.trackViewPortDimensions, 'function' );
		assert.equal( typeof tracker.trackSizeIssueEvent, 'function' );
		assert.equal( typeof tracker.trackBannerEventWithViewport, 'function' );
	} );

	it( 'sends correct data on banner event', () => {
		const eventData = {
			bannerName: BANNER_NAME,
			bannerAction: 'test-event',
			eventRate: ALWAYS_TRACK,
			slidesShown: 1,
			finalSlide: 1
		};
		const eventSpy = { track: sinon.spy() };
		const tracker = new EventLoggingTracker( eventData.bannerName, eventSpy, RANDOM_ALWAYS_ZERO );

		tracker.trackBannerEvent( eventData.bannerAction, eventData.slidesShown, eventData.finalSlide, eventData.eventRate );

		assert.deepEqual( eventSpy.track.firstCall.args[ 0 ], EVENT_SCHEMA );
		assert.deepEqual( eventSpy.track.firstCall.args[ 1 ], eventData );
	} );

	it( 'sends correct data on viewport event', () => {
		const eventData = {
			bannerName: VIEWPORT_TRACKING_IDENTIFIER + '-' + BANNER_NAME,
			viewportWidth: DIMENSION_DATA.window.width,
			viewportHeight: DIMENSION_DATA.window.height,
			bannerHeight: DIMENSION_DATA.bannerHeight,
			eventRate: ALWAYS_TRACK
		};
		const eventSpy = { track: sinon.spy() };
		const tracker = new EventLoggingTracker( BANNER_NAME, eventSpy, RANDOM_ALWAYS_ZERO );

		tracker.trackViewPortDimensions( VIEWPORT_TRACKING_IDENTIFIER, DIMENSION_DATA, eventData.eventRate );

		assert.deepEqual( eventSpy.track.firstCall.args[ 0 ], BANNER_SIZE_SCHEMA );
		assert.deepEqual( eventSpy.track.firstCall.args[ 1 ], eventData );
	} );

	it( 'sends correct data on size issue event', () => {
		const eventData = {
			bannerName: BANNER_NAME,
			viewportWidth: DIMENSION_DATA.window.width,
			viewportHeight: DIMENSION_DATA.window.height,
			bannerHeight: DIMENSION_DATA.bannerHeight,
			eventRate: ALWAYS_TRACK
		};
		const eventSpy = { track: sinon.spy() };
		const tracker = new EventLoggingTracker( BANNER_NAME, eventSpy, RANDOM_ALWAYS_ZERO );

		tracker.trackSizeIssueEvent( DIMENSION_DATA, eventData.eventRate );

		assert.deepEqual( eventSpy.track.firstCall.args[ 0 ], BANNER_SIZE_SCHEMA );
		assert.deepEqual( eventSpy.track.firstCall.args[ 1 ], eventData );
	} );

	it( 'Only sends when rate is higher than random', () => {
		TEST_RANGE.forEach( testItem => {
			const eventSpy = { track: sinon.spy() };
			const tracker = new EventLoggingTracker( BANNER_NAME, eventSpy, () => testItem.random );
			tracker.trackBannerEvent( 'test-action', 1, 1, testItem.ratio );
			assert.equal( eventSpy.track.calledOnce, testItem.shouldFire );
		} );
	} );

	it( 'Sends both banner and viewport events when rate is higher than random', () => {
		TEST_RANGE.forEach( testItem => {
			const eventSpy = { track: sinon.spy() };
			const tracker = new EventLoggingTracker( BANNER_NAME, eventSpy, () => testItem.random );
			tracker.trackBannerEventWithViewport( 'test-action', 1, 1, testItem.ratio, DIMENSION_DATA );
			assert.equal( eventSpy.track.calledTwice, testItem.shouldFire );
		} );
	} );

	it( 'Prepends "vtc" string on banner name for close tracking', () => {
		const eventData = {
			bannerName: VIEWPORT_TRACKING_CLOSED_EVENT_IDENTIFIER + '-' + BANNER_NAME,
			viewportWidth: DIMENSION_DATA.window.width,
			viewportHeight: DIMENSION_DATA.window.height,
			bannerHeight: DIMENSION_DATA.bannerHeight,
			eventRate: ALWAYS_TRACK
		};
		const eventSpy = { track: sinon.spy() };
		const tracker = new EventLoggingTracker( BANNER_NAME, eventSpy, RANDOM_ALWAYS_ZERO );

		tracker.trackBannerEventWithViewport( 'irrelevantActionName', 0, 0, 1, DIMENSION_DATA );
		assert.deepEqual( eventSpy.track.secondCall.args[ 1 ], eventData );
	} );

	it( 'Prepends "submit" string on banner name for submit tracking', () => {
		const eventData = {
			bannerName: VIEWPORT_TRACKING_SUBMITTED_EVENT_IDENTIFIER + '-' + BANNER_NAME,
			viewportWidth: DIMENSION_DATA.window.width,
			viewportHeight: DIMENSION_DATA.window.height,
			bannerHeight: DIMENSION_DATA.bannerHeight,
			eventRate: ALWAYS_TRACK
		};
		const eventSpy = { track: sinon.spy() };
		const tracker = new EventLoggingTracker( BANNER_NAME, eventSpy, RANDOM_ALWAYS_ZERO );

		tracker.trackViewPortDimensions( 'submit', DIMENSION_DATA, 1 );
		assert.deepEqual( eventSpy.track.firstCall.args[ 1 ], eventData );
	} );
} );
