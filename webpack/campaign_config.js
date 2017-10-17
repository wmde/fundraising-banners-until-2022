function CampaignConfig( config ) {
	this.config = config;
}

CampaignConfig.prototype.getEntryPoints = function () {
	let entrypoints = {};
	Object.keys( this.config ).forEach( function ( campaign ) {
		Object.keys( this.config[ campaign ].banners ).forEach( function ( banner ) {
			let bannerConf = this.config[ campaign ].banners[ banner ];
			if ( entrypoints[ bannerConf.pagename ] ) {
				throw new Error( 'Duplicate pagename "' + bannerConf.pagename + '" for banner ' + campaign + '.' + banner );
			}
			entrypoints[ bannerConf.pagename ] = bannerConf.filename;
		}.bind( this ) );
	}.bind( this ) );
	return entrypoints;
};

CampaignConfig.prototype.getConfigForPages = function () {
	let pageConfig = {};
	Object.keys( this.config ).forEach( function ( campaign ) {
		let campaignConfig = {};
		Object.keys( this.config[ campaign ] ).forEach( function ( campaignKey ) {
			if ( campaignKey === 'banners' ) {
				return;
			}
			campaignConfig[ campaignKey ] = this.config[ campaign ][ campaignKey ];
		}.bind( this ) );
		Object.keys( this.config[ campaign ].banners ).forEach( function ( banner ) {
			let bannerConf = this.config[ campaign ].banners[ banner ];
			if ( pageConfig[ bannerConf.pagename ] ) {
				throw new Error( 'Duplicate pagename "' + bannerConf.pagename + '" for banner ' + campaign + '.' + banner );
			}
			pageConfig[ bannerConf.pagename ] = Object.assign( {}, bannerConf, campaignConfig );
		}.bind( this ) );
	}.bind( this ) );
	return pageConfig;
};

module.exports = CampaignConfig;
