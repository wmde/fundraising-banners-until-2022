/**
 * The try/catch is to check for browsers that explicitly have localStorage blocked
 * as the window still has the object but throws an exception when we try to use it
 *
 * @return {boolean}
 */
let localStorageActive;

export default function hasLocalStorage() {
	if ( localStorageActive !== undefined ) {
		return localStorageActive;
	}

	try {
		window.localStorage.setItem( 'mDQcDkrbb2', 'mDQcDkrbb2' );
		window.localStorage.removeItem( 'mDQcDkrbb2' );
		localStorageActive = true;
	} catch ( e ) {
		localStorageActive = false;
	}

	return localStorageActive;
}
