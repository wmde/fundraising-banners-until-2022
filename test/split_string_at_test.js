const assert = require( 'assert' );

import { splitStringAt } from '../shared/split_string_at';

describe( 'splitStringAt', function () {
	it( 'returns a string array when no split words are found', function () {
		assert.deepEqual( splitStringAt( [ 'a' ], '' ), [] );
		assert.deepEqual( splitStringAt( [ 'o' ], 'this is a test' ), [ 'this is a test' ] );
	} );

	it( 'returns a string containing the split words', function () {
		assert.deepEqual( splitStringAt( [ 'a' ], 'this is a test' ), [ 'this is ', 'a', ' test' ] );
		assert.deepEqual( splitStringAt( [ 'a', 't' ], 'this is a test' ), [ 't', 'his is ', 'a', ' ', 't', 'es', 't' ] );
	} );
} );
