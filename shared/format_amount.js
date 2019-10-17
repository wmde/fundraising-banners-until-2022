/**
 * Format amount string:
 *  - commas to dots
 *  - remove euro sign
 *  - trim
 *  @param {string} amountStr
 *  @param {string} decimalSeparator
 *  @return {string} A string with 2 decimal places
 */
export function formatAmount( amountStr, decimalSeparator = ',' ) {
	// Replace all commas with dots and then remove all dots except for the last one
	amountStr = amountStr.replace( new RegExp( ',', 'g' ), '.' );
	amountStr = amountStr.replace( /[.](?=.*[.])/g, '' );

	// Remove euro sign
	amountStr = amountStr.replace( /[€]/, '' );
	amountStr = amountStr.trim();
	if ( isNaN( Number( amountStr ) ) ) {
		return '0';
	}
	return Number( amountStr ).toFixed( 2 ).replace( /\./, decimalSeparator );
}