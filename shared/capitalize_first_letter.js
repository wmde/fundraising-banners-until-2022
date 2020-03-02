/**
 * Use this function for capitalizing the first letter where the text--capitalize-first-letter CSS class does not work
 * because the element is an inline element.
 *
 * @param {string} message
 * @return {string}
 */
export function capitalizeFirstLetter( message ) {
	return message.charAt( 0 ).toUpperCase() + message.slice( 1 );
}
