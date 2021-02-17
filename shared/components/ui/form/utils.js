import { AMOUNT_TOO_HIGH, AMOUNT_TOO_LOW, INVALID, UNSET } from './hooks/validation_states';

/**
 * Create translated message from amount validation result
 *
 * @param {number} amountValidity
 * @param {Object} translations
 * @return {string}
 */
export function amountMessage( amountValidity, translations ) {
	switch ( amountValidity ) {
		case AMOUNT_TOO_HIGH:
			return translations[ 'amount-too-high-message' ];
		case AMOUNT_TOO_LOW:
			return translations[ 'amount-too-low-message' ];
		case UNSET:
		case INVALID:
			return translations[ 'amount-empty-message' ];
	}
	return '';
}

/**
 * Convert UNSET to INVALID validity
 *
 * @param {number} validity
 * @param {Function} updateValidity Setter for updated validity if it changes
 * @return {number} Validity, cannot be UNSET
 */
export function validateRequired( [ validity, updateValidity ] ) {
	if ( validity === UNSET ) {
		updateValidity( INVALID );
		return INVALID;
	}
	return validity;
}
