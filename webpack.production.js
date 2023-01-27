const fs = require( 'fs' );
const rimraf = require( 'rimraf' );
const toml = require( 'toml' );
const { mergeWithCustomize, customizeObject } = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const MediaWikiTextWrapper = require( './webpack/mediawiki_text_wrapper' );
const LoadVueOnWpde = require( './webpack/load_vue_on_wpde' );

const CampaignConfig = require( './webpack/campaign_config' );
const campaigns = new CampaignConfig( toml.parse( fs.readFileSync( 'campaign_info.toml', 'utf8' ) ) );

function readWrapperTemplate( name ) {
	return fs.readFileSync( './webpack/wikitext_templates/' + name + '.hbs', 'utf8' );
}

module.exports = ( env ) => {
	let entrypointRules = {};
	let customizationRules = { customizeObject: () => undefined };
	if ( env.banner ) {
		const bannerName = env.banner;
		const singleEntry = campaigns.getEntryPoints()[ bannerName ];
		if ( !singleEntry ) {
			throw new Error( `${bannerName} not found in entry point list` );
		}
		entrypointRules = {
			entry: { [ bannerName ]: singleEntry }
		};
		customizationRules.customizeObject = customizeObject( {
			entry: 'replace'
		} );
	}
	return mergeWithCustomize( customizationRules )(
		CommonConfig,
		{
			devtool: false,
			mode: 'production',
			plugins: [
				new MediaWikiTextWrapper( {
					templates: campaigns.getWrapperTemplates( readWrapperTemplate ),
					context: {
						bannerValuesJS: '{{MediaWiki:WMDE_FR2017/Resources/BannerValues.js}}',
						bannerValues: '{{MediaWiki:WMDE_Fundraising/Campaign_Parameters_2022}}'
					},
					filePattern: '{B,WMDE}*.js',
					campaignConfig: campaigns.getConfigForPages()
				} ),
				// TODO use wpde url instead
				new LoadVueOnWpde( { vueURL: 'https://unpkg.com/vue@3/dist/vue.runtime.global.prod.js' } ),
				// Remove generated license files
				// See https://stackoverflow.com/a/72237744/130121
				new ( class {
					apply( compiler ) {
						compiler.hooks.done.tap( 'Remove LICENSE', () => {
							rimraf.sync( './dist/*.LICENSE.txt' );
						} );
					}
				} )()
			],
			externals: [
				/**
				* In production builds we'll use the Vue class provided by MediaWiki and declare everything imported from
				* 'vue' and '@vue/something' an external dependency
				*
				* To make the Vue class available to the bundled code, you need to wrap it like this:
				*
				*    mw.loader.using( [ 'vue' ], function() { bundled code goes here } );
				*
				* The MediaWikiTextWrapper webpack plugin (and the template it uses) must take care of the wrapping
				*/
				function ( { request }, callback ) {
					if ( /(^@vue\/|^vue$)/.test( request ) ) {
						callback( null, 'Vue' );
						return;
					}
					callback()
				}
			]
		},
		entrypointRules
	);
};
