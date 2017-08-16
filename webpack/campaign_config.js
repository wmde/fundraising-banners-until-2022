function CampaignConfig( config ) {
	this.config = config;
}

CampaignConfig.prototype.getEntryPoints = function () {
	let entrypoints = {};
	Object.keys( this.config ).forEach( function ( campaign ) {
		Object.keys( this.config[ campaign ].banners ).forEach( function ( banner ) {
			let bannerConf = this.config[ campaign ].banners[ banner ];
			if ( entrypoints[ bannerConf.pagename ] ) {
				throw new Error( 'Duplicate pagename "' + bannerConf.pagename + '" for banner ' + campaign + '.' + banner )
			}
			entrypoints[ bannerConf.pagename ] = bannerConf.filename;
		}.bind( this ) )
	}.bind( this ) );
	return entrypoints;
};

module.exports = CampaignConfig;