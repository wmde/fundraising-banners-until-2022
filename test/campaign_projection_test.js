const MockDate = require( 'mockdate' );

const assert = require('assert');
const CampaignProjection = require( '../shared/campaign_projection' );

describe( 'CampaignProjection', function () {
	describe( '#getSecondsSinceCampaignStartDate()', function () {
		it( 'should return 4 days in seconds', function () {
			const campaignProjection = new CampaignProjection(
				new Date( '2017-11-01 00:00:00' ),
				new Date( '2018-01-01 00:00:00' )
			);
			MockDate.set( new Date( '2017-11-05 00:00:00' ) );
			assert.equal( campaignProjection.getSecondsSinceCampaignStart(), 4 * 24 * 60 * 60 );
		} );

		it( 'should not return a negative value', function () {
			const campaignProjection = new CampaignProjection(
				new Date( '2017-11-01 00:00:00' ),
				new Date( '2018-01-01 00:00:00' )
			);
			MockDate.set( new Date( 2017, 9, 5 ) );
			assert.equal( campaignProjection.getSecondsSinceCampaignStart(), 0 );
		} );

		it( 'should return at most seconds between campaign start and end', function () {
			const campaignProjection = new CampaignProjection(
				new Date( '2017-12-30 00:00:00' ),
				new Date( '2018-01-01 00:00:00' )
			);
			MockDate.set( new Date( 2018, 0, 1 ) );
			assert.equal( campaignProjection.getSecondsSinceCampaignStart(), 2 * 24 * 60 * 60 );
		} );
	} );
} );
