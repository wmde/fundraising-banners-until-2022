import hasLocalStorage from '../shared/has_local_storage';

export class MinimisedPersistence {
	constructor( bannerName ) {
		this.bannerName = bannerName + '-minimised';
	}

	isMinimised() {
		if ( !hasLocalStorage() ) {
			return;
		}

		try {
			return window.localStorage.getItem( this.bannerName ) || false;
		} catch ( e ) {
			return false;
		}
	}

	setMinimised() {
		if ( !hasLocalStorage() ) {
			return;
		}

		try {
			window.localStorage.setItem( this.bannerName, 'minimised' );
		} catch ( e ) {
			// Don't throw localStorage exceptions
		}
	}

	removeMinimised() {
		if ( !hasLocalStorage() ) {
			return;
		}

		try {
			window.localStorage.removeItem( this.bannerName );
		} catch ( e ) {
			// Don't throw localStorage exceptions
		}
	}
}

export function createMinimisedPersistence( bannerName ) {
	return new MinimisedPersistence( bannerName );
}
