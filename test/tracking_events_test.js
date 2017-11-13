import TrackingEvents from '../shared/tracking_events';

const assert = require( 'assert' );

const { JSDOM } = require( 'jsdom' );
const { window } = new JSDOM( '<!doctype html><html><body></body></html>' );
const $ = require( 'jquery' )( window );

describe( 'TrackingEvents', function () {

	const trackingBaseUrl = 'http://tracking-server/path?trackPage=http://tracked-server',
		clickActionName = 'click-action',
		sizeIssueActionName = 'banner-size-issue',
		recordBannerImpressionActionName = 'banner-shown',
		bannerName = 'some-banner',
		fullTrackingRatio = 1,
		noTrackingRatio = 0;

	let $trackedElement = null,
		$trackingElement = null,
		trackingEvents = null;

	describe( '#trackClickEvent()', function () {

		beforeEach( function () {
			$trackedElement = $( '<div />' );
			$trackingElement = $( '<img />' );
			trackingEvents = new TrackingEvents( trackingBaseUrl, bannerName, $trackingElement );
		} );

		it( 'Click event tracking URL is built correctly', function () {
			trackingEvents.trackClickEvent( $trackedElement, clickActionName, fullTrackingRatio );
			$trackedElement.click();

			assert.equal(
				$trackingElement.attr( 'src' ),
				trackingBaseUrl + '/' + clickActionName + '/' + bannerName
			);
		} );

		it( 'With a tracking ratio of zero, the click event is not tracked', function () {
			trackingEvents.trackClickEvent( $trackedElement, clickActionName, noTrackingRatio );
			$trackedElement.click();

			assert.equal(
				$trackingElement.attr( 'src' ),
				undefined
			);
		} );

	} );

	describe( '#trackSizeIssueEvent()', function () {

		beforeEach( function () {
			$trackingElement = $( '<img />' );
			trackingEvents = new TrackingEvents( trackingBaseUrl, bannerName, $trackingElement );
		} );

		it( 'Size issue event tracking URL is built correctly', function () {
			let trackingData = 'some-data-to-be-appended';
			trackingEvents.trackSizeIssueEvent( trackingData, fullTrackingRatio );

			assert.equal(
				$trackingElement.attr( 'src' ),
				trackingBaseUrl + '/' + sizeIssueActionName + '/' + bannerName + '/' + trackingData
			);
		} );

		it( 'With a tracking ratio of zero, the event is not tracked', function () {
			let trackingData = 'some-data-to-be-appended';
			trackingEvents.trackSizeIssueEvent( trackingData, noTrackingRatio );

			assert.equal(
				$trackingElement.attr( 'src' ),
				undefined
			);
		} );

	} );

	describe( '#trackBannerImpression()', function () {

		beforeEach( function () {
			$trackingElement = $( '<img />' );
			trackingEvents = new TrackingEvents( trackingBaseUrl, bannerName, $trackingElement );
		} );

		it( 'URL for recording a banner impression is built correctly', function () {
			trackingEvents.recordBannerImpression();

			assert.equal(
				$trackingElement.attr( 'src' ),
				trackingBaseUrl + '/' + recordBannerImpressionActionName + '/' + bannerName
			);
		} );

	} );

} );
