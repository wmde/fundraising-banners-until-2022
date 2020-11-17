export class LocalImpressionCount {
	constructor( bannerName ) {
		this.bannerName = bannerName;
		this.overallCount = 0;
		this.bannerCount = 0;
		if ( !window.localStorage ) {
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
		if ( !window.localStorage ) {
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

	getOverallCount() {
		return this.overallCount;
	}
}
