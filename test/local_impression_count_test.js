import sinon from 'sinon';
const assert = require( 'assert' );
import { LocalImpressionCount } from '../shared/local_impression_count';

describe( 'LocalImpressionCount', () =>{
	let localStorage;

	beforeEach( () => {
		localStorage = {
			getItem: sinon.stub(),
			setItem: sinon.stub()
		};
		global.window = { localStorage };
	} );

	it( 'initializes with a count of 0 when there is nothing in storage', () => {
		const count = new LocalImpressionCount( 'TestBanner' );

		assert.strictEqual( count.overallCount, 0 );
		assert.strictEqual( count.bannerCount, 0 );
	} );

	it( 'initializes with a count from storage', () => {
		localStorage.getItem.withArgs( 'fundraising.overallCount' ).returns( '5' );
		localStorage.getItem.withArgs( 'fundraising.bannerCount' ).returns( 'TestBanner|3' );
		const count = new LocalImpressionCount( 'TestBanner' );

		assert.strictEqual( count.overallCount, 5 );
		assert.strictEqual( count.bannerCount, 3 );
	} );

	it( 'initializes with a banner count of 0 when banner name from storage does not match', () => {
		localStorage.getItem.withArgs( 'fundraising.overallCount' ).returns( '5' );
		localStorage.getItem.withArgs( 'fundraising.bannerCount' ).returns( 'OtherBanner|5' );
		const count = new LocalImpressionCount( 'TestBanner' );

		assert.strictEqual( count.overallCount, 5 );
		assert.strictEqual( count.bannerCount, 0 );
	} );

	it( 'increases overall and banner count', () => {
		localStorage.getItem.withArgs( 'fundraising.overallCount' ).returns( '6' );
		localStorage.getItem.withArgs( 'fundraising.bannerCount' ).returns( 'TestBanner|1' );
		const count = new LocalImpressionCount( 'TestBanner' );

		count.incrementImpressionCounts();

		assert.strictEqual( count.overallCount, 7 );
		assert.strictEqual( count.bannerCount, 2 );

	} );

	it( 'stores new conts when increasing', () => {
		localStorage.getItem.withArgs( 'fundraising.overallCount' ).returns( '6' );
		localStorage.getItem.withArgs( 'fundraising.bannerCount' ).returns( 'TestBanner|1' );
		localStorage.setItem = sinon.spy();
		const count = new LocalImpressionCount( 'TestBanner' );

		count.incrementImpressionCounts();

		assert.strictEqual( localStorage.setItem.callCount, 2 );
		assert.ok( localStorage.setItem.calledWith( 'fundraising.overallCount', '7' ) );
		assert.ok( localStorage.setItem.calledWith( 'fundraising.bannerCount', 'TestBanner|2' ) );

	} );
} );
