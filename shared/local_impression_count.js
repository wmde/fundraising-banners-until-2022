export class LocalImpressionCount {
	constructor( bannerName ) {
		this.bannerName = bannerName;
		this.overallCount = 0;
		this.bannerCount = 0;
		if ( !window.localStorage ) {
			return;
		}
		const overallCount = window.localStorage.getItem( 'fundraising.overallCount' ) || '0';
		this.overallCount = parseInt( overallCount, 10 );
		const bannerCount = window.localStorage.getItem( 'fundraising.bannerCount' ) || '';
		if ( bannerCount.indexOf( '|' ) === -1 ) {
			return;
		}
		const [ lastSeenBannerName, lastBannerCount ] = bannerCount.split( '|', 2 );
		if ( lastSeenBannerName === bannerName ) {
			this.bannerCount = parseInt( lastBannerCount, 10 );
		}
	}

	incrementImpressionCounts() {
		this.overallCount++;
		this.bannerCount++;
		if ( !window.localStorage ) {
			return;
		}
		window.localStorage.setItem( 'fundraising.overallCount', this.overallCount.toFixed( 0 ) );
		window.localStorage.setItem( 'fundraising.bannerCount', this.bannerName + '|' + this.bannerCount );
	}

	getOverallCount() {
		return this.overallCount;
	}
}
