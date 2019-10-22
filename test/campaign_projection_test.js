const assert = require( 'assert' );
const sinon = require( 'sinon' );

import { CampaignProjection } from '../shared/campaign_projection';
import CampaignDays from '../shared/campaign_days';

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

	let campaignDays = new CampaignDays(
		new Date( '2017-11-01 00:00:00' ),
		new Date( '2018-01-01 00:00:00' ),
		new Date( '2017-10-01' )
	);

	const sandbox = sinon.createSandbox();

	afterEach( function () {
		sandbox.restore();
	} );

	describe( '#getProjectedDonationSum()', function () {

		it( 'should return donation sum projection based on number of passed seconds', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			const seconds = sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' );
			seconds.onFirstCall().returns( 345600 );
			seconds.onSecondCall().returns( 432000 );
			const campaignProjection = new CampaignProjection( campaignDays, defaultOptions );

			assert.equal( campaignProjection.getProjectedDonationSum(), 57600 ); // 4 days * 24 * 60 * 10 donations/min
			assert.equal( campaignProjection.getProjectedDonationSum(), 72000 ); // 5 days * 24 * 60 * 10 donations/min
		} );

		it( 'should add the base value to the projected sum', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 345600 );
			const campaignProjection = new CampaignProjection(
				campaignDays,
				Object.assign( {}, defaultOptions, { baseDonationSum: 12345 } )
			);

			assert.equal( campaignProjection.getProjectedDonationSum(), 69945 );
		} );

		it( 'should return zero before the campaign starts', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( false );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( -345600 );
			const campaignProjection = new CampaignProjection( campaignDays, defaultOptions );

			assert.equal( campaignProjection.getProjectedDonationSum(), 0 );
		} );

		it( 'should return zero before the campaign starts as a base value is set', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( false );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( -345600 );
			const campaignProjection = new CampaignProjection(
				campaignDays,
				Object.assign( {}, defaultOptions, { baseDonationSum: 12345 } )
			);

			assert.equal( campaignProjection.getProjectedDonationSum(), 0 );
		} );

		it( 'should stop projecting donations after the campaign ends', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 1444555345600 );
			sandbox.stub( campaignDays, 'campaignHasEnded' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsBetweenStartAndEndOfCampaign' ).returns( 5270400 );
			const campaignProjection = new CampaignProjection( campaignDays, defaultOptions );

			assert.equal( campaignProjection.getProjectedDonationSum(), 878400 );
		} );

	} );

	describe( '#getProjectedNumberOfDonors()', function () {
		it( 'should return number of donor projection based on number of passed seconds', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			const seconds = sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' );
			seconds.onFirstCall().returns( 345600 );
			seconds.onSecondCall().returns( 432000 );
			const campaignProjection = new CampaignProjection( campaignDays, defaultOptions );

			assert.equal( campaignProjection.getProjectedNumberOfDonors( false ), 17280 ); // 4 days * 24 * 60 * 3 donors/min
			assert.equal( campaignProjection.getProjectedNumberOfDonors( false ), 21600 ); // 5 days * 24 * 60 * 3 donors/min
		} );

		it( 'should add the base value to the projected number of donors', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 345600 );
			const campaignProjection = new CampaignProjection(
				campaignDays,
				Object.assign( {}, defaultOptions, { donorsBase: 98765 } )
			);

			assert.equal( campaignProjection.getProjectedNumberOfDonors(), 116045 );
		} );

		it( 'should return zero before the campaign starts', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( false );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( -345600 );
			const campaignProjection = new CampaignProjection( campaignDays, defaultOptions );

			assert.equal( campaignProjection.getProjectedNumberOfDonors(), 0 );
		} );

		it( 'should return zero before the campaign starts and a base value is set', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( false );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( -345600 );
			const campaignProjection = new CampaignProjection(
				campaignDays,
				Object.assign( {}, defaultOptions, { donorsBase: 98765 } )
			);

			assert.equal( campaignProjection.getProjectedNumberOfDonors(), 0 );
		} );

		it( 'should stop projecting donors after the campaign ends', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 1444555345600 );
			sandbox.stub( campaignDays, 'campaignHasEnded' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsBetweenStartAndEndOfCampaign' ).returns( 5270400 );
			const campaignProjection = new CampaignProjection( campaignDays, defaultOptions );

			assert.equal( campaignProjection.getProjectedNumberOfDonors(), 263520 );
		} );

	} );

} );
