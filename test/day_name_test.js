const assert = require( 'assert' );

import DayName from '../shared/day_name';

describe( 'DayName', function () {

	describe( '#getDayNameMessageKey', function () {
		it( 'returns the proper message key for a date defined as special day', function () {
			const dayName = new DayName( new Date( 2017, 11, 25, 12, 0, 0 ) );
			assert.equal( dayName.getDayNameMessageKey(), 'day-name-christmas-day' );
		} );

		it( 'returns the general message key for the week of the day', function () {
			const dayName = new DayName( new Date( 2017, 10, 14, 12, 0, 0 ) );
			assert.equal( dayName.getDayNameMessageKey(), 'day-name-tuesday' );
		} );
	} );

	describe( '#isSpecialDayName', function () {
		it( 'returns true when for a date defined as special day', function () {
			const dayName = new DayName( new Date( 2017, 11, 25, 12, 0, 0 ) );
			assert.equal( dayName.getDayNameMessageKey(), 'day-name-christmas-day' );
		} );

		it( 'returns false for a date not defined as special day', function () {
			const dayName = new DayName( new Date( 2017, 11, 5, 12, 0, 0 ) );
			assert.equal( dayName.getDayNameMessageKey(), 'day-name-tuesday' );
		} );
	} );

} );
