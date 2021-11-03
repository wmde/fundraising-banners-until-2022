import hasLocalStorage from './has_local_storage';

export class LocalImpressionCount {
	constructor( bannerName ) {
		this.bannerName = bannerName;
		this.overallCount = 0;
		this.bannerCount = 0;
		if ( !hasLocalStorage() ) {
			return;
		}
		let overallCount = this.getItem( 'fundraising.overallCount', 0 );
		// This is a fix for a local storage issue where NaN was being stored
		// and once it was in there it would remain NaN forever and always
		if ( isNaN( parseInt( overallCount ) ) ) {
			overallCount = 0;
		}
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
			return defaultValue;
		}
	}

	incrementImpressionCounts() {
		this.overallCount++;
		this.bannerCount++;

		if ( !hasLocalStorage() ) {
			return;
		}

		try {
			window.localStorage.setItem( 'fundraising.overallCount', this.overallCount.toFixed( 0 ) );
			window.localStorage.setItem( 'fundraising.bannerCount', this.bannerName + '|' + this.bannerCount );
		} catch ( e ) {
			// Don't throw localStorage exceptions
		}
	}

	getOverallCount() {
		return this.overallCount;
	}
}
