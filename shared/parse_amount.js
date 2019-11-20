/**
 * Parse custom amount string:
 *  - commas to dots
 *  - remove euro sign
 *  - trim
 *  @param {string} amountStr
 *  @return {number}
 */
export function parseAmount( amountStr ) {
	// Replace all commas with dots and then remove all dots except for the last one
	amountStr = amountStr.replace( new RegExp( ',', 'g' ), '.' );
	amountStr = amountStr.replace( /[.](?=.*[.])/g, '' );

	// Remove all non-numeric chars
	amountStr = amountStr.replace( /[^0-9.]/g, '' );
	if ( isNaN( Number( amountStr ) ) ) {
		return 0;
	}
	return Number( amountStr );
}
