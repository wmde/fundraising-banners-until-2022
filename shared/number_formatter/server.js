import formatter from 'format-number';

/**
 * Format the amount for the FundraisingFrontend, independently from the banner locale.
 *
 * Until we implemented https://phabricator.wikimedia.org/T204202, we need to distinguish between the
 * "donation/new" and the "donation/add" routes, which expect different number formats (new=English, add=German).
 *
 * @param {number} amount
 * @param {string} route "new" or "add"
 * @return {string}
 */
export function amountForServerFormatter( amount, route = 'new' ) {
	switch ( route ) {
		case 'new':
			return formatter( { round: 2 } )( amount );
		case 'add':
			return formatter( { round: 2, decimal: ',' } )( amount );
		default:
			throw new Error( 'Unknown target route: ' + route );
	}
}

export default amountForServerFormatter;
