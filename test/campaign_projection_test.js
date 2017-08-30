const MockDate = require( 'mockdate' );
const assert = require('assert');
const CampaignProjection = require( '../shared/campaign_projection' );

describe( 'CampaignProjection', function () {

	const BASE_DONATION_SUM = 123456,
		DONATION_SUM_PER_MINUTE = 10,
		DONORS_BASE_NUMBER = 1234,
		DONORS_PER_MINUTE = 1,
		PROJECTION_DEVIATION = 0.2,
		GERMAN_DIGIT_GROUPING_CHARACTER = '.',
		ENGLISH_DIGIT_GROUPING_CHARACTER = ',',
		defaultOptions = {
			campaignStartDate: new Date( '2017-11-01 00:00:00' ),
			campaignEndDate: new Date( '2018-01-01 00:00:00' ),
			baseDonationSum: BASE_DONATION_SUM,
			donationAmountPerMinute: DONATION_SUM_PER_MINUTE,
			donorsBase: DONORS_BASE_NUMBER,
			donorsPerMinute: DONORS_PER_MINUTE,
			digitGroupingCharacter: GERMAN_DIGIT_GROUPING_CHARACTER,
			deviation: PROJECTION_DEVIATION
		};

	before( function () {
		MockDate.set( new Date( '2017-11-05 00:00:00' ) );
	} );

	describe( '#getProjectedDonationSum()', function () {

		it( 'should return donation sum projection', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );
			assert.equal( campaignProjection.getProjectedDonationSum( false ), '181.056' );
		} );

		it( 'should return deviating donation sum projection', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );
			assert.equal( campaignProjection.getProjectedDonationSum( true ), '181.171' );
		} );

		it( 'should return deviating donation sum projection with digits grouped by comma', function () {
			const options = Object.assign( {}, defaultOptions, { digitGroupingCharacter: ENGLISH_DIGIT_GROUPING_CHARACTER } ),
				campaignProjection = new CampaignProjection( options );
			assert.equal( campaignProjection.getProjectedDonationSum( true ), '181,171' );
		} );

	} );

	describe( '#getProjectedNumberOfDonors()', function () {
		it( 'should return number of donor projection', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );
			assert.equal( campaignProjection.getProjectedNumberOfDonors( false ), '6.994' );
		} );

		it( 'should return deviating number of donor projection', function () {
			const campaignProjection = new CampaignProjection( defaultOptions );
			assert.equal( campaignProjection.getProjectedNumberOfDonors( true ), '7.005' );
		} );

		it( 'should return deviating number of donor projection with digits grouped by comma', function () {
			const options = Object.assign( {}, defaultOptions, { digitGroupingCharacter: ENGLISH_DIGIT_GROUPING_CHARACTER } ),
				campaignProjection = new CampaignProjection( options );
			assert.equal( campaignProjection.getProjectedNumberOfDonors( true ), '7,005' );
		} );

	} );

} );
