const assert = require( 'assert' );

import CancelableTimeout from '../shared/interruptible_timeout';

describe( 'CancelableTimeout', function (  ) {
	it( 'runs the function when the timeout is over', function ( done ) {
		const timeout = new CancelableTimeout();
		timeout.run( done, 2 );
	} );

	it( 'does not run the function when the timeout is over', function ( done ) {
		const timeout = new CancelableTimeout();
		timeout.run( function() { assert.fail( 'Canceled callback was called!' ); }, 5 );
		timeout.cancel();
		setTimeout( done, 7 );
	} );

	it( 'provides the cancel method as an event handler', function ( done ) {
		const timeout = new CancelableTimeout();
		timeout.run( function() { assert.fail( 'Canceled callback was called!' ); }, 5 );
		setTimeout( timeout.cancel.bind( timeout ), 2 );
		setTimeout( done, 7 );
	} );

	it( 'is not running when it is initialized', function () {
		const timeout = new CancelableTimeout();
		assert.ok( !timeout.isRunning() );
	} );

	it( 'can indicate that it\'s running', function () {
		const timeout = new CancelableTimeout();
		timeout.run( function() { }, 5 );
		assert.ok( timeout.isRunning() );
	} );

	it( 'is not running anymore when it\'s canceled', function () {
		const timeout = new CancelableTimeout();
		timeout.run( function() { }, 5 );
		timeout.cancel();
		assert.ok( !timeout.isRunning() );
	} );

	it( 'is not running anymore when the timeout is finished', function ( done ) {
		const timeout = new CancelableTimeout();
		timeout.run( function() { }, 2 );
		setTimeout( function () {
			assert.ok( !timeout.isRunning() );
			done();
		}, 5 );

	} );

} );