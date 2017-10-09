const assert = require( 'assert' );
const sinon = require( 'sinon' );

import CampaignDays from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';

describe('CampaignDaySentence', function() {

	const campaignDays = new CampaignDays(
		new Date( '2017-11-01 00:00:00' ),
		new Date( '2018-01-01 00:00:00' ),
		new Date( '2017-10-01' )
	);

	const sandbox = sinon.createSandbox();

	afterEach(function () {
		sandbox.restore();
	});

	describe( '#getSentence', function () {
		it( 'returns a sentence when the campaign has not started yet' , function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( false );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Heute bitten wir Sie um Ihre Unterstützung.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the first day of the campaign' , function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 3600 );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Heute beginnt unsere Spendenkampagne.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the second day of the campaign' , function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 86405 );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Heute ist der 2. Tag unserer Spendenkampagne.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the last week of the campaign' , function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsUntilCampaignEnds' ).returns( 259200 );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Es bleiben nur noch 3 Tage, um Wikipedia in diesem Jahr zu unterstützen.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the last day of the campaign' , function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsUntilCampaignEnds' ).returns( 86400 );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( 'Es bleibt nur noch ein Tag, um Wikipedia in diesem Jahr zu unterstützen.', sentence.getSentence() );
		} );

		it( 'returns nothing after campaign has ended' , function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'campaignHasEnded' ).returns( true );
			const sentence = new CampaignDaySentence( campaignDays );
			assert.equal( '', sentence.getSentence() );
		} );
	} );
} );