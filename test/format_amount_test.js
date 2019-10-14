import { formatAmount } from '../shared/format_amount.js';
import assert from 'assert';

describe( 'formatAmount', () => {
	it( 'formats numbers to decimal places', () => {
		assert.strictEqual( formatAmount( '5' ), '5.00' );
	} );

	it( 'fills decimal places', () => {
		assert.strictEqual( formatAmount( '5.1' ), '5.10' );
		assert.strictEqual( formatAmount( '5.19' ), '5.19' );
	} );

	it( 'converts decimal comma to dot', () => {
		assert.strictEqual( formatAmount( '5,99' ), '5.99' );
	} );

	it( 'removes excessive whitespace', () => {
		assert.strictEqual( formatAmount( '   99    ' ), '99.00' );
	} );

	it( 'removes the Euro sign', () => {
		assert.strictEqual( formatAmount( '120 €' ), '120.00' );
	} );

} );
