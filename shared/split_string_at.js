/**
 * Split string at every occurrence of splitWords
 *
 * @param {string[]} splitWords
 * @param {string} str
 * @return {string[]} Split string, including splitWords
 */
export function splitStringAt( splitWords, str ) {
	const rx = new RegExp( '(' + splitWords.join( '|' ) + ')', 'g' );
	return str.split( rx ).filter( w => w !== '' );
}
