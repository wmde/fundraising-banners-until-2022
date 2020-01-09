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
		const testTranslations = {
			'campaign-day-before-campaign': 'Heute bitten wir Sie um Ihre Unterstützung.',
			'campaign-day-first-day': 'Heute beginnt unsere Spendenkampagne.',
			'campaign-day-nth-day': 'Heute ist der {{days}}. Tag unserer Spendenkampagne.',
			'campaign-day-only-n-days': 'Es bleiben nur noch {{days}} Tage, um Wikipedia in diesem Jahr zu unterstützen.',
			'campaign-day-last-day': 'Es bleibt nur noch ein Tag, um Wikipedia in diesem Jahr zu unterstützen.'
		};
		it( 'returns a sentence when the campaign has not started yet', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( false );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations );
			assert.equal( 'Heute bitten wir Sie um Ihre Unterstützung.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the first day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 3600 );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations );
			assert.equal( 'Heute beginnt unsere Spendenkampagne.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the second day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 86405 );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations );
			assert.equal( 'Heute ist der 2. Tag unserer Spendenkampagne.', sentence.getSentence() );
		} );

		it( 'returns the only_n_days sentence when a specified threshold is exceeded', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsUntilCampaignEnds' ).returns( 1123200 );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations, 20 );
			assert.equal( 'Es bleiben nur noch 13 Tage, um Wikipedia in diesem Jahr zu unterstützen.', sentence.getSentence() );
		} );

		it( 'returns a sentence on the last day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsUntilCampaignEnds' ).returns( 86400 );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations );
			assert.equal( 'Es bleibt nur noch ein Tag, um Wikipedia in diesem Jahr zu unterstützen.', sentence.getSentence() );
		} );

		it( 'returns nothing after campaign has ended', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'campaignHasEnded' ).returns( true );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations );
			assert.equal( '', sentence.getSentence() );
		} );
	} );

	describe( '#getSentence EN', function () {
		const testTranslations = {
			'LANGUAGE': 'en',
			'campaign-day-before-campaign': 'Today we ask for your support.',
			'campaign-day-first-day': 'Today our fundraising campaign starts.',
			'campaign-day-nth-day': 'This is the {{days}} day of our campaign.',
			'campaign-day-only-n-days': 'Only {{days}} days left to donate for Wikipedia this year.',
			'campaign-day-last-day': 'Today is the final day of our donation campaign.'
		};

		it( 'returns the 2nd day sentence on the second day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 86405 );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations );
			assert.equal( 'This is the 2nd day of our campaign.', sentence.getSentence() );
		} );

		it( 'returns the 3rd day sentence on the second day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 172810 );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations );
			assert.equal( 'This is the 3rd day of our campaign.', sentence.getSentence() );
		} );

		it( 'returns the 4th day sentence on the second day of the campaign', function () {
			sandbox.stub( campaignDays, 'campaignHasStarted' ).returns( true );
			sandbox.stub( campaignDays, 'getSecondsSinceCampaignStart' ).returns( 259215 );
			const sentence = new CampaignDaySentence( campaignDays, testTranslations );
			assert.equal( 'This is the 4th day of our campaign.', sentence.getSentence() );
		} );
	} );
} );
