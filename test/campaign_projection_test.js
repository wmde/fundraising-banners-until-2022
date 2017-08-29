const MockDate = require( 'mockdate' );

const assert = require('assert');
const CampaignProjection = require( '../shared/campaign_projection' );

describe( 'CampaignProjection', function () {

	before( function () {
		MockDate.set( new Date( '2017-11-05 00:00:00' ) );
	} );

	describe( '#getProjectedDonationSum()', function () {

		it( 'should return donation sum projection', function () {
			const BASE_DONATION_SUM = 123456,
				DONATION_SUM_PER_MINUTE = 10,
				campaignProjection = new CampaignProjection(
					new Date( '2017-11-01 00:00:00' ),
					new Date( '2018-01-01 00:00:00' ),
					BASE_DONATION_SUM,
					DONATION_SUM_PER_MINUTE,
					0
				);
			assert.equal( campaignProjection.getProjectedDonationSum( false ), 181056 );
		} );

		it( 'should return deviating donation sum projection', function () {
			const BASE_DONATION_SUM = 123456,
				DONATION_SUM_PER_MINUTE = 10,
				campaignProjection = new CampaignProjection(
					new Date( '2017-11-01 00:00:00' ),
					new Date( '2018-01-01 00:00:00' ),
					BASE_DONATION_SUM,
					DONATION_SUM_PER_MINUTE,
					0.2
				);
			assert.equal( campaignProjection.getProjectedDonationSum( true ), 181171.2 );
		} );

	} );

} );
