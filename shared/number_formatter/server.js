/**
 * Format the amount for the FundraisingFrontend, give it to the server in eurocents (integer).
 *
 * @param {number} amount
 * @return {string}
 */
export function amountForServerFormatter( amount ) {
	return parseFloat( amount ).toFixed( 2 ) * 100;
}

export default amountForServerFormatter;
