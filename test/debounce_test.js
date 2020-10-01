const assert = require( 'assert' );
import sinon from 'sinon';
import debounce from '../shared/debounce';

describe( 'Debounce', function () {

	let clock;

	beforeEach( function () {
		clock = sinon.useFakeTimers();
	} );

	afterEach( function () {
		clock.restore();
	} );

	it( 'runs the callback when debounce is over', function ( done ) {
		let finished = false;

		debounce( function () {
			finished = true;
		}, 2 )();

		setTimeout( function () {
			assert.ok( finished );
			done();
		}, 3 );

		clock.tick( 4 );
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

		clock.tick( 5 );
	} );
} );
