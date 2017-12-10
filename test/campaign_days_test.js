const assert = require( 'assert' );

import CampaignDays, { endOfDay, startOfDay } from '../shared/campaign_days';

describe( 'startOfDay', function () {
	it( 'returns the first second of the day', function () {
		assert.equal( startOfDay( '2017-11-01' ).getTime(), new Date( 2017, 10, 1, 0, 0, 0 ).getTime() );
	} );

	it( 'throws errors when date string is malformed', function () {
		assert.throws( function () {
			startOfDay( '2017-01-4' );
		}, Error );
	} );
} );

describe( 'endOfDay', function () {
	it( 'returns the first second of the day', function () {
		assert.equal( endOfDay( '2017-12-31' ).getTime(), new Date( 2017, 11, 31, 23, 59, 59 ).getTime() );
	} );

	it( 'throws errors when date string is malformed', function () {
		assert.throws( function () {
			endOfDay( '2017-01-4' );
		}, Error );
	} );
} );

describe( 'CampaignDays', function () {

	const CAMPAIGN_START = new Date( 2016, 10, 1, 0, 0, 0 );
	const CAMPAIGN_END = new Date( 2016, 11, 31, 23, 59, 59 );

	describe( '#campaignHasStarted', function () {
		it( 'returns false when campaign has not started yet', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 9, 1, 0, 0, 0 ) );
			assert.ok( !campaignDays.campaignHasStarted() );
		} );

		it( 'returns true when campaign on first day of campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 10, 1, 0, 0, 5 ) );
			assert.ok( campaignDays.campaignHasStarted() );
		} );

		it( 'returns true when campaign on last day of campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 11, 31, 23, 59, 58 ) );
			assert.ok( campaignDays.campaignHasStarted() );
		} );

		it( 'returns true when campaign is over', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2017, 0, 1, 0, 0, 0 ) );
			assert.ok( campaignDays.campaignHasStarted() );
		} );
	} );

	describe( '#campaignHasEnded', function () {
		it( 'returns false when campaign has not started yet', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 9, 1, 0, 0, 0 ) );
			assert.ok( !campaignDays.campaignHasEnded() );
		} );

		it( 'returns false when campaign on first day of campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 10, 1, 0, 0, 5 ) );
			assert.ok( !campaignDays.campaignHasEnded() );
		} );

		it( 'returns false when campaign on last day of campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 11, 31, 23, 59, 58 ) );
			assert.ok( !campaignDays.campaignHasEnded() );
		} );

		it( 'returns true when campaign is over', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2017, 0, 1, 0, 0, 0 ) );
			assert.ok( campaignDays.campaignHasEnded() );
		} );
	} );

	describe( '#getSecondsSinceCampaignStart', function () {
		it( 'returns a negative number before the campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 9, 31, 0, 0, 0 ) );
			assert.equal( -86400, campaignDays.getSecondsSinceCampaignStart() );
		} );

		it( 'returns a positive number after the campaign started', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 10, 3, 0, 0, 0 ) );
			assert.equal( 172800, campaignDays.getSecondsSinceCampaignStart() );
		} );

		it( 'continues counting when the campaign has ended', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2017, 2, 4, 0, 0, 0 ) );
			assert.equal( 10627200, campaignDays.getSecondsSinceCampaignStart() );
		} );

	} );

	describe( '#getSecondsBetweenStartAndEndOfCampaign', function () {
		it( 'returns a number of seconds', function () {
			let campaignDays = new CampaignDays( CAMPAIGN_START, new Date( 2016, 10, 2, 0, 0, 0 ), new Date( 2016, 9, 31, 0, 0, 0 ) );
			assert.equal( 86400, campaignDays.getSecondsBetweenStartAndEndOfCampaign() );

			campaignDays = new CampaignDays( CAMPAIGN_START, new Date( 2016, 10, 3, 0, 0, 0 ), new Date( 2016, 9, 31, 0, 0, 0 ) );
			assert.equal( 172800, campaignDays.getSecondsBetweenStartAndEndOfCampaign() );
		} );

	} );

	describe( '#getSecondsUntilCampaignEnds', function () {
		it( 'returns a positive number before the campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 9, 31, 23, 59, 59 ) );
			assert.equal( 5270400, campaignDays.getSecondsUntilCampaignEnds() );
		} );

		it( 'returns a positive number after the campaign started', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 11, 31, 23, 59, 54 ) );
			assert.equal( 5, campaignDays.getSecondsUntilCampaignEnds() );
		} );

		it( 'returns a negative number when the campaign has ended', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2017, 0, 1, 0, 0, 4 ) );
			assert.equal( -5, campaignDays.getSecondsUntilCampaignEnds() );
		} );

	} );

	describe( '#getNumberOfDaysUntilCampaignEnd', function () {
		it( 'returns the number of days until the defined end of the campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 9, 31, 23, 59, 59 ) );
			assert.equal( 61, campaignDays.getNumberOfDaysUntilCampaignEnd() );
		} );

		it( 'returns 1 on the last day of the campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2016, 11, 31, 23, 59, 54 ) );
			assert.equal( 1, campaignDays.getNumberOfDaysUntilCampaignEnd() );
		} );

		it( 'returns zero on the first day after the campaign', function () {
			const campaignDays = new CampaignDays( CAMPAIGN_START, CAMPAIGN_END, new Date( 2017, 0, 1, 0, 0, 4 ) );
			assert.equal( 0, campaignDays.getNumberOfDaysUntilCampaignEnd() );
		} );

	} );

} );
