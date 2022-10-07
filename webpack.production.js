const fs = require( 'fs' );
const rimraf = require( 'rimraf' );
const toml = require( 'toml' );
const { merge } = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const MediaWikiTextWrapper = require( './webpack/mediawiki_text_wrapper' );

const CampaignConfig = require( './webpack/campaign_config' );
const campaigns = new CampaignConfig( toml.parse( fs.readFileSync( 'campaign_info.toml', 'utf8' ) ) );

function readWrapperTemplate( name ) {
	return fs.readFileSync( './webpack/wikitext_templates/' + name + '.hbs', 'utf8' );
}

module.exports = merge( CommonConfig, {
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
		// Remove generated license files
		// See https://stackoverflow.com/a/72237744/130121
		new ( class {
			apply( compiler ) {
				compiler.hooks.done.tap( 'Remove LICENSE', () => {
					rimraf.sync( './dist/*.LICENSE.txt' );
				} );
			}
		} )()
	]
} );
