export class LocalImpressionCount {
	constructor( bannerName ) {
		this.bannerName = bannerName;
		this.overallCount = 0;
		this.bannerCount = 0;
		if ( !this.hasLocalStorage() ) {
			return;
		}
		const overallCount = this.getItem( 'fundraising.overallCount' );
		this.overallCount = parseInt( overallCount, 10 );
		const bannerCount = this.getItem( 'fundraising.bannerCount' ) || '';
		if ( bannerCount.indexOf( '|' ) === -1 ) {
			return;
		}
		const [ lastSeenBannerName, lastBannerCount ] = bannerCount.split( '|', 2 );
		if ( lastSeenBannerName === bannerName ) {
			this.bannerCount = parseInt( lastBannerCount, 10 );
		}
	}

	getItem( name, defaultValue ) {
		try {
			return window.localStorage.getItem( name ) || defaultValue;
		} catch ( e ) {
			if ( e.name === 'NS_ERROR_FILE_CORRUPTED' ) {
				return defaultValue;
			}
			throw e;
		}
	}

	incrementImpressionCounts() {
		this.overallCount++;
		this.bannerCount++;

		if ( !this.hasLocalStorage() ) {
			return;
		}

		try {
			window.localStorage.setItem( 'fundraising.overallCount', this.overallCount.toFixed( 0 ) );
			window.localStorage.setItem( 'fundraising.bannerCount', this.bannerName + '|' + this.bannerCount );
		} catch ( e ) {
			if ( e.name === 'NS_ERROR_FILE_CORRUPTED' ) {
				return;
			}
			throw e;
		}
	}

	/**
	 * The try/catch is to check for browsers that explicitly have localStorage blocked
	 * as the window still has the object but throws an exception when we try to use it
	 * @return {boolean}
	 */
	hasLocalStorage() {
		if ( typeof this.localStorageActive !== undefined ) {
			return this.localStorageActive;
		}

		try {
			window.localStorage.setItem( 'mDQcDkrbb2', 'mDQcDkrbb2' );
			window.localStorage.removeItem( 'mDQcDkrbb2' );
			this.localStorageActive = true;
		} catch ( e ) {
			this.localStorageActive = false;
		}

		return this.localStorageActive;
	}

	getOverallCount() {
		return this.overallCount;
	}
}
