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

/**
 * Load wrapper template for each campaign, based on config
 *
 * @param {function} loadTemplate callback function to load the template from the file system, must return a template string
 * @return {object}
 */
CampaignConfig.prototype.getWrapperTemplates = function ( loadTemplate ) {
	let wrapperTemplates = {};
	let loadedTemplates = {};
	let wrapperTemplate;
	Object.keys( this.config ).forEach( function ( campaign ) {
		if ( !this.config[ campaign ].wrapper_template ) {
			throw new Error( 'No wrapper template defined for campaign ' + campaign );
		}

		wrapperTemplate = this.config[ campaign ].wrapper_template;
		if ( !loadedTemplates[ wrapperTemplate ] ) {
			loadedTemplates[ wrapperTemplate ] = loadTemplate( wrapperTemplate );
		}

		Object.keys( this.config[ campaign ].banners ).forEach( function ( banner ) {
			let bannerConf = this.config[ campaign ].banners[ banner ];
			wrapperTemplates[ bannerConf.pagename ] = loadedTemplates[ wrapperTemplate ];
		}.bind( this ) );
	}.bind( this ) );
	return wrapperTemplates;

};

module.exports = CampaignConfig;
