const MockDate = require( 'mockdate' );

const assert = require('assert');
const CampaignProjection = require( '../shared/campaign_projection' );

describe( 'CampaignProjection', function () {

	const BASE_DONATION_SUM = 123456,
		DONATION_SUM_PER_MINUTE = 10,
		DONORS_BASE_NUMBER = 1234,
		DONORS_PER_MINUTE = 1,
		PROJECTION_DEVIATION = 0.2,
		NO_PROJECTION_DEVIATION = 0;

	before( function () {
		MockDate.set( new Date( '2017-11-05 00:00:00' ) );
	} );

	describe( '#getProjectedDonationSum()', function () {

		it( 'should return donation sum projection', function () {
			const campaignProjection = new CampaignProjection(
				new Date( '2017-11-01 00:00:00' ),
				new Date( '2018-01-01 00:00:00' ),
				BASE_DONATION_SUM,
				DONATION_SUM_PER_MINUTE,
				DONORS_BASE_NUMBER,
				DONORS_PER_MINUTE,
				NO_PROJECTION_DEVIATION
			);
			assert.equal( campaignProjection.getProjectedDonationSum( false ), 181056 );
		} );

		it( 'should return deviating donation sum projection', function () {
			const campaignProjection = new CampaignProjection(
				new Date( '2017-11-01 00:00:00' ),
				new Date( '2018-01-01 00:00:00' ),
				BASE_DONATION_SUM,
				DONATION_SUM_PER_MINUTE,
				DONORS_BASE_NUMBER,
				DONORS_PER_MINUTE,
				PROJECTION_DEVIATION
			);
			assert.equal( campaignProjection.getProjectedDonationSum( true ), 181171.2 );
		} );

	} );

	describe( '#getProjectedNumberOfDonors()', function () {
		it( 'should return number of donor projection', function () {
			const campaignProjection = new CampaignProjection(
				new Date( '2017-11-01 00:00:00' ),
				new Date( '2018-01-01 00:00:00' ),
				BASE_DONATION_SUM,
				DONATION_SUM_PER_MINUTE,
				DONORS_BASE_NUMBER,
				DONORS_PER_MINUTE,
				NO_PROJECTION_DEVIATION
			);
			assert.equal( campaignProjection.getApprDonatorsRaw( false ), 6994 );
		} );

		it( 'should return deviating number of donor projection', function () {
			const campaignProjection = new CampaignProjection(
				new Date( '2017-11-01 00:00:00' ),
				new Date( '2018-01-01 00:00:00' ),
				BASE_DONATION_SUM,
				DONATION_SUM_PER_MINUTE,
				DONORS_BASE_NUMBER,
				DONORS_PER_MINUTE,
				PROJECTION_DEVIATION
			);
			assert.equal( campaignProjection.getApprDonatorsRaw( true ), 7005.52 );
		} );

	} );

} );
