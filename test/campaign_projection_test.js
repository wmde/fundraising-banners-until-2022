const MockDate = require( 'mockdate' );
const assert = require( 'assert' );
const CampaignProjection = require( '../shared/campaign_projection' );

describe( 'CampaignProjection', function () {

	const DONATION_SUM_PER_MINUTE = 10,
		DONORS_PER_MINUTE = 3,
		defaultOptions = {
			campaignStartDate: new Date( '2017-11-01 00:00:00' ),
			campaignEndDate: new Date( '2018-01-01 00:00:00' ),
			baseDonationSum: 0,
			donationAmountPerMinute: DONATION_SUM_PER_MINUTE,
			donorsBase: 0,
			donorsPerMinute: DONORS_PER_MINUTE
		};

	beforeEach( function () {
		MockDate.set( new Date( '2017-11-05 00:00:00' ) );
	} );

	describe( '#getProjectedDonationSum()', function () {

		it( 'should return donation sum projection based on date', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );

			assert.equal( campaignProjection.getProjectedDonationSum(), 57600 ); // 4 days * 24 * 60 * 10 donations/min

			MockDate.set( new Date( '2017-11-06 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedDonationSum(), 72000 ); // 5 days * 24 * 60 * 10 donations/min
		} );

		it( 'should add the base value to the projected sum', function () {
			const campaignProjection = new CampaignProjection( Object.assign( {}, defaultOptions, { baseDonationSum: 12345 } ) );

			assert.equal( campaignProjection.getProjectedDonationSum(), 69945 );
		} );

		it( 'should return zero before the campaign starts', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );

			MockDate.set( new Date( '2017-10-19 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedDonationSum(), 0 );
		} );

		it( 'should return zero before the campaign starts as a base value is set', function () {
			const campaignProjection = new CampaignProjection( Object.assign( {}, defaultOptions, { baseDonationSum: 12345 } ) );

			MockDate.set( new Date( '2017-10-19 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedDonationSum(), 0 );
		} );

		it( 'should stop projecting donations after the campaign ends', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );

			MockDate.set( new Date( '2018-01-13 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedDonationSum(), 878400 );
		} );

	} );

	describe( '#getProjectedNumberOfDonors()', function () {
		it( 'should return number of donor projection based on date', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );

			assert.equal( campaignProjection.getProjectedNumberOfDonors( false ), 17280 ); // 4 days * 24 * 60 * 3 donors/min

			MockDate.set( new Date( '2017-11-06 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedNumberOfDonors( false ), 21600 ); // 5 days * 24 * 60 * 3 donors/min
		} );

		it( 'should add the base value to the projected number of donors', function () {
			const campaignProjection = new CampaignProjection( Object.assign( {}, defaultOptions, { donorsBase: 98765 } ) );

			MockDate.set( new Date( '2017-11-05 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedNumberOfDonors(), 116045 );
		} );

		it( 'should return zero before the campaign starts', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );

			MockDate.set( new Date( '2017-10-19 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedNumberOfDonors(), 0 );
		} );

		it( 'should return zero before the campaign starts and a base value is set', function () {
			const campaignProjection = new CampaignProjection( Object.assign( {}, defaultOptions, { donorsBase: 98765 } ) );

			MockDate.set( new Date( '2017-10-19 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedNumberOfDonors(), 0 );
		} );

		it( 'should stop projecting donors after the campaign ends', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );

			MockDate.set( new Date( '2018-01-13 00:00:00' ) );
			assert.equal( campaignProjection.getProjectedNumberOfDonors(), 263520 );
		} );

	} );

} );
