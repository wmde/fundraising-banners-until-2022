const assert = require( 'assert' );
const sinon = require( 'sinon' );

import CampaignDays from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';

describe( 'CampaignDaySentence', function () {

	const campaignDays = new CampaignDays(
		new Date( '2017-11-01 00:00:00' ),
		new Date( '2018-01-01 00:00:00' ),
		new Date( '2017-10-01' )
	);

	const sandbox = sinon.createSandbox();

	afterEach( function () {
		sandbox.restore();
	} );

	describe( '#getSentence DE', function () {
		it( 'returns a sentence when the campaign has not started yet', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( false );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Heute bitten wir Sie um Ihre Unterstützung.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the first day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 3600 );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Heute beginnt unsere Spendenkampagne.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the second day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 86405 );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Heute ist der 2. Tag unserer Spendenkampagne.', sentence.getSentence() );
		} );

		it( 'returns the only_n_days sentence when a specified threshold is exceeded', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsUntilCampaignEnds' ).returns( 1123200 );
			const sentence = new CampaignDaySentence( campaignDays, 'de', 20 );
			assert.equal( 'Es bleiben nur noch 13 Tage, um Wikipedia in diesem Jahr zu unterstützen.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the last day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsUntilCampaignEnds' ).returns( 86400 );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Es bleibt nur noch ein Tag, um Wikipedia in diesem Jahr zu unterstützen.', sentence.getSentence() );
		} );

		it( 'returns nothing after campaign has ended', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'campaignHasEnded' ).returns( true );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( '', sentence.getSentence() );
		} );
	} );

	describe( '#getSentence EN', function () {
		it( 'returns the general sentence when the campaign has not started yet', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( false );
			const sentence = new CampaignDaySentence( campaignDays, 'en' );
			assert.equal( 'Today we ask for your support.', sentence.getSentence() );
		} );

		it( 'returns the campaign start sentence on the first day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 3600 );
			const sentence = new CampaignDaySentence( campaignDays, 'en' );
			assert.equal( 'Today our fundraising campaign starts.', sentence.getSentence() );
		} );

		it( 'returns the 2nd day sentence on the second day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 86405 );
			const sentence = new CampaignDaySentence( campaignDays, 'en' );
			assert.equal( 'This is the 2nd day of our campaign.', sentence.getSentence() );
		} );

		it( 'returns the 3rd day sentence on the second day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 172810 );
			const sentence = new CampaignDaySentence( campaignDays, 'en' );
			assert.equal( 'This is the 3rd day of our campaign.', sentence.getSentence() );
		} );

		it( 'returns the 4th day sentence on the second day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 259215 );
			const sentence = new CampaignDaySentence( campaignDays, 'en' );
			assert.equal( 'This is the 4th day of our campaign.', sentence.getSentence() );
		} );

		it( 'returns the only_n_days sentence when a specified threshold is exceeded', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsUntilCampaignEnds' ).returns( 1123200 );
			const sentence = new CampaignDaySentence( campaignDays, 'en', 22 );
			assert.equal( 'Only 13 left until our fundraising campaign ends.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the last day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsUntilCampaignEnds' ).returns( 86400 );
			const sentence = new CampaignDaySentence( campaignDays, 'en' );
			assert.equal( 'Today is the final day of our donation campaign.', sentence.getSentence() );
		} );

		it( 'returns nothing after campaign has ended', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'campaignHasEnded' ).returns( true );
			const sentence = new CampaignDaySentence( campaignDays, 'en' );
			assert.equal( '', sentence.getSentence() );
		} );
	} );
} );
