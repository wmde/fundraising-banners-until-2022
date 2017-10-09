const assert = require('assert');
import CampaignDays from '../shared/campaign_days';

describe('CampaignDays', function() {
	describe( '#campaignHasStarted', function () {
		it( 'returns false when campaign has not started yet', function() {
			const campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-12-31' ), new Date( '2016-10-01' ) );
			assert.ok( !campaignDays.campaignHasStarted() );
		} );

		it( 'returns true when campaign on first day of campaign', function() {
			const campaignDays = new CampaignDays( new Date( '2016-11-01 0:00:00' ), new Date( '2016-12-31' ), new Date( '2016-11-01 0:00:05' ) );
			assert.ok( campaignDays.campaignHasStarted() );
		} );

		it( 'returns true when campaign on last day of campaign', function() {
			const campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-12-31 23:59:59' ), new Date( '2016-12-31 23:59:58' ) );
			assert.ok( campaignDays.campaignHasStarted() );
		} );

		it( 'returns true when campaign is over', function() {
			const campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-12-31 23:59:59' ), new Date( '2017-01-01' ) );
			assert.ok( campaignDays.campaignHasStarted() );
		} );
	} );

	describe( '#campaignHasEnded', function () {
		it( 'returns false when campaign has not started yet', function() {
			const campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-12-31' ), new Date( '2016-10-01' ) );
			assert.ok( !campaignDays.campaignHasEnded() );
		} );

		it( 'returns false when campaign on first day of campaign', function() {
			const campaignDays = new CampaignDays( new Date( '2016-11-01 0:00:00' ), new Date( '2016-12-31' ), new Date( '2016-11-01 0:00:05' ) );
			assert.ok( !campaignDays.campaignHasEnded() );
		} );

		it( 'returns false when campaign on last day of campaign', function() {
			const campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-12-31 23:59:59' ), new Date( '2016-12-31 23:59:58' ) );
			assert.ok( !campaignDays.campaignHasEnded() );
		} );

		it( 'returns true when campaign is over', function() {
			const campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-12-31 23:59:59' ), new Date( '2017-01-01' ) );
			assert.ok( campaignDays.campaignHasEnded() );
		} );
	} );

	describe( '#getSecondsSinceCampaignStart', function () {
		it( 'returns a negative number before the campaign', function () {
			const campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-12-31' ), new Date( '2016-10-31' ) );
			assert.equal( -86400, campaignDays.getSecondsSinceCampaignStart() );
		} );

		it( 'returns a positive number after the campaign started', function () {
			const campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-12-31' ), new Date( '2016-11-03' ) );
			assert.equal( 172800, campaignDays.getSecondsSinceCampaignStart() );
		} );

		it( 'continues counting when the campaign has ended', function () {
			const campaignDays = new CampaignDays( new Date( '2016-11-01 00:00:00' ), new Date( '2016-12-31 23:59:59' ), new Date( '2017-03-04' ) );
			assert.equal( 10630800, campaignDays.getSecondsSinceCampaignStart() );
		} );

	} );

	describe( '#getSecondsBetweenStartAndEndOfCampaign', function () {
		it( 'returns a number of seconds', function () {
			let campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-11-02' ), new Date( '2016-10-31' ) );
			assert.equal( 86400, campaignDays.getSecondsBetweenStartAndEndOfCampaign() );

			campaignDays = new CampaignDays( new Date( '2016-11-01' ), new Date( '2016-11-03' ), new Date( '2016-10-31' ) );
			assert.equal( 172800, campaignDays.getSecondsBetweenStartAndEndOfCampaign() );
		} );

	} );


} );