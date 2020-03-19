const assert = require( 'assert' );

import debounce from '../shared/debounce';

describe( 'Debounce', function () {

	it( 'runs the callback when debounce is over', function ( done ) {
		let finished = false;

		debounce( function () {
			finished = true;
		}, 2 )();

		setTimeout( function () {
			assert.ok( finished );
			done();
		}, 5 );
	} );

	it( 'extends the callback on a new event', function ( done ) {
		let finished = false;

		let event = debounce( function () {
			finished = true;
		}, 3 );

		event();
		setTimeout( function () {
			event();
		}, 2 );

		setTimeout( function () {
			assert.ok( !finished );
			done();
		}, 4 );
	} );
} );
